"use client"

import Link from "next/link";
import { Arrow90degRight } from "react-bootstrap-icons";
import Category from "@/models/nav-model/category";
import NavItem from "@/models/nav-model/nav_item";
import Breadcrumb from "@/components/breadcrumb";
import BackDrop from "@/components/page/backdrop";
import Card from "@/components/page/card";

const nav1 = new Category(
  {
    id: 1,
    title: "Publications",
    location: "dropdown-down",
    links: [
      new NavItem({
        id: 1,
        title: "KDD Lab Publications",
        url: "/publications",
      }),
      new NavItem({
        id: 2,
        title: "Conference Papers",
        url: "/conference/papers",
      }),
      new NavItem({
        id: 3,
        title: "Journal Papers",
        url: "/journal/papers",
      }),
      new NavItem({
        id: 4,
        title: "Book Chapters",
        url: "/book",
      }),
      new NavItem({
        id: 4,
        title: "Poster Papers, Abstracts, and Surveys",
        url: "/poster-abstract-survey",
      })
    ]
  }
);

const nav2 = new Category(
  {
    id: 1,
    title: "Research",
    location: "dropdown-down",
    links: [
      new NavItem({
        id: 1,
        title: "KDD Lab Research",
        url: "/research",
      }),
      new NavItem({
        id: 2,
        title: "Computer Vision",
        url: "/research/computer-vision",
      }),
      new NavItem({
        id: 3,
        title: "Natural Language",
        url: "/research/natural-language",
      }),
      new NavItem({
        id: 4,
        title: "Reinforcement Learning",
        url: "/research/reinforcement-learning",
      }),
      new NavItem({
        id: 5,
        title: "AI & Cybersecurity",
        url: "/research/ai-cybersecurity",
      }),
      new NavItem({
        id: 6,
        title: "Other AI & ML Topics",
        url: "/research/other-ai-ml-topics",
      })
    ]
  }
);

const nav3 = new Category(
  {
    id: 1,
    title: "About",
    location: "dropdown-down",
    links: [
      new NavItem({
        id: 1,
        title: "About our team",
        url: "/about/team",
      }),
      new NavItem({
        id: 2,
        title: "About our lab",
        url: "/about/lab",
      }),
      new NavItem({
        id: 3,
        title: "About our research",
        url: "/about/research",
      }),
      new NavItem({
        id: 4,
        title: "Publications",
        url: "/publications",
      })
    ]
  }
);

const nav4 = new Category(
  {
    id: 1,
    title: "About",
    location: "dropdown-down",
    links: [
      new NavItem({
        id: 1,
        title: "About our team",
        url: "/about/team",
      }),
      new NavItem({
        id: 2,
        title: "About our lab",
        url: "/about/lab",
      }),
      new NavItem({
        id: 3,
        title: "About our research",
        url: "/about/research",
      }),
      new NavItem({
        id: 4,
        title: "Publications",
        url: "/publications",
      })
    ]
  }
);

const Dev = () => (
  <div className="h-full flex flex-col">
    <h1>Dev</h1>
    <Link href="/">Go back to home</Link>
    <Breadcrumb/>
    <BackDrop>
      <Card title="hello testing"></Card>
      <Card title="hello testing">woiahdi</Card>
      <Card title="hello testing">dwa id</Card>
      <Card title="hello testing"> dwahidahi</Card>
    </BackDrop>
  </div>
);

export default Dev;