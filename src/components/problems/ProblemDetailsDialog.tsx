
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { Calendar, Clock, Briefcase, Tag, Building2, ExternalLink, Info } from "lucide-react";
import { Problem } from "@/lib/types";
import { Link } from "react-router-dom";

interface ProblemDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  problem: Problem | null;
  onApply?: (problemId: string) => void;
}

const ProblemDetailsDialog = ({ isOpen, onClose, problem, onApply }: ProblemDetailsDialogProps) => {
  if (!problem) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{problem.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6 py-4">
          {/* Startup info */}
          {problem.startup && (
            <div className="flex items-center space-x-2">
              <Building2 className="h-4 w-4 text-muted-foreground" />
              <Link 
                to={`/startups/${problem.startup_id}`}
                className="text-primary hover:underline flex items-center"
              >
                {problem.startup?.company_name || problem.startup?.name}
                <ExternalLink className="ml-1 h-3 w-3" />
              </Link>
            </div>
          )}
          
          {/* Status and dates */}
          <div className="flex flex-wrap gap-4">
            <div className="flex items-center space-x-2">
              <Badge>{problem.status}</Badge>
            </div>
            <div className="flex items-center space-x-1 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Posted {format(new Date(problem.createdAt), "MMM d, yyyy")}</span>
            </div>
            {problem.deadline && (
              <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Due {format(new Date(problem.deadline), "MMM d, yyyy")}</span>
              </div>
            )}
          </div>
          
          {/* Description */}
          <div className="space-y-2">
            <h3 className="font-medium">Description</h3>
            <p className="text-sm whitespace-pre-line">{problem.description}</p>
          </div>
          
          {/* Additional Info */}
          {problem.additional_info && (
            <div className="space-y-2">
              <h3 className="font-medium flex items-center">
                <Info className="mr-1 h-4 w-4" /> Additional Information
              </h3>
              <p className="text-sm whitespace-pre-line">{problem.additional_info}</p>
            </div>
          )}
          
          {/* Skills */}
          <div className="space-y-2">
            <h3 className="font-medium flex items-center">
              <Tag className="mr-1 h-4 w-4" /> Required Skills
            </h3>
            <div className="flex flex-wrap gap-2">
              {problem.required_skills.map((skill) => (
                <Badge key={skill} variant="outline">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
          
          {/* Experience and Compensation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <h3 className="font-medium flex items-center">
                <Briefcase className="mr-1 h-4 w-4" /> Experience Level
              </h3>
              <p className="capitalize">{problem.experience_level}</p>
            </div>
            
            {problem.compensation && (
              <div className="space-y-1">
                <h3 className="font-medium">Compensation</h3>
                <p>{problem.compensation}</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Footer with action buttons */}
        <div className="flex justify-end space-x-2 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
          {problem.status === "open" && onApply && (
            <Button onClick={() => {
              onApply(problem.id);
              onClose();
            }}>
              Apply Now
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProblemDetailsDialog;
