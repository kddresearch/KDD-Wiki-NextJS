import { fetchById, fetchByUsername } from "@/db/wiki_user";
import { WikiUser } from "@/models/wikiuser";
import KddUser from "../models/kdd_user";

export const fetchUser = async (identifier: string, authUser: any): Promise<WikiUser | null> => {
    try {
        if (identifier === "self") {
            if (authUser.username) {
                const user = await fetchByUsername(authUser.username);
                return user || WikiUser.newUserFactory(authUser.username);
            }
            return null;
        }

        const isNumber = !isNaN(parseInt(identifier));
        let user;

        if (isNumber) {
            user = await fetchById(parseInt(identifier));
        } else {
            user = await fetchByUsername(identifier);
        }
        return user;
    } catch (err) {
        console.error("Error occurred during fetchUser:", err);
        throw err;
    }
};