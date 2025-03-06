
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import NewProblemForm from "./NewProblemForm";
import { Problem } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { AuthGuard } from "@/components/auth/AuthGuard";

interface NewProblemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (newProblem: Problem) => void;
}

const NewProblemDialog = ({ isOpen, onClose, onSuccess }: NewProblemDialogProps) => {
  const { user } = useAuth();
  
  // Only startups can post problems
  if (!user?.role || user.role !== "startup") {
    return null;
  }
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Post a New Problem</DialogTitle>
        </DialogHeader>
        <AuthGuard>
          <NewProblemForm onClose={onClose} onSuccess={onSuccess} />
        </AuthGuard>
        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewProblemDialog;
