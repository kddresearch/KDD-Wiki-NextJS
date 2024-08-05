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
          <TextEditor />
        </Card>
        <Card title="Testing the markdown">
          <Alert variant={"primary"}>
            <InfoIcon className="h-4 w-4" />
            <AlertTitle>Markdown Support is in Development</AlertTitle>
            <AlertDescription>
              Please be aware that markdown support is still in development and may not work as expected.
            </AlertDescription>
          </Alert>
          <TextEditor usePrePopulated={true} />
        </Card>
        <Card title="hello testing">THIS IS THE NEW VERSION pushed from the azure registry</Card>
        <Card title="hello testing">dwa id</Card>
        <Card title="hello testing"> dwahidahi</Card>

      </StripeBackDrop>
    </div>
  );
};

export default Dev;
