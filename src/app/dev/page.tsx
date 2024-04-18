"use client";

import Link from "next/link";
import { Arrow90degRight } from "react-bootstrap-icons";
import Category from "@/models/nav-model/category";
import NavItem from "@/models/nav-model/nav_item";
import Breadcrumb from "@/components/breadcrumb";
import BackDrop from "@/components/page/backdrop";
import Card from "@/components/page/card";
import Editor from "@/components/editors/lexical/editor";
import { useState, useEffect } from 'react';

// Lexical

const fetchData = async () => {
  try {
    const response = await fetch('/api/user/self');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.text();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    return "Error fetching data!";
  }
};

const Dev = () => {

  const [apiData, setApiData] = useState('');

  useEffect(() => {
    const fetchApiData = async () => {
      const data = await fetchData();
      setApiData(data);
    };

    fetchApiData();
  }, []);

  return (
    <div className="h-full flex flex-col">
      <Breadcrumb />

      <BackDrop>
        <Card title="hello testing">
          <Editor />
        </Card>
        <Card title="Testing the api!">
          <p className="prose prose-code">
            <pre>{apiData}</pre>
          </p>
        </Card>
        <Card title="hello testing">woiahdi</Card>
        <Card title="hello testing">dwa id</Card>
        <Card title="hello testing"> dwahidahi</Card>

      </BackDrop>
    </div>
  );
};

export default Dev;
