import Breadcrumb from "@/components/breadcrumb";
import StripeBackDrop from "@/components/layout/backdrop";
import Card from "@/components/layout/card";
import TextEditor from "@/components/editors/lexical/editor";

const Dev = () => {

  return (
    <div className="h-full flex flex-col">
      <Breadcrumb />

      <StripeBackDrop>
        <Card title="hello testing">
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
