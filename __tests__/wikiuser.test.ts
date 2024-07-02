import { expect, test, vi } from "vitest";
import WikiUser, { AccessLevel } from "@/app/lib/models/wikiuser"
import { testConnection } from '@/app/lib/db';
import getConfig from "@/config";
const config = await getConfig();
import { getRandomValues } from "crypto";

// Disables a package that checks that code is only executed on the server side.
// Also, this mock can be defined in the Vitest setup file.
vi.mock("server-only", () => {
    return {};
});


test('WikiUser Default', () => {
    const array = new Uint32Array(1);
    const username = getRandomValues(array).toString().substring(7);

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
    const array = new Uint32Array(1);
    const username = getRandomValues(array).toString().substring(7);

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

// Create guest wikiuser
test('WikiUser Guest', () => {

    const wikiuser = WikiUser.guestFactory();

    const guestData = {
        id: 0,
        username: "Guest",
        access_level: AccessLevel.Guest,
        settings: {},
        first_name: "John",
        last_name: "Doe",
        bio: "My Guest User!",
        email: "guest@none.com",
        profile_picture: "/images/default_profile.png",
        phone_number: "785-000-0000",
        social_media: {},
        admin_teams: [],
        date_created: new Date(),
        date_modified: new Date(),
        last_login: new Date(),
    };

    guestData["date_created"] = wikiuser.date_created;
    guestData["date_modified"] = wikiuser.date_modified;
    guestData["last_login"] = wikiuser.last_login;

    expect(wikiuser).toEqual(expect.objectContaining(guestData))
});

// only continue if the database connection is successful
const isGitHubActions = config!.github_actions;
test('DB Connection', async () => {
    const connected = await testConnection();
    expect(connected).toBe(true);
});