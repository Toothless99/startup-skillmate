
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { getProfileById } from "@/lib/supabase";
import { User } from "@/lib/types";
import ProfileCard from "@/components/profile/ProfileCard";
import { ArrowLeft } from "lucide-react";

const ProfileView = () => {
  const { id } = useParams<{ id: string }>();
  const [profile, setProfile] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const userData = await getProfileById(id);
        setProfile(userData);
      } catch (error) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile. The user may not exist.",
          variant: "destructive",
        });
        navigate(-1);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [id, navigate, toast]);

  if (isLoading) {
    return (
      <div className="max-container pt-24 px-4 pb-16">
        <Button variant="outline" className="mb-6" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        
        <div className="space-y-6">
          <Skeleton className="h-12 w-3/4" />
          <Card>
            <div className="p-6 space-y-4">
              <Skeleton className="h-6 w-1/3" />
              <Skeleton className="h-24 w-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-1/4" />
                <div className="flex gap-2">
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-20" />
                  <Skeleton className="h-6 w-20" />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-container pt-24 px-4 pb-16">
        <Button variant="outline" className="mb-6" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
        
        <div className="text-center py-10">
          <h1 className="text-2xl font-bold mb-4">Profile Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The profile you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-container pt-24 px-4 pb-16">
      <Button variant="outline" className="mb-6" onClick={() => navigate(-1)}>
        <ArrowLeft className="h-4 w-4 mr-2" /> Back
      </Button>
      
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">
          {profile.role === "startup" ? profile.companyName : profile.name}
        </h1>
        
        <ProfileCard user={profile} />
        
        {profile.role === "startup" && (
          <div className="flex justify-center mt-8">
            <Button size="lg" onClick={() => navigate(`/problems?startup=${profile.id}`)}>
              View Problems from this Startup
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileView;
