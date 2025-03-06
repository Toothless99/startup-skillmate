import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { User } from "@/lib/types";
import { Plus, X, Globe, Linkedin, Users, MapPin, Building2, Briefcase } from "lucide-react";
import { MultiSelect, Option } from "@/components/ui/multi-select";

// Industry sector options
const industrySectorOptions: Option[] = [
  { label: "Software Development", value: "software_development" },
  { label: "Artificial Intelligence", value: "ai" },
  { label: "Machine Learning", value: "machine_learning" },
  { label: "Fintech", value: "fintech" },
  { label: "Healthtech", value: "healthtech" },
  { label: "Edtech", value: "edtech" },
  { label: "E-commerce", value: "ecommerce" },
  { label: "Blockchain", value: "blockchain" },
  { label: "Cybersecurity", value: "cybersecurity" },
  { label: "Clean Energy", value: "clean_energy" },
  { label: "Biotech", value: "biotech" },
  { label: "Robotics", value: "robotics" },
  { label: "IoT (Internet of Things)", value: "iot" },
  { label: "AR/VR", value: "ar_vr" },
  { label: "SaaS", value: "saas" },
  { label: "Mobile Apps", value: "mobile_apps" },
  { label: "Gaming", value: "gaming" },
  { label: "Social Media", value: "social_media" },
  { label: "Marketplace", value: "marketplace" },
  { label: "Transportation", value: "transportation" },
  { label: "Food & Beverage", value: "food_beverage" },
  { label: "Real Estate", value: "real_estate" },
  { label: "Travel & Hospitality", value: "travel_hospitality" },
  { label: "Media & Entertainment", value: "media_entertainment" },
  { label: "Agriculture", value: "agriculture" },
  { label: "Manufacturing", value: "manufacturing" },
  { label: "Retail", value: "retail" },
  { label: "Logistics", value: "logistics" },
  { label: "Legal Tech", value: "legal_tech" },
  { label: "HR Tech", value: "hr_tech" }
];

interface StartupProfileFormProps {
  user: User;
  onSubmit: (data: Partial<User>) => Promise<void>;
}

const StartupProfileForm = ({ user, onSubmit }: StartupProfileFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [sectorInput, setSectorInput] = useState("");
  const [sectors, setSectors] = useState<string[]>(user.sectors || []);
  const [cofounderInput, setCofounderInput] = useState("");
  const [cofounderNames, setCofounderNames] = useState<string[]>(user.founderNames || []);
  
  const [formData, setFormData] = useState({
    name: user.name || "",
    companyName: user.companyName || "",
    companyDescription: user.companyDescription || "",
    websiteUrl: user.websiteUrl || "",
    linkedinUrl: user.linkedinUrl || "",
    location: user.location || "",
    stage: user.stage || "idea",
    hiringStatus: user.hiringStatus || "not_hiring" as "hiring" | "not_hiring" | "future_hiring",
    industrySectors: user.industrySectors || []
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addSector = () => {
    if (sectorInput.trim() && !sectors.includes(sectorInput.trim())) {
      setSectors([...sectors, sectorInput.trim()]);
      setSectorInput("");
    }
  };

  const removeSector = (sector: string) => {
    setSectors(sectors.filter(s => s !== sector));
  };
  
  const addCofounder = () => {
    if (cofounderInput.trim() && !cofounderNames.includes(cofounderInput.trim())) {
      setCofounderNames([...cofounderNames, cofounderInput.trim()]);
      setCofounderInput("");
    }
  };

  const removeCofounder = (cofounder: string) => {
    setCofounderNames(cofounderNames.filter(c => c !== cofounder));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.companyName || sectors.length === 0) {
      return;
    }
    
    try {
      setIsLoading(true);
      
      await onSubmit({
        name: formData.name,
        companyName: formData.companyName,
        companyDescription: formData.companyDescription,
        websiteUrl: formData.websiteUrl,
        linkedinUrl: formData.linkedinUrl,
        location: formData.location,
        founderNames: cofounderNames,
        sectors,
        stage: formData.stage,
        hiringStatus: formData.hiringStatus,
        industrySectors: formData.industrySectors
      });
    } finally {
      setIsLoading(false);
    }
  };

  const stageOptions = [
    { value: "idea", label: "Idea Stage" },
    { value: "mvp", label: "MVP" },
    { value: "pre_seed", label: "Pre-Seed" },
    { value: "seed", label: "Seed" },
    { value: "series_a", label: "Series A" },
    { value: "series_b_plus", label: "Series B+" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
          <CardDescription>Update your startup's profile information</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Your Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="companyName" className="flex items-center">
              <Building2 className="mr-1 h-4 w-4" /> Company Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="companyName"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Your startup's name"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="companyDescription">Company Description <span className="text-red-500">*</span></Label>
            <Textarea
              id="companyDescription"
              name="companyDescription"
              value={formData.companyDescription}
              onChange={handleChange}
              placeholder="Tell us about your startup and its mission..."
              rows={4}
              required
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="websiteUrl" className="flex items-center">
                <Globe className="mr-1 h-4 w-4" /> Website URL
              </Label>
              <Input
                id="websiteUrl"
                name="websiteUrl"
                value={formData.websiteUrl}
                onChange={handleChange}
                placeholder="https://yourstartup.com"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="linkedinUrl" className="flex items-center">
                <Linkedin className="mr-1 h-4 w-4" /> LinkedIn URL
              </Label>
              <Input
                id="linkedinUrl"
                name="linkedinUrl"
                value={formData.linkedinUrl}
                onChange={handleChange}
                placeholder="https://linkedin.com/company/yourstartup"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location" className="flex items-center">
              <MapPin className="mr-1 h-4 w-4" /> Location
            </Label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="City, Country"
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Company Details</CardTitle>
          <CardDescription>Tell us more about your startup</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label className="flex items-center">
              <Users className="mr-1 h-4 w-4" /> Co-Founders
            </Label>
            <div className="flex space-x-2">
              <Input
                value={cofounderInput}
                onChange={(e) => setCofounderInput(e.target.value)}
                placeholder="Co-founder name"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addCofounder();
                  }
                }}
              />
              <Button type="button" size="sm" onClick={addCofounder}>
                Add
              </Button>
            </div>
            <div className="flex flex-wrap gap-2 mt-2">
              {cofounderNames.map((cofounder) => (
                <Badge 
                  key={cofounder} 
                  variant="secondary" 
                  className="flex items-center"
                >
                  {cofounder}
                  <X 
                    className="ml-1 h-3 w-3 cursor-pointer hover:text-destructive" 
                    onClick={() => removeCofounder(cofounder)}
                  />
                </Badge>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label>Industry Sectors <span className="text-red-500">*</span></Label>
            <div className="flex items-center">
              <Briefcase className="mr-2 h-4 w-4 text-muted-foreground" />
              <MultiSelect
                options={industrySectorOptions}
                selected={formData.industrySectors}
                onChange={(selected) => handleSelectChange("industrySectors", selected)}
                placeholder="Select industry sectors"
              />
            </div>
            {sectors.length === 0 && (
              <p className="text-xs text-muted-foreground">Please add at least one sector</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="stage">Company Stage <span className="text-red-500">*</span></Label>
              <Select 
                value={formData.stage} 
                onValueChange={(value) => handleSelectChange("stage", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select stage" />
                </SelectTrigger>
                <SelectContent>
                  {stageOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="hiringStatus">Hiring Status</Label>
              <Select 
                value={formData.hiringStatus} 
                onValueChange={(value: "hiring" | "not_hiring" | "future_hiring") => 
                  handleSelectChange("hiringStatus", value)
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select hiring status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hiring">Currently Hiring</SelectItem>
                  <SelectItem value="future_hiring">Hiring Soon</SelectItem>
                  <SelectItem value="not_hiring">Not Hiring</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Button type="submit" className="w-full" disabled={isLoading || sectors.length === 0}>
        {isLoading ? "Saving changes..." : "Save Changes"}
      </Button>
    </form>
  );
};

export default StartupProfileForm;
