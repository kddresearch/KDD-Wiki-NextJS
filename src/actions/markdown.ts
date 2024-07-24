"use server";

import { serialize } from 'next-mdx-remote/serialize'

export async function renderMarkdownString(source: string) {
    try {
        const content = await serialize(source);
        return content;
    } catch (error) {
        console.error('Error compiling MDX:', error);
        throw new Error('Failed to compile MDX');
    }
}