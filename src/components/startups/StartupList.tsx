
import { useState, useEffect } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building2, Search, MapPin, Users, ExternalLink } from "lucide-react";
import { User } from "@/lib/types";
import { Link } from "react-router-dom";
import { getStartups } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

interface StartupListProps {
  featuredOnly?: boolean;
}

const StartupList = ({ featuredOnly = false }: StartupListProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [startups, setStartups] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    const fetchStartups = async () => {
      try {
        setIsLoading(true);
        const data = await getStartups(featuredOnly);
        setStartups(data);
      } catch (error) {
        console.error("Error fetching startups:", error);
        toast({
          title: "Error",
          description: "Failed to load startups. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchStartups();
  }, [featuredOnly, toast]);
  
  // Filter startups based on search term
  const filteredStartups = startups.filter(
    (startup) =>
      startup.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      startup.companyDescription?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      startup.sectors?.some(sector => sector.toLowerCase().includes(searchTerm.toLowerCase()))
  );
  
  if (isLoading) {
    return <div className="text-center py-8">Loading startups...</div>;
  }
  
  return (
    <div className="space-y-6">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search startups by name, description, or industry..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>
      
      {/* Startup cards grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStartups.length > 0 ? (
          filteredStartups.map((startup) => (
            <Card key={startup.id} className="h-full flex flex-col">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="rounded-full w-12 h-12 bg-primary/10 flex items-center justify-center">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <CardTitle className="text-xl">{startup.companyName || startup.name}</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="flex-grow">
                <div className="space-y-4">
                  <p className="text-muted-foreground">{startup.companyDescription || startup.bio}</p>
                  
                  {/* Startup tags/industries */}
                  <div className="flex flex-wrap gap-2">
                    {startup.sectors?.map((sector) => (
                      <Badge key={sector} variant="secondary">
                        {sector}
                      </Badge>
                    ))}
                  </div>
                  
                  {/* Availability status */}
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={startup.hiringStatus === "hiring" ? "default" : "outline"}
                      className={startup.hiringStatus === "hiring" ? "bg-green-500" : ""}
                    >
                      {startup.hiringStatus === "hiring" ? "Actively Hiring" : 
                       startup.hiringStatus === "future_hiring" ? "Hiring Soon" : "Not Hiring"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t pt-4">
                <div className="flex justify-between w-full">
                  <Button variant="outline" size="sm" asChild>
                    <Link to={`/problems?startup=${startup.id}`}>
                      View Problems
                    </Link>
                  </Button>
                  <Button size="sm" asChild>
                    <Link to={`/startups/${startup.id}`}>
                      <span>View Profile</span>
                      <ExternalLink className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-10">
            <p className="text-muted-foreground">No startups match your search criteria.</p>
            {searchTerm && (
              <Button variant="link" onClick={() => setSearchTerm("")}>
                Clear search
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StartupList;
