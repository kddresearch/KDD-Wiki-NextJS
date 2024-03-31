import joi from 'joi';


// Joi schema for custom_url validation
const customUrlSchema = joi.object({
    id: joi.number().integer().min(0).optional(),
    url: joi.string().max(50).required(),
    action: joi.string().valid('pg', 'rd').required(),
    target: joi.alternatives().try(
        joi.number().integer().min(0),
        joi.string().uri()
    ).required(),
    date_created: joi.date().required(),
    date_modified: joi.date().required(),
    author_id: joi.number().integer().min(0).required()
});

class CustomUrl {
    id?: number;
    url: string;
    action: 'pg' | 'rd';
    target: string | number;

    // metadata
    date_created: Date;
    date_modified: Date;
    author_id: number;

    constructor(data: any)
    {
        // Convert author_id to number
        data.author_id = Number(data.author_id);

        // if date_created is not provided, set it to the current date
        if (!data.date_created) {
            data.date_created = new Date();
        }

        // if date_modified is not provided, set it to the current date
        if (!data.date_modified) {
            data.date_modified = new Date();
        }

        const { error, value } = customUrlSchema.validate(data);

        // IF there is an error, throw an error with the message
        if (error) {
            throw new Error(`CustomUrl validation error: ${error.message}\nCurrent Value: ${data[error.name]}`);
        }

        // Assign the validated values to the CustomUrl object
        this.id = value.id;
        this.url = value.url;
        this.action = value.action;
        this.target = value.target;

        // metadata
        this.date_created = value.date_created;
        this.date_modified = value.date_modified;
        this.author_id = value.author_id;
    }
}

export default CustomUrl;