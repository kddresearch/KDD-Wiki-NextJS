import joi from "joi";
import { pgTable, integer, text, varchar, boolean, date, serial } from 'drizzle-orm/pg-core';


//Joi schema for announcement validation
const announcementSchema = joi.object({
  id: joi.number().integer().min(0),
  title: joi.string().max(50).trim().required(),
  content: joi.string().required(),
  date_created: joi.date().required(),
  date_modified: joi.date().required(),
  author_id: joi.number().integer().min(0).required(),
  is_old: joi.boolean().required(),
});

class Announcement {
  id: number;
  title: string;
  content: string;
  date_created: Date;
  date_modified: Date;
  author_id: number;
  is_old: boolean;

  constructor(data: any) {
    // Validates the data against the Joi schema, values is the validated data
    const { error, value } = announcementSchema.validate(data);

    // IF there is an error, throw an error with the message
    if (error) {
      throw new Error(`Announcement validation error: ${error.message}`);
    }

    // Assign the validated values to the Announcement object
    this.id = value.id;
    this.title = value.title;
    this.content = value.content;
    this.date_created = value.date_created;
    this.date_modified = value.date_modified;
    this.author_id = value.author_id;
    this.is_old = value.is_old;
  }
}

// export default Announcement;

export { Announcement };


// export functions
