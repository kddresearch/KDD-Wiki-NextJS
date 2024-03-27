"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import Category from '@/models/nav-model/category';

const HamburgerMenu = (categories: Category[]) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  }

  return (
    <div className='md:hidden text-black'>
      <button onClick={toggleMenu} className='text-white'>
        menu
      </button>
      <div className={`${isMenuOpen? 'block' : 'hidden'} md:hidden bg-white w-full absolute left-0 mt-2 p-4 rounded shadow-lg`}>
        <ul>
          {categories.map((category) => (
            <li key={category.id} className='mb-2'>
              <span className='font-bold'>{category.title}</span>
              <ul>
                {category.links.map((link) => (
                  <li key={link.id} className='ml-4'>
                    <Link href={link.url}>{link.title}</Link>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default HamburgerMenu;