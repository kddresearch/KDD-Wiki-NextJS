import Joi from "joi";

const rCategoryMemberSchema = Joi.object({
    id: Joi.number().required(),
    category_id: Joi.number().required(),
    member_id: Joi.number().required(),
});

class rCategoryMember {
    id: number;
    category_id: number;
    member_id: number;

    constructor(data: any) {
        // Validate the data
        const { error, value } = rCategoryMemberSchema.validate(data);
        // If there is an error, throw an error
        if (error) {
            throw new Error(`CategoryMembers validation error: ${error.message}`);
        }

        this.id = data.id;
        this.category_id = data.category_id;
        this.member_id = data.member_id;
    }
}

export default rCategoryMember;
// SQL
// CREATE TABLE category_member (
//     category_id INTEGER NOT NULL REFERENCES rcategory(id),
//     user_id INTEGER NOT NULL REFERENCES wiki_user(id),
//     PRIMARY KEY (category_id, user_id)
// );