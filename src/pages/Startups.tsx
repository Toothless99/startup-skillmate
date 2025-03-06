
import { AuthGuard } from "@/components/auth/AuthGuard";
import StartupList from "@/components/startups/StartupList";

const Startups = () => {
  return (
    <div className="max-container pt-24 px-4 pb-16">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-1">Startups</h1>
        <p className="text-muted-foreground">
          Discover innovative startups looking for talented problem solvers
        </p>
      </div>

      <AuthGuard
        fallback={
          <div className="bg-muted/30 p-6 rounded-lg border border-dashed text-center">
            <h3 className="font-medium text-lg mb-2">Featured Startups</h3>
            <p className="text-muted-foreground mb-6">
              Sign in to see all startups on the platform
            </p>
            <StartupList featuredOnly={true} />
          </div>
        }
      >
        <StartupList featuredOnly={false} />
      </AuthGuard>
    </div>
  );
};

export default Startups;
