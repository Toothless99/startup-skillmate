import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ApplicationsList from "@/components/applications/ApplicationsList";

const ApplicationsTab = () => {
  return (
    <Tabs defaultValue="all" className="w-full">
      <TabsList className="mb-4">
        <TabsTrigger value="all">All Applications</TabsTrigger>
        <TabsTrigger value="pending">Pending</TabsTrigger>
        <TabsTrigger value="accepted">Accepted</TabsTrigger>
        <TabsTrigger value="rejected">Rejected</TabsTrigger>
      </TabsList>
      
      <TabsContent value="all">
        <ApplicationsList />
      </TabsContent>
      
      <TabsContent value="pending">
        <ApplicationsList status="pending" />
      </TabsContent>
      
      <TabsContent value="accepted">
        <ApplicationsList status="accepted" />
      </TabsContent>
      
      <TabsContent value="rejected">
        <ApplicationsList status="rejected" />
      </TabsContent>
    </Tabs>
  );
};

export default ApplicationsTab; 