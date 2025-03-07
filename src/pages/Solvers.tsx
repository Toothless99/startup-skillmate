
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SolverList from "@/components/solvers/SolverList";
import AuthGuard from "@/components/auth/AuthGuard";
import { User } from "@/lib/types";
import { getStudents } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";

const Solvers = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [solvers, setSolvers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSolvers = async () => {
      try {
        setLoading(true);
        const students = await getStudents();
        setSolvers(students);
      } catch (error) {
        console.error("Error fetching solvers:", error);
        toast({
          title: "Error",
          description: "Failed to load solvers. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSolvers();
  }, [toast]);

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
            initialSolvers={solvers}
            onViewProfile={handleViewProfile}
          />
        </div>
      </AuthGuard>
    </div>
  );
};

export default Solvers;
