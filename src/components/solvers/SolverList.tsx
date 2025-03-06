import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, GraduationCap, Briefcase, Languages, Search, ExternalLink, Filter, X } from "lucide-react";
import { User as UserType } from "@/lib/types";
import { Link } from "react-router-dom";
import { getSolvers } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import SolverCard from "./SolverCard";

interface SolverListProps {
  initialSolvers?: UserType[];
  featuredOnly?: boolean;
  onViewProfile?: (solverId: string) => void;
}

const SolverList = ({ initialSolvers, featuredOnly = false, onViewProfile }: SolverListProps) => {
  const { toast } = useToast();
  const [solvers, setSolvers] = useState<UserType[]>([]);
  const [filteredSolvers, setFilteredSolvers] = useState<UserType[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [experienceFilter, setExperienceFilter] = useState<string>("all");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSolvers = async () => {
      try {
        setIsLoading(true);
        // If initialSolvers is provided, use that instead of fetching
        if (initialSolvers && initialSolvers.length > 0) {
          setSolvers(initialSolvers);
          setFilteredSolvers(initialSolvers);
          return;
        }

        // Otherwise fetch from API
        const fetchedSolvers = await getSolvers(featuredOnly);
        setSolvers(fetchedSolvers);
        setFilteredSolvers(fetchedSolvers);
      } catch (error) {
        console.error("Error fetching solvers:", error);
        toast({
          title: "Error",
          description: "Failed to load solvers. Please try again later.",
          variant: "destructive",
        });
        // Set some mock data as fallback
        setSolvers(mockSolvers);
        setFilteredSolvers(mockSolvers);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSolvers();
  }, [initialSolvers, featuredOnly, toast]);

  // Get all unique skills from solvers
  const allSkills = Array.from(
    new Set(solvers.flatMap((solver) => solver.skills || []))
  ).sort();

  // Apply filters when inputs change
  useEffect(() => {
    let filtered = solvers;
    
    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (solver) =>
          solver.name?.toLowerCase().includes(term) ||
          solver.university?.toLowerCase().includes(term) ||
          solver.major?.toLowerCase().includes(term) ||
          solver.skills?.some(skill => skill.toLowerCase().includes(term))
      );
    }
    
    // Apply experience filter
    if (experienceFilter && experienceFilter !== "all") {
      filtered = filtered.filter((solver) => solver.experienceLevel === experienceFilter);
    }
    
    // Apply skills filter
    if (selectedSkills.length > 0) {
      filtered = filtered.filter((solver) =>
        selectedSkills.some((skill) => solver.skills?.includes(skill))
      );
    }
    
    setFilteredSolvers(filtered);
  }, [searchTerm, experienceFilter, selectedSkills, solvers]);

  const handleSkillToggle = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill]
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setExperienceFilter("all");
    setSelectedSkills([]);
  };

  // Mock solvers data for fallback
  const mockSolvers: UserType[] = [
    {
      id: "1",
      email: "john.doe@example.com",
      name: "John Doe",
      role: "student",
      skills: ["React", "TypeScript", "Node.js"],
      university: "Stanford University",
      major: "Computer Science",
      graduationYear: "2024",
      experienceLevel: "intermediate",
      availability: { status: "available", hours: 20 },
      bio: "Full-stack developer with a passion for building user-friendly applications.",
      createdAt: new Date("2023-01-15"),
      updatedAt: new Date("2023-06-20")
    },
    {
      id: "2",
      email: "jane.smith@example.com",
      name: "Jane Smith",
      role: "student",
      skills: ["UI/UX", "Figma", "Adobe XD"],
      university: "MIT",
      major: "Design",
      graduationYear: "2023",
      experienceLevel: "advanced",
      availability: { status: "available", hours: 15 },
      bio: "UI/UX designer with 3+ years of experience creating beautiful interfaces.",
      createdAt: new Date("2023-02-10"),
      updatedAt: new Date("2023-06-15")
    },
    {
      id: "3",
      email: "alex.johnson@example.com",
      name: "Alex Johnson",
      role: "student",
      skills: ["Python", "Machine Learning", "Data Analysis"],
      university: "UC Berkeley",
      major: "Data Science",
      graduationYear: "2025",
      experienceLevel: "beginner",
      availability: { status: "limited", hours: 10 },
      bio: "Data scientist specializing in machine learning and predictive analytics.",
      createdAt: new Date("2023-03-05"),
      updatedAt: new Date("2023-06-10")
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search solvers by name, skills, or bio..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {/* Filters */}
        <div className="flex flex-wrap gap-2">
          <Select value={experienceFilter} onValueChange={setExperienceFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Experience Level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Levels</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="sm"
            className="flex items-center"
            onClick={clearFilters}
            disabled={!searchTerm && experienceFilter === "all" && selectedSkills.length === 0}
          >
            Clear Filters
          </Button>
        </div>
      </div>
      
      {/* Skills filter */}
      <div className="pb-2">
        <div className="flex items-center text-sm text-muted-foreground mb-2">
          <Filter className="mr-2 h-4 w-4" /> Filter by skills
        </div>
        <div className="flex flex-wrap gap-2">
          {allSkills.map((skill) => (
            <Badge
              key={skill}
              variant={selectedSkills.includes(skill) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => handleSkillToggle(skill)}
            >
              {skill}
            </Badge>
          ))}
        </div>
      </div>
      
      {/* Solver cards grid */}
      {isLoading ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Loading solvers...</p>
        </div>
      ) : filteredSolvers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSolvers.map((solver) => (
            <SolverCard
              key={solver.id}
              solver={solver}
              onViewProfile={onViewProfile}
            />
          ))}
        </div>
      ) : (
        <div className="col-span-full text-center py-10">
          <p className="text-muted-foreground">No solvers match your criteria.</p>
          <Button variant="link" onClick={clearFilters}>
            Clear all filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default SolverList;
