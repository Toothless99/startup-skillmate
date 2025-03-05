import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@/lib/types";
import { Globe, Linkedin, GraduationCap, Calendar, Languages, Briefcase } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { MultiSelect, Option } from "@/components/ui/multi-select";

// Common skill options
const skillOptions: Option[] = [
  { label: "JavaScript", value: "javascript" },
  { label: "TypeScript", value: "typescript" },
  { label: "React", value: "react" },
  { label: "Node.js", value: "nodejs" },
  { label: "Python", value: "python" },
  { label: "Java", value: "java" },
  { label: "C++", value: "cpp" },
  { label: "C#", value: "csharp" },
  { label: "Ruby", value: "ruby" },
  { label: "PHP", value: "php" },
  { label: "Swift", value: "swift" },
  { label: "Kotlin", value: "kotlin" },
  { label: "Go", value: "go" },
  { label: "Rust", value: "rust" },
  { label: "HTML", value: "html" },
  { label: "CSS", value: "css" },
  { label: "SQL", value: "sql" },
  { label: "MongoDB", value: "mongodb" },
  { label: "GraphQL", value: "graphql" },
  { label: "Docker", value: "docker" },
  { label: "AWS", value: "aws" },
  { label: "Azure", value: "azure" },
  { label: "GCP", value: "gcp" },
  { label: "UI/UX Design", value: "uiux" },
  { label: "Figma", value: "figma" },
  { label: "Product Management", value: "product_management" },
  { label: "Data Science", value: "data_science" },
  { label: "Machine Learning", value: "machine_learning" },
  { label: "AI", value: "ai" },
  { label: "DevOps", value: "devops" },
];

// Language options
const languageOptions: Option[] = [
  { label: "English", value: "english" },
  { label: "Spanish", value: "spanish" },
  { label: "French", value: "french" },
  { label: "German", value: "german" },
  { label: "Chinese", value: "chinese" },
  { label: "Japanese", value: "japanese" },
  { label: "Korean", value: "korean" },
  { label: "Russian", value: "russian" },
  { label: "Portuguese", value: "portuguese" },
  { label: "Italian", value: "italian" },
  { label: "Dutch", value: "dutch" },
  { label: "Arabic", value: "arabic" },
  { label: "Hindi", value: "hindi" },
  { label: "Bengali", value: "bengali" },
  { label: "Turkish", value: "turkish" },
];

// Areas of interest options
const interestOptions: Option[] = [
  { label: "Web Development", value: "web_development" },
  { label: "Mobile Development", value: "mobile_development" },
  { label: "Data Science", value: "data_science" },
  { label: "Machine Learning", value: "machine_learning" },
  { label: "Artificial Intelligence", value: "ai" },
  { label: "Blockchain", value: "blockchain" },
  { label: "Cybersecurity", value: "cybersecurity" },
  { label: "Cloud Computing", value: "cloud_computing" },
  { label: "DevOps", value: "devops" },
  { label: "UI/UX Design", value: "uiux" },
  { label: "Product Management", value: "product_management" },
  { label: "Digital Marketing", value: "digital_marketing" },
  { label: "E-commerce", value: "ecommerce" },
  { label: "FinTech", value: "fintech" },
  { label: "HealthTech", value: "healthtech" },
  { label: "EdTech", value: "edtech" },
  { label: "GreenTech", value: "greentech" },
  { label: "Gaming", value: "gaming" },
  { label: "AR/VR", value: "arvr" },
  { label: "IoT", value: "iot" },
];

interface StudentProfileFormProps {
  user: User;
  onSubmit: (data: Partial<User>) => Promise<void>;
}

const StudentProfileForm = ({ user, onSubmit }: StudentProfileFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [skills, setSkills] = useState<string[]>(user.skills || []);
  const [languages, setLanguages] = useState<string[]>(user.languages || []);
  const [areasOfInterest, setAreasOfInterest] = useState<string[]>(user.areasOfInterest || []);
  
  const [formData, setFormData] = useState({
    name: user.name || "",
    bio: user.bio || "",
    websiteUrl: user.websiteUrl || "",
    linkedinUrl: user.linkedinUrl || "",
    university: user.university || "",
    major: user.major || "",
    graduationYear: user.graduationYear || "",
    experienceLevel: user.experienceLevel || "beginner" as "beginner" | "intermediate" | "advanced",
    availability: {
      status: user.availability?.status || "available" as "available" | "limited" | "unavailable",
      hours: user.availability?.hours || 10
    }
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvailabilityChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [field]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || skills.length === 0) {
      return;
    }
    
    try {
      setIsLoading(true);
      
      await onSubmit({
        ...formData,
        skills,
        languages,
        areasOfInterest
      });
    } catch (error) {
      console.error("Failed to update profile:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
          <CardDescription>Update your personal details and contact information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="bio">Bio</Label>
            <Textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell us a bit about yourself..."
              rows={4}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="websiteUrl" className="flex items-center">
                <Globe className="mr-1 h-4 w-4" /> Website
              </Label>
              <Input
                id="websiteUrl"
                name="websiteUrl"
                value={formData.websiteUrl}
                onChange={handleChange}
                placeholder="https://yourwebsite.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="linkedinUrl" className="flex items-center">
                <Linkedin className="mr-1 h-4 w-4" /> LinkedIn
              </Label>
              <Input
                id="linkedinUrl"
                name="linkedinUrl"
                value={formData.linkedinUrl}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/yourusername"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Education & Experience</CardTitle>
          <CardDescription>Share your educational background and experience level</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="university" className="flex items-center">
                <GraduationCap className="mr-1 h-4 w-4" /> University
              </Label>
              <Input
                id="university"
                name="university"
                value={formData.university}
                onChange={handleChange}
                placeholder="Your university or school"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="major">Major / Field of Study</Label>
              <Input
                id="major"
                name="major"
                value={formData.major}
                onChange={handleChange}
                placeholder="e.g. Computer Science"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="graduationYear" className="flex items-center">
                <Calendar className="mr-1 h-4 w-4" /> Graduation Year
              </Label>
              <Input
                id="graduationYear"
                name="graduationYear"
                value={formData.graduationYear}
                onChange={handleChange}
                placeholder="e.g. 2024"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="experienceLevel" className="flex items-center">
                <Briefcase className="mr-1 h-4 w-4" /> Experience Level
              </Label>
              <Select 
                value={formData.experienceLevel} 
                onValueChange={(value: "beginner" | "intermediate" | "advanced") => 
                  handleSelectChange("experienceLevel", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select experience level" />
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
            <Label className="flex items-center">
              Skills <span className="text-red-500">*</span>
            </Label>
            <MultiSelect
              options={skillOptions}
              selected={skills}
              onChange={setSkills}
              placeholder="Select skills"
              emptyMessage="No skills found."
            />
            {skills.length === 0 && (
              <p className="text-xs text-muted-foreground">Please add at least one skill</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label>Areas of Interest</Label>
            <MultiSelect
              options={interestOptions}
              selected={areasOfInterest}
              onChange={setAreasOfInterest}
              placeholder="Select areas of interest"
              emptyMessage="No areas found."
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Languages & Availability</CardTitle>
          <CardDescription>Let startups know when and how you can work</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="flex items-center">
              <Languages className="mr-1 h-4 w-4" /> Languages
            </Label>
            <MultiSelect
              options={languageOptions}
              selected={languages}
              onChange={setLanguages}
              placeholder="Select languages"
              emptyMessage="No languages found."
            />
          </div>
          
          <div className="space-y-4">
            <Label>Availability</Label>
            <div className="space-y-2">
              <Select 
                value={formData.availability.status} 
                onValueChange={(value: "available" | "limited" | "unavailable") => 
                  handleAvailabilityChange("status", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select availability status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="available">Available for Work</SelectItem>
                  <SelectItem value="limited">Limited Availability</SelectItem>
                  <SelectItem value="unavailable">Not Available</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {formData.availability.status !== "unavailable" && (
              <div className="space-y-2">
                <div className="flex justify-between">
                  <Label>Hours per week: {formData.availability.hours}</Label>
                </div>
                <Slider
                  value={[formData.availability.hours]}
                  min={1}
                  max={40}
                  step={1}
                  onValueChange={(value) => handleAvailabilityChange("hours", value[0])}
                />
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      <Button type="submit" className="w-full" disabled={isLoading || skills.length === 0}>
        {isLoading ? "Saving changes..." : "Save Changes"}
      </Button>
    </form>
  );
};

export default StudentProfileForm; 