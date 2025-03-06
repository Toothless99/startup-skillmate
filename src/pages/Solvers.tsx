
import { AuthGuard } from "@/components/auth/AuthGuard";
import SolverList from "@/components/solvers/SolverList";

// Define interface for SolverList props
interface SolverListProps {
  featuredOnly?: boolean;
}

const Solvers = () => {
  return (
    <div className="max-container pt-24 px-4 pb-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-1">Problem Solvers</h1>
        <p className="text-muted-foreground">
          Connect with skilled students and professionals ready to solve your problems
        </p>
      </div>

      <AuthGuard
        fallback={
          <div className="bg-muted/30 p-6 rounded-lg border border-dashed text-center">
            <h3 className="font-medium text-lg mb-2">Featured Solvers</h3>
            <p className="text-muted-foreground mb-6">
              Sign in to see all solvers on the platform
            </p>
            <SolverList featuredOnly={true} />
          </div>
        }
      >
        <SolverList />
      </AuthGuard>
    </div>
  );
};

export default Solvers;
