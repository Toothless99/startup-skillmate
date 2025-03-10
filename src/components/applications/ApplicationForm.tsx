
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Problem } from "@/lib/types";
import { createApplication } from "@/lib/supabase";

interface ApplicationFormProps {
  problem: Problem;
  onClose: () => void;
  onSuccess?: () => void;
}

const ApplicationForm = ({ problem, onClose, onSuccess }: ApplicationFormProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [coverLetter, setCoverLetter] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to apply",
        variant: "destructive",
      });
      return;
    }
    
    if (!coverLetter.trim()) {
      toast({
        title: "Cover letter required",
        description: "Please write a brief cover letter explaining why you're a good fit for this problem.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      setIsSubmitting(true);
      
      // Create application object
      const applicationData = {
        problem_id: problem.id,
        user_id: user.id,
        cover_letter: coverLetter,
        status: 'pending' as const
      };
      
      // Submit the application to the database
      const result = await createApplication(applicationData);
      
      if (result) {
        toast({
          title: "Application submitted!",
          description: "Your application has been sent to the startup.",
        });
        
        if (onSuccess) {
          onSuccess();
        }
        onClose();
      } else {
        throw new Error("Failed to submit application");
      }
    } catch (error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Application failed",
        description: "There was an error submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-2">Applying to: {problem.title}</h3>
        <p className="text-sm text-muted-foreground mb-4">
          Startup: {problem.startup?.name || problem.startup_id}
        </p>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="coverLetter" className="block text-sm font-medium">
          Cover Letter <span className="text-red-500">*</span>
        </label>
        <Textarea
          id="coverLetter"
          value={coverLetter}
          onChange={(e) => setCoverLetter(e.target.value)}
          placeholder="Explain why you're interested in this problem and how your skills make you a good fit..."
          rows={6}
          required
        />
        <p className="text-xs text-muted-foreground">
          The startup will see your profile information along with this cover letter.
        </p>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit Application"}
        </Button>
      </div>
    </form>
  );
};

export default ApplicationForm;
