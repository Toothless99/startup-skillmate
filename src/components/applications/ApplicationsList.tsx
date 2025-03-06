import { useState, useEffect } from "react";
import { Application } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { getApplicationsForStartup, updateApplicationStatus } from "@/lib/supabase";
import { useAuth } from "@/context/AuthContext";
import { Link } from "react-router-dom";

interface ApplicationsListProps {
  status?: 'pending' | 'accepted' | 'rejected';
}

const ApplicationsList = ({ status }: ApplicationsListProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!user || user.role !== "startup") return;
      
      try {
        setIsLoading(true);
        const fetchedApplications = await getApplicationsForStartup(user.id);
        
        // Filter by status if provided
        const filteredApplications = status 
          ? fetchedApplications.filter(app => app.status === status)
          : fetchedApplications;
          
        setApplications(filteredApplications);
      } catch (error) {
        console.error("Error fetching applications:", error);
        toast({
          title: "Error",
          description: "Failed to load applications. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchApplications();
  }, [user, toast, status]);

  const handleUpdateStatus = async (applicationId: string, status: 'accepted' | 'rejected') => {
    try {
      await updateApplicationStatus(applicationId, status);
      
      // Update local state
      setApplications(prevApplications => 
        prevApplications.map(app => 
          app.id === applicationId ? { ...app, status } : app
        )
      );
      
      toast({
        title: `Application ${status}`,
        description: `You have ${status} the application.`,
      });
    } catch (error) {
      console.error(`Error ${status} application:`, error);
      toast({
        title: "Error",
        description: `Failed to ${status} the application. Please try again.`,
        variant: "destructive",
      });
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading applications...</div>;
  }

  if (applications.length === 0) {
    return (
      <div className="text-center py-10">
        <p className="text-muted-foreground">No applications yet.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {applications.map((application) => (
        <Card key={application.id}>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={application.user?.avatarUrl} alt={application.user?.name} />
                  <AvatarFallback>{getInitials(application.user?.name || "")}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">{application.user?.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Applied on {formatDate(application.createdAt)}
                  </p>
                </div>
              </div>
              <Badge variant={
                application.status === "accepted" ? "default" : 
                application.status === "rejected" ? "destructive" : 
                "outline"
              }>
                {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <h4 className="text-sm font-medium">Applied to:</h4>
              <p className="font-medium">{application.problem?.title}</p>
            </div>
            
            {application.coverLetter && (
              <div>
                <h4 className="text-sm font-medium mb-1">Cover Letter:</h4>
                <p className="text-sm">{application.coverLetter}</p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" asChild>
              <Link to={`/solvers/${application.userId}`}>View Profile</Link>
            </Button>
            
            {application.status === "pending" && (
              <div className="flex space-x-2">
                <Button 
                  variant="destructive" 
                  onClick={() => handleUpdateStatus(application.id, "rejected")}
                >
                  Reject
                </Button>
                <Button 
                  onClick={() => handleUpdateStatus(application.id, "accepted")}
                >
                  Accept
                </Button>
              </div>
            )}
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default ApplicationsList;
