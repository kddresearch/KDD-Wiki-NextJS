"use client";

import classNames from "classnames";
import { MDXRemote, MDXRemoteSerializeResult } from 'next-mdx-remote';
import Card from '@/components/layout/card';
import Link from 'next/link';
import { Suspense, useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { renderMarkdownString } from "@/actions/markdown";
import React from "react";

const components = { Card, Link };

function LoadingComponent() {
  return (
    <div className="space-y-2">
      <Skeleton className="h-4 w-[400px]" />
      <Skeleton className="h-4 w-[350px]" />
      <Skeleton className="h-4 w-[250px]" />
      <div className="h-4"></div>
      <Skeleton className="h-4 w-[400px]" />
      <Skeleton className="h-4 w-[375px]" />
      <div className="h-4"></div>
      <Skeleton className="h-4 w-[400px]" />
      <Skeleton className="h-4 w-[375px]" />
      <Skeleton className="h-4 w-[325px]" />
      <Skeleton className="h-4 w-[100px]" />
      <div className="h-4"></div>
      <Skeleton className="h-4 w-[250px]" />
    </div>
  );
}

function ErrorComponent({ error }: { error: Error }) {
  return <div>Error: {error.message}</div>;
}

function RenderMarkdownStringClient({ 
  markdown,
  ...props
}: { 
  markdown: string 
} & React.HTMLAttributes<HTMLDivElement>) {

  const proseClasses = classNames('prose', 'max-w-none', 'prose-h1:text-purple', 'prose-a:text-purple', 'prose-a:underline', props.className);

  const [mdxSource, setMDXSource] = useState<MDXRemoteSerializeResult<Record<string, unknown>, Record<string, unknown>> | null>(null);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchCompiledMarkdown = async () => {
      try {
        const result = await renderMarkdownString(markdown);
        setMDXSource(result);
      } catch (err) {
        setError(err instanceof Error ? err : new Error('An error occurred'));
      }
    };

    fetchCompiledMarkdown();
  }, [markdown]);

  if (!mdxSource) {
    return <LoadingComponent />;
  }

  if (error) {
    return <ErrorComponent error={error} />;
  }

  return (
    <Suspense fallback={<LoadingComponent />}>
      <div className={proseClasses}>
        <MDXRemote {...mdxSource} />
      </div>
    </Suspense>
  );
}

export default RenderMarkdownStringClient;