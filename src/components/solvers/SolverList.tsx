
import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, GraduationCap, Briefcase, Languages, Search, ExternalLink, Filter } from "lucide-react";
import { User as UserType } from "@/lib/types";
import { Link } from "react-router-dom";
import { getSolvers } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface SolverListProps {
  featuredOnly?: boolean;
}

const SolverList = ({ featuredOnly = false }: SolverListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [availabilityFilter, setAvailabilityFilter] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [solvers, setSolvers] = useState<UserType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchSolvers = async () => {
      try {
        setIsLoading(true);
        const data = await getSolvers(featuredOnly);
        setSolvers(data);
      } catch (error) {
        console.error("Error fetching solvers:", error);
        toast({
          title: "Error",
          description: "Failed to load solvers. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchSolvers();
  }, [featuredOnly, toast]);
  
  // Get all unique skills from solvers
  const allSkills = Array.from(
    new Set(solvers.flatMap((solver) => solver.skills || []))
  ).sort();
  
  // Handle skill toggle for filtering
  const handleSkillToggle = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill]
    );
  };
  
  // Filter solvers based on search term, availability, and skills
  const filteredSolvers = solvers.filter((solver) => {
    // Search term filter
    const matchesSearch = 
      !searchTerm ||
      solver.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      solver.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      solver.skills?.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Availability filter
    const matchesAvailability = 
      !availabilityFilter ||
      solver.availability?.status === availabilityFilter;
    
    // Skills filter
    const matchesSkills = 
      selectedSkills.length === 0 ||
      selectedSkills.some(skill => solver.skills?.includes(skill));
    
    return matchesSearch && matchesAvailability && matchesSkills;
  });
  
  const clearFilters = () => {
    setSearchTerm("");
    setAvailabilityFilter("");
    setSelectedSkills([]);
  };
  
  if (isLoading) {
    return <div className="text-center py-8">Loading solvers...</div>;
  }
  
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
          <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Availability</SelectItem>
              <SelectItem value="available">Fully Available</SelectItem>
              <SelectItem value="limited">Limited Availability</SelectItem>
            </SelectContent>
          </Select>
          
          <Button
            variant="outline"
            size="sm"
            className="flex items-center"
            onClick={clearFilters}
            disabled={!searchTerm && !availabilityFilter && selectedSkills.length === 0}
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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSolvers.length > 0 ? (
          filteredSolvers.map((solver) => (
            <Card key={solver.id} className="h-full flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full overflow-hidden bg-muted">
                    {solver.avatarUrl ? (
                      <img 
                        src={solver.avatarUrl} 
                        alt={solver.name} 
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <User className="h-6 w-6 m-3 text-muted-foreground" />
                    )}
                  </div>
                  <CardTitle className="text-xl">{solver.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-4">
                  <p className="text-muted-foreground">{solver.bio}</p>
                  
                  {/* Skills */}
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center">
                      <Briefcase className="h-4 w-4 mr-1" /> Skills
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {solver.skills?.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  {/* Languages */}
                  <div>
                    <h4 className="text-sm font-medium mb-2 flex items-center">
                      <Languages className="h-4 w-4 mr-1" /> Languages
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {solver.languages?.map((language) => (
                        <span key={language} className="text-sm text-muted-foreground">
                          {language}
                        </span>
                      ))}
                    </div>
                  </div>
                  
                  {/* Availability */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Availability</h4>
                    <Badge 
                      variant={solver.availability?.status === "available" ? "default" : "outline"}
                      className={solver.availability?.status === "available" ? "bg-green-500" : ""}
                    >
                      {solver.availability?.status === "available" ? "Available" : "Limited Availability"}
                      {solver.availability?.hours && ` (${solver.availability.hours} hrs/week)`}
                    </Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <Button className="w-full" asChild>
                  <Link to={`/solvers/${solver.id}`}>
                    View Profile
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-muted-foreground">No solvers match your criteria.</p>
            <Button variant="link" onClick={clearFilters}>
              Clear all filters
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SolverList;
