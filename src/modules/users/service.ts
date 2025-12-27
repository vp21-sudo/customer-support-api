import { createUserCache, getUserCache } from "./cache";


export const createUser = async () => {
    try {
        const userId = crypto.randomUUID(); 
        await createUserCache(userId);
        return userId;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const getUser = async (userId: string) => {
    try {
        const user = await getUserCache(userId);
        if (!user) {
            throw new Error("User not found");
        }
        return user;
    } catch (error) {
        console.error(error);
        throw error;
    }
}