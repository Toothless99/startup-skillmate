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

// Mock user data for demonstration
const mockUsers = [
  {
    id: "user1",
    email: "student@example.com",
    name: "John Student",
    role: "student" as const,
    skills: ["React", "TypeScript", "Node.js"],
    university: "Stanford University",
    major: "Computer Science",
    graduationYear: "2024",
    experienceLevel: "intermediate" as const,
    availability: {
      status: "available" as const,
      hours: 15
    },
    createdAt: new Date(),
    updatedAt: new Date()
  },
  {
    id: "user2",
    email: "startup@example.com",
    name: "Jane Founder",
    role: "startup" as const,
    companyName: "TechStartup Inc.",
    companyDescription: "We're building the future of technology.",
    sectors: ["SaaS", "AI"],
    stage: "seed" as const,
    hiringStatus: "hiring" as const,
    createdAt: new Date(),
    updatedAt: new Date()
  }
];

// Add a development mode flag
const DEV_MODE = true;

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Check for saved user in localStorage
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("Failed to parse saved user:", error);
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      
      if (DEV_MODE) {
        // In a real app, this would be an API call
        // For demo, we'll use mock data
        const foundUser = mockUsers.find(u => u.email === email);
        
        if (!foundUser) {
          throw new Error("Invalid email or password");
        }
        
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        setUser(foundUser);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(foundUser));
        
        toast({
          title: "Welcome back!",
          description: `You've successfully signed in as ${foundUser.name}.`,
        });
        
        return;
      }
      
      // Real authentication logic
      const { user: authUser, session } = await signIn(email, password);
      
      if (!authUser) {
        throw new Error("Invalid email or password");
      }
      
      // Get user profile
      const userProfile = await getCurrentUser();
      
      setUser(userProfile);
      setIsAuthenticated(true);
      localStorage.setItem("user", JSON.stringify(userProfile));
      
      toast({
        title: "Welcome back!",
        description: `You've successfully signed in as ${userProfile.name}.`,
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
    setIsLoading(true);
    try {
      // Mock Google login - would use Supabase auth in real implementation
      const mockUser: User = {
        id: "123",
        email: "user@example.com",
        name: "Google User",
        avatarUrl: "https://i.pravatar.cc/150?u=google",
        role: "student",
        skills: ["React", "JavaScript"],
        languages: ["English"],
        availability: { status: "available" },
        experienceLevel: "intermediate",
        areasOfInterest: ["SaaS", "Fintech"],
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      setUser(mockUser);
      localStorage.setItem('skillmate-user', JSON.stringify(mockUser));
    } catch (error) {
      console.error("Google login error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    email: string, 
    password: string, 
    name: string, 
    role: "student" | "startup",
    profileData?: Record<string, any>
  ) => {
    try {
      // Create auth user
      const { data: authData } = await signUp(email, password);
      
      if (!authData.user) {
        throw new Error("User creation failed");
      }
      
      // Create profile with additional data
      const userData = {
        id: authData.user.id,
        email,
        name,
        role,
        createdAt: new Date(),
        updatedAt: new Date(),
        ...profileData
      };
      
      // In a real app, you would save this to your database
      // For now, we'll just simulate a successful creation
      
      // Set the user in state
      setUser(userData);
      setIsAuthenticated(true);
      
      return userData;
    } catch (error) {
      console.error("Signup error:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem("user");
      
      toast({
        title: "Signed out",
        description: "You've been successfully signed out.",
      });
    } catch (error) {
      console.error("Logout error:", error);
      toast({
        title: "Logout failed",
        description: error instanceof Error ? error.message : "An error occurred during sign out.",
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
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedUser = {
        ...user,
        ...userData,
        updatedAt: new Date()
      };
      
      // Update in mock data
      const userIndex = mockUsers.findIndex(u => u.id === user.id);
      if (userIndex >= 0) {
        mockUsers[userIndex] = updatedUser;
      }
      
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      return;
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

  // Mock function to get applications for a startup
  const getApplications = async (): Promise<Application[]> => {
    // In a real app, this would fetch from the backend
    if (user?.role !== 'startup') return [];

    // Mock applications data
    const mockApplications: Application[] = [
      {
        id: "app1",
        userId: "user1",
        user: {
          id: "user1",
          email: "student1@example.com",
          name: "John Student",
          role: "student",
          skills: ["React", "Node.js"],
          experienceLevel: "intermediate",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        problemId: "1",
        problem: {
          id: "1",
          title: "Develop a Mobile App UI/UX",
          description: "We need a talented UI/UX designer...",
          startupId: user.id,
          requiredSkills: ["UI/UX", "Figma"],
          experienceLevel: "intermediate",
          status: "open",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        coverLetter: "I am very interested in this opportunity...",
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: "app2",
        userId: "user2",
        user: {
          id: "user2",
          email: "student2@example.com",
          name: "Jane Student",
          role: "student",
          skills: ["UI/UX", "Figma", "Adobe XD"],
          experienceLevel: "advanced",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        problemId: "1",
        problem: {
          id: "1",
          title: "Develop a Mobile App UI/UX",
          description: "We need a talented UI/UX designer...",
          startupId: user.id,
          requiredSkills: ["UI/UX", "Figma"],
          experienceLevel: "intermediate",
          status: "open",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        coverLetter: "I have extensive experience with mobile app design...",
        status: "pending",
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];

    return mockApplications;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
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
