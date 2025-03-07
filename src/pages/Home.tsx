import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock, Briefcase, Users, BookOpen } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/auth/AuthModal";
import { useState } from "react";
import { Problem } from "@/lib/types";

// Feature problems for the homepage
const featuredProblems: Problem[] = [
  {
    id: "1",
    title: "Build a Mobile App for Event Check-in",
    description: "We need a React Native developer to create a mobile app for event check-in. The app will scan QR codes and validate attendees against our database.",
    startup_id: "101",
    required_skills: ["React Native", "Mobile Development", "API Integration"],
    experience_level: "intermediate",
    compensation: "$3,000",
    deadline: new Date("2023-12-15"),
    status: "open",
    featured: true,
  },
  {
    id: "2",
    title: "Design Brand Identity for Tech Startup",
    description: "Looking for a designer to create a brand identity including logo, color palette, typography, and brand guidelines for our fintech startup.",
    startup_id: "102",
    required_skills: ["Brand Design", "Logo Design", "Typography", "Adobe Creative Suite"],
    experience_level: "intermediate",
    compensation: "$2,500",
    deadline: new Date("2023-12-20"),
    status: "open",
    featured: true,
  },
  {
    id: "3",
    title: "Implement ML Algorithm for Product Recommendations",
    description: "We're looking for a data scientist to implement a machine learning algorithm for our e-commerce platform to improve product recommendations.",
    startup_id: "103",
    required_skills: ["Python", "Machine Learning", "Data Science", "SQL"],
    experience_level: "advanced",
    compensation: "$4,000",
    deadline: new Date("2023-12-25"),
    status: "open",
    featured: true,
  }
];

const Home = () => {
  const { isAuthenticated, user } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "signup">("login");
  
  const openAuthModal = (tab: "login" | "signup") => {
    setAuthModalTab(tab);
    setIsAuthModalOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-primary/10 to-background py-16 lg:py-24">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Connect Students with <span className="text-primary">Startup Challenges</span>
              </h1>
              <p className="mt-4 text-xl text-muted-foreground">
                Gain real-world experience by solving problems for innovative startups, or find talented students to help grow your company.
              </p>
              <div className="mt-8 space-x-4">
                {!isAuthenticated ? (
                  <>
                    <Button size="lg" onClick={() => openAuthModal("signup")}>
                      Get Started
                    </Button>
                    <Button variant="outline" size="lg" onClick={() => openAuthModal("login")}>
                      Sign In
                    </Button>
                  </>
                ) : (
                  <>
                    {user?.role === "student" ? (
                      <Button size="lg" asChild>
                        <Link to="/problems">Find Problems</Link>
                      </Button>
                    ) : (
                      <Button size="lg" asChild>
                        <Link to="/solvers">Find Solvers</Link>
                      </Button>
                    )}
                    <Button variant="outline" size="lg" asChild>
                      <Link to="/profile">My Profile</Link>
                    </Button>
                  </>
                )}
              </div>
            </div>
            <div className="relative hidden lg:block">
              <img 
                src="/placeholder.svg" 
                alt="Platform preview" 
                className="rounded-lg shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>
      
      {/* Featured Problems */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-3xl font-bold">Featured Problems</h2>
            <Button variant="outline" asChild>
              <Link to="/problems" className="flex items-center">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProblems.map((problem) => (
              <Card key={problem.id} className="overflow-hidden border border-muted h-full flex flex-col">
                <CardContent className="p-6 flex flex-col h-full">
                  <div className="mb-4 flex items-start justify-between">
                    <div>
                      <Badge className="mb-2">Featured</Badge>
                      <h3 className="text-xl font-semibold line-clamp-2">
                        {problem.title}
                      </h3>
                    </div>
                  </div>
                  
                  <p className="text-muted-foreground line-clamp-3 mb-4">
                    {problem.description}
                  </p>
                  
                  <div className="mt-auto space-y-3">
                    <div className="flex items-center text-sm">
                      <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Company: {problem.startup?.company_name || "Unknown"}</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <Users className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Experience: {problem.experience_level.charAt(0).toUpperCase() + problem.experience_level.slice(1)}</span>
                    </div>
                    
                    <div className="flex items-center text-sm">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>Timeframe: {problem.deadline ? new Date(problem.deadline).toLocaleDateString() : "Flexible"}</span>
                    </div>
                    
                    <div className="flex flex-wrap gap-1 mt-2">
                      {problem.required_skills.slice(0, 3).map((skill, index) => (
                        <Badge variant="secondary" key={index} className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {problem.required_skills.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{problem.required_skills.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
      
      {/* How it Works Section */}
      <section className="py-16 bg-muted">
        <div className="container mx-auto px-4 max-w-6xl">
          <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4">
                <BookOpen className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Browse Problems</h3>
              <p className="text-muted-foreground">
                Students can explore a wide range of startup challenges and projects.
              </p>
            </div>
            
            {/* Step 2 */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4">
                <Briefcase className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Apply & Collaborate</h3>
              <p className="text-muted-foreground">
                Apply to the problems that match your skills and collaborate with startups.
              </p>
            </div>
            
            {/* Step 3 */}
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-primary text-primary-foreground flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Get Recognized</h3>
              <p className="text-muted-foreground">
                Showcase your talents, gain experience, and get recognized by startups.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Auth modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        defaultTab={authModalTab}
      />
    </div>
  );
};

export default Home;
