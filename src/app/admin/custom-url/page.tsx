"use client";

import BackDrop from "@/components/page/backdrop";
import Card from "@/components/page/card";
import { CustomUrl, fetchAll, insert, update, remove } from "@/app/lib/models/custom_url";
import Link from "next/link";

async function customURLDashboard() {

  const allCustomURLs = await fetchAll();

  const handleAddCustomURL = async (event: Eve) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const url = formData.get('url');
    const action = formData.get('action');
    const target = formData.get('target');

    try {
      const url_json = {
        url: url, 
        action: action, 
        target: target 
      }
      const url_model = new CustomUrl(url_json);

      await insert({ url, action, target });
      // Optionally, you can refresh the custom URLs list after successful insertion
      // window.location.reload();
    } catch (error) {
      console.error('Error adding custom URL:', error);
    }
  };


  return (
    <BackDrop isRow={false}>

      {/* <Card title="Custom URL Dashboard" actions={renderedSearch}> */}
      <Card title="Custom URL Dashboard">
        <h1 className="text-2xl text-bold">Sort by letter</h1>
        <p>A. B. C. Ect. and more I dont wanna write rn</p>

        {allCustomURLs.map((customURL, index) => (
          <div key={customURL.id}>
            <Link href={`/${customURL.url}`}>
              <h2 className="text-xl">
                {customURL.target} from {customURL.url}
              </h2>
            </Link>
          </div>
        ))}
      </Card>

    </BackDrop>
  );
}

export default customURLDashboard;