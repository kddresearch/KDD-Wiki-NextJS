"use client";
import TextEditor from "@/components/editors/lexical/editor";
import rPage from "@/app/lib/models/rpage";
import Directory from "@/app/lib/models/directory";
import { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from 'react-query';

function PageEditor({ inputPage }: { inputPage: object }) {
  let page = (new rPage(inputPage)).toJSON();
  const [title, setTitle] = useState(page.title);
  const [content, setContent] = useState(page.content);
  const [parentId, setParentId] = useState<number | null>(null);
  const [parentType, setParentType] = useState<string | null>(null);
  const [directoriesAndPages, setDirectoriesAndPages] = useState<(Directory | rPage)[]>([]);

  useEffect(() => {
    async function fetchData() {
      const response = await fetch('/api/directory/all-dirs-pages');
      if (!response.ok) {
        console.error('Failed to fetch directories and pages');
        return;
      }
      const data = await response.json();
      setDirectoriesAndPages(data);
    }
    fetchData();
  }, []);

  async function submitPageCall(page: rPage, parentId?: number, parentType?: string) {
    const response = await fetch(`/api/rpage/${page.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ page, parentId, parentType })
    });

    if (!response.ok) {
      throw new Error('Failed to submit page');
    }

    return response.json();
  }

  const queryClient = useQueryClient();
  const { mutate, isLoading, isError, error } = useMutation(
    (data: { page: rPage, parentId?: number, parentType?: string }) => submitPageCall(data.page, data.parentId, data.parentType),
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
      validatedPage = new rPage(updatedPage);
    } catch (error: any) {
      let errorMessage = `${error.message}`;
      alert(errorMessage);
      return;
    }

    mutate({ page: validatedPage, parentId, parentType }, {
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
      <TextEditor
        markdown={content || ""}
        onContentChange={(newContent: string) => setContent(newContent)}
      />
      <div className="flex flex-row content-center">
        <label className="text-2xl font-bold mr-2 my-auto">Parent:</label>
        <select
          value={parentId ? `${parentId}-${parentType}` : ""}
          onChange={(e) => {
            const selectedOption = e.target.value.split("-");
            setParentId(Number(selectedOption[0]));
            setParentType(selectedOption[1]);
          }}
        >
          <option value="">Select Parent</option>
          {directoriesAndPages.map((item) => (
            <option key={item.id} value={`${item.id}-${item.type}`}>
              {item.title} ({item.type === 'directory' ? 'Directory' : 'Page'})
            </option>
          ))}
        </select>
      </div>
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
