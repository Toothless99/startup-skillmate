
// src/lib/supabase/problems.ts

import { Problem } from '../types';
import { requireSupabase, supabase } from './client';

// Problem CRUD operations
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
      .select(`
        *,
        startup:profiles(*)
      `)
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
