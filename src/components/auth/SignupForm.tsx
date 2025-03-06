
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAuth } from "@/context/AuthContext";
import StartupSignupForm from "./StartupSignupForm";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";
import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SignupFormProps {
  onSuccess?: () => void;
}

// Create a schema for form validation
const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  role: z.enum(["student", "startup"])
});

const SignupForm = ({ onSuccess }: SignupFormProps) => {
  const { signup } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    role: "student" as "student" | "startup"
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [step, setStep] = useState(1);
  const [generalError, setGeneralError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
    // Clear general error as well
    setGeneralError("");
  };

  const handleRoleChange = (value: "student" | "startup") => {
    setFormData(prev => ({ ...prev, role: value }));
    setGeneralError("");
  };

  const validateForm = () => {
    try {
      signupSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach(err => {
          if (err.path) {
            newErrors[err.path[0].toString()] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setGeneralError("");
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setIsLoading(true);
      
      if (formData.role === "startup") {
        // For startups, we'll move to the next step
        setStep(2);
        setIsLoading(false);
        return;
      }
      
      // For students, complete signup immediately
      console.log('Submitting student signup:', formData.email, formData.password, formData.name, formData.role);
      await signup(formData.email, formData.password, formData.name, formData.role);
      
      toast({
        title: "Account created!",
        description: "Your account has been created successfully.",
      });
      
      onSuccess?.();
    } catch (error) {
      console.error("Signup form error:", error);
      
      // Show error in the form
      if (error instanceof Error) {
        setGeneralError(error.message);
      } else {
        setGeneralError("An unexpected error occurred. Please try again later.");
      }
      
    } finally {
      setIsLoading(false);
    }
  };

  if (step === 2) {
    return (
      <StartupSignupForm
        email={formData.email}
        password={formData.password}
        name={formData.name}
        onSuccess={onSuccess}
      />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 py-2">
      {generalError && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{generalError}</AlertDescription>
        </Alert>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
        <Input
          id="name"
          name="name"
          placeholder="John Doe"
          value={formData.name}
          onChange={handleChange}
          required
          className={errors.name ? "border-destructive" : ""}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="you@example.com"
          value={formData.email}
          onChange={handleChange}
          required
          className={errors.email ? "border-destructive" : ""}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email}</p>
        )}
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
        <Input
          id="password"
          name="password"
          type="password"
          placeholder="••••••••"
          value={formData.password}
          onChange={handleChange}
          required
          className={errors.password ? "border-destructive" : ""}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password}</p>
        )}
        <p className="text-xs text-muted-foreground">
          Password must be at least 6 characters.
        </p>
      </div>
      
      <div className="space-y-2">
        <Label>I am a: <span className="text-red-500">*</span></Label>
        <RadioGroup 
          value={formData.role} 
          onValueChange={handleRoleChange}
          className="flex space-x-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="student" id="student" />
            <Label htmlFor="student" className="cursor-pointer">Student</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="startup" id="startup" />
            <Label htmlFor="startup" className="cursor-pointer">Startup</Label>
          </div>
        </RadioGroup>
      </div>
      
      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? "Creating account..." : formData.role === "startup" ? "Next" : "Create Account"}
      </Button>
    </form>
  );
};

export default SignupForm;
