import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/components/ui/theme-provider";
import { Menu, Sun, Moon, X, User, PanelLeft } from "lucide-react";
import AuthModal from "@/components/auth/AuthModal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User as UserIcon, Settings, Plus } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger
} from "@/components/ui/sheet";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import NewProblemForm from "@/components/problems/NewProblemForm";

const Navbar = () => {
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, setTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isNewProblemDialogOpen, setIsNewProblemDialogOpen] = useState(false);
  const [authModalTab, setAuthModalTab] = useState<"login" | "signup">("login");
  
  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const closeMenu = () => setIsMenuOpen(false);
  
  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Problems", path: "/problems" },
    ...(isAuthenticated ? [{ name: "Profile", path: "/profile" }] : []),
    ...(user?.role === "admin" ? [{ name: "Admin", path: "/admin" }] : []),
    ...(isAuthenticated && user?.role === "startup" ? [{ name: "Post Problem", path: "/problems/new" }] : [])
  ];
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };
  
  const isStartup = user?.role === "startup";
  
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(part => part[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };
  
  const handleOpenLogin = () => {
    setAuthModalTab("login");
    setIsAuthModalOpen(true);
  };
  
  const handleOpenSignup = () => {
    setAuthModalTab("signup");
    setIsAuthModalOpen(true);
  };
  
  const handleLogout = async () => {
    await logout();
  };
  
  const handlePostProblemClick = () => {
    if (isAuthenticated) {
      setIsNewProblemDialogOpen(true);
    } else {
      setIsAuthModalOpen(true);
    }
  };
  
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <Link to="/" className="flex items-center font-semibold mr-4">
          <span className="hidden sm:inline-block">SkillMate</span>
        </Link>
        
        <div className="flex items-center space-x-1 md:space-x-2">
          <Link to="/">
            <Button variant={location.pathname === "/" ? "default" : "ghost"} size="sm">
              Home
            </Button>
          </Link>
          <Link to="/problems">
            <Button variant={location.pathname === "/problems" ? "default" : "ghost"} size="sm">
              Problems
            </Button>
          </Link>
          <Link to="/solvers">
            <Button variant={location.pathname === "/solvers" ? "default" : "ghost"} size="sm">
              Solvers
            </Button>
          </Link>
          <Link to="/startups">
            <Button variant={location.pathname === "/startups" ? "default" : "ghost"} size="sm">
              Startups
            </Button>
          </Link>
        </div>
        
        <div className="flex-1"></div>
        
        <div className="hidden md:flex items-center space-x-2">
          {isAuthenticated ? (
            <>
              {user?.role === "startup" && (
                <Button 
                  variant="default" 
                  size="sm" 
                  className="flex items-center"
                  onClick={handlePostProblemClick}
                >
                  <Plus className="mr-1 h-4 w-4" />
                  Post Problem
                </Button>
              )}
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatarUrl} alt={user?.name} />
                      <AvatarFallback>{user?.name ? getInitials(user.name) : "U"}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link to="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout}>
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button variant="default" size="sm" onClick={() => setIsAuthModalOpen(true)}>
              Sign In
            </Button>
          )}
        </div>
        
        <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="md:hidden">
              {isMenuOpen ? <X /> : <Menu />}
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="flex flex-col space-y-4 mt-4">
              <Link to="/" onClick={closeMenu}>
                <Button variant="ghost" className="w-full justify-start">Home</Button>
              </Link>
              <Link to="/problems" onClick={closeMenu}>
                <Button variant="ghost" className="w-full justify-start">Problems</Button>
              </Link>
              <Link to="/solvers" onClick={closeMenu}>
                <Button variant="ghost" className="w-full justify-start">Solvers</Button>
              </Link>
              <Link to="/startups" onClick={closeMenu}>
                <Button variant="ghost" className="w-full justify-start">Startups</Button>
              </Link>
              
              {isAuthenticated ? (
                <>
                  <Link to="/profile" onClick={closeMenu}>
                    <Button variant="ghost" className="w-full justify-start">Profile</Button>
                  </Link>
                  
                  {user?.role === "startup" && (
                    <Button 
                      variant="default" 
                      className="w-full justify-start"
                      onClick={() => {
                        closeMenu();
                        handlePostProblemClick();
                      }}
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Post Problem
                    </Button>
                  )}
                  
                  <Button 
                    variant="ghost" 
                    className="w-full justify-start text-destructive"
                    onClick={() => {
                      logout();
                      closeMenu();
                    }}
                  >
                    Log out
                  </Button>
                </>
              ) : (
                <Button 
                  variant="default" 
                  className="w-full"
                  onClick={() => {
                    setIsAuthModalOpen(true);
                    closeMenu();
                  }}
                >
                  Sign In
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
      
      {/* Auth Modal */}
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
      />
      
      {/* New Problem Dialog */}
      <Dialog open={isNewProblemDialogOpen} onOpenChange={setIsNewProblemDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogTitle>Post a New Problem</DialogTitle>
          <NewProblemForm 
            onClose={() => setIsNewProblemDialogOpen(false)}
            onSuccess={(newProblem) => {
              console.log("New problem created:", newProblem);
              // You could add the new problem to a context or redirect to the problem page
            }}
          />
        </DialogContent>
      </Dialog>
    </header>
  );
};

export default Navbar;
