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

import Joi, { State } from "joi";
import remark from 'remark';
import remarkParse from 'remark-parse';
import { unified } from 'unified';
import { CustomHelpers } from 'joi';
import remarkMdx from 'remark-mdx'

const mdxValidator = async (value: string, helpers: CustomHelpers) => {
    try {
      const processor = unified().use(remarkParse);
      await processor.run(processor.parse(value));
      return value;
    } catch (error) {
      const errorState: State = {
        key: '',
        path: [],
        parent: null,
        reference: null,
        ancestors: [],
      };
  
      return helpers.error('string.mdx', { value }, errorState);
    }
  };

// Joi schema for the ResearchProject validation
const researchProjectSchema = Joi.object({
    id: Joi.number().required(),
    title: Joi.string().alphanum().max(50).min(4).required(),
    category_id: Joi.number().required(),
    description: Joi.string().max(2000).required(),
    project_management_link: Joi.string().required(),
    datasets_id: Joi.array().items().required(),
    source_code: Joi.object({
        url: Joi.string().required(),
        is_private: Joi.boolean().required() 
    }).required(),

    date_created: Joi.date().required(),
    date_modified: Joi.date().required(),
});

export default researchProject;