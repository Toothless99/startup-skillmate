
import { createClient } from '@supabase/supabase-js';
import { User, Problem, Application } from './types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth functions
export const signUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
};

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  
  if (error) throw error;
  return data;
};

export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  });
  
  if (error) throw error;
  return data;
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
};

export const getCurrentUser = async () => {
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
  const { data, error } = await supabase
    .from('profiles')
    .insert([profile])
    .select();
    
  if (error) throw error;
  return data[0] as User;
};

export const updateProfile = async (id: string, updates: Partial<User>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', id)
    .select();
    
  if (error) throw error;
  return data[0] as User;
};

export const getProfileById = async (id: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();
    
  if (error) throw error;
  return data as User;
};

export const getStartups = async (featuredOnly = false) => {
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
  const { data, error } = await supabase
    .from('problems')
    .insert([problem])
    .select();
    
  if (error) throw error;
  return data[0] as Problem;
};

export const getProblems = async (startupId?: string, featured?: boolean) => {
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
  const { data, error } = await supabase
    .from('applications')
    .insert([application])
    .select();
    
  if (error) throw error;
  return data[0] as Application;
};

export const getApplicationsForStartup = async (startupId: string) => {
  const { data, error } = await supabase
    .from('applications')
    .select('*, problem:problems(*), user:profiles(*)')
    .eq('problem.startupId', startupId);
    
  if (error) throw error;
  return data as Application[];
};

export const getApplicationsForUser = async (userId: string) => {
  const { data, error } = await supabase
    .from('applications')
    .select('*, problem:problems(*), startup:problems(startup(*))')
    .eq('userId', userId);
    
  if (error) throw error;
  return data as Application[];
};
