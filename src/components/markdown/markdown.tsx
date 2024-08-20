import 'server-only';
import React from 'react';
import classNames from 'classnames';
import { MDXRemote } from 'next-mdx-remote/rsc';
import Card from '@/components/layout/card';
import Link from 'next/link';
import fs from 'fs';

const components = { Card, Link };

export async function RenderMarkdownString({ 
  markdown, 
  ...props 
}: { 
  markdown: string } & 
  React.HTMLAttributes<HTMLDivElement>
) {
  const proseClasses = classNames('prose', 'max-w-none', 'prose-h1:text-purple', 'prose-a:text-purple', 'prose-a:underline', props.className);

  return (
    <div className={proseClasses} {...props}>
      <MDXRemote source={markdown} components={components} />
    </div>
  );
}

export function RenderMarkdownFile({ 
  filePath, 
  ...props 
}: { 
  filePath: string } & 
  React.HTMLAttributes<HTMLDivElement>
) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  return <RenderMarkdownString markdown={fileContent} {...props} />;
}