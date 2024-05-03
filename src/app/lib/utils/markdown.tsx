import fs from 'fs';
// import * as prod from 'react/jsx-runtime'
import React from 'react';
import classNames from 'classnames';
// import rehypeParse from 'rehype-parse';
// import rehypeSanitize from 'rehype-sanitize'
// import rehypeStringify from 'rehype-stringify'
// import rehypeReact from 'rehype-react';
// import { unified } from 'unified';
import { MDXRemote } from 'next-mdx-remote/rsc'

// TODO: Fix this type issue
// const production = {Fragment: prod.Fragment, jsx: prod.jsx, jsxs: prod.jsxs} as any;

async function RenderMarkdownString({ 
  markdown, 
  ...props 
}: { 
  markdown: string } & 
  React.HTMLAttributes<HTMLDivElement>
) {
  const proseClasses = classNames('prose', 'max-w-none', 'prose-h1:text-purple', 'prose-a:text-purple', 'prose-a:underline', props.className);

  // const processor = unified()
  //   .use(rehypeParse, {fragment: true})
  //   .use(rehypeSanitize)
  //   .use(rehypeStringify)
  //   .use(rehypeReact, production)

  // const content = await processor.process(markdown);

  // const content = <MDXRemote source={markdown} />

  return (
    <div className={proseClasses} {...props}>
      <MDXRemote source={markdown} />
    </div>
  );
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