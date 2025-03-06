
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AuthModal from "@/components/auth/AuthModal";
import { useAuth } from "@/context/AuthContext";
import { AuthButton } from "@/components/auth/AuthGuard";

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/40">
      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 text-center max-w-5xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tighter mb-6">
          Connect with Startups, Solve Real Problems
        </h1>
        <p className="text-xl text-muted-foreground mb-10 max-w-3xl mx-auto">
          ProblemSolver connects talented students with innovative startups to solve real-world problems and gain valuable experience.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-16">
          {isAuthenticated ? (
            <>
              <Button size="lg" onClick={() => navigate("/problems")}>
                Browse Problems
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/startups")}>
                Explore Startups
              </Button>
            </>
          ) : (
            <>
              <Button size="lg" onClick={() => setIsAuthModalOpen(true)}>
                Get Started
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/problems")}>
                Learn More
              </Button>
            </>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-16">
            Why Use ProblemSolver?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* For Students */}
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-4">For Problem Solvers</h3>
              <ul className="space-y-3 mb-6">
                <li>• Gain real-world project experience</li>
                <li>• Build your portfolio with actual startup work</li>
                <li>• Earn compensation for your skills</li>
                <li>• Connect with innovative startups</li>
              </ul>
              <AuthButton
                variant="secondary" 
                className="w-full"
                redirectTo="/problems"
                onClick={() => navigate("/problems")}
              >
                Find Problems to Solve
              </AuthButton>
            </div>

            {/* For Startups */}
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-4">For Startups</h3>
              <ul className="space-y-3 mb-6">
                <li>• Access skilled talent for your challenges</li>
                <li>• Get fresh perspectives on your problems</li>
                <li>• Cost-effective solution for specific needs</li>
                <li>• Connect with the next generation of innovators</li>
              </ul>
              <AuthButton
                variant="secondary"
                className="w-full"
                redirectTo="/solvers"
                onClick={() => navigate("/solvers")}
              >
                Find Talented Solvers
              </AuthButton>
            </div>

            {/* Platform Benefits */}
            <div className="bg-background p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold mb-4">Platform Benefits</h3>
              <ul className="space-y-3 mb-6">
                <li>• Streamlined matching system</li>
                <li>• Verified profiles and reviews</li>
                <li>• Secure communication channels</li>
                <li>• Support throughout the process</li>
              </ul>
              <AuthButton
                variant="secondary"
                className="w-full"
                redirectTo="/startups"
                onClick={() => navigate("/startups")}
              >
                Explore How It Works
              </AuthButton>
            </div>
          </div>
        </div>
      </section>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
    </div>
  );
};

export default Index;
