import Breadcrumb from "@/components/breadcrumb";
import StripeBackDrop from "@/components/layout/backdrop";
import Card from "@/components/layout/card";
import TextEditor from "@/components/editors/lexical/editor";
import {
  Alert,
  AlertDescription,
  AlertTitle
} from "@/components/ui/alert"
import { InfoIcon, Terminal } from "lucide-react";

const Dev = () => {

  return (
    <div className="h-full flex flex-col">
      <Breadcrumb />

      <StripeBackDrop>
        <Card title="hello testing">
          <Alert variant={"destructive"}>
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Known Issues:</AlertTitle>
            <AlertDescription>
              This is a develpment page. Please do not use it for production.
            </AlertDescription>
          </Alert>
          <TextEditor/>
        </Card>
        <Card title="Testing the api!">
          NO API CALL HERE NO MORE.
          <p className="prose prose-code">
            grrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrrr
          </p>
        </Card>
        <Card title="hello testing">THIS IS THE NEW VERSION pushed from the azure registry</Card>
        <Card title="hello testing">dwa id</Card>
        <Card title="hello testing"> dwahidahi</Card>

      </StripeBackDrop>
    </div>
  );
};

export default Dev;
