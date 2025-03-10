
import { useState, useEffect } from "react";
import ProblemList from "@/components/problems/ProblemList";
import { Problem } from "@/lib/types";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import NewProblemForm from "@/components/problems/NewProblemForm";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/auth/AuthModal";
import { getProblems } from "@/lib/supabase";
import ProblemDetailsDialog from "@/components/problems/ProblemDetailsDialog";
import ApplicationForm from "@/components/applications/ApplicationForm";

const Problems = () => {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewProblemDialogOpen, setIsNewProblemDialogOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [selectedProblemId, setSelectedProblemId] = useState<string | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isApplicationDialogOpen, setIsApplicationDialogOpen] = useState(false);

  // Get selected problem data
  const selectedProblem = selectedProblemId 
    ? problems.find(p => p.id === selectedProblemId) || null
    : null;

  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setIsLoading(true);
        const fetchedProblems = await getProblems();
        setProblems(fetchedProblems);
      } catch (error) {
        console.error("Error fetching problems:", error);
        toast({
          title: "Error",
          description: "Failed to load problems. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProblems();
  }, [toast]);

  const handlePostProblemClick = () => {
    if (isAuthenticated) {
      setIsNewProblemDialogOpen(true);
    } else {
      setIsAuthModalOpen(true);
    }
  };

  const handleNewProblemSuccess = (newProblem: Problem) => {
    // Add the new problem to the list
    setProblems((prevProblems) => [newProblem, ...prevProblems]);
    
    toast({
      title: "Problem posted successfully!",
      description: "Your problem has been published and is now visible to solvers.",
    });
  };

  const handleViewDetails = (problemId: string) => {
    setSelectedProblemId(problemId);
    setIsDetailsDialogOpen(true);
  };

  const handleApplyClick = (problemId: string) => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }
    
    // Check if user is a student
    if (user?.role !== "student") {
      toast({
        title: "Permission denied",
        description: "Only students/solvers can apply to problems.",
        variant: "destructive",
      });
      return;
    }
    
    setSelectedProblemId(problemId);
    setIsApplicationDialogOpen(true);
  };

  const handleApplicationSuccess = () => {
    toast({
      title: "Application successful",
      description: "Your application has been submitted successfully.",
    });
    setIsApplicationDialogOpen(false);
  };

  return (
    <div className="container mx-auto px-4 md:px-6 max-w-7xl">
      <div className="py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Problems</h1>
          
          {user?.role === "startup" && (
            <Button onClick={handlePostProblemClick}>
              <Plus className="mr-2 h-4 w-4" />
              Post Problem
            </Button>
          )}
        </div>
        
        <ProblemList 
          initialProblems={problems}
          isLoading={isLoading}
          onViewDetails={handleViewDetails}
          onApply={handleApplyClick}
        />
      </div>
      
      {/* New Problem Dialog */}
      <Dialog open={isNewProblemDialogOpen} onOpenChange={setIsNewProblemDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogTitle>Post a New Problem</DialogTitle>
          <NewProblemForm 
            onClose={() => setIsNewProblemDialogOpen(false)}
            onSuccess={handleNewProblemSuccess}
          />
        </DialogContent>
      </Dialog>
      
      {/* Problem Details Dialog */}
      {selectedProblem && (
        <ProblemDetailsDialog
          problem={selectedProblem}
          isOpen={isDetailsDialogOpen}
          onClose={() => setIsDetailsDialogOpen(false)}
          onApply={() => {
            setIsDetailsDialogOpen(false);
            setIsApplicationDialogOpen(true);
          }}
        />
      )}
      
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
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </div>
  );
};

export default Problems;
