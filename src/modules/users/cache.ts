import { redis } from "bun";

const getUserCacheKey = (key: string) =>  `user:${key}`;
export const createUserCache = async (userId: string) => {
    try {
        let user = await getUserCache(userId);
        if (user) {
            return user;
        }
        user = await redis.set(getUserCacheKey(userId), userId);
        return user;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

export const getUserCache = async (userId: string) => {
    try {
        const user = await redis.get(getUserCacheKey(userId));
        return user;
    } catch (error) {
        console.error(error);
        throw error;
    }
}