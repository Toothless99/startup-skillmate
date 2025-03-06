import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { Plus, X, Edit, Save, Trash2 } from "lucide-react";
import ProfileCard from "@/components/profile/ProfileCard";
import AuthModal from "@/components/auth/AuthModal";
import ApplicationsList from "@/components/applications/ApplicationsList";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import StudentProfileForm from "@/components/profile/StudentProfileForm";
import StartupProfileForm from "@/components/profile/StartupProfileForm";
import { useToast } from "@/hooks/use-toast";
import ApplicationsTab from "@/components/profile/ApplicationsTab";
import StudentApplicationsTab from "@/components/profile/StudentApplicationsTab";

const interestOptions = [
  "SaaS", "E-commerce", "Fintech", "EdTech", "HealthTech", "AI",
  "DevTools", "Mobile Apps", "Web Development", "Hardware", "Blockchain",
  "Sustainability", "Social Impact", "Gaming", "Marketing", "Open to all"
];

const skillOptions = [
  // Tech skills
  "React", "JavaScript", "TypeScript", "Python", "Java", "C++", "Swift", "Kotlin",
  "Node.js", "Django", "Laravel", "AWS", "Azure", "Google Cloud", "Docker", "Kubernetes",
  "MongoDB", "PostgreSQL", "MySQL", "Firebase", "GraphQL", "REST API", "Microservices",
  "DevOps", "CI/CD", "Test Automation", "Mobile Development", "Web Development",
  "Blockchain", "Smart Contracts", "Machine Learning", "Data Science", "Big Data",
  
  // Design skills
  "UI/UX Design", "Graphic Design", "Figma", "Adobe XD", "Photoshop", "Illustrator",
  "Prototyping", "User Research", "Wireframing", "Motion Design",
  
  // Business skills
  "Marketing", "SEO", "Content Writing", "Social Media", "Business Development",
  "Product Management", "Project Management", "Market Research", "Customer Service",
  "Sales", "Business Analysis", "Financial Modeling", "Accounting", "Legal",
  
  // Soft skills
  "Leadership", "Communication", "Problem Solving", "Critical Thinking", "Teamwork",
  "Time Management", "Adaptability", "Creativity", "Presentation Skills"
];

const Profile = () => {
  const { user, isAuthenticated, isLoading, updateUserProfile } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  
  // State for skill editing
  const [skillInput, setSkillInput] = useState("");
  const [skills, setSkills] = useState<string[]>(user?.skills || []);
  
  // State for language editing
  const [languageInput, setLanguageInput] = useState("");
  const [languages, setLanguages] = useState<string[]>(user?.languages || []);
  
  // State for bio editing
  const [bio, setBio] = useState(user?.bio || "");
  
  // State for experience level
  const [experienceLevel, setExperienceLevel] = useState<"beginner" | "intermediate" | "advanced" | undefined>(
    user?.experienceLevel
  );
  
  // State for areas of interest
  const [interestInput, setInterestInput] = useState("");
  const [areasOfInterest, setAreasOfInterest] = useState<string[]>(user?.areasOfInterest || []);
  
  // State for startup specific fields
  const [startupData, setStartupData] = useState({
    companyName: user?.companyName || "",
    companyDescription: user?.companyDescription || "",
    websiteUrl: user?.websiteUrl || "",
    linkedinUrl: user?.linkedinUrl || "",
    founderNames: user?.founderNames?.join(", ") || "",
    stage: user?.stage || ""
  });
  
  const [sectors, setSectors] = useState<string[]>(user?.sectors || []);
  const [sectorInput, setSectorInput] = useState("");
  
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, isLoading, navigate]);
  
  if (isLoading || !user) {
    return (
      <div className="max-container pt-24 px-4 pb-16">
        <div className="flex justify-center items-center min-h-[50vh]">
          <p>Loading profile...</p>
        </div>
      </div>
    );
  }
  
  // Handlers for skills
  const addSkill = () => {
    if (skillInput.trim() && !skills.includes(skillInput.trim())) {
      setSkills([...skills, skillInput.trim()]);
      setSkillInput("");
    }
  };
  
  const removeSkill = (skill: string) => {
    setSkills(skills.filter((s) => s !== skill));
  };
  
  // Handlers for languages
  const addLanguage = () => {
    if (languageInput.trim() && !languages.includes(languageInput.trim())) {
      setLanguages([...languages, languageInput.trim()]);
      setLanguageInput("");
    }
  };
  
  const removeLanguage = (language: string) => {
    setLanguages(languages.filter((l) => l !== language));
  };
  
  // Handlers for areas of interest
  const addInterest = () => {
    if (interestInput.trim() && !areasOfInterest.includes(interestInput.trim())) {
      setAreasOfInterest([...areasOfInterest, interestInput.trim()]);
      setInterestInput("");
    }
  };
  
  const removeInterest = (interest: string) => {
    setAreasOfInterest(areasOfInterest.filter((i) => i !== interest));
  };
  
  // Handlers for sectors
  const addSector = () => {
    if (sectorInput.trim() && !sectors.includes(sectorInput.trim())) {
      setSectors([...sectors, sectorInput.trim()]);
      setSectorInput("");
    }
  };
  
  const removeSector = (sector: string) => {
    setSectors(sectors.filter((s) => s !== sector));
  };
  
  const handleStartupDataChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setStartupData({ ...startupData, [name]: value });
  };
  
  const handleProfileUpdate = async (userData: Partial<typeof user>) => {
    try {
      await updateUserProfile(userData);
      toast({
        title: "Profile updated",
        description: "Your profile has been successfully updated.",
      });
      setActiveTab("overview");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    }
  };
  
  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen px-4">
        <div className="max-w-md w-full text-center space-y-6">
          <h1 className="text-2xl font-bold">You need to sign in first</h1>
          <p className="text-muted-foreground">
            Please sign in or create an account to view and edit your profile.
          </p>
          <Button onClick={() => setIsAuthModalOpen(true)}>
            Sign In
          </Button>
          <AuthModal
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
          />
        </div>
      </div>
    );
  }
  
  return (
    <div className="max-container pt-24 px-4 pb-16">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
          <Button onClick={() => navigate("/problems")}>Browse Problems</Button>
        </div>
        
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full max-w-md" style={{ gridTemplateColumns: user?.role === 'startup' ? '1fr 1fr 1fr' : '1fr 1fr 1fr' }}>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="edit">Edit Profile</TabsTrigger>
            {user?.role === 'student' && (
              <TabsTrigger value="applications">My Applications</TabsTrigger>
            )}
            {user?.role === 'startup' && (
              <TabsTrigger value="applications">Applications</TabsTrigger>
            )}
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            {user && <ProfileCard user={user} />}
          </TabsContent>
          
          <TabsContent value="edit" className="space-y-6">
            {user.role === 'startup' ? (
              <StartupProfileForm user={user} onSubmit={handleProfileUpdate} />
            ) : (
              <StudentProfileForm user={user} onSubmit={handleProfileUpdate} />
            )}
          </TabsContent>
          
          {user?.role === 'student' && (
            <TabsContent value="applications" className="space-y-6">
              <StudentApplicationsTab />
            </TabsContent>
          )}
          
          {user?.role === 'startup' && (
            <TabsContent value="applications" className="space-y-6">
              <ApplicationsTab />
            </TabsContent>
          )}
        </Tabs>
      </div>
    </div>
  );
};

export default Profile;
