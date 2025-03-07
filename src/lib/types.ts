
export interface User {
  id: string
  email: string
  name: string
  avatarUrl?: string
  bio?: string
  role: 'student' | 'startup' | 'admin'
  skills?: string[]
  languages?: string[]
  // Student specific fields
  university?: string
  major?: string
  graduation_year?: string
  experience_level?: 'beginner' | 'intermediate' | 'advanced'
  areas_of_interest?: string[]
  availability?: any
  website_url?: string
  linkedin_url?: string
  location?: string
  github_url?: string
  portfolio_url?: string
  // Startup specific fields
  company_name?: string
  company_description?: string
  founder_names?: string[]
  sectors?: string[]
  stage?: string
  hiring_status?: 'hiring' | 'not_hiring' | 'future_hiring'
  industry_sectors?: string[]
  logo_url?: string
  employee_count?: string
  founding_year?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface Problem {
  id: string
  title: string
  description: string
  startup_id: string
  startup?: User
  required_skills: string[]
  experience_level: 'beginner' | 'intermediate' | 'advanced'
  compensation?: string
  additional_info?: string
  deadline?: Date
  status: 'draft' | 'open' | 'in_progress' | 'completed' | 'cancelled'
  featured?: boolean
  applications_count?: number
  createdAt?: Date
  updatedAt?: Date
}

export interface Application {
  id: string
  problem_id: string
  problem?: Problem
  user_id: string
  user?: User
  cover_letter?: string
  status: 'pending' | 'accepted' | 'rejected'
  createdAt?: Date
  updatedAt?: Date
}
