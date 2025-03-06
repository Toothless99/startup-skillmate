import { ReactNode, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import AuthModal from "./AuthModal";

interface AuthGuardProps {
  children: ReactNode;
  requiredRole?: "student" | "startup" | "admin";
  fallback?: ReactNode;
}

/**
 * AuthGuard - Protects content that requires authentication
 * 
 * @param children - The protected content to show if authenticated
 * @param requiredRole - Optional role required to access the content
 * @param fallback - Optional fallback content to show if not authenticated
 */
export const AuthGuard = ({ children, requiredRole, fallback }: AuthGuardProps) => {
  const { user, isAuthenticated } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  if (!isAuthenticated) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    return (
      <div className="bg-muted/20 rounded-lg border border-dashed p-8 text-center">
        <h3 className="text-lg font-medium mb-2">Sign in required</h3>
        <p className="text-muted-foreground mb-4">
          You need to sign in to access this content
        </p>
        <Button onClick={() => setIsAuthModalOpen(true)}>
          Sign In
        </Button>
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)}
        />
      </div>
    );
  }

  if (requiredRole && user?.role !== requiredRole) {
    return (
      <div className="bg-muted/20 rounded-lg border border-dashed p-8 text-center">
        <h3 className="text-lg font-medium mb-2">Access restricted</h3>
        <p className="text-muted-foreground mb-4">
          You need to be a {requiredRole} to access this content
        </p>
      </div>
    );
  }

  return <>{children}</>;
};

/**
 * WithAuth - HOC that protects components that require authentication
 */
export function withAuth<P extends object>(
  Component: React.ComponentType<P>,
  redirectTo?: string
): React.FC<P> {
  return (props: P) => {
    const { isAuthenticated } = useAuth();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    if (isAuthenticated) {
      return <Component {...props} />;
    }

    return (
      <>
        <div className="bg-muted/20 rounded-lg border border-dashed p-8 text-center">
          <h3 className="text-lg font-medium mb-2">Sign in required</h3>
          <p className="text-muted-foreground mb-4">
            You need to sign in to access this content
          </p>
          <Button onClick={() => setIsAuthModalOpen(true)}>
            Sign In
          </Button>
        </div>
        <AuthModal 
          isOpen={isAuthModalOpen} 
          onClose={() => setIsAuthModalOpen(false)}
          redirectTo={redirectTo}
        />
      </>
    );
  };
}

/**
 * AuthButton - A button that requires authentication to perform its action
 */
export const AuthButton = ({ 
  children, 
  onClick, 
  redirectTo,
  ...props 
}: React.ComponentProps<typeof Button> & { redirectTo?: string }) => {
  const { isAuthenticated } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (isAuthenticated) {
      onClick?.(e);
    } else {
      e.preventDefault();
      setIsAuthModalOpen(true);
    }
  };

  return (
    <>
      <Button {...props} onClick={handleClick}>
        {children}
      </Button>
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)}
        redirectTo={redirectTo}
      />
    </>
  );
};
export default AuthGuard;