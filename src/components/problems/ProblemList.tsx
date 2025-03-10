
import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { Problem } from "@/lib/types";
import ProblemCard from "./ProblemCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { X, Search, Filter, Lock } from "lucide-react";
import AuthModal from "@/components/auth/AuthModal";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "react-router-dom";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import ApplicationForm from "@/components/applications/ApplicationForm";

interface ProblemListProps {
  initialProblems?: Problem[];
  startupId?: string;
  limitForGuests?: boolean;
  onViewDetails?: (problemId: string) => void;
  onApply?: (problemId: string) => void;
  featuredOnly?: boolean;
  isLoading?: boolean;
}

const ProblemList = ({ initialProblems, startupId, limitForGuests = true, onViewDetails, onApply, isLoading }: ProblemListProps) => {
  const { isAuthenticated, user } = useAuth();
  const { toast } = useToast();
  const location = useLocation();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [filteredProblems, setFilteredProblems] = useState<Problem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [experienceFilter, setExperienceFilter] = useState<string>("all");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isApplicationDialogOpen, setIsApplicationDialogOpen] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  
  useEffect(() => {
    // Initialize problems
    let allProblems = initialProblems?.length ? initialProblems : [];
    
    // If startupId is provided, filter problems for that specific startup
    if (startupId) {
      allProblems = allProblems.filter(problem => problem.startup_id === startupId);
    }
    
    // For search params in URL - for example ?startup=startup1
    const searchParams = new URLSearchParams(location.search);
    const urlStartupId = searchParams.get('startup');
    if (urlStartupId) {
      allProblems = allProblems.filter(problem => problem.startup_id === urlStartupId);
    }
    
    // For non-authenticated users, show only featured problems if limitForGuests is true
    if (!isAuthenticated && limitForGuests) {
      allProblems = allProblems.filter(problem => problem.featured);
    }
    
    setProblems(allProblems);
    setFilteredProblems(allProblems);
  }, [initialProblems, isAuthenticated, startupId, location.search, limitForGuests]);
  
  // Get all unique skills from problems
  const allSkills = Array.from(
    new Set(problems.flatMap((problem) => problem.required_skills))
  ).sort();
  
  // Apply filters when inputs change
  useEffect(() => {
    let filtered = problems;
    
    // Apply search term filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (problem) =>
          problem.title.toLowerCase().includes(term) ||
          problem.description.toLowerCase().includes(term) ||
          problem.startup?.name?.toLowerCase().includes(term) ||
          problem.startup?.company_name?.toLowerCase().includes(term) ||
          problem.required_skills.some(skill => skill.toLowerCase().includes(term))
      );
    }
    
    // Apply experience filter
    if (experienceFilter && experienceFilter !== "all") {
      filtered = filtered.filter((problem) => problem.experience_level === experienceFilter);
    }
    
    // Apply skills filter
    if (selectedSkills.length > 0) {
      filtered = filtered.filter((problem) =>
        selectedSkills.some((skill) => problem.required_skills.includes(skill))
      );
    }
    
    setFilteredProblems(filtered);
  }, [searchTerm, experienceFilter, selectedSkills, problems]);
  
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
  
  const handleApply = (problem: Problem) => {
    if (!isAuthenticated) {
      setSelectedProblem(problem);
      setIsAuthModalOpen(true);
      return;
    }
    
    // Don't allow startups to apply to problems
    if (user?.role !== "student") {
      toast({
        title: "Permission denied",
        description: "Only students/solvers can apply to problems.",
        variant: "destructive",
      });
      return;
    }
    
    // Open application dialog
    setSelectedProblem(problem);
    setIsApplicationDialogOpen(true);
  };
  
  const handleApplicationSuccess = () => {
    toast({
      title: "Application submitted",
      description: "Your application has been successfully submitted.",
    });
    
    // Call the parent's onApply callback if it exists
    if (onApply && selectedProblem) {
      onApply(selectedProblem.id);
    }
    
    setIsApplicationDialogOpen(false);
    setSelectedProblem(null);
  };
  
  // Show authentication prompt for guests when limiting content
  if (!isAuthenticated && limitForGuests && (!problems.length || problems.every(p => !p.featured))) {
    return (
      <div className="text-center py-8 space-y-4">
        <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
          <Lock className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold">Sign in to view all problems</h3>
        <p className="text-muted-foreground max-w-md mx-auto">
          Create an account or sign in to browse the full list of problems posted by startups.
        </p>
        <Button onClick={() => setIsAuthModalOpen(true)}>
          Sign In
        </Button>
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search problems..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
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
            <X className="mr-1 h-4 w-4" /> Clear Filters
          </Button>
        </div>
      </div>
      
      {/* Skills filter section */}
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
      
      {/* Limited view for non-authenticated users */}
      {!isAuthenticated && limitForGuests && problems.some(p => p.featured) && (
        <div className="bg-muted/50 rounded-lg p-4 mb-4">
          <div className="flex items-center space-x-2 mb-2">
            <Badge>Featured</Badge>
            <p className="text-sm font-medium">Featured Problems</p>
          </div>
          <p className="text-sm text-muted-foreground">
            Sign in to see all available problems and apply to them.
          </p>
        </div>
      )}
      
      {/* Loading state */}
      {isLoading && (
        <div className="col-span-full text-center py-10">
          <p className="text-muted-foreground">Loading problems...</p>
        </div>
      )}
      
      {/* Problem cards */}
      {!isLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProblems.length > 0 ? (
            filteredProblems.map((problem) => (
              <ProblemCard
                key={problem.id}
                problem={problem}
                onViewDetails={() => onViewDetails?.(problem.id)}
                onApply={() => handleApply(problem)}
                isFeatured={problem.featured}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-10">
              <p className="text-muted-foreground">No problems match your criteria.</p>
              <Button variant="link" onClick={clearFilters}>
                Clear all filters
              </Button>
            </div>
          )}
        </div>
      )}
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
      
      {/* Application Dialog */}
      {selectedProblem && (
        <Dialog open={isApplicationDialogOpen} onOpenChange={setIsApplicationDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogTitle>Apply to Problem</DialogTitle>
            <ApplicationForm 
              problem={selectedProblem}
              onClose={() => setIsApplicationDialogOpen(false)}
              onSuccess={handleApplicationSuccess}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ProblemList;
