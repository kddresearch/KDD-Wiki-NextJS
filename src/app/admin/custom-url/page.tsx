"use server";
import { fetchAll } from "@/app/lib/db/custom_url";
import CustomUrl from "@/app/lib/models/custom_url";
import CustomURLDashboard from "@/app/admin/custom-url/custom_url_dashboard";

export default async function Page() {
  const allCustomURLs = await fetchAll();

  return <CustomURLDashboard allCustomURLs={JSON.stringify(allCustomURLs)} />;
}
