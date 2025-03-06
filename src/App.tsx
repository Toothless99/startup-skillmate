import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./components/ui/theme-provider";
import { Toaster } from "./components/ui/toaster";
import { AuthProvider } from "./context/AuthContext";
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

// Create a client
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
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
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
