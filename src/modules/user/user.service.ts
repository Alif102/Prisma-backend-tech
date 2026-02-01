import { prisma } from "../../../config/db";
import { Prisma, User } from "../../../generated/prisma/client";

const createUser = async (payload: Prisma.UserCreateInput): Promise<User> => {
  return prisma.user.create({
    data: payload,
  });
};

const getAllFromDB = async () => {
    const result = await prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            picture: true,
            createdAt: true,
            updatedAt: true,
            role: true,
            status: true,
            posts: true
        },
        orderBy: {
            createdAt: "desc"
        }
    });
    return result;
}

export const UserService = {
  createUser, getAllFromDB
};
