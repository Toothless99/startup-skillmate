import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "@/components/auth/AuthModal";
import { ArrowRight, Briefcase, GraduationCap } from "lucide-react";

const Home = () => {
  const { isAuthenticated } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "signup">("signup");
  
  const handleOpenSignup = (role: "student" | "startup") => {
    setAuthModalTab("signup");
    setIsAuthModalOpen(true);
  };
  
  return (
    <div className="max-container pt-24 px-4 pb-16">
      <div className="flex flex-col items-center text-center space-y-6 py-12">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
          Connect Students with Startups
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl">
          ProblemSolver helps students gain real-world experience by solving problems for startups.
        </p>
        
        {isAuthenticated ? (
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Button asChild size="lg">
              <Link to="/problems">
                Browse Problems <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/profile">
                View Profile
              </Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 w-full max-w-2xl">
            <div className="bg-card border rounded-lg p-6 flex flex-col items-center text-center space-y-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <GraduationCap className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">For Students</h2>
              <p className="text-muted-foreground">
                Gain real-world experience, build your portfolio, and connect with innovative startups.
              </p>
              <Button 
                className="w-full" 
                onClick={() => handleOpenSignup("student")}
              >
                Join as a Student
              </Button>
            </div>
            
            <div className="bg-card border rounded-lg p-6 flex flex-col items-center text-center space-y-4">
              <div className="bg-primary/10 p-3 rounded-full">
                <Briefcase className="h-6 w-6 text-primary" />
              </div>
              <h2 className="text-xl font-semibold">For Startups</h2>
              <p className="text-muted-foreground">
                Post problems, find talented students, and get solutions for your business challenges.
              </p>
              <Button 
                className="w-full" 
                onClick={() => handleOpenSignup("startup")}
              >
                Join as a Startup
              </Button>
            </div>
          </div>
        )}
      </div>
      
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultTab={authModalTab}
      />
    </div>
  );
};

export default Home; 