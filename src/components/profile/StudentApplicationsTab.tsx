import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import StudentApplicationsList from "@/components/applications/StudentApplicationsList";

const StudentApplicationsTab = () => {
  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="all">All Applications</TabsTrigger>
        <TabsTrigger value="pending">Pending</TabsTrigger>
        <TabsTrigger value="accepted">Accepted</TabsTrigger>
        <TabsTrigger value="rejected">Rejected</TabsTrigger>
      </TabsList>
      
      <TabsContent value="all">
        <StudentApplicationsList />
      </TabsContent>
      
      <TabsContent value="pending">
        <StudentApplicationsList status="pending" />
      </TabsContent>
      
      <TabsContent value="accepted">
        <StudentApplicationsList status="accepted" />
      </TabsContent>
      
      <TabsContent value="rejected">
        <StudentApplicationsList status="rejected" />
      </TabsContent>
    </Tabs>
  );
};

export default StudentApplicationsTab; 