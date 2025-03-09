
import { Routes, Route, useNavigate } from "react-router-dom";
import { ThemeProvider } from "./components/ui/theme-provider";
import { Toaster } from "./components/ui/toaster";
import { AuthProvider } from "./context/AuthContext";
import { useEffect, useState } from "react";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Solvers from "./pages/Solvers";
import Startups from "./pages/Startups";
import Problems from "./pages/Problems";
import Profile from "./pages/Profile";
import ProfileView from "./pages/ProfileView";
import NotFound from "./pages/NotFound";
import "react-day-picker/dist/style.css";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { initializeDatabase } from "./lib/dbSetup";
import { useToast } from "./hooks/use-toast";

// Create a client
const queryClient = new QueryClient();

function App() {
  const { toast } = useToast();
  const [dbInitialized, setDbInitialized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize the database when the app loads
    const setupDatabase = async () => {
      try {
        setIsLoading(true);
        // Initialize the database with mock data
        const success = await initializeDatabase();
        
        setDbInitialized(success);
        
        if (success) {
          console.log("Database setup successful");
        } else {
          toast({
            title: "Mock Data Setup Warning",
            description: "Some mock data could not be loaded. Demo functionality might be limited, but the app will still work.",
            variant: "default",
          });
        }
      } catch (error) {
        console.error("Database initialization error:", error);
        setDbInitialized(false);
        toast({
          title: "Database Warning",
          description: "Unable to initialize some mock data. The app will still function, but with limited demo data.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    setupDatabase();
  }, [toast]);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider defaultTheme="light" storageKey="startup-skillmate-theme">
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-1">
              {isLoading ? (
                <div className="flex items-center justify-center h-full py-20">
                  <p className="text-lg text-gray-600">Loading application data...</p>
                </div>
              ) : (
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/solvers" element={<Solvers />} />
                  <Route path="/solvers/:id" element={<ProfileView />} />
                  <Route path="/startups" element={<Startups />} />
                  <Route path="/startups/:id" element={<ProfileView />} />
                  <Route path="/problems" element={<Problems />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              )}
            </main>
            <Footer />
          </div>
          <Toaster />
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
