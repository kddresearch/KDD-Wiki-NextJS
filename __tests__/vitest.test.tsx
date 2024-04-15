import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
// import WikiUser from './app/lib/models/wikiuser'
import WikiUser, { AccessLevel } from "@/app/lib/models/wikiuser"

test('WikiUser Default', () => {

  // const username = "test";

  // generate random string
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
})

