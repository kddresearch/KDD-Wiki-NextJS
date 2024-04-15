import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
// import WikiUser from './app/lib/models/wikiuser'
import WikiUser, { AccessLevel } from "@/app/lib/models/wikiuser"

test('test' , () => {
    const test = true;
    expect(test).toBe(true);
});