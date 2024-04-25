import fs from 'fs';
import React from 'react'
import {createRoot} from 'react-dom/client'
import Markdown from 'react-markdown'
import classNames from "classnames";

function RenderMarkdownString({
  markdown, 
  ...props 
} : { markdown: string } & React.HTMLAttributes<HTMLDivElement>) {

  const proseClasses = classNames(
    'prose',
    'max-w-none',
    'prose-h1:text-purple',
    'prose-a:text-purple',
    'prose-a:underline',
    props.className
  );

  return (<Markdown className={proseClasses}>{markdown}</Markdown>);
}

function RenderMarkdownFile({
  filePath, 
  ...props 
} : { filePath: string } & React.HTMLAttributes<HTMLDivElement>) {
  const fileContent = fs.readFileSync(filePath, 'utf8');
  return (<RenderMarkdownString markdown={fileContent} {...props}/>);
}

export {
  RenderMarkdownFile,
  RenderMarkdownString
}