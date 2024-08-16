import { z } from "zod";

export const priorityValues = [100, 200, 300, 400, 500, 600, 700, 800, 900, 1000];

export const legacyPageSchema = z.object({
    id: z.coerce.number().int().min(0),
    title: z.string().max(50).min(1),
    priority: z.coerce.number().int().min(0)
        .max(1000, { message: "Priority cannot be higher than 1000" })
        .refine(val => priorityValues.includes(val), { message: "Priority must be multiples of 100" }).default(1000),
    content: z.string().min(0),
    discussion: z.string().min(0).nullable(),
    is_private: z.boolean(),
    date_created: z.coerce.date(),
    date_modified: z.coerce.date(),
    category_id: z.number().int().min(0).nullable(),
    author_id: z.number().int().min(0),
    name: z.string().max(50).transform((val) => val ?? undefined).optional(),
    has_publication: z.boolean(),
    is_kdd_only: z.boolean(),
    last_updated: z.string().nullable(),
    is_home: z.boolean().nullable(),
    is_template: z.boolean().nullable(),
});

class Page {
    id: number;
    title: string;
    priority: number;
    content: string;
    discussion: string | null;
    is_private: boolean;
    date_created: Date;
    date_modified: Date;
    category_id: number | null;
    author_id: number;
    name: string | undefined;
    has_publication: boolean;
    is_kdd_only: boolean;
    last_updated: string | null;
    is_home: boolean | null;
    is_template: boolean | null;

    
    constructor(data: any) {
        const result = legacyPageSchema.safeParse(data);

        // IF there is an error, throw an error with the message
        if (!result.success) {
            throw new Error(`Invalid user data: ${JSON.stringify(result.error.errors)}`);
        }

        const value = result.data;

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
        // this.date_created = page.date_created;
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

