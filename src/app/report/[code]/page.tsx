"use client";

import Breadcrumb from '@/components/breadcrumb';
import Link from 'next/link'
import { useSearchParams } from "next/navigation";
import { useState } from 'react';

export default function Report404({ params }: { params: { code: string } }) {
  const page = useSearchParams()?.get("page");

  const code_ = params.code;

  return (
    <div className='bg-white min-h-full grow text-black bg-stripe flex items-center justify-center'>
      <div className='container p-5 bg-white z-10 text-lg my-8'>
        <div className='flex flex-row'>
          <h1 className='text-purple text-4xl md:text-6xl font-bold grow'>Report Page Missing</h1>
        </div>
        <p className='my-4 inline-block'>
          Would you like to report missing page at 
          <span className='capitalize inline-block bg-gray p-1 mx-1 rounded-md max-w-48 md:max-w-xs lg:max-w-sm xl:max-w-3xl overflow-hidden truncate align-middle'>
            {page}
          </span>?
        </p>
        <h2>
          What did you expect to be here?
        </h2>
        <p>
          <textarea className='w-full min-h-24 max-h-40 h-32 border-solid border-2 border-gray' placeholder='Describe what you expected to see here'></textarea>
        </p>
        <button className='bg-gray p-1 rounded-md'>Submit</button>
      </div>
    </div>
  )
}