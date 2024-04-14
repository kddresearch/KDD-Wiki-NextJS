import { fetchById, fetchByName } from "../db/_page";
import Page from "../models/_page";


async function fetchPage(identifier: string): Promise<Page | null> {
    try {
        const isNumber = !isNaN(parseInt(identifier));
        let rcategory;

        if (isNumber) {
            rcategory = await fetchById(parseInt(identifier));
        } else {

            if (identifier === "members") {
                return null;
            }

            rcategory = await fetchByName(identifier);
        }

        return rcategory;
    } catch (err) {
        console.error("Error occurred during fetchrCategory:", err);
        throw err;
    }
}

export { fetchPage }