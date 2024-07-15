import joi from "joi";

// Joi schema for nav_item validation
const navItemSchema = joi.object({
    id: joi.number().required(),
    title: joi.string().required(),
    url: joi.string().required(),
});

class NavItem {
    id: number;
    title: string;
    url: string;

    constructor(data: any) {
        // Validates the data against the Joi schema, values is the validated data
        const { error, value } = navItemSchema.validate(data);

        // IF there is an error, throw an error with the message
        if (error) {
            throw new Error(`NavItem validation error: ${error.message}`);
        }

        // Assign the validated values to the NavItem object
        this.id = value.id;
        this.title = value.title;
        this.url = value.url;
    }

    toJSON() {
        return {
            id: this.id,
            title: this.title,
            url: this.url,
        };
    }
}

export default NavItem;