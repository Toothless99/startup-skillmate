
// src/lib/supabase/applications.ts

import { Application } from '../types';
import { supabase } from './client';

// Application CRUD operations
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
      .select(`
        *,
        problem:problems(*),
        problem!inner(startup_id),
        startup:profiles!problems(*)
      `)
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
      .select(`
        *,
        user:profiles(*)
      `)
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
      .select(`
        *,
        problem:problems(*),
        user:profiles(id, name, avatar_url, university, major, experience_level, skills)
      `)
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
