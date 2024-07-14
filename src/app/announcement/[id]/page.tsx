import { SrvRecord } from "dns";
import Link from "next/link";
import { Announcement, fetchById } from "@/models/announcement";
import sanitizeHtml from "sanitize-html";
import StripeBackDrop from "@/components/layout/backdrop";
import Card from "@/components/layout/card";
import { notFound } from "next/navigation";

const AnnouncementPage = async ({ params }: { params: { id: string } }) => {
  // if id is not a number, return 404
  if (isNaN(parseInt(params.id))) {
    return notFound();
  }

  const announcement = await fetchById(parseInt(params.id));

  const sanitizedContent = sanitizeHtml(announcement.content, {
    allowedTags: ["div", "h1", "a", "img"],
    allowedAttributes: {
      a: ["href"],
      img: ["src", "alt", "style"],
      div: ["style"],
    },
    allowedStyles: {
      img: {
        "max-height": [/^\d+px$/],
      },
      div: {
        display: [/^flex$/],
        "justify-content": [/^space-between$/],
        "align-items": [/^center$/],
        flex: [/^\d+$/],
        "margin-right": [/^\d+px$/],
      },
    },
  });

  return (
    <StripeBackDrop>
      <Card title={announcement.title} subTitle={announcement.date_created.toLocaleDateString()}>
        <div
          dangerouslySetInnerHTML={{ __html: sanitizedContent }}
          className="my-4"
        />
      </Card>
    </StripeBackDrop>
  );
};

export default AnnouncementPage;
