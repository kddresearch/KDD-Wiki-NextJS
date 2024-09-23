import Link from "next/link";
import Breadcrumb from "@/components/breadcrumb";

import getConfig from "@/config";
const config = await getConfig;

const Dev = () => (
  <div>
    <div>
      <h1>Dev</h1>
      <Link href="/">Go back to home</Link>

      <p>
        config: {config?.Keystore?.Provider !== undefined ? config.Keystore.Provider : "undefined"}
      </p>

      <Breadcrumb />
    </div>
  </div>
);

export default Dev;
