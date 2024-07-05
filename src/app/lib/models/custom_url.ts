import Joi from "joi";
import { pgTable, integer, text, varchar, date, serial } from 'drizzle-orm/pg-core';


enum ActionType {
  toPage = "pg",
  redirect = "rd",
}

// // Joi schema for custom_url validation
// const customUrlSchema = Joi.object({
//   id: Joi.number().integer().min(0).optional(),
//   url: Joi.string().max(50).required(),
//   action: Joi.string().valid(...Object.values(ActionType)).required(),
//   target: Joi
//     .alternatives()
//     .try(Joi.number().integer().min(0), Joi.string().uri())
//     .required(),
//   date_created: Joi.date().required(),
//   date_modified: Joi.date().required(),
//   author_id: Joi.number().integer().min(0).required(),
// });

export const customUrlSchema = pgTable('custom_urls', {
  //primary key?
  id: serial('id').primaryKey(), 
  url: varchar('url', { length: 50 }).notNull(), 
  //add constraint for action type
  action: text('action').notNull(),
  //.check(`action IN (${Object.values(ActionType).map(action => `'${action}'`).join(', ')})`), 
  // target_integer: integer('target_integer'), 
  // target_string: varchar('target_string'), 
  //store as string and validate later
  target:text('targtet').notNull(),
  date_created: date('date_created').notNull(), 
  date_modified: date('date_modified').notNull(), 
  author_id: integer('author_id').notNull(), 
});

class CustomUrl {
  id?: number;
  url: string;
  action: ActionType;
  target: string | number;

  // metadata
  date_created: Date;
  date_modified: Date;
  author_id: number;

  constructor(data: any) {
    // Convert author_id to number
    data.author_id = Number(data.author_id);

    // if date_created is not provided, set it to the current date
    if (!data.date_created) {
      data.date_created = new Date();
    }

    // if date_modified is not provided, set it to the current date
    if (!data.date_modified) {
      data.date_modified = new Date();
    }

    const { error, value } = customUrlSchema.validate(data);

    // IF there is an error, throw an error with the message
    if (error) {
      throw new Error(
        `CustomUrl validation error: ${error.message}`,
      );
    }

    // Assign the validated values to the CustomUrl object
    this.id = value.id;
    this.url = value.url;
    this.action = value.action;
    this.target = value.target;

    // metadata
    this.date_created = value.date_created;
    this.date_modified = value.date_modified;
    this.author_id = value.author_id;
  }
}

export default CustomUrl;
