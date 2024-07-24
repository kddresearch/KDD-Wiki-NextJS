"use client";

import classNames from "classnames";
import { evaluate, MDXRemote } from "next-mdx-remote-client/rsc";
import Card from '@/components/layout/card';
import Link from 'next/link';
import { Suspense } from "react";

const components = { Card, Link };

function LoadingComponent() {
  return <div>Loading...</div>;
}

function ErrorComponent({ error }: { error: Error }) {
  return <div>Error: {error.message}</div>;
}

function RenderMarkdownStringClient({ 
  markdown, 
  ...props 
}: { 
  markdown: string } & 
  React.HTMLAttributes<HTMLDivElement>
) {
  const proseClasses = classNames('prose', 'max-w-none', 'prose-h1:text-purple', 'prose-a:text-purple', 'prose-a:underline', props.className);

  return (
    <Suspense fallback={<LoadingComponent />}>
      <div className={proseClasses} {...props}>
        <MDXRemote
          source={markdown}
          components={components}
          onError={ErrorComponent}
        />
      </div>
    </Suspense>
  );
}

export default RenderMarkdownStringClient;