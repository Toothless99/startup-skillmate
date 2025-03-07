
import { User } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

interface SolverCardProps {
  solver: User;
  onViewProfile?: (solverId: string) => void;
}

const SolverCard = ({ solver, onViewProfile }: SolverCardProps) => {
  const handleViewProfile = () => {
    if (onViewProfile) {
      onViewProfile(solver.id);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12">
              <AvatarImage src={solver.avatarUrl || ""} alt={solver.name} />
              <AvatarFallback>{getInitials(solver.name)}</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">{solver.name}</h3>
              <p className="text-sm text-muted-foreground">
                {solver.university} {solver.graduation_year ? `'${solver.graduation_year.slice(-2)}` : ""}
              </p>
            </div>
          </div>
          <Badge variant={solver.availability?.status === "available" ? "default" : "outline"}>
            {solver.availability?.status === "available" ? "Available" : "Limited"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-sm mb-4 line-clamp-3">{solver.bio || "No bio provided"}</p>
        <div className="space-y-2">
          {solver.major && (
            <div className="text-sm">
              <span className="font-medium">Major:</span> {solver.major}
            </div>
          )}
          <div className="text-sm">
            <span className="font-medium">Experience:</span> {solver.experience_level ? solver.experience_level.charAt(0).toUpperCase() + solver.experience_level.slice(1) : "Not specified"}
          </div>
          <div>
            <span className="text-sm font-medium">Skills:</span>
            <div className="flex flex-wrap gap-1 mt-1">
              {solver.skills && solver.skills.length > 0 ? (
                solver.skills.slice(0, 4).map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))
              ) : (
                <span className="text-xs text-muted-foreground">No skills listed</span>
              )}
              {solver.skills && solver.skills.length > 4 && (
                <Badge variant="secondary" className="text-xs">
                  +{solver.skills.length - 4} more
                </Badge>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleViewProfile} className="w-full">
          View Profile
        </Button>
      </CardFooter>
    </Card>
  );
};

export default SolverCard;
