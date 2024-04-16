import { expect, test, vi } from "vitest";
import WikiUser, { AccessLevel } from "@/app/lib/models/wikiuser"
import { testConnection } from '@/app/lib/db';
import config from "@/config";

// Disables a package that checks that code is only executed on the server side.
// Also, this mock can be defined in the Vitest setup file.
vi.mock("server-only", () => {
    return {};
});

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

    const wikiuser = WikiUser.newUserFactory(username)

    userData["date_created"] = wikiuser.date_created;
    userData["date_modified"] = wikiuser.date_modified;
    userData["last_login"] = wikiuser.last_login;

    expect(wikiuser).toEqual(expect.objectContaining(userData))
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

    userData["date_created"] = wikiuser.date_created;
    userData["date_modified"] = wikiuser.date_modified;
    userData["last_login"] = wikiuser.last_login;

    expect(wikiuser).toEqual(expect.objectContaining(userData))
});

// only continue if the database connection is successful

// const isGitHubActions = process.env.GITHUB_ACTIONS === 'true';
const isGitHubActions = config.github_actions;

(isGitHubActions ? test.skip : test)('DB Connection', async () => {
    const connected = await testConnection();
    expect(connected).toBe(true);
});