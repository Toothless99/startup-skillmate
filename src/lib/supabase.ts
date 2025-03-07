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
      .from('users')
      .insert([userData])
      .select()
      .single();
    
    if (error) throw error;
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
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
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
      .from('users')
      .update(userData)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
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
      .from('users')
      .select('*')
      .eq('role', 'student');
    
    if (error) throw error;
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
      .from('users')
      .select('*')
      .eq('role', 'startup');
    
    if (error) throw error;
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
    
    if (error) throw error;
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
      .select('*, startup:users(id, name, companyName, avatarUrl)')
      .order('createdAt', { ascending: false });
    
    if (error) throw error;
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
      .eq('startupId', startupId)
      .order('createdAt', { ascending: false });
    
    if (error) throw error;
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
    
    if (error) throw error;
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
      .select('*, problem:problems(*), startup:users!problems(id, name, avatarUrl)')
      .eq('userId', userId);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching applications for user:', error);
    return [];
  }
};

export const getApplicationsForStartup = async (startupId: string): Promise<Application[]> => {
  try {
    const { data, error } = await supabase
      .from('applications')
      .select('*, problem:problems(*), user:users(id, name, avatarUrl, university, major, experienceLevel, skills)')
      .eq('startupId', startupId);
    
    if (error) throw error;
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
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating application status:', error);
    return null;
  }
};
