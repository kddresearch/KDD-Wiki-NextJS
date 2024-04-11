import Joi from "joi";

enum CategoryType {
    research = "research",
    admin = "admin",
    // ...
}

const researchCategorySchema = Joi.object({
    id: Joi.number().required(),
    role: Joi.string().valid(...Object.values(CategoryType)).required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
    members: Joi.array().items(Joi.number()).required(),
    date_created: Joi.date().required(),
    date_modified: Joi.date().required(),
});

class Category {
    id: number;
    role: CategoryType
    name: string;
    description: string;
    members: number[];
    date_created: Date;
    date_modified: Date;

    constructor(data: any) {
        // Validate the data
        const { error, value } = researchCategorySchema.validate(data);

        // If there is an error, throw an error
        if (error) {
            throw new Error(`ResearchCategory validation error: ${error.message}`);
        }

        this.id = value.id;
        this.role = value.role;
        this.name = value.name;
        this.description = value.description;
        this.members = value.members;
        this.date_created = value.date_created;
        this.date_modified = value.date_modified;
    }
}

export default Category;

// SQL
// CREATE TABLE categories (
//     id SERIAL PRIMARY KEY,
//     role TEXT NOT NULL,
//     name TEXT NOT NULL,
//     description TEXT NOT NULL,
//     members INTEGER[] NOT NULL REFERENCES rkdd_user(id),
//     date_created TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
//     date_modified TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
// );