import { prisma } from "../../../config/db";
import { Prisma, Post } from "../../../generated/prisma/client";


const createCategory = async (payload: Prisma.PostCreateInput): Promise<Post> => {
    const result = await prisma.post.create({
        data: payload,
        include: {
            author: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        }
    })

    return result;
}

export const CategoryService = {
    createCategory,
    // getAllPosts,
    // getPostById,
    // updatePost,
    // deletePost,
    // getBlogStat
}