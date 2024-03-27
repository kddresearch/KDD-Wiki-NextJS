// import Link from 'next/link'
// import { use } from 'react';
// import { GET } from './route';
 
// export default function Report404({ page }: { page: string }) {

//   return (
//     <div className='bg-white min-h-full grow text-black bg-stripe flex items-center justify-center'>
//       <div className='container p-5 bg-white z-10 my-auto text-lg'>
//         <div className='flex flex-row'>
//           <h1 className='text-purple text-4xl md:text-6xl font-bold grow'>Report Page</h1>
//         </div>
//         <p className='my-4 inline-block'>
//           Would you like to report missing page at <span className='text-purple'>{page}</span>?
//         </p>
//         <p className='my-4'>
//         </p>
//         <Link className='bg-gray p-1 rounded-md' href="/">Return Home</Link>
//       </div>
//     </div>
//   )
// }

export default function Report404({ code, params }: { code: { code: string }, params: { [key: string]: string | string[] | undefined } }) {
  const page = code;

  return (
    <div>{JSON.stringify(params)}</div>
  )
}