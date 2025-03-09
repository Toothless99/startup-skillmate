
// src/lib/supabase/users.ts

import { User } from '../types';
import { requireSupabase, supabase } from './client';

// User CRUD operations
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
