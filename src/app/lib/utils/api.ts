import { NextRequest, NextResponse } from "next/server";
import WikiUser from "../models/wikiuser";
import KddUser from "../models/kdd_user";
import rCategory from "../models/rcategory";
import rCategoryMember from "../models/rcategory_member";
import { BlobStorageError } from "../files";

/**
 * Sanitizes errors for API responses
 */
function handleAPIError(err: any): [ { error: string }, { status: number } ] {

    console.error(err);

    if (err instanceof BlobStorageError) {
        return [ { error: err.message }, { status: err.statusCode } ];
    }

    if (err.hasOwnProperty('status') && err.hasOwnProperty('message'))
        return [ { error: err["message"] }, { status: err["status"] } ];

    return [ { error: "An error occurred"}, { status: 500 } ];
}

async function bodyParser(req: NextRequest, schema?: any) {
  const body = await req.json();

  if (schema) {
    const { error, value } = schema.validate(body, { abortEarly: false });
    if (error) {
      throw { status: 400, message: `Validation error: ${error.message}` };
    }
    return value;
  }

  return body;
}


export {
    handleAPIError,
    bodyParser
};