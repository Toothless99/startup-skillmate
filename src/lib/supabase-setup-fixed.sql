
-- Improved SQL script for creating Supabase tables with appropriate RLS policies

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  avatar_url TEXT,
  bio TEXT,
  role TEXT NOT NULL CHECK (role IN ('student', 'startup', 'admin')),
  skills TEXT[] DEFAULT '{}',
  languages TEXT[] DEFAULT '{}',
  
  -- Student-specific fields
  university TEXT,
  major TEXT,
  graduation_year TEXT,
  experience_level TEXT CHECK (experience_level IN ('beginner', 'intermediate', 'advanced')),
  areas_of_interest TEXT[] DEFAULT '{}',
  availability JSONB,
  website_url TEXT,
  linkedin_url TEXT,
  location TEXT,
  github_url TEXT,
  portfolio_url TEXT,
  
  -- Startup-specific fields
  company_name TEXT,
  company_description TEXT,
  founder_names TEXT[] DEFAULT '{}',
  sectors TEXT[] DEFAULT '{}',
  stage TEXT,
  hiring_status TEXT CHECK (hiring_status IN ('hiring', 'not_hiring', 'future_hiring')),
  industry_sectors TEXT[] DEFAULT '{}',
  logo_url TEXT,
  employee_count TEXT,
  founding_year TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create problems table
CREATE TABLE IF NOT EXISTS problems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  startup_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  required_skills TEXT[] DEFAULT '{}',
  experience_level TEXT NOT NULL CHECK (experience_level IN ('beginner', 'intermediate', 'advanced')),
  compensation TEXT,
  additional_info TEXT,
  deadline TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL CHECK (status IN ('draft', 'open', 'in_progress', 'completed', 'cancelled')),
  featured BOOLEAN DEFAULT false,
  applications_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- Create applications table
CREATE TABLE IF NOT EXISTS applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  problem_id UUID NOT NULL REFERENCES problems(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  cover_letter TEXT,
  status TEXT NOT NULL CHECK (status IN ('pending', 'accepted', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
  UNIQUE(problem_id, user_id)
);

-- MODIFIED RLS POLICIES
-- First clean up any existing RLS
ALTER TABLE IF EXISTS profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS problems DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS applications DISABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Service role can manage all profiles" ON profiles;
DROP POLICY IF EXISTS "Insert is allowed for everyone" ON profiles;

DROP POLICY IF EXISTS "Problems are viewable by everyone" ON problems;
DROP POLICY IF EXISTS "Startups can create problems" ON problems;
DROP POLICY IF EXISTS "Startups can update their own problems" ON problems;
DROP POLICY IF EXISTS "Startups can delete their own problems" ON problems;

DROP POLICY IF EXISTS "Users can view their own applications" ON applications;
DROP POLICY IF EXISTS "Startups can view applications for their problems" ON applications;
DROP POLICY IF EXISTS "Students can create applications" ON applications;
DROP POLICY IF EXISTS "Startups can update application status" ON applications;

-- Re-enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- IMPROVED Profiles policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can insert profiles"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id OR auth.role() = 'service_role');

CREATE POLICY "Users can update their own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id OR auth.role() = 'service_role');

CREATE POLICY "Service role can manage all profiles" 
  ON profiles USING (auth.role() = 'service_role');

-- Problems policies
CREATE POLICY "Problems are viewable by everyone"
  ON problems FOR SELECT
  USING (true);

CREATE POLICY "Startups can create problems"
  ON problems FOR INSERT
  WITH CHECK (
    (auth.uid() = startup_id) OR 
    (auth.role() = 'service_role')
  );

CREATE POLICY "Startups can update their own problems"
  ON problems FOR UPDATE
  USING (
    (auth.uid() = startup_id) OR 
    (auth.role() = 'service_role')
  );

CREATE POLICY "Startups can delete their own problems"
  ON problems FOR DELETE
  USING (
    (auth.uid() = startup_id) OR 
    (auth.role() = 'service_role')
  );

-- Applications policies
CREATE POLICY "Users can view their own applications"
  ON applications FOR SELECT
  USING (
    (auth.uid() = user_id) OR 
    (auth.role() = 'service_role')
  );

CREATE POLICY "Startups can view applications for their problems"
  ON applications FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM problems
      WHERE problems.id = applications.problem_id
      AND problems.startup_id = auth.uid()
    ) OR 
    (auth.role() = 'service_role')
  );

CREATE POLICY "Students can create applications"
  ON applications FOR INSERT
  WITH CHECK (
    (auth.uid() = user_id) OR 
    (auth.role() = 'service_role')
  );

CREATE POLICY "Startups can update application status"
  ON applications FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM problems
      WHERE problems.id = applications.problem_id
      AND problems.startup_id = auth.uid()
    ) OR 
    (auth.role() = 'service_role')
  );

-- Helper functions for managing RLS
CREATE OR REPLACE FUNCTION disable_rls_for_profiles()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;
END;
$$;

CREATE OR REPLACE FUNCTION enable_rls_for_profiles()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
END;
$$;

-- Create functions and triggers

-- Function to update applications_count
CREATE OR REPLACE FUNCTION update_problem_applications_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE problems
    SET applications_count = applications_count + 1
    WHERE id = NEW.problem_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE problems
    SET applications_count = applications_count - 1
    WHERE id = OLD.problem_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

-- Trigger for applications_count
DROP TRIGGER IF EXISTS update_problem_applications_count_trigger ON applications;
CREATE TRIGGER update_problem_applications_count_trigger
AFTER INSERT OR DELETE ON applications
FOR EACH ROW
EXECUTE FUNCTION update_problem_applications_count();

-- Function to handle timestamps
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers for updated_at
DROP TRIGGER IF EXISTS set_profiles_updated_at ON profiles;
CREATE TRIGGER set_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS set_problems_updated_at ON problems;
CREATE TRIGGER set_problems_updated_at
BEFORE UPDATE ON problems
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();

DROP TRIGGER IF EXISTS set_applications_updated_at ON applications;
CREATE TRIGGER set_applications_updated_at
BEFORE UPDATE ON applications
FOR EACH ROW
EXECUTE FUNCTION handle_updated_at();
