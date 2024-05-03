import fs from 'fs';
import React from 'react';
import classNames from 'classnames';
import rehypeParse from 'rehype-parse';
import rehypeReact from 'rehype-react';
import {unified} from 'unified';

// @ts-expect-error: the react types are missing.
const production = {Fragment: prod.Fragment, jsx: prod.jsx, jsxs: prod.jsxs}

function RenderMarkdownString({ 
  markdown, 
  ...props 
}: { 
  markdown: string } & 
  React.HTMLAttributes<HTMLDivElement>
) {
  const proseClasses = classNames('prose', 'max-w-none', 'prose-h1:text-purple', 'prose-a:text-purple', 'prose-a:underline', props.className);

  const processor = unified()
    .use(rehypeParse, {fragment: true})
    .use(rehypeReact, production)

  const content = processor.processSync(markdown).result;

  return <div className={proseClasses} {...props}>{content}</div>;
}

function RenderMarkdownFile({ 
  filePath, 
  ...props 
}: { 
  filePath: string } & 
  React.HTMLAttributes<HTMLDivElement>
) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  return <RenderMarkdownString markdown={fileContent} {...props} />;
}

export { RenderMarkdownFile, RenderMarkdownString };