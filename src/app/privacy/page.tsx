import Card from "@/components/layout/card";
import { RenderMarkdownString } from "@/components/markdown/markdown";
import StripeBackDrop from "@/components/layout/backdrop";

const privacyMD = `
## Microsoft Clarity

  We partner with Microsoft Clarity and Microsoft Advertising to capture 
  how you use and interact with our website through behavioral metrics, 
  heatmaps, and session replay to improve and market our products/services. 
  Website usage data is captured using first and third-party cookies and 
  other tracking technologies to determine the popularity of 
  products/services and online activity. Additionally, we use this 
  information for site optimization, fraud/security purposes, and 
  advertising. For more information about how Microsoft collects and uses 
  your data, visit the Microsoft Privacy Statement.

`

const Privacy = () => {
  return (
    <StripeBackDrop>
      <Card title="Privacy Policy">
        <RenderMarkdownString markdown={privacyMD} className="prose-lg py-2"  />
      </Card>
    </StripeBackDrop>
  );
};

export default Privacy;