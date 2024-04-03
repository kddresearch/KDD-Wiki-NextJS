import Joi from "joi";
import KddUser from "./kdd_user";

enum AccessLevel {
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
};

// Joi schema for validating the KddUser object
const kddUserSchema = Joi.object({
  id: Joi.number().required(),
  username: Joi.string().required(),
  access_level: Joi.string()
    .valid(...Object.values(AccessLevel))
    .required(),
  settings: Joi.object().required(),
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  bio: Joi.string().required(),
  email: Joi.string().email().required(),
  profile_picture: Joi.string().required(),
  phone_number: Joi.string().required(),
  social_media: Joi.object()
    .pattern(
      Joi.string().valid(...Object.values(SocialMedia)),
      Joi.string().uri().allow(""),
    )
    .required(),
  date_created: Joi.date().required(),
  date_modified: Joi.date().required(),
  last_login: Joi.date().required(),
});

class rKddUser {
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

  // Metadata
  date_created: Date;
  date_modified: Date;
  last_login: Date;

  constructor(data: any) {
    // Validates the data against the Joi schema, values is the validated data
    const { error, value } = kddUserSchema.validate(data);

    // IF there is an error, throw an error with the message
    if (error) {
      throw new Error(`KddUser validation error: ${error.message}`);
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
    this.date_created = value.date_created;
    this.date_modified = value.date_modified;
    this.last_login = value.last_login;
  }

  static guestFactory(): rKddUser {
    const guestData = {
      id: 0,
      username: "Guest",
      access_level: AccessLevel.ReadOnly,
      settings: {},
      first_name: "",
      last_name: "",
      bio: "",
      email: "",
      profile_picture: "",
      phone_number: "",
      social_media: {},
      date_created: new Date(),
      date_modified: new Date(),
      last_login: null,
    };

    return new rKddUser(guestData);
  }

  static newUserFactory(): rKddUser {
    const userData = {
      id: -1,
      username: "",
      access_level: AccessLevel.Member,
      settings: {},
      first_name: "",
      last_name: "",
      bio: "Your bio here!",
      email: "",
      profile_picture: "/images/default_profile.png",
      phone_number: "",
      social_media: {},
      date_created: new Date(),
      date_modified: new Date(),
      last_login: new Date(),
    };

    return new rKddUser(userData);
  }

  static fromKddUser(kddUser: KddUser): rKddUser {
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

    return new rKddUser(userData);
  }

  toJSON(): any {
    return {
      id: this.id,
      username: this.username,
      access_level: this.access_level,
      settings: this.settings,
      first_name: this.first_name,
      last_name: this.last_name,
      bio: this.bio,
      email: this.email,
      profile_picture: this.profile_picture,
      phone_number: this.phone_number,
      social_media: this.social_media,
      date_created: this.date_created,
      date_modified: this.date_modified,
      last_login: this.last_login,
    };
  }
}

export { AccessLevel, SocialMedia, rKddUser };

export default rKddUser;

// TODO: on production:
// CREATE INDEX idx_kdd_users_username ON kdd_users (username);
