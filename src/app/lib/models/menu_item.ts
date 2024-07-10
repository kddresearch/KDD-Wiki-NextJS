import joi from "joi";
import { query } from "../db";

// Joi schema for menu item validation
const menuItemSchema = joi.object({
  id: joi.number().integer().min(0),
  parent_id: joi.number().integer().min(0).required(),
  child_id: joi.number().integer().min(0).required(),
  parent_type: joi.string().valid('directory', 'rpage').required(),
  child_type: joi.string().valid('directory', 'rpage').required(),
});

class MenuItem {
  id: number;
  parent_id: number;
  child_id: number;
  parent_type: 'directory' | 'rpage';
  child_type: 'directory' | 'rpage';

  constructor(data: any) {
    // Validates the data against the Joi schema
    const { error, value } = menuItemSchema.validate(data);

    // If there is an error, throw an error with the message
    if (error) {
      throw new Error(`MenuItem validation error: ${error.message}`);
    }

    // Assign the validated values to the MenuItem object
    this.id = value.id;
    this.parent_id = value.parent_id;
    this.child_id = value.child_id;
    this.parent_type = value.parent_type;
    this.child_type = value.child_type;
  }
}

export { MenuItem };
