import { NextRequest, NextResponse } from "next/server";
import WikiUser from "../models/wikiuser";
import rCategory from "../models/rcategory";
import rCategoryMember from "../models/rcategory_member";
import { BlobStorageError } from "../files";

/**
 * Sanitizes errors for API responses
 */
function handleAPIError(err: any): [ { error: string }, { status: number } ] {

    console.error("API Error", err);

    if (err instanceof BlobStorageError) {
        return [ { error: err.message }, { status: err.statusCode } ];
    }

    if (err.hasOwnProperty('status') && err.hasOwnProperty('message'))
        return [ { error: err["message"] }, { status: err["status"] } ];

    return [ { error: "An error occurred"}, { status: 500 } ];
}

async function bodyParser<T extends new (...args: any[]) => any>(
    req: NextRequest,
    ModelClass: T
): Promise<InstanceType<T>> {
    try {
        const json = await req.json();
        const instance = new ModelClass(json);
        return instance;
    } catch (err) {

        if (err instanceof SyntaxError) {
            console.error('Error occurred during bodyParser:', err);
            throw { status: 400, message: 'Invalid JSON in request body' };
        }

        console.error('Error occurred during bodyParser:', err);
        throw { status: 400, message: `Invalid request body of type: ${ModelClass.name}` };
    }
}

export {
    handleAPIError,
    bodyParser
};