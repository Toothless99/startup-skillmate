import React, { createContext, useContext, useEffect, useState } from "react";
import { User, Application } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { 
  signIn, 
  signUp, 
  signInWithGoogle, 
  signOut, 
  getCurrentUser,
  createProfile,
  updateProfile,
  getApplicationsForStartup,
  supabase
} from "@/lib/supabase";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  signup: (email: string, password: string, name: string, role: 'student' | 'startup') => Promise<void>;
  logout: () => Promise<void>;
  getApplications: () => Promise<Application[]>;
  updateUserProfile: (userData: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  // Check if user is already logged in on page load
  useEffect(() => {
    const checkUser = async () => {
      try {
        const userData = await getCurrentUser();
        setUser(userData);
      } catch (error) {
        console.error("Error fetching current user:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();
  }, []);

  // Auth subscription to keep user state in sync
  useEffect(() => {
    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session?.user?.id) {
          try {
            const userData = await getCurrentUser();
            setUser(userData);
          } catch (error) {
            console.error("Error fetching user data:", error);
          }
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      await signIn(email, password);
      
      const userData = await getCurrentUser();
      setUser(userData);
      
      toast({
        title: "Welcome back!",
        description: `You've successfully signed in as ${userData.name}.`,
      });
    } catch (error) {
      console.error("Login error:", error);
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Please check your credentials and try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    try {
      setIsLoading(true);
      await signInWithGoogle();
      
      // Note: User will be set by the auth state change listener
      toast({
        title: "Welcome!",
        description: "You've successfully signed in with Google.",
      });
    } catch (error) {
      console.error("Google login error:", error);
      toast({
        title: "Login failed",
        description: error instanceof Error ? error.message : "Failed to sign in with Google.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (email: string, password: string, name: string, role: 'student' | 'startup') => {
    try {
      setIsLoading(true);
      
      // First sign up with email and password
      console.log('Attempting to sign up user:', email);
      const { user: authUser } = await signUp(email, password);
      
      if (!authUser?.id) {
        console.error('No user ID returned from signUp');
        throw new Error("Failed to create account - no user ID returned");
      }
      
      console.log('User created successfully, creating profile');
      
      // Create the profile
      const newUser: Partial<User> = {
        id: authUser.id,
        email,
        name,
        role,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...(role === 'student' ? {
          experienceLevel: 'beginner' as const,
          availability: { status: 'available' as const }
        } : {
          stage: 'idea',
          hiringStatus: 'not_hiring' as const
        })
      };
      
      console.log('Creating profile with data:', newUser);
      const createdUser = await createProfile(newUser);
      setUser(createdUser);
      
      toast({
        title: "Account created!",
        description: `Welcome to the platform, ${name}!`,
      });
      
    } catch (error) {
      console.error("Signup error:", error);
      
      // Create a more user-friendly error message
      let errorMessage = "Failed to create your account.";
      
      if (error instanceof Error) {
        // Handle specific error types
        if (error.message.includes("profiles table does not exist")) {
          errorMessage = "The database is not properly set up. Please contact support.";
        } else if (error.message.includes("already registered")) {
          errorMessage = "This email is already registered. Please try signing in instead.";
        } else if (error.message.includes("Password")) {
          errorMessage = error.message; // For password requirement errors
        } else {
          errorMessage = error.message;
        }
      }
      
      toast({
        title: "Signup failed",
        description: errorMessage,
        variant: "destructive",
      });
      
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await signOut();
      setUser(null);
      
      toast({
        title: "Signed out",
        description: "You've been successfully signed out.",
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Error",
        description: "Failed to sign out. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserProfile = async (userData: Partial<User>) => {
    try {
      setIsLoading(true);
      
      if (!user) {
        throw new Error("Not authenticated");
      }
      
      const updatedUser = await updateProfile(user.id, {
        ...userData,
        updatedAt: new Date()
      });
      
      setUser(updatedUser);
      
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
      
    } catch (error) {
      console.error("Profile update error:", error);
      toast({
        title: "Update failed",
        description: error instanceof Error ? error.message : "Failed to update profile. Please try again.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getApplications = async (): Promise<Application[]> => {
    if (!user || user.role !== 'startup') return [];
    
    try {
      return await getApplicationsForStartup(user.id);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast({
        title: "Error",
        description: "Failed to fetch applications. Please try again.",
        variant: "destructive",
      });
      return [];
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        loginWithGoogle,
        signup,
        logout,
        getApplications,
        updateUserProfile
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
