import Joi from "joi";

enum PublicationPlatform {
    ARXIV = 'arxiv',
    DBLP = 'dblp',
    GOOGLE_SCHOLAR = 'google_scholar',
    PDF = 'pdf',
    BIBTEX = 'bibtex',
    RESEARCH_GATE = 'research_gate',
    CITESEERX = 'citeseerx',
    SEMANTIC_SCHOLAR = 'semantic_scholar'
    // ...
}

type PublicationPlatformLinks = {
    [Key in PublicationPlatform]?: string;
};

// Joi schema for the Publication validation
const rpublicationSchema = Joi.object({
    id: Joi.number().integer().required(),
    content: Joi.string().required(),
    platforms: Joi.object()
        .pattern(
            Joi.string().valid(...Object.values(PublicationPlatform)),
            Joi.string().uri().allow(""),
        )
        .required(),
    date_published: Joi.date().required(),

    project_id: Joi.number().integer().required(),
    author_ids: Joi.array().items(Joi.number().integer()).required(),

    date_created: Joi.date().required(),
    date_modified: Joi.date().required(),
});

class rPublication {
    id: number;
    content: string;
    platforms: PublicationPlatformLinks;
    date_published: Date;

    // relationships
    project_id: number;
    author_ids: number[];
    date_created: Date;
    date_modified: Date;

    constructor(data: any) {
        // Validate the data
        const { error, value } = rpublicationSchema.validate(data);

        // If there is an error, throw an error
        if (error) {
            throw new Error(`Publication validation error: ${error.message}`);
        }

        this.id = value.id;
        this.content = value.content;
        this.platforms = value.platforms;
        this.date_published = value.date_published;
        this.project_id = value.project_id;
        this.author_ids = value.author_ids;
        this.date_created = value.date_created;
        this.date_modified = value.date_modified;
    }
}

export default rPublication;