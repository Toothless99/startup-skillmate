
import { User } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Building2, 
  Calendar, 
  GraduationCap, 
  Briefcase, 
  Globe, 
  Linkedin, 
  MapPin, 
  Users, 
  Languages, 
  Clock, 
  Tag 
} from "lucide-react";

interface ProfileCardProps {
  user: User;
}

const ProfileCard = ({ user }: ProfileCardProps) => {
  const isStartup = user.role === "startup";
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-2xl">{isStartup ? user.company_name : user.name}</CardTitle>
              {isStartup && user.name && (
                <CardDescription>Contact: {user.name}</CardDescription>
              )}
            </div>
            
            <div className="flex flex-wrap gap-2">
              {isStartup ? (
                <>
                  <Badge variant="outline">{user.stage?.replace('_', ' ').toUpperCase()}</Badge>
                  {user.hiring_status === "hiring" && (
                    <Badge className="bg-green-500">Hiring</Badge>
                  )}
                  {user.hiring_status === "future_hiring" && (
                    <Badge variant="secondary">Hiring Soon</Badge>
                  )}
                </>
              ) : (
                <>
                  <Badge variant="outline" className="capitalize">{user.experience_level || "Beginner"}</Badge>
                  {user.availability?.status === "available" && (
                    <Badge className="bg-green-500">Available</Badge>
                  )}
                  {user.availability?.status === "limited" && (
                    <Badge variant="secondary">Limited Availability</Badge>
                  )}
                  {user.availability?.status === "unavailable" && (
                    <Badge variant="outline">Not Available</Badge>
                  )}
                </>
              )}
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Bio/Description */}
          {isStartup ? (
            user.company_description && (
              <div className="space-y-2">
                <h3 className="font-medium">About the Company</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-line">{user.company_description}</p>
              </div>
            )
          ) : (
            user.bio && (
              <div className="space-y-2">
                <h3 className="font-medium">About Me</h3>
                <p className="text-sm text-muted-foreground whitespace-pre-line">{user.bio}</p>
              </div>
            )
          )}
          
          {/* Contact & Links */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {user.location && (
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{user.location}</span>
              </div>
            )}
            
            {user.website_url && (
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-muted-foreground" />
                <a 
                  href={user.website_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  Website
                </a>
              </div>
            )}
            
            {user.linkedin_url && (
              <div className="flex items-center gap-2">
                <Linkedin className="h-4 w-4 text-muted-foreground" />
                <a 
                  href={user.linkedin_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary hover:underline"
                >
                  LinkedIn
                </a>
              </div>
            )}
            
            {!isStartup && user.availability?.status !== "unavailable" && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span>{user.availability?.hours || 10} hours/week</span>
              </div>
            )}
          </div>
          
          {/* Startup specific */}
          {isStartup && (
            <>
              {user.founder_names && user.founder_names.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-medium flex items-center">
                    <Users className="mr-1 h-4 w-4" /> Founders
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {user.founder_names.map((founder) => (
                      <Badge key={founder} variant="outline">
                        {founder}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {user.sectors && user.sectors.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-medium flex items-center">
                    <Briefcase className="mr-1 h-4 w-4" /> Industry Sectors
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {user.sectors.map((sector) => (
                      <Badge key={sector} variant="secondary">
                        {sector}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
          
          {/* Student specific */}
          {!isStartup && (
            <>
              {(user.university || user.major || user.graduation_year) && (
                <div className="space-y-2">
                  <h3 className="font-medium flex items-center">
                    <GraduationCap className="mr-1 h-4 w-4" /> Education
                  </h3>
                  <div className="space-y-1">
                    {user.university && (
                      <p className="text-sm">{user.university}</p>
                    )}
                    {user.major && (
                      <p className="text-sm text-muted-foreground">
                        {user.major}
                        {user.graduation_year && ` • Class of ${user.graduation_year}`}
                      </p>
                    )}
                  </div>
                </div>
              )}
              
              {user.skills && user.skills.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-medium flex items-center">
                    <Tag className="mr-1 h-4 w-4" /> Skills
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {user.skills.map((skill) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {user.areas_of_interest && user.areas_of_interest.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-medium">Areas of Interest</h3>
                  <div className="flex flex-wrap gap-2">
                    {user.areas_of_interest.map((interest) => (
                      <Badge key={interest} variant="outline">
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {user.languages && user.languages.length > 0 && (
                <div className="space-y-2">
                  <h3 className="font-medium flex items-center">
                    <Languages className="mr-1 h-4 w-4" /> Languages
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {user.languages.map((language) => (
                      <Badge key={language} variant="outline">
                        {language}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
      
      {/* Call to action */}
      <div className="flex justify-end">
        <Button variant="outline" onClick={() => window.print()}>
          Download Profile
        </Button>
      </div>
    </div>
  );
};

export default ProfileCard;
