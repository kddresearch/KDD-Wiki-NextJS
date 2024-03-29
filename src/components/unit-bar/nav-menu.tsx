"use client";

import Category from "@/models/nav-model/category";
import NavItem from "@/models/nav-model/nav_item";
import Link from "next/link";
import HamburgerMenu from "./nav-items/hamburger-menu";
import Dropdown from "./nav-items/dropdown-menu";

const Navigation = () => {

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
      title: "Teaching",
      location: "dropdown-down",
      links: [
        new NavItem({
          id: 1,
          title: "About KDD Courses",
          url: "/course",
        }),
        new NavItem({
          id: 2,
          title: "CIS 732 Machine Learning",
          url: "/course/machine-learning",
        }),
        new NavItem({
          id: 3,
          title: "CIS 798 - Computer Vision",
          url: "/course/computer-vision",
        }),
        new NavItem({
          id: 4,
          title: "CIS 530/730 - Artifical Intelligence",
          url: "/course/artifical-intelligence",
        }),
        new NavItem({
          id: 4,
          title: "CIS 531/731 - Data Science and Analytics",
          url: "/course/data-science-and-analytics",
        }),
        new NavItem({
          id: 4,
          title: "CIS 536/736 - Computer Graphics",
          url: "/courses/computer-graphics",
        }),
        new NavItem({
          id: 4,
          title: "CIS 830 - Advanced Topics in AI",
          url: "/courses/advanced-topics-in-ai",
        }),
      ]
    }
  );
  
  const nav4 = new Category(
    {
      id: 1,
      title: "People",
      location: "dropdown-down",
      links: [
        new NavItem({
          id: 1,
          title: "Our Faculty",
          url: "/about/team",
        }),
        new NavItem({
          id: 2,
          title: "Our Members",
          url: "/member",
        }),
        new NavItem({
          id: 3,
          title: "Our Alumni",
          url: "/alumni",
        }),
        new NavItem({
          id: 4,
          title: "Opportunites - Join us!",
          url: "/opportunites",
        })
      ]
    }
  );

  return( 
    <div className="bg-purple">
      <div className="container flex flex-row py-3">

        <div className="grow md:hidden">

        </div>

        <div className="justify-end">
          {HamburgerMenu([nav1, nav2, nav3, nav4])}
        </div>

        <div id="desktop-nav" className="md:flex flex-row hidden">
          {Dropdown(nav1)}
          <div className="h-6 inline border-l-[1px] pr-5"></div>
          {Dropdown(nav2)}
          <div className="h-6 inline border-l-[1px] pr-5"></div>
          {Dropdown(nav3)}
          <div className="h-6 inline border-l-[1px] pr-5"></div>
          {Dropdown(nav4)}
        </div>

      </div>
    </div>
  );
}

export default Navigation;