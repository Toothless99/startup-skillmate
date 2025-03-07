import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Problem } from "@/lib/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, X, ChevronDown } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProblemCard from "./ProblemCard";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import ProblemDetailsDialog from "./ProblemDetailsDialog";

interface ProblemListProps {
  initialProblems?: Problem[];
  isLoading?: boolean;
  featuredOnly?: boolean;
  onViewDetails?: (problemId: string) => void;
  onApply?: (problemId: string) => void;
}

const ProblemList = ({ 
  initialProblems = [], 
  isLoading = false,
  featuredOnly = false,
  onViewDetails,
  onApply,
}: ProblemListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [status, setStatus] = useState("all");
  const [experienceLevel, setExperienceLevel] = useState("all");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [problems, setProblems] = useState<Problem[]>(initialProblems);
  const [filteredProblems, setFilteredProblems] = useState<Problem[]>(initialProblems);
  const [allSkills, setAllSkills] = useState<string[]>([]);
  const [isFilterExpanded, setIsFilterExpanded] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  // Update problems when initialProblems changes
  useEffect(() => {
    setProblems(initialProblems);
    setFilteredProblems(initialProblems);
    
    // Extract all unique skills
    const skillsSet = new Set<string>();
    initialProblems.forEach(problem => {
      if (problem.required_skills) {
        problem.required_skills.forEach(skill => skillsSet.add(skill));
      }
    });
    setAllSkills(Array.from(skillsSet).sort());
  }, [initialProblems]);

  // Apply filters when inputs change
  useEffect(() => {
    let filtered = problems;
    
    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        problem => 
          problem.title.toLowerCase().includes(term) || 
          problem.description.toLowerCase().includes(term) ||
          (problem.required_skills && problem.required_skills.some(skill => 
            skill.toLowerCase().includes(term)
          ))
      );
    }
    
    // Filter by status
    if (status !== "all") {
      filtered = filtered.filter(problem => problem.status === status);
    }
    
    // Filter by experience level
    if (experienceLevel !== "all") {
      filtered = filtered.filter(problem => problem.experience_level === experienceLevel);
    }
    
    // Filter by selected skills
    if (selectedSkills.length > 0) {
      filtered = filtered.filter(problem => 
        problem.required_skills && selectedSkills.some(skill => problem.required_skills.includes(skill))
      );
    }
    
    // Put featured problems first if not filtering by featured only
    if (!featuredOnly) {
      filtered.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return 0;
      });
    }
    
    setFilteredProblems(filtered);
  }, [searchTerm, status, experienceLevel, selectedSkills, problems, featuredOnly]);

  const handleViewDetails = (problemId: string) => {
    // Find the problem
    const problem = problems.find(p => p.id === problemId);
    if (problem) {
      setSelectedProblem(problem);
      setIsDetailsDialogOpen(true);
    }
    
    // Call the parent handler if provided
    if (onViewDetails) {
      onViewDetails(problemId);
    }
  };

  const toggleSkill = (skill: string) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill) 
        : [...prev, skill]
    );
  };

  const clearFilters = () => {
    setSearchTerm("");
    setStatus("all");
    setExperienceLevel("all");
    setSelectedSkills([]);
  };

  const hasActiveFilters = searchTerm || status !== "all" || experienceLevel !== "all" || selectedSkills.length > 0;

  return (
    <div className="space-y-6">
      {/* Search and filters */}
      <div className="space-y-4">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search problems by title, description, or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        {/* Main filters */}
        <div className="flex flex-wrap gap-2 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="w-[140px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_progress">In Progress</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={experienceLevel} onValueChange={setExperienceLevel}>
              <SelectTrigger className="w-[160px]">
                <SelectValue placeholder="Experience Level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Levels</SelectItem>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
            
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters} className="h-10">
                <X className="mr-2 h-4 w-4" />
                Clear Filters
              </Button>
            )}
          </div>
          
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setIsFilterExpanded(!isFilterExpanded)}
            className="h-10"
          >
            <Filter className="mr-2 h-4 w-4" />
            Skills
            <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${isFilterExpanded ? 'rotate-180' : ''}`} />
          </Button>
        </div>
        
        {/* Skills filter */}
        {isFilterExpanded && (
          <Card className="mt-2">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">Filter by skills</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {allSkills.map((skill) => (
                  <Badge
                    key={skill}
                    variant={selectedSkills.includes(skill) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleSkill(skill)}
                  >
                    {skill}
                  </Badge>
                ))}
                
                {allSkills.length === 0 && (
                  <p className="text-muted-foreground text-sm">No skills available to filter</p>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
      
      {/* Problems grid */}
      {isLoading ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Loading problems...</p>
        </div>
      ) : filteredProblems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProblems.map((problem) => (
            <ProblemCard
              key={problem.id}
              problem={problem}
              onViewDetails={handleViewDetails}
              isFeatured={!!problem.featured}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-10">
          <p className="text-muted-foreground">No problems match your criteria.</p>
          <Button variant="link" onClick={clearFilters} className="mt-2">
            Clear all filters
          </Button>
        </div>
      )}
      
      {/* Problem details dialog */}
      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
          {selectedProblem && (
            <ProblemDetailsDialog 
              problem={selectedProblem}
              onClose={() => setIsDetailsDialogOpen(false)}
              isOpen={isDetailsDialogOpen}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProblemList;
