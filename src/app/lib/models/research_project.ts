import Joi from "joi";

// Joi schema for the ResearchProject validation
const researchProjectSchema = Joi.object({
    id: Joi.number().required(),
    title: Joi.string().required(),
    category_id: Joi.number().required(),
    description: Joi.string().required(),
    project_management_link: Joi.string().required(),
    datasets_id: Joi.array().items().required(),
    source_code: Joi.object({
        url: Joi.string().required(),
        is_private: Joi.boolean().required() 
    }).required(),

    date_created: Joi.date().required(),
    date_modified: Joi.date().required(),
});

class ResearchProject {
    id: number;
    title: string;
    description: string;
    project_management_link: string;
    source_code: { url: string, is_private: boolean };

    // relationships
    category_id: number;
    datasets_id: number[];

    date_created: Date;
    date_modified: Date;

    constructor(data: any) {
        // Validate the data
        const { error, value } = researchProjectSchema.validate(data);

        // If there is an error, throw an error
        if (error) {
            throw new Error(`ResearchProject validation error: ${error.message}`);
        }

        this.id = value.id;
        this.title = value.title;
        this.category_id = value.category_id;
        this.description = value.description;
        this.project_management_link = value.project_management_link;
        this.datasets_id = value.datasets_id;
        this.source_code = value.source_code;

        this.date_created = value.date_created;
        this.date_modified = value.date_modified;
    }
}

export default ResearchProject;