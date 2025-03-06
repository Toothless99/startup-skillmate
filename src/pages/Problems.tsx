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

const Problems = () => {
  const { toast } = useToast();
  const { user, isAuthenticated } = useAuth();
  const [problems, setProblems] = useState<Problem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isNewProblemDialogOpen, setIsNewProblemDialogOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  useEffect(() => {
    // In a real app, this would fetch problems from your API
    // For now, we'll use the mock data in ProblemList
    setIsLoading(false);
  }, []);

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
          onViewDetails={(id) => console.log("View details for problem:", id)}
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
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
    </div>
  );
};

export default Problems;
