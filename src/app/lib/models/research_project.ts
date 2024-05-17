import Joi from "joi";

// Joi schema for the ResearchProject validation
const researchProjectSchema = Joi.object({
    id: Joi.number().required(),
    title: Joi.string().alphanum().max(50).min(4).required(),
    category_id: Joi.number().required(),
    description: Joi.string().max(2000).required(),
    methodology: Joi.string().max(5000).required(),

    // Relationships
    tag_ids: Joi.array().items(Joi.number()).required(),
    dataset_ids: Joi.array().items(Joi.number()).required(),
    personnel_ids: Joi.array().items(Joi.number()).required(),
    publication_ids: Joi.array().items(Joi.number()).required(),
    funding_ids: Joi.array().items(Joi.number()).required(),
    source_code_id: Joi.number().required(),

    // Metadata
    date_created: Joi.date().required(),
    date_modified: Joi.date().required(),
});

class ResearchProject {
    id: number;
    title: string;
    category_id: number;
    description: string;
    methodology: string;
    
    // Relationships
    tag_ids: number[];
    dataset_ids: number[];
    personnel_ids: number[];
    publication_ids: number[];
    funding_ids: number[];
    source_code_id: number;

    // Metadata
    date_created: Date;
    date_modified: Date;

    constructor(data: any) {

        const { error, value } = researchProjectSchema.validate(data);

        if (error) {
            throw new Error(`ResearchProject validation error: ${error.message}`);
        }

        this.id = value.id;
        this.title = value.title;
        this.category_id = value.category_id;
        this.description = value.description;
        this.methodology = value.methodology;
        this.tag_ids = value.tag_ids;
        this.dataset_ids = value.dataset_ids;
        this.personnel_ids = value.personnel_ids;
        this.publication_ids = value.publication_ids;
        this.funding_ids = value.funding_ids;
        this.source_code_id = value.source_code_id;
        this.date_created = value.date_created;
        this.date_modified = value.date_modified;
    }
}

export default ResearchProject;