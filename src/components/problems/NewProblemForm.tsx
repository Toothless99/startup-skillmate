
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { CalendarIcon, Plus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { Problem } from "@/lib/types";
import { useAuth } from "@/context/AuthContext";
import { createProblem } from "@/lib/supabase";

interface NewProblemFormProps {
  onClose: () => void;
  onSuccess?: (newProblem: Problem) => void;
}

const NewProblemForm = ({ onClose, onSuccess }: NewProblemFormProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    experienceLevel: "beginner" as "beginner" | "intermediate" | "advanced",
    compensation: "",
    additionalInfo: "",
    deadline: null as Date | null,
  });
  const [skillInput, setSkillInput] = useState("");
  const [requiredSkills, setRequiredSkills] = useState<string[]>([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleExperienceLevelChange = (value: "beginner" | "intermediate" | "advanced") => {
    setFormData((prev) => ({ ...prev, experienceLevel: value }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setFormData((prev) => ({ ...prev, deadline: date || null }));
  };

  const addSkill = () => {
    if (skillInput.trim() && !requiredSkills.includes(skillInput.trim())) {
      setRequiredSkills([...requiredSkills, skillInput.trim()]);
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setRequiredSkills(requiredSkills.filter((s) => s !== skill));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || requiredSkills.length === 0) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields and add at least one required skill.",
        variant: "destructive",
      });
      return;
    }
    
    if (!user || user.role !== "startup") {
      toast({
        title: "Permission denied",
        description: "Only startups can post problems.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Create a new problem object with correct typing
      const newProblemData: Partial<Problem> = {
        title: formData.title,
        description: formData.description,
        startup_id: user.id,
        required_skills: requiredSkills,
        experience_level: formData.experienceLevel,
        compensation: formData.compensation || null,
        deadline: formData.deadline || null,
        status: "open" as "open" | "draft" | "in_progress" | "completed" | "cancelled",
        featured: false,
        additional_info: formData.additionalInfo || null,
        created_at: new Date(),
        updated_at: new Date()
      };
      
      // Save to Supabase
      const createdProblem = await createProblem(newProblemData);
      
      if (createdProblem) {
        // Call the success callback with the new problem
        onSuccess?.(createdProblem);
        
        // Close the form
        onClose();
        
        toast({
          title: "Problem posted!",
          description: "Your problem has been published and is now visible to solvers.",
        });
      } else {
        throw new Error("Failed to create problem");
      }
    } catch (error) {
      console.error("Error posting problem:", error);
      toast({
        title: "Failed to post problem",
        description: "Failed to post problem. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Problem Title <span className="text-red-500">*</span></Label>
        <Input
          id="title"
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="E.g., Develop a Mobile App UI/UX"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Problem Description <span className="text-red-500">*</span></Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Describe the problem in detail, including context and expected outcomes..."
          rows={5}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label>Required Skills <span className="text-red-500">*</span></Label>
        <div className="flex space-x-2">
          <Input
            value={skillInput}
            onChange={(e) => setSkillInput(e.target.value)}
            placeholder="E.g., React, Python, UI/UX"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addSkill();
              }
            }}
          />
          <Button type="button" size="icon" onClick={addSkill}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-2">
          {requiredSkills.map((skill) => (
            <Badge key={skill} variant="secondary" className="flex items-center gap-1">
              {skill}
              <X
                className="h-3 w-3 cursor-pointer hover:text-destructive"
                onClick={() => removeSkill(skill)}
              />
            </Badge>
          ))}
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="experienceLevel">Experience Level <span className="text-red-500">*</span></Label>
        <Select
          value={formData.experienceLevel}
          onValueChange={handleExperienceLevelChange}
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
      
      <div className="space-y-2">
        <Label htmlFor="compensation">Compensation</Label>
        <Input
          id="compensation"
          name="compensation"
          value={formData.compensation}
          onChange={handleChange}
          placeholder="E.g., $20-30/hour, $1000-2000 for the project"
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="additionalInfo">Additional Information</Label>
        <Textarea
          id="additionalInfo"
          name="additionalInfo"
          value={formData.additionalInfo}
          onChange={handleChange}
          placeholder="Any other details that might be helpful for solvers..."
          rows={3}
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="deadline">Deadline</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "w-full justify-start text-left font-normal",
                !formData.deadline && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.deadline ? format(formData.deadline, "PPP") : "Select a date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={formData.deadline || undefined}
              onSelect={handleDateChange}
              initialFocus
              disabled={(date) => date < new Date()}
            />
          </PopoverContent>
        </Popover>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Posting..." : "Post Problem"}
        </Button>
      </div>
    </form>
  );
};

export default NewProblemForm;
