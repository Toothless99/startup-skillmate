
import { useState } from "react";
import { Problem } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/auth/AuthModal";
import ApplicationForm from "@/components/applications/ApplicationForm";

interface ProblemCardProps {
  problem: Problem;
  onViewDetails?: (problemId: string) => void;
  isFeatured?: boolean;
}

const ProblemCard = ({ problem, onViewDetails, isFeatured = false }: ProblemCardProps) => {
  const { user, isAuthenticated } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isApplicationModalOpen, setIsApplicationModalOpen] = useState(false);
  
  const handleApplyClick = () => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }
    
    if (user?.role !== "student") {
      // Only students can apply
      return;
    }
    
    setIsApplicationModalOpen(true);
  };
  
  const handleViewDetails = () => {
    if (onViewDetails) {
      onViewDetails(problem.id);
    }
  };
  
  const formatDate = (date?: Date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <>
      <Card className={`h-full flex flex-col ${isFeatured ? 'border-primary/50' : ''}`}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-semibold line-clamp-2">{problem.title}</h3>
              <p className="text-sm text-muted-foreground">
                {problem.startup?.name || "Unknown Startup"}
              </p>
            </div>
            <Badge variant={problem.status === "open" ? "default" : "secondary"}>
              {problem.status === "open" ? "Open" : "Closed"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="flex-grow">
          <p className="text-sm mb-4 line-clamp-3">{problem.description}</p>
          <div className="space-y-2">
            <div className="flex flex-wrap gap-1">
              {problem.required_skills && problem.required_skills.slice(0, 3).map((skill, index) => (
                <Badge key={index} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {problem.required_skills && problem.required_skills.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{problem.required_skills.length - 3} more
                </Badge>
              )}
            </div>
            <div className="text-sm">
              <span className="font-medium">Experience:</span> {problem.experience_level.charAt(0).toUpperCase() + problem.experience_level.slice(1)}
            </div>
            {problem.compensation && (
              <div className="text-sm">
                <span className="font-medium">Compensation:</span> {problem.compensation}
              </div>
            )}
            {problem.deadline && (
              <div className="text-sm">
                <span className="font-medium">Deadline:</span> {formatDate(problem.deadline)}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button variant="outline" className="flex-1" onClick={handleViewDetails}>
            View Details
          </Button>
          {problem.status === "open" && user?.role === "student" && (
            <Button className="flex-1" onClick={handleApplyClick}>
              Apply Now
            </Button>
          )}
        </CardFooter>
      </Card>
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
      
      {/* Application Modal */}
      <Dialog open={isApplicationModalOpen} onOpenChange={setIsApplicationModalOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogTitle>Apply to Problem</DialogTitle>
          <ApplicationForm 
            problem={problem}
            onClose={() => setIsApplicationModalOpen(false)}
            onSuccess={() => {
              // You could update the UI to show the user has applied
              console.log("Application submitted successfully");
            }}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ProblemCard;
