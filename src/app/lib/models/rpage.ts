import Joi from "joi";

// Joi schema for page validation
const rPageSchema = Joi.object({
    id: Joi.number().required(),
    created_at: Joi.date().required(),
    modified_at: Joi.date().required(),
    title: Joi.string().required(),
    content: Joi.string().allow(null, ''),
    endpoint: Joi.string().allow(null, ''),
    page_type: Joi.string().valid('page', 'pointer').required()
});

class rPage {
    id: number;
    created_at: Date;
    modified_at: Date;
    title: string;
    content: string | null;
    endpoint: string | null;
    page_type: string;

    constructor(data: any) {
        const { error, value } = rPageSchema.validate(data);
        if (error) {
            throw new Error(`Page validation error: ${error.message}\nCurrent Value: ${JSON.stringify(data)}`);
        }
        this.id = value.id;
        this.created_at = new Date(value.created_at);
        this.modified_at = new Date(value.modified_at);
        this.title = value.title;
        this.content = value.content;
        this.endpoint = value.endpoint;
        this.page_type = value.page_type;
    }

    /**
     * Returns a JSON representation of the Page object
     */
    toJSON() {
        return {
            id: this.id,
            created_at: this.created_at,
            modified_at: this.modified_at,
            title: this.title,
            content: this.content,
            endpoint: this.endpoint,
            page_type: this.page_type
        };
    }
}

export default rPage;
