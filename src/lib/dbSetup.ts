
import { supabase } from './supabase';
import { mockSolvers } from './mockData';
import { User, Problem } from './types';
import { v4 as uuidv4 } from 'uuid';

// Function to populate the database with mock data
export const populateDatabase = async () => {
  try {
    console.log('Populating database with mock data...');
    
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
      console.log('No existing profiles found, adding mock data...');
      
      // Try to add mock data using anonymous access
      // This will use the RLS policies that are already in place
      
      // Create local variables to store successfully inserted users
      let insertedSolvers = [];
      let insertedStartups = [];
      
      // Create mock solvers with generated UUIDs
      const mockSolversWithIds = mockSolvers.map(solver => ({
        ...solver,
        id: uuidv4(),
      }));

      // Attempt to insert mock solvers - catch errors but continue
      for (const solver of mockSolversWithIds) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .insert(solver)
            .select();
          
          if (error) {
            console.error(`Error inserting solver ${solver.name}:`, error);
          } else if (data && data.length > 0) {
            console.log(`Successfully added solver: ${solver.name}`);
            insertedSolvers.push(data[0]);
          }
        } catch (err) {
          console.error(`Exception inserting solver ${solver.name}:`, err);
        }
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
      
      // Attempt to insert mock startups - catch errors but continue
      for (const startup of mockStartups) {
        try {
          const { data, error } = await supabase
            .from('profiles')
            .insert(startup)
            .select();
          
          if (error) {
            console.error(`Error inserting startup ${startup.name}:`, error);
          } else if (data && data.length > 0) {
            console.log(`Successfully added startup: ${startup.name}`);
            insertedStartups.push(data[0]);
          }
        } catch (err) {
          console.error(`Exception inserting startup ${startup.name}:`, err);
        }
      }
      
      // If we have successful startups, create problems
      if (insertedStartups.length > 0) {
        // Use the first startup ID for mock problems
        const firstStartupId = insertedStartups[0].id;
        const secondStartupId = insertedStartups.length > 1 ? insertedStartups[1].id : firstStartupId;
        
        // Create mock problems with the startup IDs
        const mockProblems: Problem[] = [
          {
            id: uuidv4(),
            title: "Build a React Native Mobile App",
            description: "We need a skilled developer to build a cross-platform mobile application for our startup.",
            startup_id: firstStartupId,
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
            startup_id: firstStartupId,
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
            startup_id: secondStartupId,
            required_skills: ["Python", "Machine Learning", "Data Science"],
            experience_level: "advanced",
            compensation: "$3000-$4000",
            additional_info: "This is a challenging project requiring strong ML skills.",
            status: "open",
            featured: true,
          }
        ];
        
        // Attempt to insert mock problems - catch errors but continue
        for (const problem of mockProblems) {
          try {
            const { error: problemError } = await supabase
              .from('problems')
              .insert(problem);
            
            if (problemError) {
              console.error(`Error inserting problem "${problem.title}":`, problemError);
            } else {
              console.log(`Successfully added problem: ${problem.title}`);
            }
          } catch (err) {
            console.error(`Exception inserting problem "${problem.title}":`, err);
          }
        }
      } else {
        console.log('No startups were successfully inserted, skipping problem creation');
      }
      
      // Return success if we inserted any data
      const hasInsertedAnyData = insertedSolvers.length > 0 || insertedStartups.length > 0;
      if (hasInsertedAnyData) {
        console.log('Database successfully populated with at least some mock data!');
        return true;
      } else {
        console.log('Failed to insert any mock data.');
        return false;
      }
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

// This function is no longer needed as we're working with the RLS policies directly
export const setupRlsHelperFunctions = async () => {
  console.log('RLS helper functions not needed, skipping...');
  return true;
};
