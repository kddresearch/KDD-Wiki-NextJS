import { z, ZodTypeAny, ZodObject, ZodOptional, ZodDiscriminatedUnion } from "zod";

/**
 * Recursively traverses a Zod schema to extract all possible configuration paths.
 * @param schema The Zod schema to traverse.
 * @param parentPath The accumulated path from parent traversals.
 * @returns An array of paths, where each path is an array of strings representing the keys.
 */
function extractSchemaPaths(schema: ZodTypeAny, parentPath: string[] = []): string[][] {
    if (schema instanceof ZodObject) {
        const shape = schema.shape;
        let paths: string[][] = [];

        for (const key in shape) {
            const newPath = [...parentPath, key];
            const field = shape[key];

            if (field instanceof ZodOptional) {
                paths = paths.concat(extractSchemaPaths(field.unwrap(), newPath));
            } else if (
                field instanceof ZodObject ||
                field instanceof ZodDiscriminatedUnion
            ) {
                paths = paths.concat(extractSchemaPaths(field, newPath));
            } else {
                paths.push(newPath);
            }
        }

        return paths;
    } else if (schema instanceof ZodDiscriminatedUnion) {
        let paths: string[][] = [];
        for (const option of schema.options) {
            paths = paths.concat(extractSchemaPaths(option, parentPath));
        }
        return paths;
    } else {
        // Primitive types
        return [parentPath];
    }
}

export {
    extractSchemaPaths
}