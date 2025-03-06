import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { MultiSelect } from "@/components/ui/multi-select";
import { useAuth } from "@/context/AuthContext";

interface StudentSignupFormProps {
  email: string;
  password: string;
  name: string;
  onBack: () => void;
  onSuccess: () => void;
}

const StudentSignupForm = ({ email, password, name, onBack, onSuccess }: StudentSignupFormProps) => {
  const { signup } = useAuth();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Student profile fields
  const [university, setUniversity] = useState("");
  const [major, setMajor] = useState("");
  const [graduationYear, setGraduationYear] = useState("");
  const [experienceLevel, setExperienceLevel] = useState<"beginner" | "intermediate" | "advanced">("beginner");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [bio, setBio] = useState("");
  const [location, setLocation] = useState("");
  const [githubUrl, setGithubUrl] = useState("");
  const [linkedinUrl, setLinkedinUrl] = useState("");
  const [portfolioUrl, setPortfolioUrl] = useState("");
  
  const skillOptions = [
    { label: "React", value: "React" },
    { label: "JavaScript", value: "JavaScript" },
    { label: "TypeScript", value: "TypeScript" },
    { label: "Python", value: "Python" },
    { label: "Java", value: "Java" },
    { label: "Node.js", value: "Node.js" },
    { label: "UI/UX Design", value: "UI/UX Design" },
    { label: "Product Management", value: "Product Management" },
    { label: "Data Science", value: "Data Science" },
    { label: "Machine Learning", value: "Machine Learning" },
    { label: "Mobile Development", value: "Mobile Development" },
    { label: "DevOps", value: "DevOps" },
    { label: "Cloud Computing", value: "Cloud Computing" },
  ];
  
  const interestOptions = [
    { label: "SaaS", value: "SaaS" },
    { label: "E-commerce", value: "E-commerce" },
    { label: "Fintech", value: "Fintech" },
    { label: "EdTech", value: "EdTech" },
    { label: "HealthTech", value: "HealthTech" },
    { label: "AI", value: "AI" },
    { label: "Blockchain", value: "Blockchain" },
    { label: "Sustainability", value: "Sustainability" },
    { label: "Social Impact", value: "Social Impact" },
    { label: "Gaming", value: "Gaming" },
  ];
  
  const graduationYearOptions = Array.from({ length: 10 }, (_, i) => {
    const year = new Date().getFullYear() + i;
    return { label: year.toString(), value: year.toString() };
  });
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!university || !major || !graduationYear || !experienceLevel || selectedSkills.length === 0) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields and select at least one skill.",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Create the user profile data
      const userData = {
        name,
        role: "student" as const,
        university,
        major,
        graduationYear,
        experienceLevel,
        skills: selectedSkills,
        bio: bio || undefined,
        location: location || undefined,
        languages: selectedLanguages,
        areasOfInterest: selectedInterests,
        githubUrl: githubUrl || undefined,
        linkedinUrl: linkedinUrl || undefined,
        portfolioUrl: portfolioUrl || undefined,
      };
      
      // Call the signup method from AuthContext
      const result = await signup(email, password, userData);
      
      if (result.success) {
        toast({
          title: "Account created!",
          description: "Your student account has been successfully created.",
        });
        onSuccess();
      } else {
        toast({
          title: "Error creating account",
          description: result.error || "There was a problem creating your account.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Student Profile</h2>
        <p className="text-sm text-muted-foreground">
          Tell us about your academic background and skills.
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="university">University <span className="text-red-500">*</span></Label>
            <Input
              id="university"
              placeholder="e.g. Stanford University"
              value={university}
              onChange={(e) => setUniversity(e.target.value)}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="major">Major <span className="text-red-500">*</span></Label>
            <Input
              id="major"
              placeholder="e.g. Computer Science"
              value={major}
              onChange={(e) => setMajor(e.target.value)}
              required
            />
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="graduationYear">Graduation Year <span className="text-red-500">*</span></Label>
            <Select value={graduationYear} onValueChange={setGraduationYear} required>
              <SelectTrigger>
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent>
                {graduationYearOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="experienceLevel">Experience Level <span className="text-red-500">*</span></Label>
            <Select value={experienceLevel} onValueChange={(value: "beginner" | "intermediate" | "advanced") => setExperienceLevel(value)} required>
              <SelectTrigger>
                <SelectValue placeholder="Select level" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="beginner">Beginner</SelectItem>
                <SelectItem value="intermediate">Intermediate</SelectItem>
                <SelectItem value="advanced">Advanced</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="skills">Skills <span className="text-red-500">*</span></Label>
          <MultiSelect
            options={skillOptions}
            selected={selectedSkills}
            onChange={setSelectedSkills}
            placeholder="Select skills"
          />
          <p className="text-xs text-muted-foreground">
            Select the skills you have experience with.
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="interests">Areas of Interest</Label>
          <MultiSelect
            options={interestOptions}
            selected={selectedInterests}
            onChange={setSelectedInterests}
            placeholder="Select interests"
          />
          <p className="text-xs text-muted-foreground">
            Select the areas you're interested in working on.
          </p>
        </div>
      </div>
      
      <div className="flex justify-between pt-4">
        <Button type="button" variant="outline" onClick={onBack}>
          Back
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Creating Account..." : "Create Account"}
        </Button>
      </div>
    </form>
  );
};

export default StudentSignupForm; 