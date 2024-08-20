import { z } from "zod";

export const legacyUserSchema = z.object({
  id:  z.coerce.number().int().refine(val => val >= 0 || val === -2, { message: "id must be a positive integer or -2 for guest user" }),
  username: z.string().min(1)
    .max(50,
      { message: "username must be less than 50 characters" })
    .refine(val => ((val.toLowerCase() === val) || (val === "Guest")), 
      { message: "username must be lowercase, or Guest" }),
  member: z.boolean().nullable().default(false).transform(val => val ?? false),
  admin: z.boolean().nullable().default(false).transform(val => val ?? false),
  readonly: z.boolean().nullable().default(false).transform(val => val ?? false),
  date_created: z.coerce.date(),
  date_modified: z.coerce.date(),
  kdd_group_id: z.number().int().min(0).optional().nullable(),
  directory_group_id: z.number().int().min(0).optional().nullable(),
  is_kdd_only: z.boolean(),
});

// TODO: What should the name of the user class be? User, or KddUser?
class LegacyUser {
  id: number;
  username: string;
  member: boolean;
  admin: boolean;
  readonly: boolean;
  date_created: Date;
  date_modified: Date;
  kdd_group_id: number | undefined | null;
  directory_group_id: number | undefined | null;
  is_kdd_only: boolean;

  constructor(data: any) {
    const result = legacyUserSchema.safeParse(data);

    if (!result.success) {
      throw new Error(`Invalid user data: ${JSON.stringify(result.error.errors)}`);
    }

    const value = result.data;

    // Assign the validated values to the KddUser object
    this.id = value.id;
    this.username = value.username;
    this.member = value.member;
    this.admin = value.admin;
    this.readonly = value.readonly;
    this.date_created = value.date_created;
    this.date_modified = value.date_modified;
    this.kdd_group_id = value.kdd_group_id;
    this.directory_group_id = value.directory_group_id;
    this.is_kdd_only = value.is_kdd_only;
  }

  static guestFactory() {
    return new LegacyUser({
      id: -2,
      username: "Guest",
      readonly: true,
      member: false,
      admin: false,
      date_created: new Date(),
      date_modified: new Date(),
      kdd_group_id: 0,
      directory_group_id: 0,
      is_kdd_only: false,
    });
  }
}

export default LegacyUser;
