"use client";

import TextEditor from "@/components/editors/lexical/editor";
import Page from "@/app/lib/models/_page";

function PageEditor({
  inputPage
} : {
  inputPage: object
}) {
  let page = new Page(inputPage);

  return (
    <div>
      <div className="flex flex-row content-center">
        <label className="text-2xl font-bold mr-2 my-auto">Title:</label>
        <input type="text" className="text-4xl text-purple font-bold border-2 border-lightgray rounded-md" defaultValue={page.title} />
      </div>

      <TextEditor markdown={page.content} />

      <button className="bg-purple text-white p-2 rounded-md mt-2">Save</button>
    </div>
  );
}

export default PageEditor;