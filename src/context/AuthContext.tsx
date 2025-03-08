
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase, requireSupabase, getUserById, createUser, updateUser } from "@/lib/supabase";
import { User } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, userData: Partial<User>) => Promise<{ success: boolean; error?: string; userId?: string }>;
  logout: () => Promise<void>;
  updateUserProfile: (userData: Partial<User>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Check for existing session on load
  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        
        if (data.session?.user) {
          const userData = await getUserById(data.session.user.id);
          if (userData) {
            setUser(userData);
            setIsAuthenticated(true);
          }
        }
      } catch (error) {
        console.error("Error checking session:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkSession();

    // Set up auth state change listener
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session) {
          const userData = await getUserById(session.user.id);
          if (userData) {
            setUser(userData);
            setIsAuthenticated(true);
          }
        } else if (event === "SIGNED_OUT") {
          setUser(null);
          setIsAuthenticated(false);
        }
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    try {
      // Make sure Supabase is configured
      requireSupabase();
      
      // Demo account handling
      const isDemoAccount = email === "student@example.com" || email === "startup@example.com";
      
      if (isDemoAccount) {
        // For demo accounts, simulate a successful login
        const role = email.startsWith("student") ? "student" : "startup";
        
        // Create a mock user object
        const mockUser = {
          id: `demo-${role}-${Date.now()}`,
          email: email,
          role: role as "student" | "startup",
          name: role === "student" ? "Demo Student" : "Demo User",
          company_name: role === "startup" ? "Demo Company" : undefined,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        setUser(mockUser as User);
        setIsAuthenticated(true);
        
        return { success: true };
      }
      
      // Regular login flow
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        const userData = await getUserById(data.user.id);
        
        if (userData) {
          setUser(userData);
          setIsAuthenticated(true);
          return { success: true };
        } else {
          return { 
            success: false, 
            error: "User profile not found. Please contact support." 
          };
        }
      }
      
      return { success: false, error: "No user data returned from authentication." };
    } catch (error: any) {
      console.error("Login error:", error);
      return { 
        success: false, 
        error: error.message || "Failed to login. Please try again." 
      };
    }
  };

  const signup = async (email: string, password: string, userData: Partial<User>): Promise<{ success: boolean; error?: string; userId?: string }> => {
    try {
      // Make sure Supabase is configured
      requireSupabase();
      
      // Create auth user in Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (!data.user) {
        return { success: false, error: "Failed to create user account" };
      }
      
      // Create user profile in database
      const userProfile = {
        id: data.user.id,
        email,
        ...userData,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      const newUser = await createUser(userProfile);

      if (newUser) {
        setUser(newUser);
        setIsAuthenticated(true);
        return { success: true, userId: newUser.id };
      }
      
      return { success: false, error: "Failed to create user profile" };
    } catch (error: any) {
      console.error("Signup error:", error);
      return { 
        success: false, 
        error: error.message || "Failed to sign up. Please try again." 
      };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setIsAuthenticated(false);
      toast({
        title: "Logged out",
        description: "You have been successfully logged out.",
      });
    } catch (error: any) {
      console.error("Logout error:", error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  const updateUserProfile = async (userData: Partial<User>): Promise<boolean> => {
    try {
      if (!user) {
        toast({
          title: "Error",
          description: "You must be logged in to update your profile.",
          variant: "destructive",
        });
        return false;
      }
      
      // Update timestamp
      userData.updated_at = new Date();
      
      const updatedUser = await updateUser(user.id, userData);
      
      if (updatedUser) {
        setUser(updatedUser);
        toast({
          title: "Profile updated",
          description: "Your profile has been successfully updated.",
        });
        return true;
      }
      
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
      return false;
    } catch (error: any) {
      console.error("Update profile error:", error);
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        signup,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
