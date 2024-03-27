import Link from "next/link";
import Breadcrumb from "@/components/breadcrumb";

const Dev = () => (
    <div>
      <div>
        <h1>Dev</h1>
        <Link href="/">Go back to home</Link>
        <Breadcrumb/>
      </div>
    </div>
  );

export default Dev;