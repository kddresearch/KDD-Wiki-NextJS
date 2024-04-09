import Joi from "joi";
import { AccessLevel } from "./rkdd_user";
import { Page } from "./page";

const rpageSchema = Joi.object({
    id: Joi.number().integer().min(0),
    title: Joi.string().max(50).required(),
    content: Joi.string().min(0),
    author: Joi.number().integer().min(0).required(),
    category: Joi.number().integer().min(0).required(),

    versionId: Joi.number().integer().min(0).required(),
    versions: Joi.array().items(Joi.object({
        versionId: Joi.number().integer().min(0).required(),
        content: Joi.string().min(0).required(),
        author: Joi.number().integer().min(0).required(),
        date_created: Joi.date().required(),
    })),

    views: Joi.number().integer().min(0).default(0),
    access_level: Joi.string().valid(...Object.values(AccessLevel)).required(),
    date_created: Joi.date().required(),
    date_modified: Joi.date().required(),
});

class rPage {
    id: number;
    title: string;
    content: string;
    author: number;
    category: number;

    versionId: number;
    versions: {
        versionId: number;
        content: string;
        author: number;
        date_created: Date;
    }[];

    views: number;
    access_level: AccessLevel;
    date_created: Date;
    date_modified: Date;

    constructor(data: any) {
        // Convert author_id and category_id to numbers if they are strings
        data.author = Number(data.author);
        data.category = Number(data.category);
        // Validates the data against the Joi schema, values is the validated data
        const { error, value } = rpageSchema.validate(data);

        // IF there is an error, throw an error with the message
        if (error) {
            throw new Error(
                `Page validation error: ${error.message}\nCurrent Value: ${data[error.name]}`,
            );
        }

        // Assign the validated values to the Page object
        this.id = value.id;
        this.title = value.title;
        this.content = value.content;
        this.author = value.author;
        this.category = value.category;

        this.versionId = value.versionId;
        this.versions = value.versions;

        this.views = value.views;
        this.access_level = value.access_level;
        this.date_created = value.date_created;
        this.date_modified = value.date_modified;
    }

    newPage(title: string, content: string, author: number, category: number, access_level: AccessLevel) {
        return new rPage({
            id: 0,
            title: title,
            content: content,
            author: author,
            category: category,

            versionId: 0,
            versions: [{
                versionId: 0,
                content: content,
                author: author,
                date_created: new Date(),
            }],

            views: 0,
            access_level: access_level,
            date_created: new Date(),
            date_modified: new Date(),
        });
    }

    updatePageContent(content: string, author: number) {
        this.content = content;
        this.versions.push({
            versionId: this.versions.length + 1,
            content: content,
            author: author,
            date_created: new Date(),
        });

        this.versionId = this.versions.length;
        this.date_modified = new Date();
    }

    static fromPage(page: Page) {
        return new rPage({
            id: page.id,
            title: page.title,
            content: page.content,
            author: page.author_id,
            category: null,

            versionId: 0,
            versions: [{
                versionId: 0,
                content: page.content,
                author: page.author_id,
                date_created: page.date_created,
            }],

            access_level: page.is_kdd_only ? AccessLevel.Member : AccessLevel.ReadOnly,
            views: 0,
            date_created: page.date_created,
            date_modified: page.date_modified,
        });
    }
}

export default rPage;