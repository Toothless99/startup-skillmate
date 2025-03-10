// src/lib/supabase.ts

import { createClient } from '@supabase/supabase-js';
import { User, Problem, Application } from './types';

// Initialize Supabase client
const supabaseUrl = 'https://ebyaurtxnxogxfvjaqxp.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVieWF1cnR4bnhvZ3hmdmphcXhwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyMjAyNjYsImV4cCI6MjA1Njc5NjI2Nn0.s05X6pAPjaY0MAdUubTXQWEONdCU6bDygjcSv586MLg';

// Check if Supabase is configured properly
const isSupabaseConfigured = supabaseUrl && supabaseKey;
if (!isSupabaseConfigured) {
  console.error('Missing Supabase environment variables. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.');
}

export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper function to check if Supabase is configured before making API calls
export const requireSupabase = () => {
  if (!isSupabaseConfigured) {
    throw new Error('Missing Supabase environment variables. Please set up the Supabase integration.');
  }
  return supabase;
};

// For demo purposes, we'll simulate database operations and return mock data
const mockUsers: Record<string, User> = {};
const mockProblems: Record<string, Problem> = {};
const mockApplications: Record<string, Application> = {};

// User functions
export const createUser = async (userData: Partial<User>): Promise<User | null> => {
  try {
    // For demo purposes, create a mock user
    const userId = userData.id || `user-${Date.now()}`;
    const newUser: User = {
      id: userId,
      email: userData.email || '',
      name: userData.name || '',
      role: userData.role || 'student',
      ...userData
    };
    
    mockUsers[userId] = newUser;
    return newUser;
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
};

export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    // Check if we have this user in our mock data
    if (mockUsers[userId]) {
      return mockUsers[userId];
    }
    
    // If not in mock data, try to fetch from Supabase
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error) {
        console.warn('Error fetching user from Supabase:', error);
        throw error;
      }
      return data;
    } catch (e) {
      // If this fails too, create a mock user for demo purposes
      const mockUser: User = {
        id: userId,
        email: `user-${userId.substring(0, 6)}@example.com`,
        name: `User ${userId.substring(0, 6)}`,
        role: Math.random() > 0.5 ? 'student' : 'startup',
        created_at: new Date(),
        updated_at: new Date()
      };
      
      mockUsers[userId] = mockUser;
      return mockUser;
    }
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};

export const updateUser = async (userId: string, userData: Partial<User>): Promise<User | null> => {
  try {
    // For demo, update the mock user
    if (mockUsers[userId]) {
      mockUsers[userId] = {
        ...mockUsers[userId],
        ...userData,
        updated_at: new Date()
      };
      return mockUsers[userId];
    }
    
    // Try updating in Supabase, but fallback to mock data
    try {
      console.log("Attempting to update user in Supabase:", userId, userData);
      const { data, error } = await supabase
        .from('profiles')
        .update(userData)
        .eq('id', userId)
        .select()
        .single();
      
      if (error) {
        console.warn('Error updating user in Supabase:', error);
        throw error;
      }
      return data;
    } catch (e) {
      console.log("Error updating in Supabase, falling back to mock data");
      // Create a mock user with the updates
      const user = await getUserById(userId);
      if (user) {
        mockUsers[userId] = {
          ...user,
          ...userData,
          updated_at: new Date()
        };
        return mockUsers[userId];
      }
      return null;
    }
  } catch (error) {
    console.error('Error updating user:', error);
    return null;
  }
};

// Get all students (solvers)
export const getStudents = async (): Promise<User[]> => {
  try {
    // Create some mock students if none exist
    if (Object.values(mockUsers).filter(u => u.role === 'student').length === 0) {
      createUser({
        id: `student-${Date.now()}-1`,
        email: 'student1@example.com',
        name: 'Student One',
        role: 'student',
        skills: ['JavaScript', 'React', 'Node.js'],
        university: 'University of Technology'
      });
      
      createUser({
        id: `student-${Date.now()}-2`,
        email: 'student2@example.com',
        name: 'Student Two',
        role: 'student',
        skills: ['Python', 'Django', 'Machine Learning'],
        university: 'State University'
      });
    }
    
    return Object.values(mockUsers).filter(user => user.role === 'student');
  } catch (error) {
    console.error('Error fetching students:', error);
    return [];
  }
};

// Get all startups
export const getStartups = async (): Promise<User[]> => {
  try {
    // Create some mock startups if none exist
    if (Object.values(mockUsers).filter(u => u.role === 'startup').length === 0) {
      createUser({
        id: `startup-${Date.now()}-1`,
        email: 'startup1@example.com',
        name: 'Startup One',
        role: 'startup',
        company_name: 'Tech Innovators',
        sectors: ['AI', 'Web Development']
      });
      
      createUser({
        id: `startup-${Date.now()}-2`,
        email: 'startup2@example.com',
        name: 'Startup Two',
        role: 'startup',
        company_name: 'Green Solutions',
        sectors: ['CleanTech', 'Sustainability']
      });
    }
    
    return Object.values(mockUsers).filter(user => user.role === 'startup');
  } catch (error) {
    console.error('Error fetching startups:', error);
    return [];
  }
};

// Problem functions
export const createProblem = async (problemData: Partial<Problem>): Promise<Problem | null> => {
  try {
    console.log("Creating problem with data:", problemData);
    
    // Try to insert the problem into Supabase first
    try {
      const { data, error } = await supabase
        .from('problems')
        .insert(problemData)
        .select()
        .single();
        
      if (error) {
        console.warn('Error inserting problem into Supabase:', error);
        throw error;
      }
      
      return data;
    } catch (e) {
      console.log("Falling back to mock data for problem creation");
      // For demo, create a mock problem
      const problemId = `problem-${Date.now()}`;
      const newProblem: Problem = {
        id: problemId,
        title: problemData.title || '',
        description: problemData.description || '',
        startup_id: problemData.startup_id || '',
        required_skills: problemData.required_skills || [],
        experience_level: problemData.experience_level || 'beginner',
        status: problemData.status || 'open',
        created_at: new Date(),
        updated_at: new Date(),
        ...problemData
      };
      
      // Add startup information if available
      if (problemData.startup_id && mockUsers[problemData.startup_id]) {
        newProblem.startup = mockUsers[problemData.startup_id];
      }
      
      mockProblems[problemId] = newProblem;
      console.log("Created mock problem:", newProblem);
      return newProblem;
    }
  } catch (error) {
    console.error('Error creating problem:', error);
    return null;
  }
};

// Get all problems
export const getProblems = async (): Promise<Problem[]> => {
  try {
    // Try to get problems from Supabase first
    try {
      const { data, error } = await supabase
        .from('problems')
        .select('*, startup:profiles(*)');
        
      if (error) {
        console.warn('Error fetching problems from Supabase:', error);
        throw error;
      }
      
      if (data && data.length > 0) {
        return data;
      }
    } catch (e) {
      console.log("Falling back to mock data for problems");
    }
    
    // Create some mock problems if none exist
    if (Object.keys(mockProblems).length === 0) {
      const startups = await getStartups();
      
      if (startups.length > 0) {
        createProblem({
          title: 'Web Application Development',
          description: 'We need a web app for customer management',
          startup_id: startups[0].id,
          startup: startups[0],
          required_skills: ['React', 'Node.js', 'MongoDB'],
          experience_level: 'intermediate',
          status: 'open'
        });
        
        if (startups.length > 1) {
          createProblem({
            title: 'Mobile App UI Design',
            description: 'Looking for UI/UX designer for our mobile app',
            startup_id: startups[1].id,
            startup: startups[1],
            required_skills: ['UI/UX', 'Figma', 'Mobile Design'],
            experience_level: 'beginner',
            status: 'open'
          });
        }
      }
    }
    
    return Object.values(mockProblems);
  } catch (error) {
    console.error('Error fetching problems:', error);
    return [];
  }
};

// Get problems by startup ID
export const getProblemsByStartupId = async (startupId: string): Promise<Problem[]> => {
  try {
    // Try to get problems from Supabase first
    try {
      const { data, error } = await supabase
        .from('problems')
        .select('*, startup:profiles(*)')
        .eq('startup_id', startupId);
        
      if (error) {
        console.warn('Error fetching problems by startup ID from Supabase:', error);
        throw error;
      }
      
      if (data && data.length > 0) {
        return data;
      }
    } catch (e) {
      console.log("Falling back to mock data for startup problems");
    }
    
    return Object.values(mockProblems).filter(problem => problem.startup_id === startupId);
  } catch (error) {
    console.error('Error fetching problems by startup ID:', error);
    return [];
  }
};

// Application functions
export const createApplication = async (applicationData: Partial<Application>): Promise<Application | null> => {
  try {
    console.log("Creating application with data:", applicationData);
    
    // Try to insert the application into Supabase first
    try {
      const { data, error } = await supabase
        .from('applications')
        .insert(applicationData)
        .select()
        .single();
        
      if (error) {
        console.warn('Error inserting application into Supabase:', error);
        throw error;
      }
      
      return data;
    } catch (e) {
      console.log("Falling back to mock data for application creation");
      
      const applicationId = `application-${Date.now()}`;
      const newApplication: Application = {
        id: applicationId,
        problem_id: applicationData.problem_id || '',
        user_id: applicationData.user_id || '',
        status: applicationData.status || 'pending',
        created_at: new Date(),
        updated_at: new Date(),
        ...applicationData
      };
      
      // Add problem and user information if available
      if (applicationData.problem_id && mockProblems[applicationData.problem_id]) {
        newApplication.problem = mockProblems[applicationData.problem_id];
      }
      
      if (applicationData.user_id && mockUsers[applicationData.user_id]) {
        newApplication.user = mockUsers[applicationData.user_id];
      }
      
      mockApplications[applicationId] = newApplication;
      console.log("Created mock application:", newApplication);
      return newApplication;
    }
  } catch (error) {
    console.error('Error creating application:', error);
    return null;
  }
};

export const getApplicationsForUser = async (userId: string): Promise<Application[]> => {
  try {
    // Try to get applications from Supabase first
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*, problem:problems(*), problem.startup:profiles(*)')
        .eq('user_id', userId);
        
      if (error) {
        console.warn('Error fetching applications for user from Supabase:', error);
        throw error;
      }
      
      if (data && data.length > 0) {
        return data;
      }
    } catch (e) {
      console.log("Falling back to mock data for user applications");
    }
    
    return Object.values(mockApplications).filter(app => app.user_id === userId);
  } catch (error) {
    console.error('Error fetching applications for user:', error);
    return [];
  }
};

export const getApplicationsForProblem = async (problemId: string): Promise<Application[]> => {
  try {
    // Try to get applications from Supabase first
    try {
      const { data, error } = await supabase
        .from('applications')
        .select('*, user:profiles(*)')
        .eq('problem_id', problemId);
        
      if (error) {
        console.warn('Error fetching applications for problem from Supabase:', error);
        throw error;
      }
      
      if (data && data.length > 0) {
        return data;
      }
    } catch (e) {
      console.log("Falling back to mock data for problem applications");
    }
    
    return Object.values(mockApplications).filter(app => app.problem_id === problemId);
  } catch (error) {
    console.error('Error fetching applications for problem:', error);
    return [];
  }
};

export const getApplicationsForStartup = async (startupId: string): Promise<Application[]> => {
  try {
    // Get all problems for this startup
    const startupProblems = await getProblemsByStartupId(startupId);
    const problemIds = startupProblems.map(p => p.id);
    
    // Try to get applications from Supabase first
    try {
      if (problemIds.length > 0) {
        // Modified query to properly handle nested relationships
        const { data, error } = await supabase
          .from('applications')
          .select(`
            *,
            problem:problems(*),
            user:profiles(*)
          `)
          .in('problem_id', problemIds);
          
        if (error) {
          console.warn('Error fetching applications for startup from Supabase:', error);
          throw error;
        }
        
        if (data && data.length > 0) {
          return data;
        }
      }
    } catch (e) {
      console.log("Falling back to mock data for startup applications");
    }
    
    // Filter applications for these problems
    return Object.values(mockApplications).filter(app => 
      problemIds.includes(app.problem_id)
    );
  } catch (error) {
    console.error('Error fetching applications for startup:', error);
    return [];
  }
};

export const updateApplicationStatus = async (
  applicationId: string, 
  status: 'pending' | 'accepted' | 'rejected'
): Promise<Application | null> => {
  try {
    console.log("Updating application status:", applicationId, status);
    
    // Try to update the application in Supabase first
    try {
      const { data, error } = await supabase
        .from('applications')
        .update({ status, updated_at: new Date() })
        .eq('id', applicationId)
        .select()
        .single();
        
      if (error) {
        console.warn('Error updating application status in Supabase:', error);
        throw error;
      }
      
      return data;
    } catch (e) {
      console.log("Falling back to mock data for application status update");
      
      if (mockApplications[applicationId]) {
        mockApplications[applicationId] = {
          ...mockApplications[applicationId],
          status,
          updated_at: new Date()
        };
        return mockApplications[applicationId];
      }
    }
    
    return null;
  } catch (error) {
    console.error('Error updating application status:', error);
    return null;
  }
};
