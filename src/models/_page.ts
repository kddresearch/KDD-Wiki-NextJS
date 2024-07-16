import joi from "joi";

// Joi schema for page validation
const pageSchema = joi.object({
    id: joi.number().integer().min(0),
    title: joi.string().max(50).required(),
    priority: joi.number().integer().min(0).default(1000).required(),
    content: joi.string().min(0),
    discussion: joi.string().required().min(0).allow(null),
    is_private: joi.boolean().required(),
    date_created: joi.date().required(),
    date_modified: joi.date().required(),
    category_id: joi.number().integer().min(0).required().allow(null),
    author_id: joi.number().integer().min(0).required(),
    name: joi.string().max(50).required().allow(null),
    has_publication: joi.boolean().required(),
    is_kdd_only: joi.boolean().required(),
    last_updated: joi.string().required().allow(null),
    is_home: joi.boolean().required().allow(null),
    is_template: joi.boolean().required().allow(null),
});

class Page {
    id: number;
    title: string;
    priority: number;
    content: string;
    discussion: string;
    is_private: boolean;
    date_created: Date;
    date_modified: Date;
    category_id: number;
    author_id: number;
    name: string;
    has_publication: boolean;
    is_kdd_only: boolean;
    last_updated: string;
    is_home: boolean;
    is_template: boolean;

    /**
     * Returns the url path for the page
     */
    get url() {
        return `/page/${this.id}`;
    }

    get editUrl() {
        return `/page/${this.id}/edit`;
    }


    /**
     * Calculates the estimated minutes to read the content
     */
    get minutesToRead() {
        return Math.max(1, Math.round(this.content.split(' ').length / 225));
    }

    /**
     * Returns a string representation of the minutes to read
     */
    get minutesToReadString() {
        return `${this.minutesToRead} minute read`;
    }

    constructor(data: any) {
        // Convert author_id and category_id to numbers if they are strings
        data.author_id = Number(data.author_id);
        data.category_id = Number(data.category_id);
        // Validates the data against the Joi schema, values is the validated data
        const { error, value } = pageSchema.validate(data);

        // IF there is an error, throw an error with the message
        if (error) {
            throw new Error(
                `Page validation error: ${error.message}\nCurrent Value: ${data[error.name]}`,
            );
        }

        // Assign the validated values to the Page object
        this.id = value.id;
        this.title = value.title;
        this.priority = value.priority;
        this.content = value.content;
        this.discussion = value.discussion;
        this.is_private = value.is_private;
        this.date_created = value.date_created;
        this.date_modified = value.date_modified;
        this.category_id = value.category_id;
        this.author_id = value.author_id;
        this.name = value.name;
        this.has_publication = value.has_publication;
        this.is_kdd_only = value.is_kdd_only;
        this.last_updated = value.last_updated;
        this.is_home = value.is_home;
        this.is_template = value.is_template;
    }

    /**
     * Protects the page object from being modified when updating
     * @param page 
     */
    update(page: Page) {
        // this.id = page.id;
        this.title = page.title;
        this.priority = page.priority;
        this.content = page.content;
        this.discussion = page.discussion;
        this.is_private = page.is_private;
        this.date_modified = new Date();
        this.category_id = page.category_id;
        // this.author_id = page.author_id;
        this.name = page.name;
        this.has_publication = page.has_publication;
        this.is_kdd_only = page.is_kdd_only;
        this.last_updated = page.last_updated;
        this.is_home = page.is_home;
        this.is_template = page.is_template;
    }

    /**
     * Returns a JSON representation of the Page object
     */
    toJSON() {
        return {
            id: this.id,
            title: this.title,
            priority: this.priority,
            content: this.content,
            discussion: this.discussion,
            is_private: this.is_private,
            date_created: this.date_created,
            date_modified: this.date_modified,
            category_id: this.category_id,
            author_id: this.author_id,
            name: this.name,
            has_publication: this.has_publication,
            is_kdd_only: this.is_kdd_only,
            last_updated: this.last_updated,
            is_home: this.is_home,
            is_template: this.is_template,
        };
    }
}

export default Page;

