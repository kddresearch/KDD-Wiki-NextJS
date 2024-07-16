"use client";
import TextEditor from "@/components/editors/lexical/editor";
import Page from "@/models/_page";
import { useState } from 'react';
import { useMutation, useQueryClient } from 'react-query';
import QueryProvider from "@/components/providers/query_provider";

function PageEditor({ inputPage }: { inputPage: object }) {
  let page = (new Page(inputPage)).toJSON();
  const [title, setTitle] = useState(page.title);
  const [content, setContent] = useState(page.content);

  async function submitPageCall(page: Page) {
    const response = await fetch(`/api/page/${page.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(page)
    });

    if (!response.ok) {
      throw new Error('Failed to submit page');
    }

    return response.json();
  }

  const queryClient = useQueryClient();
  const { mutate, isLoading, isError, error } = useMutation(
    (page: Page) => submitPageCall(page),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('pages');
      },
    }
  );

  function submitPage() {
    const updatedPage = {
      ...page,
      title,
      content,
    };

    let validatedPage;
    try {
      validatedPage = new Page(updatedPage);
    } catch (error: any) {
      let errorMessage = `${error.message}`;
      alert(errorMessage);
      return;
    }

    mutate(validatedPage, {
      onError: (error) => {
        let errorMessage;
        if (error instanceof Error) {
          errorMessage = `${error.message}`;
        } else {
          errorMessage = 'An unexpected error occurred';
        }
        alert(errorMessage);
      },
    });
  }

  return (
    <>
      <div className="flex flex-row content-center">
        <label className="text-2xl font-bold mr-2 my-auto">Title:</label>
        <input
          type="text"
          className="text-4xl text-purple font-bold border-2 border-lightgray rounded-md"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>
      {/* TODO: Fix editor on this page lol */}
      {/* <TextEditor
        markdown={content}
        onContentChange={(newContent: string) => setContent(newContent)}
      /> */}
      <button
        className="bg-purple text-white p-2 rounded-md mt-2"
        onClick={submitPage}
        disabled={isLoading}
      >
        {isLoading ? 'Submitting...' : 'Save'}
      </button>
      {isError && <div>{(error as Error).message}</div>}
    </>
  );
}

export default PageEditor;