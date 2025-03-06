import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/auth/AuthModal";
import { ArrowRight, Briefcase, GraduationCap, Star, Zap, Shield, Trophy, Clock, CheckCircle2, Github, Twitter, Linkedin } from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Problem } from "@/lib/types";

// Mock featured problems
const featuredProblems: Problem[] = [
  {
    id: "1",
    title: "Optimize Our Customer Onboarding Flow",
    description: "We need to improve our customer onboarding process to reduce drop-offs and increase activation rates.",
    company: "GrowthMate",
    skills: ["UX Design", "User Research", "Product Strategy"],
    difficulty: "intermediate",
    timeCommitment: "10-15 hours",
    deadline: "2 weeks",
    compensation: "Paid",
    status: "open"
  },
  {
    id: "2",
    title: "Build a Data Visualization Dashboard",
    description: "Create an interactive dashboard to help our customers visualize their analytics data more effectively.",
    company: "DataViz",
    skills: ["React", "D3.js", "Data Visualization"],
    difficulty: "advanced",
    timeCommitment: "20-30 hours",
    deadline: "3 weeks",
    compensation: "Paid + Equity",
    status: "open"
  },
  {
    id: "3",
    title: "Develop a Mobile App Prototype",
    description: "Design and develop a prototype for our new mobile app that helps users track their fitness goals.",
    company: "FitTrack",
    skills: ["Mobile Development", "UI Design", "React Native"],
    difficulty: "intermediate",
    timeCommitment: "15-20 hours",
    deadline: "4 weeks",
    compensation: "Paid",
    status: "open"
  }
];

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "signup">("signup");
  
  const handleOpenSignup = (role: "student" | "startup") => {
    setAuthModalTab("signup");
    setIsAuthModalOpen(true);
  };
  
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with Gradient Background */}
      <div className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-800 to-pink-700">
        <div className="absolute inset-0 bg-grid-white/[0.05] bg-[size:20px_20px]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
        
        <div className="max-container relative pt-32 pb-20 px-4 text-white">
          <div className="flex flex-col items-center text-center space-y-6 max-w-3xl mx-auto">
            <Badge className="bg-white/10 text-white hover:bg-white/20 transition-colors px-4 py-1 text-sm backdrop-blur-sm">
              Connecting Talent with Opportunity
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight leading-tight">
              Where Student Skills <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-emerald-400">Meet Startup</span> Needs
            </h1>
            
            <p className="text-xl text-white/80 max-w-2xl">
              SkillMate helps students gain real-world experience by solving problems for innovative startups.
            </p>
            
            {isAuthenticated ? (
              <div className="flex flex-col sm:flex-row gap-4 mt-6">
                <Button asChild size="lg" className="bg-white text-indigo-900 hover:bg-white/90">
                  <Link to="/problems">
                    Browse Problems <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white/10">
                  <Link to="/profile">
                    View Profile
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 w-full max-w-2xl">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 flex flex-col items-center text-center space-y-4 hover:bg-white/15 transition-colors">
                  <div className="bg-gradient-to-br from-cyan-500 to-blue-600 p-3 rounded-full">
                    <GraduationCap className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold">For Students</h2>
                  <p className="text-white/80">
                    Gain real-world experience, build your portfolio, and connect with innovative startups.
                  </p>
                  <Button 
                    className="w-full bg-white text-indigo-900 hover:bg-white/90" 
                    onClick={() => handleOpenSignup("student")}
                  >
                    Join as a Student
                  </Button>
                </div>
                
                <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 flex flex-col items-center text-center space-y-4 hover:bg-white/15 transition-colors">
                  <div className="bg-gradient-to-br from-pink-500 to-orange-500 p-3 rounded-full">
                    <Briefcase className="h-6 w-6 text-white" />
                  </div>
                  <h2 className="text-xl font-semibold">For Startups</h2>
                  <p className="text-white/80">
                    Post problems, find talented students, and get solutions for your business challenges.
                  </p>
                  <Button 
                    className="w-full bg-white text-indigo-900 hover:bg-white/90" 
                    onClick={() => handleOpenSignup("startup")}
                  >
                    Join as a Startup
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Benefits Section */}
      <div className="py-20 bg-gradient-to-b from-background to-background/80">
        <div className="max-container px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">Why Join SkillMate?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our platform offers unique benefits for both students and startups
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="border-none shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30">
              <CardContent className="pt-6">
                <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Zap className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Real Experience</h3>
                <p className="text-muted-foreground">
                  Work on actual business problems and build a portfolio that stands out to employers.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-lg bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30">
              <CardContent className="pt-6">
                <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Vetted Opportunities</h3>
                <p className="text-muted-foreground">
                  All startups and problems are reviewed to ensure quality and relevance.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-lg bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/30">
              <CardContent className="pt-6">
                <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Trophy className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Recognition</h3>
                <p className="text-muted-foreground">
                  Get recognized for your contributions and build your professional network.
                </p>
              </CardContent>
            </Card>
            
            <Card className="border-none shadow-lg bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30">
              <CardContent className="pt-6">
                <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                  <Clock className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Flexible Commitment</h3>
                <p className="text-muted-foreground">
                  Choose problems that match your schedule and skill level.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      
      {/* Featured Problems Section */}
      <div className="py-20 bg-gradient-to-b from-slate-50 to-white dark:from-slate-950/50 dark:to-background">
        <div className="max-container px-4">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold tracking-tight mb-2">Featured Problems</h2>
              <p className="text-muted-foreground">
                Explore these highlighted opportunities from innovative startups
              </p>
            </div>
            <Button asChild variant="outline">
              <Link to="/problems">
                View All <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProblems.map((problem) => (
              <Card key={problem.id} className="border shadow-md hover:shadow-lg transition-shadow h-full flex flex-col">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-xl">{problem.title}</CardTitle>
                      <CardDescription className="mt-1">{problem.company}</CardDescription>
                    </div>
                    <Star className="h-5 w-5 text-amber-400 fill-amber-400" />
                  </div>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                    {problem.description}
                  </p>
                  <div className="space-y-3">
                    <div className="flex items-center text-sm">
                      <CheckCircle2 className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span className="capitalize">{problem.difficulty} difficulty</span>
                    </div>
                    <div className="flex items-center text-sm">
                      <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                      <span>{problem.timeCommitment}</span>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {problem.skills.slice(0, 3).map((skill) => (
                        <Badge key={skill} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                  <Button asChild className="w-full">
                    <Link to={`/problems/${problem.id}`}>
                      View Details
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </div>
      
      {/* CTA Section - Simplified */}
      <div className="py-16 bg-gradient-to-r from-indigo-600 to-purple-700 text-white">
        <div className="max-container px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-xl text-white/80 max-w-2xl mx-auto">
            Join our community of students and startups today and start building your future.
          </p>
        </div>
      </div>
      
      {/* Footer with only social media icons */}
      <footer className="py-8 border-t">
        <div className="max-container px-4">
          <div className="flex justify-center space-x-6">
            <a href="https://github.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
              <Github className="h-6 w-6" />
              <span className="sr-only">GitHub</span>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
              <Twitter className="h-6 w-6" />
              <span className="sr-only">Twitter</span>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
              <Linkedin className="h-6 w-6" />
              <span className="sr-only">LinkedIn</span>
            </a>
          </div>
        </div>
      </footer>
      
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultTab={authModalTab}
      />
    </div>
  );
};

export default Home; 