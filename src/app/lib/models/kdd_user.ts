import joi from "joi";
import { pgTable, integer, text, varchar, boolean, date, serial } from 'drizzle-orm/pg-core';


// Joi schema for kdd user validation
const kdd_userSchema = joi.object({
  id: joi.number().integer(),
  username: joi.string().required().max(50), // TODO: Find EID max length
  member: joi.boolean().required().allow(null),
  admin: joi.boolean().required().allow(null),
  readonly: joi.boolean().required().allow(null),
  date_created: joi.date().required(),
  date_modified: joi.date().required(),
  kdd_group_id: joi.number().integer().min(0).allow(null), // Allow null or integer >= 0
  directory_group_id: joi.number().integer().min(0).allow(null), // Allow null or integer >= 0
  is_kdd_only: joi.boolean().required(),
});


export const kddUserTable = pgTable('kdd_users', {
  id: serial('id').primaryKey(),
  username: varchar('username', { length: 50 }).notNull(), 
  //to be required
  member: boolean('member').notNull().default(false),
  //to be required
  admin: boolean('admin').notNull().default(false),
  //to be requried
  readonly: boolean('readonly').notNull().default(false),
  date_created: date('date_created').defaultNow(),
  date_modified: date('date_modified').defaultNow(), 
  kdd_group_id: integer('kdd_group_id'),
  directory_group_id: integer('directory_group_id'),
  is_kdd_only: boolean('is_kdd_only').notNull() 
});


// TODO: What should the name of the user class be? User, or KddUser?
class KddUser {
  id: number;
  username: string;
  member: boolean;
  admin: boolean;
  readonly: boolean;
  date_created: Date;
  date_modified: Date;
  kdd_group_id: number;
  directory_group_id: number;
  is_kdd_only: boolean;

  constructor(data: any) {
    // Validates the data against the Joi schema, values is the validated data
    const { error, value } = kdd_userSchema.validate(data);

    // IF there is an error, throw an error with the message
    if (error) {
      throw new Error(`KddUser validation error: ${error.message}`);
    }

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
    return new KddUser({
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

  // tojson() {
  toJSON() {
    return {
      id: this.id,
      username: this.username,
      member: this.member,
      admin: this.admin,
      readonly: this.readonly,
      date_created: this.date_created,
      date_modified: this.date_modified,
      kdd_group_id: this.kdd_group_id,
      directory_group_id: this.directory_group_id,
      is_kdd_only: this.is_kdd_only,
    };
  }
}

export default KddUser;
