import { Problem } from "@/lib/types";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Briefcase, Tag, Building2, Info } from "lucide-react";
import { format } from "date-fns";
import { Link } from "react-router-dom";

interface ProblemCardProps {
  problem: Problem;
  onApply?: (problemId: string) => void;
  onViewDetails?: (problemId: string) => void;
  isFeatured?: boolean;
}

const ProblemCard = ({ problem, onApply, onViewDetails, isFeatured }: ProblemCardProps) => {
  // Handle status badge display
  const getStatusBadge = () => {
    switch (problem.status) {
      case "open":
        return <Badge>Open</Badge>;
      case "in_progress":
        return <Badge variant="secondary">In Progress</Badge>;
      case "completed":
        return <Badge variant="outline">Completed</Badge>;
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>;
      default:
        return <Badge variant="outline">Draft</Badge>;
    }
  };

  return (
    <Card className={`overflow-hidden transition-all duration-300 hover:shadow-md ${isFeatured ? 'border-primary/20' : ''}`}>
      {isFeatured && (
        <div className="bg-primary text-primary-foreground text-xs font-medium px-3 py-1">
          Featured
        </div>
      )}
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg">{problem.title}</CardTitle>
            {problem.startup && (
              <CardDescription className="mt-1 hover:underline">
                <Link to={`/startups/${problem.startupId}`}>
                  <span className="flex items-center">
                    <Building2 className="h-3 w-3 mr-1" />
                    {problem.startup?.companyName || problem.startup?.name || "Anonymous Startup"}
                  </span>
                </Link>
              </CardDescription>
            )}
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm line-clamp-3">{problem.description}</p>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <p className="text-xs text-muted-foreground flex items-center">
              <Tag className="mr-1 h-3 w-3" /> Skills
            </p>
            <div className="flex flex-wrap gap-1">
              {problem.requiredSkills.slice(0, 3).map((skill) => (
                <Badge key={skill} variant="outline" className="text-xs">
                  {skill}
                </Badge>
              ))}
              {problem.requiredSkills.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{problem.requiredSkills.length - 3}
                </Badge>
              )}
            </div>
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted-foreground flex items-center">
              <Briefcase className="mr-1 h-3 w-3" /> Experience
            </p>
            <p className="text-sm capitalize">
              {problem.experienceLevel}
            </p>
          </div>

          {problem.compensation && (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Compensation</p>
              <p className="text-sm">{problem.compensation}</p>
            </div>
          )}

          {problem.deadline && (
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground flex items-center">
                <Calendar className="mr-1 h-3 w-3" /> Deadline
              </p>
              <p className="text-sm">
                {format(new Date(problem.deadline), "MMM d, yyyy")}
              </p>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between border-t pt-4">
        <div className="text-xs text-muted-foreground flex items-center">
          <Clock className="mr-1 h-3 w-3" />
          Posted {format(new Date(problem.createdAt), "MMM d, yyyy")}
        </div>
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => onViewDetails && onViewDetails(problem.id)}
          >
            <Info className="mr-1 h-4 w-4" /> Details
          </Button>
          {problem.status === "open" && onApply && (
            <Button size="sm" onClick={() => onApply(problem.id)}>
              Apply Now
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  );
};

export default ProblemCard;
