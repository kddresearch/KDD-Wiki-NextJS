import Link from "next/link"
import { notFound } from 'next/navigation'

export default function Page({ params }: { params: { slug: string } }) {

  if (params.slug != "publications") {
    notFound()
  }

  return (
    <div>
      <h1>Page</h1>
      <Link href="/">Go back to home</Link>
      <div>Slug: {params.slug}</div>
    </div>
  )
}