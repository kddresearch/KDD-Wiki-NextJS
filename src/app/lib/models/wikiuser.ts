import Joi from "joi";
import KddUser from "./kdd_user";
import { pgTable, integer, varchar, text, date, serial, jsonb } from 'drizzle-orm/pg-core';


enum AccessLevel {
    Guest = "guest",
    ReadOnly = "readonly",
    Member = "member",
    Admin = "admin",   
}

enum SocialMedia {
    Facebook = "facebook",
    Twitter = "twitter",
    Instagram = "instagram",
    LinkedIn = "linkedin",
    GitHub = "github",
    Website = "website",
}

type SocialMediaLinks = {
    [Key in SocialMedia]?: string;
}

enum AdminTeam {
    WikiTeam = 'WikiTeam',
    SysAdmin = 'SysAdmin',
    Unassigned = 'Unassigned',
    // ...
}

// Joi schema for validating the KddUser object
const wikiUserSchema = Joi.object({
    id: Joi.number().required(),
    username: Joi.string().required(),
    access_level: Joi.string()
        .valid(...Object.values(AccessLevel))
        .required(),
    settings: Joi.object().required(),
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    bio: Joi.string().required(),
    email: Joi.string().email({ tlds: false }).required(),
    profile_picture: Joi.string().required(),
    phone_number: Joi.string().required(),
    social_media: Joi.object()
        .pattern(
            Joi.string().valid(...Object.values(SocialMedia)),
            Joi.string().uri().allow(""),
        )
        .required(),
    admin_teams: Joi.array().items(Joi.string().valid(...Object.values(AdminTeam))).default([]),
    date_created: Joi.date().required(),
    date_modified: Joi.date().required(),
    last_login: Joi.date().required(),
});

export const wikiUserTable = pgTable('wiki_users', {
  id: serial('id').primaryKey(), 
  username: varchar('username').notNull(), 
  access_level: varchar('access_level').notNull(),
  settings: jsonb('settings').notNull(), 
  first_name: varchar('first_name').notNull(), 
  last_name: varchar('last_name').notNull(), 
  bio: text('bio').notNull(), 
  email: varchar('email').notNull(),
  profile_picture: varchar('profile_picture').notNull(),
  phone_number: varchar('phone_number').notNull(), 
  social_media: jsonb('social_media').notNull(), 
  admin_teams: text('admin_teams').default('[]'), 
  date_created: date('date_created').defaultNow(), 
  date_modified: date('date_modified').defaultNow(), 
  last_login: date('last_login').notNull() 
});

class WikiUser {
    id: number;
    username: string;
    access_level: AccessLevel;
    settings: { [key: string]: string };

    // Profile
    first_name: string;
    last_name: string;
    bio: string;
    email: string;
    profile_picture: string;
    phone_number: string;
    social_media: SocialMediaLinks;
    admin_teams: AdminTeam[];

    // Metadata
    date_created: Date;
    date_modified: Date;
    last_login: Date;

    constructor(data: any) {
        // Validates the data against the Joi schema, values is the validated data
        const { error, value } = wikiUserSchema.validate(data);

        // IF there is an error, throw an error with the message
        if (error) {
            throw error;
            // throw new Error(`KddUser validation error: ${error.message}`);
        }

        this.id = value.id;
        this.username = value.username;
        this.access_level = value.access_level;
        this.settings = value.settings;
        this.first_name = value.first_name;
        this.last_name = value.last_name;
        this.bio = value.bio;
        this.email = value.email;
        this.profile_picture = value.profile_picture;
        this.phone_number = value.phone_number;
        this.social_media = value.social_media;
        this.admin_teams = value.admin_teams;
        this.date_created = value.date_created;
        this.date_modified = value.date_modified;
        this.last_login = value.last_login;
    }

    static guestFactory(): WikiUser {
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

        return new WikiUser(guestData);
    }

    static newUserFactory(username: string): WikiUser {
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

        return new WikiUser(userData);
    }

    static fromKddUser(kddUser: KddUser): WikiUser {
        const userData = {
            id: kddUser.id,
            username: kddUser.username,
            access_level: kddUser.readonly
                ? AccessLevel.ReadOnly
                : kddUser.admin
                ? AccessLevel.Admin
                : AccessLevel.Member,
            settings: {},
            first_name: "John",
            last_name: "Doe",
            bio: "Your bio here!",
            email: `${kddUser.username}@k-state.edu`,
            profile_picture: "/images/default_profile.png",
            phone_number: "(785) 532-6011",
            social_media: {},
            admin_teams: [],
            date_created: new Date(),
            date_modified: new Date(),
            last_login: new Date(),
        };

        const defaults = [
            "first_name",
            "last_name",
            "bio",
            "email",
            "profile_picture",
            "phone_number",
        ];

        return new WikiUser(userData);
    }

    /**
     * Does NOT update the access level
     */
    update(user: WikiUser): void {
        // this.username = user.username;
        // this.access_level = user.access_level;
        this.settings = user.settings;
        this.first_name = user.first_name;
        this.last_name = user.last_name;
        this.bio = user.bio;
        // this.email = user.email;
        this.profile_picture = user.profile_picture;
        this.phone_number = user.phone_number;
        this.social_media = user.social_media;
        this.admin_teams = user.admin_teams;
        this.date_modified = new Date();
    }

    updateAccessLevel(access_level: AccessLevel): void {
        this.access_level = access_level;
        this.date_modified = new Date();
    }

    toJSON(): any {
        return {
            id: this.id,
            username: this. username,
            access_level: this.access_level,
            settings: this.settings,
            first_name: this.first_name,
            last_name: this.last_name,
            bio: this.bio,
            email: this.email,
            profile_picture: this.profile_picture,
            phone_number: this.phone_number,
            social_media: this.social_media,
            admin_teams: this.admin_teams,
            date_created: this.date_created,
            date_modified: this.date_modified,
            last_login: this.last_login,
        };
    }
}

export { AccessLevel, SocialMedia, WikiUser };

export default WikiUser;

// TODO: on production:
// CREATE INDEX idx_kdd_users_username ON kdd_users (username);

// SQL
// CREATE TABLE wiki_user (
//   id SERIAL PRIMARY KEY,
//   username TEXT NOT NULL UNIQUE,
//   access_level TEXT NOT NULL,
//   settings JSONB NOT NULL,
//   first_name TEXT NOT NULL,
//   last_name TEXT NOT NULL,
//   bio TEXT NOT NULL,
//   email TEXT NOT NULL UNIQUE,
//   profile_picture TEXT NOT NULL,
//   phone_number TEXT NOT NULL,
//   social_media JSONB NOT NULL,
//   admin_teams JSONB NOT NULL,
//   date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
//   date_modified TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
//   last_login TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
// );