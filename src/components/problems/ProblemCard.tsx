
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Problem } from "@/lib/types";
import { format } from "date-fns";
import { ChevronRight, Users, CalendarClock, Sparkles } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

export interface ProblemCardProps {
  problem: Problem;
  onViewDetails?: () => void;
  onApply?: () => void;
  isFeatured?: boolean;
}

const ProblemCard = ({ problem, onViewDetails, onApply, isFeatured }: ProblemCardProps) => {
  const { user } = useAuth();
  const isStartup = user?.role === "startup";
  const isSolver = user?.role === "student";
  
  return (
    <Card className={`overflow-hidden ${isFeatured ? 'border-primary/50 shadow-md' : ''}`}>
      {isFeatured && (
        <div className="bg-primary/10 py-1 px-3 flex items-center justify-center gap-1 text-xs font-medium text-primary">
          <Sparkles className="h-3 w-3" />
          Featured Problem
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-bold line-clamp-2">{problem.title}</CardTitle>
        </div>
        <div className="flex flex-wrap gap-1 mt-2">
          {problem.required_skills.slice(0, 3).map((skill) => (
            <Badge key={skill} variant="secondary" className="font-normal text-xs">
              {skill}
            </Badge>
          ))}
          {problem.required_skills.length > 3 && (
            <Badge variant="outline" className="font-normal text-xs">
              +{problem.required_skills.length - 3} more
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
          {problem.description}
        </p>
        
        <div className="flex flex-col space-y-2 text-sm">
          <div className="flex items-center text-muted-foreground">
            <Users className="h-4 w-4 mr-2" />
            <span className="capitalize">{problem.experience_level} level</span>
          </div>
          
          {problem.deadline && (
            <div className="flex items-center text-muted-foreground">
              <CalendarClock className="h-4 w-4 mr-2" />
              <span>Due {format(new Date(problem.deadline), "MMM d, yyyy")}</span>
            </div>
          )}
          
          <div className="flex items-center text-sm">
            <span className="text-muted-foreground">Posted by:</span>
            <span className="ml-1 font-medium">
              {problem.startup?.company_name || problem.startup?.name || "Unknown Startup"}
            </span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col items-stretch pt-0 gap-2">
        <Button 
          variant="default" 
          className="w-full justify-between"
          onClick={onViewDetails}
        >
          View Details <ChevronRight className="h-4 w-4" />
        </Button>
        
        {isSolver && !isStartup && (
          <Button
            variant="outline" 
            className="w-full" 
            onClick={onApply}
          >
            Apply Now
          </Button>
        )}
      </CardFooter>
    </Card>
  );
};

export default ProblemCard;
