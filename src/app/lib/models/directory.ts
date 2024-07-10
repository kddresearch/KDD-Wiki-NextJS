import Joi from "joi";
import { List } from "postcss/lib/list";
import rPage from "./rpage";

// Joi schema for directory validation
const directorySchema = Joi.object({
    id: Joi.number().integer().min(0),
    created_at: Joi.date().required(),
    modified_at: Joi.date().required(),
    title: Joi.string().max(255).required(),
    type: Joi.string().valid('directory').optional(),
    children: Joi.array().items(Joi.object().unknown(true)) // Correctly define the children array
});

class Directory {
    id: number;
    created_at: Date;
    modified_at: Date;
    title: string;
    children: (Directory | rPage)[]; // Correctly type the children property

    constructor(data: any) {
        // Validates the data against the Joi schema, values is the validated data
        const { error, value } = directorySchema.validate(data);

        // If there is an error, throw an error with the message
        if (error) {
            throw new Error(`Directory validation error: ${error.message}\nCurrent Value: ${JSON.stringify(data)}`);
        }

        // Assign the validated values to the Directory object
        this.id = value.id;
        this.created_at = new Date(value.created_at);
        this.modified_at = new Date(value.modified_at);
        this.title = value.title;
        this.children = []; // Initialize the children property
    }

    /**
     * Update the directory with the new directory data
     */
    update(directory: Directory) {
        this.title = directory.title;
        this.modified_at = new Date(); // Update the modified_at field to the current date/time
    }
}

export default Directory;
