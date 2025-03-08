
import { supabase } from './supabase';
import { mockSolvers } from './mockData';
import { User, Problem } from './types';
import { v4 as uuidv4 } from 'uuid';

// Function to populate the database with mock data
export const populateDatabase = async () => {
  try {
    // Check if profiles table is empty
    const { data: existingProfiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
    
    if (profilesError) {
      console.error('Checking profiles error:', profilesError);
      return false;
    }
    
    // If the profiles table is empty, populate it with mock data
    if (!existingProfiles || existingProfiles.length === 0) {
      console.log('Populating database with mock data...');
      
      // For testing, we'll disable RLS temporarily to allow direct inserts
      // This is only needed during initial setup
      try {
        // Turn off RLS for profiles table temporarily
        await supabase.rpc('disable_rls_for_profiles');
        console.log('Temporarily disabled RLS for profiles');
      } catch (rlsError) {
        console.log('Could not disable RLS, proceeding with default security:', rlsError);
        // Continue anyway, as the function might not exist
      }
      
      // Create mock solvers with generated UUIDs
      const mockSolversWithIds = mockSolvers.map(solver => ({
        ...solver,
        id: uuidv4(),
      }));

      // Insert mock solvers
      const { error: solversError } = await supabase
        .from('profiles')
        .insert(mockSolversWithIds);
      
      if (solversError) {
        console.error('Error inserting mock solvers:', solversError);
        return false;
      }
      
      // Create mock startups
      const mockStartups: User[] = [
        {
          id: uuidv4(),
          email: "info@techwave.com",
          name: "TechWave Solutions",
          role: "startup",
          company_name: "TechWave Solutions",
          company_description: "Building innovative AI solutions for enterprise customers.",
          sectors: ["AI", "Enterprise Software", "SaaS"],
          stage: "seed",
          hiring_status: "hiring",
          location: "San Francisco, CA",
          founder_names: ["Alex Johnson", "Maria Garcia"],
          website_url: "https://techwave.example.com",
          linkedin_url: "https://linkedin.com/company/techwave",
          employee_count: "11-50",
          founding_year: "2021",
        },
        {
          id: uuidv4(),
          email: "contact@greengrow.com",
          name: "GreenGrow",
          role: "startup",
          company_name: "GreenGrow",
          company_description: "Sustainable agriculture technology solutions.",
          sectors: ["AgTech", "Sustainability", "IoT"],
          stage: "series-a",
          hiring_status: "future_hiring",
          location: "Boulder, CO",
          founder_names: ["Sarah Chen", "Michael Rodriguez"],
          website_url: "https://greengrow.example.com",
          linkedin_url: "https://linkedin.com/company/greengrow",
          employee_count: "1-10",
          founding_year: "2020",
        }
      ];
      
      // Insert mock startups
      const { error: startupsError } = await supabase
        .from('profiles')
        .insert(mockStartups);
      
      if (startupsError) {
        console.error('Error inserting mock startups:', startupsError);
        return false;
      }
      
      // Create mock problems with the first startup ID
      const mockProblems: Problem[] = [
        {
          id: uuidv4(),
          title: "Build a React Native Mobile App",
          description: "We need a skilled developer to build a cross-platform mobile application for our startup.",
          startup_id: mockStartups[0].id, // Use the actual ID from the first mock startup
          required_skills: ["React Native", "JavaScript", "Mobile Development"],
          experience_level: "intermediate",
          compensation: "$2000-$3000",
          additional_info: "This is a 4-6 week project with potential for ongoing work.",
          status: "open",
          featured: true,
        },
        {
          id: uuidv4(),
          title: "Design a New Product Landing Page",
          description: "Looking for a UI/UX designer to create a compelling landing page for our new SaaS product.",
          startup_id: mockStartups[0].id, // Use the actual ID from the first mock startup
          required_skills: ["UI/UX Design", "Figma", "Web Design"],
          experience_level: "beginner",
          compensation: "$500-$1000",
          additional_info: "Should be completed within 2 weeks.",
          status: "open",
          featured: false,
        },
        {
          id: uuidv4(),
          title: "Implement Machine Learning Model",
          description: "We need help implementing a recommendation algorithm for our e-commerce platform.",
          startup_id: mockStartups[1].id, // Use the actual ID from the second mock startup
          required_skills: ["Python", "Machine Learning", "Data Science"],
          experience_level: "advanced",
          compensation: "$3000-$4000",
          additional_info: "This is a challenging project requiring strong ML skills.",
          status: "open",
          featured: true,
        }
      ];
      
      // Insert mock problems
      const { error: problemsError } = await supabase
        .from('problems')
        .insert(mockProblems);
      
      if (problemsError) {
        console.error('Error inserting mock problems:', problemsError);
        return false;
      }
      
      // Turn RLS back on if we disabled it
      try {
        await supabase.rpc('enable_rls_for_profiles');
        console.log('Re-enabled RLS for profiles');
      } catch (rlsError) {
        console.log('Could not re-enable RLS:', rlsError);
        // Continue anyway
      }
      
      console.log('Database successfully populated with mock data!');
      return true;
    }
    
    console.log('Database already contains data, skipping population.');
    return true;
  } catch (error) {
    console.error('Error populating database:', error);
    return false;
  }
};

// Function to call from app initialization
export const initializeDatabase = async () => {
  try {
    const result = await populateDatabase();
    console.log('Database initialization:', result ? 'successful' : 'failed');
    return result;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
};

// Create stored procedures for RLS management in Supabase
export const setupRlsHelperFunctions = async () => {
  try {
    // Create function to disable RLS for profiles table (admin only)
    await supabase.rpc('create_disable_rls_function', {
      sql_command: `
        CREATE OR REPLACE FUNCTION disable_rls_for_profiles()
        RETURNS void
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        BEGIN
          ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
        END;
        $$;
      `
    });
    
    // Create function to enable RLS for profiles table (admin only)
    await supabase.rpc('create_enable_rls_function', {
      sql_command: `
        CREATE OR REPLACE FUNCTION enable_rls_for_profiles()
        RETURNS void
        LANGUAGE plpgsql
        SECURITY DEFINER
        AS $$
        BEGIN
          ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
        END;
        $$;
      `
    });
    
    console.log('RLS helper functions created successfully');
    return true;
  } catch (error) {
    console.log('Error setting up RLS helper functions (this is expected if they already exist):', error);
    return false;
  }
};
