"use client";

import BackDrop from "@/components/page/backdrop";
import Card from "@/components/page/card";
import CustomUrl from "@/app/lib/models/custom_url";
import { fetchAll, insert, remove, test_Server_Shit } from "@/app/lib/db/custom_url";
import Link from "next/link";
import { useState } from "react";

interface CustomURLDashboardProps {
  allCustomURLs: string;
}

const customURLDashboard: React.FC<CustomURLDashboardProps> = ({ allCustomURLs }) => {
  const [newCustomURL, setNewCustomURL] = useState({
    url: '',
    action: 'pg',
    target: '',
    author_id: 1
  });

  allCustomURLs = JSON.parse(allCustomURLs);

  // console.log("all URLs: ", allCustomURLs);

  const handleAddCustomURL = async () => {
    try {
      var newURL = new CustomUrl(newCustomURL);

      console.log('Adding custom URL:', newURL);

      console.log(await test_Server_Shit(JSON.stringify(newURL)));

      console.log(await insert(JSON.stringify(newURL)));
      setNewCustomURL({ url: '', action: 'pg', target: '', author_id: 1});
    } catch (err) {
      console.error('Error occurred during insert:', err);
    }
  };

  const handleDeleteCustomURL = async (customURL: CustomUrl) => {
    try {
      await remove(customURL);
    } catch (err) {
      console.error('Error occurred during delete:', err);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewCustomURL((prevState) => ({ ...prevState, [name]: name === 'author_id' ? Number(value) : value, }));
  };

  return (
    <BackDrop isRow={false}>
      <Card title="Custom URL Dashboard">
        <h1 className="text-2xl text-bold">Sort by letter</h1>
        <p>A. B. C. Ect. and more I dont wanna write rn</p>
        {/* Inputs for adding a new custom URL */}
        <h2 className="text-xl">Add New Custom URL</h2>
        <label>
          URL:
          <input
            type="text"
            name="url"
            value={newCustomURL.url}
            onChange={handleInputChange}
            required
          />
        </label>
        <label>
          Action:
          <select
            name="action"
            value={newCustomURL.action}
            onChange={handleInputChange}
            required
          >
            <option value="pg">Page</option>
            <option value="rd">URL</option>
          </select>
        </label>
        <label>
          Target:
          <input
            type="text"
            name="target"
            value={newCustomURL.target}
            onChange={handleInputChange}
            required
          />
        </label>
        <button onClick={handleAddCustomURL}>Add Custom URL</button>
        {/* Display all custom URLs */}
        {allCustomURLs && Array.isArray(allCustomURLs) && allCustomURLs.map((customURL, index) => (
          <div key={customURL.id}>
            <h2 className="text-xl">
              {customURL.url} - {customURL.action} - {customURL.target}
              <button onClick={() => handleDeleteCustomURL(customURL)}>
                Delete
              </button>
            </h2>
          </div>
          ))}
      </Card>
    </BackDrop>
  );
};

export default customURLDashboard;