import { useState, useEffect } from "react";
import { Application } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { getApplicationsForUser } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";

interface StudentApplicationsListProps {
  status?: 'pending' | 'accepted' | 'rejected';
}

const StudentApplicationsList = ({ status }: StudentApplicationsListProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!user || user.role !== "student") return;
      
      try {
        setIsLoading(true);
        const fetchedApplications = await getApplicationsForUser(user.id);
        
        // Filter by status if provided
        const filteredApplications = status 
          ? fetchedApplications.filter(app => app.status === status)
          : fetchedApplications;
          
        setApplications(filteredApplications);
      } catch (error) {
        console.error("Error fetching applications:", error);
        toast({
          title: "Error",
          description: "Failed to load your applications. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, [user, toast, status]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'accepted':
        return <Badge>Accepted</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline">Pending</Badge>;
    }
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading your applications...</div>;
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">
          {status 
            ? `You don't have any ${status} applications.` 
            : "You haven't applied to any problems yet."}
        </p>
        <Button variant="link" asChild className="mt-2">
          <Link to="/problems">Browse Problems</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {applications.map((application) => (
        <Card key={application.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-semibold text-lg">{application.problem?.title}</h3>
                <p className="text-sm text-muted-foreground">
                  Applied on {formatDate(application.createdAt)}
                </p>
              </div>
              {getStatusBadge(application.status)}
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <h4 className="text-sm font-medium">Startup:</h4>
              <p>{application.startup?.name || "Unknown Startup"}</p>
            </div>
            
            {application.coverLetter && (
              <div>
                <h4 className="text-sm font-medium mb-1">Your Cover Letter:</h4>
                <p className="text-sm">{application.coverLetter}</p>
              </div>
            )}
          </CardContent>
          <CardFooter>
            <Button variant="outline" asChild className="w-full">
              <Link to={`/problems/${application.problemId}`}>View Problem</Link>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default StudentApplicationsList; 