import { createClient } from '@supabase/supabase-js';
import { User, Problem, Application } from './types';
import { toCamelCase, toSnakeCase } from './utils';

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
export const createProfile = async (userData: {
  id: string;
  email: string;
  name: string;
  role: string;
  created_at?: Date;
  updated_at?: Date;
}) => {
  requireSupabase();
  
  try {
    // Make sure we're using snake_case field names for Supabase
    // and not sending any camelCase fields
    const profileData = {
      id: userData.id,
      email: userData.email,
      name: userData.name,
      role: userData.role,
      created_at: userData.created_at || new Date(),
      updated_at: userData.updated_at || new Date()
    };
    
    const { data, error } = await supabase
      .from('profiles')
      .insert([profileData])
      .select();
      
    if (error) {
      console.error('Error creating profile:', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      throw new Error('Failed to create profile - no data returned');
    }
    
    return data[0];
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
  
  try {
    let query = supabase
      .from('profiles')
      .select('*')
      .eq('role', 'student');
    
    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching solvers:', error);
      throw error;
    }
    
    // Convert snake_case to camelCase
    return data.map(solver => ({
      id: solver.id,
      email: solver.email,
      name: solver.name,
      role: solver.role,
      skills: solver.skills || [],
      university: solver.university,
      major: solver.major,
      graduationYear: solver.graduation_year,
      experienceLevel: solver.experience_level,
      availability: solver.availability || { status: 'unknown' },
      bio: solver.bio,
      languages: solver.languages || [],
      areasOfInterest: solver.areas_of_interest || [],
      avatarUrl: solver.avatar_url,
      linkedinUrl: solver.linkedin_url,
      websiteUrl: solver.website_url,
      location: solver.location,
      createdAt: solver.created_at ? new Date(solver.created_at) : new Date(),
      updatedAt: solver.updated_at ? new Date(solver.updated_at) : new Date()
    }));
  } catch (error) {
    console.error('Error in getSolvers:', error);
    throw error;
  }
};

// Problem functions
export const createProblem = async (problemData: Omit<Problem, 'id' | 'createdAt' | 'updatedAt'>) => {
  requireSupabase();
  
  try {
    // Convert camelCase to snake_case for database
    const snakeCaseData = {
      title: problemData.title,
      description: problemData.description,
      startup_id: problemData.startupId,
      required_skills: problemData.requiredSkills,
      experience_level: problemData.experienceLevel,
      compensation: problemData.compensation,
      deadline: problemData.deadline,
      status: problemData.status || 'open',
      featured: problemData.featured || false,
      additional_info: problemData.additionalInfo,
      created_at: new Date(),
      updated_at: new Date()
    };
    
    const { data, error } = await supabase
      .from('problems')
      .insert([snakeCaseData])
      .select();
      
    if (error) {
      console.error('Error creating problem:', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      throw new Error('Failed to create problem - no data returned');
    }
    
    // Convert snake_case back to camelCase
    return {
      id: data[0].id,
      title: data[0].title,
      description: data[0].description,
      startupId: data[0].startup_id,
      requiredSkills: data[0].required_skills,
      experienceLevel: data[0].experience_level,
      compensation: data[0].compensation,
      deadline: data[0].deadline ? new Date(data[0].deadline) : undefined,
      status: data[0].status,
      featured: data[0].featured,
      additionalInfo: data[0].additional_info,
      createdAt: new Date(data[0].created_at),
      updatedAt: new Date(data[0].updated_at)
    } as Problem;
  } catch (error) {
    console.error('Problem creation error:', error);
    throw error;
  }
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
export const createApplication = async (applicationData: {
  problemId: string;
  userId: string;
  startupId: string;
  coverLetter?: string;
  status: 'pending' | 'accepted' | 'rejected';
}) => {
  requireSupabase();
  
  try {
    // Convert to snake_case for database
    const snakeCaseData = {
      problem_id: applicationData.problemId,
      user_id: applicationData.userId,
      startup_id: applicationData.startupId,
      cover_letter: applicationData.coverLetter,
      status: applicationData.status,
      created_at: new Date(),
      updated_at: new Date()
    };
    
    const { data, error } = await supabase
      .from('applications')
      .insert([snakeCaseData])
      .select();
      
    if (error) {
      console.error('Error creating application:', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      throw new Error('Failed to create application - no data returned');
    }
    
    // Convert snake_case back to camelCase
    return {
      id: data[0].id,
      problemId: data[0].problem_id,
      userId: data[0].user_id,
      startupId: data[0].startup_id,
      coverLetter: data[0].cover_letter,
      status: data[0].status,
      createdAt: new Date(data[0].created_at),
      updatedAt: new Date(data[0].updated_at)
    };
  } catch (error) {
    console.error('Application creation error:', error);
    throw error;
  }
};

export const getApplicationsForStartup = async (startupId: string) => {
  requireSupabase();
  
  try {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        problem:problems(*),
        user:profiles(*)
      `)
      .eq('startup_id', startupId);
      
    if (error) {
      console.error('Error fetching applications for startup:', error);
      throw error;
    }
    
    // Convert snake_case to camelCase
    return data.map(app => ({
      id: app.id,
      problemId: app.problem_id,
      problem: app.problem ? {
        id: app.problem.id,
        title: app.problem.title,
        // ... other problem fields
      } : undefined,
      userId: app.user_id,
      user: app.user ? {
        id: app.user.id,
        name: app.user.name,
        email: app.user.email,
        // ... other user fields
      } : undefined,
      startupId: app.startup_id,
      status: app.status,
      coverLetter: app.cover_letter,
      createdAt: new Date(app.created_at),
      updatedAt: new Date(app.updated_at)
    }));
  } catch (error) {
    console.error('Error in getApplicationsForStartup:', error);
    throw error;
  }
};

export const getApplicationsForUser = async (userId: string) => {
  requireSupabase();
  
  try {
    const { data, error } = await supabase
      .from('applications')
      .select(`
        *,
        problem:problems(*),
        startup:profiles(*)
      `)
      .eq('user_id', userId);
      
    if (error) {
      console.error('Error fetching applications for user:', error);
      throw error;
    }
    
    // Convert snake_case to camelCase
    return data.map(app => ({
      id: app.id,
      problemId: app.problem_id,
      problem: app.problem ? {
        id: app.problem.id,
        title: app.problem.title,
        // ... other problem fields
      } : undefined,
      userId: app.user_id,
      startupId: app.startup_id,
      startup: app.startup ? {
        id: app.startup.id,
        name: app.startup.name,
        // ... other startup fields
      } : undefined,
      status: app.status,
      coverLetter: app.cover_letter,
      createdAt: new Date(app.created_at),
      updatedAt: new Date(app.updated_at)
    }));
  } catch (error) {
    console.error('Error in getApplicationsForUser:', error);
    throw error;
  }
};

export const updateApplicationStatus = async (applicationId: string, status: 'pending' | 'accepted' | 'rejected') => {
  requireSupabase();
  
  try {
    const { data, error } = await supabase
      .from('applications')
      .update({ status, updated_at: new Date() })
      .eq('id', applicationId)
      .select();
      
    if (error) {
      console.error('Error updating application status:', error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      throw new Error('Failed to update application - no data returned');
    }
    
    // Convert snake_case back to camelCase
    return {
      id: data[0].id,
      status: data[0].status,
      updatedAt: new Date(data[0].updated_at)
    };
  } catch (error) {
    console.error('Application update error:', error);
    throw error;
  }
};
