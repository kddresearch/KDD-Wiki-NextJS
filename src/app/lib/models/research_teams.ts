import Joi from "joi";

const researchProjectSchema = Joi.object({
    id: Joi.number().required(),
    title: Joi.string().required(),
    category: Joi.number().required(),
    description: Joi.string().required(),
    project_management_link: Joi.string().required(),
    datasets: Joi.array().items(Joi.number()).required(),
    source_code: Joi.string().required(),
    background: Joi.string().required(),

    date_created: Joi.date().required(),
    date_modified: Joi.date().required(),
});

class ResearchProject {
    id: number;
    title: string;
    category: number;
    description: string;
    project_management_link: string;
    datasets: number[];
    source_code: string;
    background: string;

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
        this.category = value.category;
        this.description = value.description;
        this.project_management_link = value.project_management_link;
        this.datasets = value.datasets;
        this.source_code = value.source_code;
        this.background = value.background;

        this.date_created = value.date_created;
        this.date_modified = value.date_modified;
    }
}

export default ResearchProject;