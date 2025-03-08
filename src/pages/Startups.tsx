import { useState, useEffect } from "react";
import { User } from "@/lib/types";
import { getStartups } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getInitials } from "@/lib/utils";
import { Link } from "react-router-dom";
import { Building2, MapPin, Globe, Users } from "lucide-react";

const Startups = () => {
  const { toast } = useToast();
  const [startups, setStartups] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStartups = async () => {
      setIsLoading(true);
      try {
        const fetchedStartups = await getStartups();
        
        if (fetchedStartups.length > 0) {
          setStartups(fetchedStartups);
        } else {
          // Use mock data if no startups found
          setStartups(mockStartups);
          toast({
            title: "Using demo data",
            description: "Currently displaying mock startup data for demonstration.",
          });
        }
      } catch (error) {
        console.error("Error fetching startups:", error);
        setStartups(mockStartups);
        toast({
          title: "Error fetching startups",
          description: "Using demo data instead.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStartups();
  }, [toast]);

  // Mock startups for fallback
  const mockStartups: User[] = [
    {
      id: "1",
      email: "techwave@example.com",
      name: "TechWave Solutions",
      role: "startup",
      company_name: "TechWave Solutions",
      company_description: "Building innovative AI solutions for enterprise customers.",
      sectors: ["AI", "Enterprise Software", "SaaS"],
      stage: "seed",
      hiring_status: "hiring",
      location: "San Francisco, CA",
      founder_names: ["Alex Johnson", "Maria Garcia"],
      website_url: "https://techwave.example.com",
      linkedin_url: "https://linkedin.com/company/techwave",
      employee_count: "11-50",
      founding_year: "2021",
    },
    // Add more mock startups as needed
  ];

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">Innovative Startups</h1>
      
      {isLoading ? (
        <div className="text-center py-10">
          <p className="text-muted-foreground">Loading startups...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {startups.map((startup) => (
            <Card key={startup.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Avatar className="h-16 w-16">
                    <AvatarImage src={startup.avatar_url || ""} alt={startup.company_name || startup.name} />
                    <AvatarFallback className="text-lg">
                      {getInitials(startup.company_name || startup.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-xl font-semibold">{startup.company_name || startup.name}</h3>
                    {startup.stage && (
                      <Badge variant="outline" className="mt-1">
                        {startup.stage.charAt(0).toUpperCase() + startup.stage.slice(1)}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <p className="text-sm mb-4 line-clamp-3">
                  {startup.company_description || "No description provided"}
                </p>
                
                {startup.sectors && startup.sectors.length > 0 && (
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {startup.sectors.map((sector, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {sector}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="space-y-2 text-sm mb-4">
                  {startup.location && (
                    <div className="flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground" />
                      <span>{startup.location}</span>
                    </div>
                  )}
                  
                  {startup.employee_count && (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span>{startup.employee_count} employees</span>
                    </div>
                  )}
                  
                  {startup.website_url && (
                    <div className="flex items-center gap-2">
                      <Globe className="h-4 w-4 text-muted-foreground" />
                      <a 
                        href={startup.website_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Website
                      </a>
                    </div>
                  )}
                  
                  {startup.founding_year && (
                    <div className="flex items-center gap-2">
                      <Building2 className="h-4 w-4 text-muted-foreground" />
                      <span>Founded in {startup.founding_year}</span>
                    </div>
                  )}
                </div>
                
                <Button asChild className="w-full">
                  <Link to={`/startups/${startup.id}`}>View Profile</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default Startups;
