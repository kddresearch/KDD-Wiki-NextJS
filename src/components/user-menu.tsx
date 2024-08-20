"use client";

import * as React from 'react';
import WikiUser from '@/models/wikiuser';

export default function AccountMenu({
  user
} : {
  user: any
}) {
  try {
    user = new WikiUser(user);
  } catch (error) {
    user = WikiUser.guestFactory();
  }

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {

  };

  return (
    <button onClick={handleClick} className='text-xs h-4'>Welcome <span className='font-semibold'>{user.username}</span></button>
  );
}
