import Joi from "joi";

const researchCategorySchema = Joi.object({
    id: Joi.number().required(),
    name: Joi.string().required(),
    description: Joi.string().required(),
    members: Joi.array().items(Joi.number()).required(),
    date_created: Joi.date().required(),
    date_modified: Joi.date().required(),
});

class ResearchCategory {
    id: number;
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
            throw new Error(`ResearchTeam validation error: ${error.message}`);
        }

        this.id = value.id;
        this.name = value.name;
        this.description = value.description;
        this.members = value.members;
        this.date_created = value.date_created;
        this.date_modified = value.date_modified;
    }
}

export default ResearchCategory;