import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, GraduationCap, Briefcase, Languages, Search, ExternalLink, Filter, X } from "lucide-react";
import { User as UserType } from "@/lib/types";
import { Link } from "react-router-dom";
import { getStudents } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import SolverCard from "./SolverCard";
import { mockSolvers } from "@/lib/mockData";

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
      setIsLoading(true);
      try {
        // Fetch solvers from Supabase
        const fetchedSolvers = await getStudents();
        
        if (fetchedSolvers.length > 0) {
          setSolvers(fetchedSolvers);
          setFilteredSolvers(fetchedSolvers);
        } else if (initialSolvers && initialSolvers.length > 0) {
          // Use provided solvers if available
          setSolvers(initialSolvers);
          setFilteredSolvers(initialSolvers);
        } else {
          // Use our comprehensive mock data
          setSolvers(mockSolvers);
          setFilteredSolvers(mockSolvers);
          
          toast({
            title: "Using demo data",
            description: "Currently displaying mock solver data for demonstration.",
          });
        }
      } catch (error) {
        console.error("Error fetching solvers:", error);
        // Fallback to mock data
        setSolvers(mockSolvers);
        setFilteredSolvers(mockSolvers);
        
        toast({
          title: "Error fetching solvers",
          description: "Using demo data instead.",
          variant: "destructive",
        });
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
      filtered = filtered.filter((solver) => solver.experience_level === experienceFilter);
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

  const experienceLevelFilter = (solver: UserType) => 
    experienceFilter === "all" || solver.experience_level === experienceFilter;

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
