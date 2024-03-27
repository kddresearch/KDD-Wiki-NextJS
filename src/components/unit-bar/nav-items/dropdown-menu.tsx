import React, { useState } from 'react';
import Link from 'next/link';
import Category from '@/models/nav-model/category';

const Dropdown = (category: Category) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  if (category.location === "dropdown-left" && category.categories && category.categories.length > 0) {
    throw new Error("Dropdown-left categories cannot have subcategories");
  }

  const buttonid = `dropDownButton_${category.title}`;
  const dropdownid = `dropDown_${category.title}`;

    // Handle mouse entering the button or dropdown
    const handleMouseEnter = () => {
      setIsDropdownOpen(true);
    };
  
    // Handle mouse leaving the button or dropdown
    const handleMouseLeave = () => {
      setIsDropdownOpen(false);
    };

  return (
    <div className='relative h-6' onMouseLeave={handleMouseLeave}>
      <button onClick={toggleDropdown} onMouseOver={handleMouseEnter} onMouseLeave={toggleDropdown} id={buttonid} className="mx-auto text-white bg-purple hover:underline underline-offset-3 decoration-3 font-bold text-lg pr-5 text-center inline-flex items-center" type='button'>{category.title}</button>

      <div id={dropdownid} onMouseOver={handleMouseEnter} className={`${isDropdownOpen ? 'block' : 'hidden'} bg-white w-fit absolute transform -translate-x-1 z-20`} aria-labelledby={buttonid}>
        <ul className="py-2 text-lg font-bold text-black">
          {category.links.map(link => (
            <li key={link.id} className='w-fit block'>
              <Link href={link.url} className='block px-4 py-1 hover:underline underline-offset-4 decoration-3 hover:text-purple whitespace-nowrap'>{link.title}</Link>
            </li>
          ))}
          {/* {category.categories && category.categories.map(subCategory => (
            <li key={subCategory.id} className="relative">
              <Dropdown category={subCategory} />
            </li>
          ))} */}
        </ul>
      </div>
    </div>
  );

  function toggleDropdown() {
    setIsDropdownOpen(!isDropdownOpen);
  }
}

export default Dropdown;
