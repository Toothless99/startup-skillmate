import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SolverList from "@/components/solvers/SolverList";
import AuthGuard from "@/components/auth/AuthGuard";
import { User } from "@/lib/types";

const Solvers = () => {
  const navigate = useNavigate();
  const [featuredSolvers] = useState<User[]>([]);

  const handleViewProfile = (solverId: string) => {
    navigate(`/solvers/${solverId}`);
  };

  return (
    <div className="container mx-auto px-4 md:px-6 max-w-7xl">
      <AuthGuard>
        <div className="py-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold">Solvers</h1>
            <p className="text-muted-foreground mt-2">
              Find talented students to help with your projects
            </p>
          </div>
          
          <SolverList 
            initialSolvers={featuredSolvers}
            onViewProfile={handleViewProfile}
          />
        </div>
      </AuthGuard>
    </div>
  );
};

export default Solvers;
