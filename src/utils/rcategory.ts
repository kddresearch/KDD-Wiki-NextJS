import { fetchById, fetchByName } from "@/db/rcategory";
import rCategory from "../models/rcategory";
import { fetchByCategoryId } from "../db/rcategory_member";

export const fetchrCategory = async (identifier: string): Promise<rCategory | null> => {
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
};