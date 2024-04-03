import BackDrop from "@/components/page/backdrop";
import Card from "@/components/page/card";
import { fetchAll } from "@/app/lib/models/page";
import Link from "next/link";

async function pageIndex() {
  var allPages = await fetchAll();

  const search = () => {
    return (
      <div className="text-2xl align-middle my-auto block">
        <input
          type="text"
          placeholder="Find Page"
          className="p-1 align-middle border-b-2"
        />
        <button className="ml-2 p-2 text-4xl align-middle">Search</button>
      </div>
    );
  };

  const renderedSearch = search();

  // sort allPages by letter
  allPages.sort((a, b) => {
    if (a.title < b.title) {
      return -1;
    }
    if (a.title > b.title) {
      return 1;
    }
    return 0;
  });

  return (
    <BackDrop isRow={false}>
      <Card title="Page Index" actions={renderedSearch}>
        <h1 className="text-2xl text-bold">Sort by letter</h1>
        <p>A. B. C. Ect. and more I dont wanna write rn</p>

        {allPages.map((page, index) => (
          <div key={page.id}>
            <Link href={`page/${page.name}`}>
              <h2 className="text-xl">{page.title}</h2>
            </Link>
          </div>
        ))}
      </Card>
    </BackDrop>
  );
}

export default pageIndex;
