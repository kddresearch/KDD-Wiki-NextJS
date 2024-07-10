"use client";

import { useState, useEffect } from "react";
import Category from "@/models/nav-model/category";
import NavItem from "@/models/nav-model/nav_item";
import HamburgerMenu from "./nav-items/hamburger-menu";
import Dropdown from "./nav-items/dropdown-menu";

const Navigation = () => {
  const [navItems, setNavItems] = useState<Category[]>([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('/api/menu/top-level');
      if (!response.ok) {
        console.error('Failed to fetch top-level directories');
        return;
      }
      const directories = await response.json();
      const categories = directories.map((directory: { id: any; title: any; children?: any[]; }) => new Category({
        id: directory.id,
        title: directory.title,
        location: "dropdown-down",
        links: (directory.children || []).filter(child => child.page_type === 'page').map((child: { id: any; title: any; }) => {
          return new NavItem({
            id: child.id,
            title: child.title,
            url: `/rpage/${child.id}`
          });
        }),
        categories: (directory.children || []).filter(child => child.page_type === 'pointer').map((child: { id: any; title: any; children?: any[]; }) => {
          return new Category({
            id: child.id,
            title: child.title,
            location: "dropdown-down",
            links: (child.children || []).filter(subChild => subChild.page_type === 'page').map((subChild: { id: any; title: any; }) => {
              return new NavItem({
                id: subChild.id,
                title: subChild.title,
                url: `/rpage/${subChild.id}`
              });
            }),
            categories: (child.children || []).filter(subChild => subChild.page_type === 'pointer')
          });
        })
      }));
      setNavItems(categories);
    }

    fetchData();
  }, []);

  return (
    <div className="bg-purple">
      <div className="container flex flex-row py-3">
        <div className="grow md:hidden"></div>

        <div className="justify-end">
          {HamburgerMenu(navItems)}
        </div>

        <div id="desktop-nav" className="md:flex flex-row hidden">
          {navItems.map((navItem, index) => (
            <div key={navItem.id} className="flex items-center">
              <Dropdown category={navItem} />
              {index < navItems.length - 1 && (
                <div className="h-6 inline border-l-[1px] border-white pr-5"></div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};


export default Navigation;
