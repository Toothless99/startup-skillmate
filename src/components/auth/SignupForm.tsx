
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StudentSignupForm from "./StudentSignupForm";
import StartupSignupForm from "./StartupSignupForm";

interface SignupFormProps {
  onSuccess: () => void;
  onLoginClick: () => void;
}

const SignupForm = ({ onSuccess, onLoginClick }: SignupFormProps) => {
  const { toast } = useToast();
  const [step, setStep] = useState<"initial" | "profile">("initial");
  const [role, setRole] = useState<"student" | "startup">("student");
  
  // Initial form fields
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  
  const handleInitialSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword || !name) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }
    
    // Move to profile step
    setStep("profile");
  };
  
  return (
    <div className="space-y-4">
      {step === "initial" ? (
        <form onSubmit={handleInitialSubmit} className="space-y-4">
          <div className="space-y-2">
            <h2 className="text-xl font-semibold">Create an Account</h2>
            <p className="text-sm text-muted-foreground">
              Enter your information to create an account
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name <span className="text-red-500">*</span></Label>
              <Input
                id="name"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password">Password <span className="text-red-500">*</span></Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm Password <span className="text-red-500">*</span></Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>I am a: <span className="text-red-500">*</span></Label>
              <Tabs defaultValue="student" onValueChange={(value) => setRole(value as "student" | "startup")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="student">Student</TabsTrigger>
                  <TabsTrigger value="startup">Startup</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
          
          <div className="flex flex-col space-y-2 pt-4">
            <Button type="submit">Continue</Button>
            <Button type="button" variant="link" onClick={onLoginClick}>
              Already have an account? Log in
            </Button>
          </div>
        </form>
      ) : (
        role === "student" ? (
          <StudentSignupForm
            email={email}
            password={password}
            name={name}
            onBack={() => setStep("initial")}
            onSuccess={onSuccess}
          />
        ) : (
          <StartupSignupForm
            email={email}
            password={password}
            name={name}
            onBack={() => setStep("initial")}
            onSuccess={onSuccess}
          />
        )
      )}
    </div>
  );
};

export default SignupForm;
