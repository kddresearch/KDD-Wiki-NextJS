import Joi from "joi";
import { pgTable, integer, text, date, serial, jsonb } from 'drizzle-orm/pg-core';


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

// enum PublicationTopics {
//     MachineLearning = 'Machine Learning',
//     DataScience = 'Data Science',
//     ArtificialIntelligence = 'Artificial Intelligence',
//     ComputerVision = 'Computer Vision',
//     NaturalLanguageProcessing = 'Natural Language Processing',
//     // ...
// }

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
        ).required(),
    date_published: Joi.date().required(),
    project_id: Joi.number().integer().required(),
    author_ids: Joi.array().items(Joi.number().integer()).required(),
    category_ids: Joi.array().items(Joi.number().integer()).required(),
    date_created: Joi.date().required(),
    date_modified: Joi.date().required(),
});
export const rpublicationTable = pgTable('r_publications', {
  id: serial('id').primaryKey(), 
  content: text('content').notNull(), 
  platforms: jsonb('platforms').notNull(), 
  date_published: date('date_published').notNull(),
  project_id: integer('project_id').notNull(), 
  author_ids: integer('author_ids').array().notNull(), 
  category_ids: integer('category_ids').array().notNull(),
  date_created: date('date_created').notNull(), 
  date_modified: date('date_modified').notNull()
});


class rPublication {
    id: number;
    content: string;
    platforms: PublicationPlatformLinks;
    date_published: Date;

    // relationships
    project_id: number;
    author_ids: number[];
    category_ids: number[];

    // metadata
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
        this.category_ids = value.category_ids;
        this.date_created = value.date_created;
        this.date_modified = value.date_modified;
    }
}

export default rPublication;