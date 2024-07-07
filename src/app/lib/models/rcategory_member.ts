import Joi from "joi";

import { pgTable, integer } from 'drizzle-orm/pg-core';

const rCategoryMemberSchema = Joi.object({
    category_id: Joi.number().required(),
    user_id: Joi.number().required(),
});

export const rCategoryMemberTable = pgTable('r_category_members', {
  category_id: integer('category_id').notNull(), 
  user_id: integer('user_id').notNull()
});


class rCategoryMember {
    category_id: number;
    user_id: number;

    constructor(data: any) {
        // Validate the data
        const { error, value } = rCategoryMemberSchema.validate(data);
        // If there is an error, throw an error
        if (error) {
            throw new Error(`CategoryMembers validation error: ${error.message}`);
        }

        this.category_id = data.category_id;
        this.user_id = data.user_id;
    }
}

export default rCategoryMember;

// SQL
// CREATE TABLE category_member (
//     category_id INTEGER NOT NULL REFERENCES rcategory(id),
//     user_id INTEGER NOT NULL REFERENCES wiki_user(id),
//     PRIMARY KEY (category_id, user_id)
// );