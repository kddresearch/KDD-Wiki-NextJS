// Example Project Data

const researchProject = {
    id: 1,
    title: "Topical Knowledge Mapping",
    researchCategory: {
        name: "Natural Language Processing",
        leadResearher: "Dr. William Hsu",
    },
    description: "This project aims to create a knowledge graph of research topics in the field of Natural Language Processing.",
    tags: ["Natural Language Processing", "Knowledge Graph", "Topic Modeling"], // also works as keywords
    methodology: "We will use topic modeling techniques to extract topics from research papers in the ACL Anthology.",
    personnel: [
        {
            name: "Dr. William Hsu",
            role: "Principal Investigator",
            email: "johnd@k-state.edu",
            affiliation: "Kansas State University"
        },
        {
            name: "Jane Smith",
            role: "Research Assistant",
            email: "JaneS@k-state.edu",
            affiliation: "Kansas State University"
        },
        {
            name: "Jane Doe",
            role: "Affiliated Researcher",
            email: "JaneS@cmu.edu",
            affiliation: "Carnegie Mellon University"
        },
        {
            name: "John Smith",
            role: "Alumni",
            email: "JaneS@k-state.edu",
            affiliation: "Kansas State University"
        },
    ],
    publications: [
        {
            title: "Topical Knowledge Mapping: A Survey",
            authors: ["John Doe", "Jane Smith"],
            publicationDate: "2021-09-01",
            publicationVenue: "ACL"
        },
    ],
    datasets: [
        {
            name: "ACL Anthology",
            description: "A collection of research papers in the field of Natural Language Processing.",
            source: "https://aclanthology.org/dataset/52",
            isPrivate: false,
        },
        {
            name: "Unpublished Dataset",
            description: "A dataset of research papers that have not been published yet",
            source: "https://unpublished.aclanthology.org/dataset/23",
            isPrivate: true,
        },
    ],
    sourceCode: {
        url: "github.com/kddresearch/topical-knowledge-mapping",
        isPrivate: false,
    },
    funding: {
        source: "National Science Foundation",
        awardNumber: "NSF-123456",
        awardAmount: 50_000,
        dateAwarded: "2021-01-01",
    }
};

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

export default researchProject;