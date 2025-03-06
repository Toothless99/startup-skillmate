
import { useState } from "react";
import ProblemList from "@/components/problems/ProblemList";
import NewProblemDialog from "@/components/problems/NewProblemDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { AuthButton, AuthGuard } from "@/components/auth/AuthGuard";
import { Problem } from "@/lib/types";

// Define interface for ProblemList props
interface ProblemListProps {
  initialProblems?: Problem[];
  featuredOnly?: boolean;
}

const Problems = () => {
  const [isNewProblemDialogOpen, setIsNewProblemDialogOpen] = useState(false);
  const [problems, setProblems] = useState<Problem[]>([]);
  const { user } = useAuth();

  const handleNewProblemSuccess = (newProblem: Problem) => {
    setProblems((prev) => [newProblem, ...prev]);
  };

  return (
    <div className="max-container pt-24 px-4 pb-16">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-1">Problems</h1>
          <p className="text-muted-foreground">
            Browse real-world problems posted by startups and apply to solve them
          </p>
        </div>

        {user?.role === "startup" && (
          <Button 
            onClick={() => setIsNewProblemDialogOpen(true)}
            className="flex items-center"
          >
            <Plus className="mr-1 h-4 w-4" /> Post a Problem
          </Button>
        )}
      </div>

      <AuthGuard
        fallback={
          <div className="bg-muted/30 p-6 rounded-lg border border-dashed text-center">
            <h3 className="font-medium text-lg mb-2">Featured Problems</h3>
            <p className="text-muted-foreground mb-6">
              Sign in to see all available problems from startups
            </p>
            <ProblemList featuredOnly={true} />
          </div>
        }
      >
        <ProblemList initialProblems={problems} />
      </AuthGuard>

      <NewProblemDialog
        isOpen={isNewProblemDialogOpen}
        onClose={() => setIsNewProblemDialogOpen(false)}
        onSuccess={handleNewProblemSuccess}
      />
    </div>
  );
};

export default Problems;
