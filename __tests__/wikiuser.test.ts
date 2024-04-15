import { expect, test } from 'vitest'
import WikiUser, { AccessLevel } from "@/app/lib/models/wikiuser"
import { testConnection } from '@/app/lib/db';

test('WikiUser Default', () => {
    const username = Math.random().toString(36).substring(7);

    const userData = {
        id: -1,
        username: username,
        access_level: AccessLevel.Member,
        settings: {},
        first_name: "John",
        last_name: "Doe",
        bio: "Your bio here!",
        email: `${username}@k-state.edu`,
        profile_picture: "/images/default_profile.png",
        phone_number: "785-000-0000",
        social_media: {},
        admin_teams: [],
        date_created: new Date(),
        date_modified: new Date(),
        last_login: new Date(),
    };

    expect(WikiUser.newUserFactory(username)).toEqual(expect.objectContaining(userData))
});

test('WikiUser Update to Admin', () => {
    const username = Math.random().toString(36).substring(7);

    const userData = {
        id: -1,
        username: username,
        access_level: AccessLevel.Admin,
        settings: {},
        first_name: "John",
        last_name: "Doe",
        bio: "Your bio here!",
        email: `${username}@k-state.edu`,
        profile_picture: "/images/default_profile.png",
        phone_number: "785-000-0000",
        social_media: {},
        admin_teams: [],
        date_created: new Date(),
        date_modified: new Date(),
        last_login: new Date(),
    };

    const wikiuser = WikiUser.newUserFactory(username)
    wikiuser.updateAccessLevel(AccessLevel.Admin);

    expect(wikiuser).toEqual(expect.objectContaining(userData))
});

let connected: boolean = false;

async function testdbConnection() {
    connected = await testConnection();
}

testdbConnection();

(connected ? test : test.skip)('DB Connection', () => {
    expect(connected).toBe(true);
})