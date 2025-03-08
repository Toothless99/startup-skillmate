
import { Routes, Route, useNavigate } from "react-router-dom";
import { ThemeProvider } from "./components/ui/theme-provider";
import { Toaster } from "./components/ui/toaster";
import { AuthProvider } from "./context/AuthContext";
import { useEffect } from "react";
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
  const navigate = useNavigate();

  useEffect(() => {
    // Initialize the database when the app loads
    const setupDatabase = async () => {
      try {
        // Initialize the database with mock data
        const success = await initializeDatabase();
        if (success) {
          console.log("Database setup successful");
        } else {
          toast({
            title: "Database Setup Warning",
            description: "There was an issue setting up the mock data. Demo functionality might be limited.",
            variant: "destructive",
          });
        }
      } catch (error) {
        console.error("Database initialization error:", error);
        toast({
          title: "Database Error",
          description: "Failed to initialize the database. Please check your connection to Supabase.",
          variant: "destructive",
        });
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
