import { createClient } from '@supabase/supabase-js';
import { User, Problem, Application } from './types';

// Get environment variables with proper type checking
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Supabase environment variables are missing. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables through the Supabase integration.');
}

// Create the Supabase client
export const supabase = createClient(
  supabaseUrl || '', 
  supabaseAnonKey || ''
);

// Helper function to check configuration before making API calls
const requireSupabase = () => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase is not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables through the Supabase integration.');
  }
};

// Auth functions
export const signUp = async (email: string, password: string) => {
  requireSupabase();
  
  try {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    
    if (error) {
      console.error('Supabase signUp error:', error);
      throw error;
    }
    
    if (!data.user) {
      throw new Error('User creation failed - no user returned from Supabase');
    }
    
    return data;
  } catch (error) {
    console.error('Error during signup process:', error);
    throw error;
  }
};

export const signIn = async (email: string, password: string) => {
  requireSupabase();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
};

export const signInWithGoogle = async () => {
  requireSupabase();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  });
  
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  requireSupabase();
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async () => {
  requireSupabase();
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) return null;
  
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();
    
  if (error) throw error;
  return data as User;
};

// Profile functions
export const createProfile = async (profile: Partial<User>) => {
  requireSupabase();
  
  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert([profile])
      .select();
      
    if (error) {
      console.error('Error creating profile:', error);
      if (error.code === '42P01') {
        throw new Error('The profiles table does not exist. Please set up your Supabase database with a profiles table.');
      }
      throw error;
    }
    
    if (!data || data.length === 0) {
      throw new Error('Failed to create profile - no data returned');
    }
    
    return data[0] as User;
  } catch (error) {
    console.error('Profile creation error:', error);
    throw error;
  }
};

export const updateProfile = async (id: string, updates: Partial<User>) => {
  requireSupabase();
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', id)
    .select();
    
  if (error) throw error;
  return data[0] as User;
};

export const getProfileById = async (id: string) => {
  requireSupabase();
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) throw error;
  return data as User;
};

export const getStartups = async (featuredOnly = false) => {
  requireSupabase();
  let query = supabase
    .from('profiles')
    .select('*')
    .eq('role', 'startup');
    
  if (featuredOnly) {
    query = query.eq('featured', true);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data as User[];
};

export const getSolvers = async (featuredOnly = false) => {
  requireSupabase();
  let query = supabase
    .from('profiles')
    .select('*')
    .eq('role', 'student');
    
  if (featuredOnly) {
    query = query.eq('featured', true);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data as User[];
};

// Problem functions
export const createProblem = async (problem: Partial<Problem>) => {
  requireSupabase();
  const { data, error } = await supabase
    .from('problems')
    .insert([problem])
    .select();
    
  if (error) throw error;
  return data[0] as Problem;
};

export const getProblems = async (startupId?: string, featured?: boolean) => {
  requireSupabase();
  let query = supabase
    .from('problems')
    .select('*, startup:profiles(*)');
    
  if (startupId) {
    query = query.eq('startupId', startupId);
  }
  
  if (featured !== undefined) {
    query = query.eq('featured', featured);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  
  return data as Problem[];
};

// Application functions
export const createApplication = async (application: Partial<Application>) => {
  requireSupabase();
  const { data, error } = await supabase
    .from('applications')
    .insert([application])
    .select();
    
  if (error) throw error;
  return data[0] as Application;
};

export const getApplicationsForStartup = async (startupId: string) => {
  requireSupabase();
  const { data, error } = await supabase
    .from('applications')
    .select('*, problem:problems(*), user:profiles(*)')
    .eq('problem.startupId', startupId);
    
  if (error) throw error;
  return data as Application[];
};

export const getApplicationsForUser = async (userId: string) => {
  requireSupabase();
  const { data, error } = await supabase
    .from('applications')
    .select('*, problem:problems(*), startup:problems(startup(*))')
    .eq('userId', userId);
    
  if (error) throw error;
  return data as Application[];
};
