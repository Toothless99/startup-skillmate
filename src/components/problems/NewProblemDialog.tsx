import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import NewProblemForm from "./NewProblemForm";
import { Problem } from "@/lib/types";
import { Button } from "@/components/ui/button";

interface NewProblemDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (newProblem: Problem) => void;
}

const NewProblemDialog = ({ isOpen, onClose, onSuccess }: NewProblemDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Post a New Problem</DialogTitle>
        </DialogHeader>
        <NewProblemForm onClose={onClose} onSuccess={onSuccess} />
        <div className="flex justify-end mt-4">
          <Button variant="outline" onClick={() => alert("Additional information button clicked!")}>
            Additional Information
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default NewProblemDialog; 