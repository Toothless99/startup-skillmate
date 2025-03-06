import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase, createUser, updateUser, getUserById } from "@/lib/supabase";
import { User } from "@/lib/types";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, userData: Partial<User>) => Promise<{ success: boolean; error?: string; userId?: string }>;
  logout: () => Promise<void>;
  updateUserProfile: (userId: string, userData: Partial<User>) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on load
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

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      // Demo account handling - Check if this is a demo account
      const isDemoAccount = email === "student@example.com" || email === "startup@example.com";
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        // If it's a demo account and the error is about email confirmation
        if (isDemoAccount && error.message.includes("Email not confirmed")) {
          // For demo accounts, we can simulate a successful login
          console.log("Demo account detected - bypassing email confirmation");
          
          // Get user profile based on email
          const role = email.startsWith("student") ? "student" : "startup";
          
          // Create a mock user object
          const mockUser = {
            id: `demo-${role}-id`,
            email: email,
            role: role,
            name: role === "student" ? "Demo Student" : "Demo Startup",
            // Add other necessary user properties
            ...(role === "startup" ? { companyName: "Demo Company" } : {}),
          };
          
          setUser(mockUser);
          setIsAuthenticated(true);
          setIsLoading(false);
          return { user: mockUser };
        }
        
        // For non-demo accounts or other errors, throw the error
        throw error;
      }

      if (data.user) {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();

        setUser({
          id: data.user.id,
          email: data.user.email!,
          ...profileData,
        });
        setIsAuthenticated(true);
      }
      
      return data;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, userData: Partial<User>) => {
    try {
      // Create auth user in Supabase
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        // Create user profile in database
        const newUser = await createUser({
          id: data.user.id,
          email,
          ...userData,
        });

        if (newUser) {
          setUser(newUser);
          return { success: true, userId: newUser.id };
        }
      }

      return { success: false, error: "Failed to create user profile" };
    } catch (error: any) {
      console.error("Signup error:", error);
      return { success: false, error: error.message || "Failed to sign up" };
    }
  };

  const logout = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      setIsAuthenticated(false);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const updateUserProfile = async (userId: string, userData: Partial<User>) => {
    try {
      const updatedUser = await updateUser(userId, userData);
      
      if (updatedUser && user && userId === user.id) {
        setUser(updatedUser);
      }
      
      return !!updatedUser;
    } catch (error) {
      console.error("Update profile error:", error);
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
