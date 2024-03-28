import { SrvRecord } from "dns";
import Link from "next/link";
import { Announcement, fetchById } from "@/app/lib/models/announcement";
import sanitizeHtml from 'sanitize-html';


const AnnouncementPage = async ({ params  }: { params : { id: string } }) => {

  // if id is not a number, return 404
  if (isNaN(parseInt(params.id))) {
    return {
      status: 404,
      message: "Invalid announcement id",
    };
  }

  const announcement = await fetchById(parseInt(params.id));

  const sanitizedContent = sanitizeHtml(announcement.content, {
    allowedTags: ['div', 'h1', 'a', 'img'],
    allowedAttributes: {
      'a': ['href'],
      'img': ['src', 'alt', 'style'],
      'div': ['style']
    },
    allowedStyles: {
      'img': {
        'max-height': [/^\d+px$/]
      },
      'div': {
        'display': [/^flex$/],
        'justify-content': [/^space-between$/],
        'align-items': [/^center$/],
        'flex': [/^\d+$/],
        'margin-right': [/^\d+px$/]
      }
    }
  });

  return (
    <div className='bg-white min-h-full grow text-black bg-stripe flex items-center justify-center'>
      <div className='container p-5 bg-white z-10 text-lg my-8'>
        <div className='flex flex-row'>
          <h1 className='text-purple text-4xl md:text-6xl font-bold grow'>{announcement.title}</h1>
        </div>
        <h3 className="text-purple my-4">{announcement.date_created.toLocaleDateString()}</h3>
        {/* <div className="mx-4 border-solid border-b-2 pb-2 border-purple" /> */}
        <div dangerouslySetInnerHTML={{ __html: sanitizedContent }} className="my-4" />
      </div>
      
    </div>
  );
};

export default AnnouncementPage;