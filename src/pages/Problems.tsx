import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import ProblemList from "@/components/problems/ProblemList";
import AuthModal from "@/components/auth/AuthModal";
import NewProblemDialog from "@/components/problems/NewProblemDialog";
import ProblemDetailsDialog from "@/components/problems/ProblemDetailsDialog";
import { Plus } from "lucide-react";
import { useState, useEffect } from "react";
import { Problem } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Link } from "react-router-dom";

const Problems = () => {
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isNewProblemDialogOpen, setIsNewProblemDialogOpen] = useState(false);
  const [selectedProblem, setSelectedProblem] = useState<Problem | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [problems, setProblems] = useState<Problem[]>([]);
  
  const isStartup = user?.role === "startup";
  
  const handleViewDetails = (problemId: string) => {
    // Find the problem by ID
    const problem = problems.find(p => p.id === problemId);
    if (problem) {
      setSelectedProblem(problem);
      setIsDetailsDialogOpen(true);
    }
  };
  
  const handleApply = (problemId: string) => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }
    
    toast({
      title: "Application Submitted",
      description: "Your application has been successfully submitted.",
    });
  };
  
  const handleNewProblemSuccess = (newProblem: Problem) => {
    // Add the new problem to the list
    setProblems(prevProblems => [newProblem, ...prevProblems]);
    
    toast({
      title: "Problem Posted",
      description: "Your problem has been successfully posted and is now visible to solvers.",
    });
    
    // Close the dialog
    setIsNewProblemDialogOpen(false);
  };
  
  return (
    <div className="max-container pt-24 px-4 pb-16">
      <div className="space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Problems</h1>
            <p className="text-muted-foreground mt-1">
              Browse and apply to problems that match your skills
            </p>
          </div>
          
          {isAuthenticated && isStartup && (
            <Button 
              className="self-start sm:self-center"
              onClick={() => setIsNewProblemDialogOpen(true)}
            >
              <Plus className="mr-2 h-4 w-4" /> Post New Problem
            </Button>
          )}
          
          {!isAuthenticated && (
            <Button 
              variant="outline" 
              onClick={() => setIsAuthModalOpen(true)}
              className="self-start sm:self-center"
            >
              Sign in to post problems
            </Button>
          )}
        </div>
        
        <div className="bg-primary/5 rounded-lg p-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex-1">
              <h2 className="text-lg font-medium">Looking for specific problems?</h2>
              <p className="text-muted-foreground">
                Use the filters below to find the perfect match for your skills and interests.
              </p>
            </div>
          </div>
        </div>
        
        <ProblemList 
          initialProblems={problems}
          onViewDetails={handleViewDetails}
          onApply={handleApply}
        />
        
        <AuthModal
          isOpen={isAuthModalOpen}
          onClose={() => setIsAuthModalOpen(false)}
        />
        
        <NewProblemDialog
          isOpen={isNewProblemDialogOpen}
          onClose={() => setIsNewProblemDialogOpen(false)}
          onSuccess={handleNewProblemSuccess}
        />
        
        <ProblemDetailsDialog
          isOpen={isDetailsDialogOpen}
          onClose={() => setIsDetailsDialogOpen(false)}
          problem={selectedProblem}
          onApply={handleApply}
        />
      </div>
    </div>
  );
};

export default Problems;