
import { ReactNode, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import AuthModal from "./AuthModal";
import { Button } from "@/components/ui/button";

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
  redirectTo?: string;
}

/**
 * AuthGuard - Protects content that requires authentication
 * 
 * @param children - The protected content to show if authenticated
 * @param fallback - Optional custom fallback to show if not authenticated
 * @param redirectTo - Optional path to redirect to after successful authentication
 */
export const AuthGuard = ({ children, fallback, redirectTo }: AuthGuardProps) => {
  const { isAuthenticated } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  if (isAuthenticated) {
    return <>{children}</>;
  }

  // If a custom fallback is provided, use it
  if (fallback) {
    return <>{fallback}</>;
  }

  // Default fallback with sign in prompt
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
        redirectTo={redirectTo}
      />
    </div>
  );
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

  const handleClick = (e: React.MouseEvent) => {
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
