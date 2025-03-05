import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GraduationCap, Briefcase, Languages } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/auth/AuthModal";

// Mock solvers data - you can replace this with your actual data source
const mockSolvers = [
  {
    id: "1",
    name: "John Doe",
    university: "Stanford University",
    major: "Computer Science",
    graduationYear: "2024",
    skills: ["React", "TypeScript", "Node.js"],
    languages: ["English", "Spanish"],
    experienceLevel: "intermediate"
  },
  {
    id: "2",
    name: "Jane Smith",
    university: "MIT",
    major: "Electrical Engineering",
    graduationYear: "2023",
    skills: ["Python", "Machine Learning", "Data Science"],
    languages: ["English", "French"],
    experienceLevel: "advanced"
  },
  {
    id: "3",
    name: "Alex Johnson",
    university: "UC Berkeley",
    major: "Business Administration",
    graduationYear: "2025",
    skills: ["Marketing", "Social Media", "Content Creation"],
    languages: ["English", "German"],
    experienceLevel: "beginner"
  }
];

const Solvers = () => {
  const { isAuthenticated } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredSolvers = mockSolvers.filter(solver => 
    solver.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    solver.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase())) ||
    solver.university.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleContactClick = () => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
    }
    // Handle contact logic here
  };
  
  return (
    <div className="max-container pt-24 px-4 pb-16">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Solvers</h1>
          <p className="text-muted-foreground mt-1">
            Find talented students to solve your problems
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4">
          <Input
            placeholder="Search by name, skills, or university..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSolvers.map((solver) => (
            <Card key={solver.id}>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{solver.name}</h3>
                    <p className="text-muted-foreground text-sm">
                      {solver.university} • {solver.major}
                    </p>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <GraduationCap className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>Class of {solver.graduationYear}</span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span className="capitalize">{solver.experienceLevel} Level</span>
                  </div>
                  
                  <div className="flex items-center text-sm">
                    <Languages className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{solver.languages.join(", ")}</span>
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm font-medium">Skills</p>
                    <div className="flex flex-wrap gap-1">
                      {solver.skills.map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <Button 
                    className="w-full mt-2" 
                    onClick={handleContactClick}
                  >
                    Contact Solver
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        
        {filteredSolvers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No solvers found matching your search.</p>
          </div>
        )}
      </div>
      
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};

export default Solvers;
