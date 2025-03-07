
// src/lib/supabase.ts

import { createClient } from '@supabase/supabase-js';
import { User, Problem, Application } from './types';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

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

// User functions
export const createUser = async (userData: Partial<User>): Promise<User | null> => {
  try {
    const db = requireSupabase();
    
    const { data, error } = await db
      .from('profiles')
      .insert([userData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating user:', error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Error creating user:', error);
    return null;
  }
};

export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const db = requireSupabase();
    
    const { data, error } = await db
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};

export const updateUser = async (userId: string, userData: Partial<User>): Promise<User | null> => {
  try {
    const db = requireSupabase();
    
    const { data, error } = await db
      .from('profiles')
      .update(userData)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating user:', error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Error updating user:', error);
    return null;
  }
};

// Get all students (solvers)
export const getStudents = async (): Promise<User[]> => {
  try {
    const db = requireSupabase();
    
    const { data, error } = await db
      .from('profiles')
      .select('*')
      .eq('role', 'student');
    
    if (error) {
      console.error('Error fetching students:', error);
      throw error;
    }
    return data || [];
  } catch (error) {
    console.error('Error fetching students:', error);
    return [];
  }
};

// Get all startups
export const getStartups = async (): Promise<User[]> => {
  try {
    const db = requireSupabase();
    
    const { data, error } = await db
      .from('profiles')
      .select('*')
      .eq('role', 'startup');
    
    if (error) {
      console.error('Error fetching startups:', error);
      throw error;
    }
    return data || [];
  } catch (error) {
    console.error('Error fetching startups:', error);
    return [];
  }
};

// Problem functions
export const createProblem = async (problemData: Partial<Problem>): Promise<Problem | null> => {
  try {
    const db = requireSupabase();
    
    const { data, error } = await db
      .from('problems')
      .insert([problemData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating problem:', error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Error creating problem:', error);
    return null;
  }
};

// Get all problems
export const getProblems = async (): Promise<Problem[]> => {
  try {
    const db = requireSupabase();
    
    const { data, error } = await db
      .from('problems')
      .select('*, startup:profiles(*)')
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching problems:', error);
      throw error;
    }
    return data || [];
  } catch (error) {
    console.error('Error fetching problems:', error);
    return [];
  }
};

// Get problems by startup ID
export const getProblemsByStartupId = async (startupId: string): Promise<Problem[]> => {
  try {
    const db = requireSupabase();
    
    const { data, error } = await db
      .from('problems')
      .select('*')
      .eq('startup_id', startupId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching problems by startup ID:', error);
      throw error;
    }
    return data || [];
  } catch (error) {
    console.error('Error fetching problems by startup ID:', error);
    return [];
  }
};

// Application functions
export const createApplication = async (applicationData: Partial<Application>): Promise<Application | null> => {
  try {
    const { data, error } = await supabase
      .from('applications')
      .insert([applicationData])
      .select()
      .single();
    
    if (error) {
      console.error('Error creating application:', error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Error creating application:', error);
    return null;
  }
};

export const getApplicationsForUser = async (userId: string): Promise<Application[]> => {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select('*, problem:problems(*), problem.startup:profiles(*)')
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error fetching applications for user:', error);
      throw error;
    }
    return data || [];
  } catch (error) {
    console.error('Error fetching applications for user:', error);
    return [];
  }
};

export const getApplicationsForProblem = async (problemId: string): Promise<Application[]> => {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select('*, user:profiles(*)')
      .eq('problem_id', problemId);
    
    if (error) {
      console.error('Error fetching applications for problem:', error);
      throw error;
    }
    return data || [];
  } catch (error) {
    console.error('Error fetching applications for problem:', error);
    return [];
  }
};

export const getApplicationsForStartup = async (startupId: string): Promise<Application[]> => {
  try {
    // First get all problems for this startup
    const { data: problems, error: problemsError } = await supabase
      .from('problems')
      .select('id')
      .eq('startup_id', startupId);
    
    if (problemsError) {
      console.error('Error fetching problems for startup:', problemsError);
      throw problemsError;
    }
    
    if (!problems || problems.length === 0) {
      return [];
    }
    
    const problemIds = problems.map(p => p.id);
    
    const { data, error } = await supabase
      .from('applications')
      .select('*, problem:problems(*), user:profiles(id, name, avatarUrl, university, major, experienceLevel, skills)')
      .in('problem_id', problemIds);
    
    if (error) {
      console.error('Error fetching applications for startup:', error);
      throw error;
    }
    return data || [];
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
    const { data, error } = await supabase
      .from('applications')
      .update({ status })
      .eq('id', applicationId)
      .select()
      .single();
    
    if (error) {
      console.error('Error updating application status:', error);
      throw error;
    }
    return data;
  } catch (error) {
    console.error('Error updating application status:', error);
    return null;
  }
};
