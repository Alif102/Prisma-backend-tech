import express from 'express';
import { CategoryController } from './category.controller';

const router = express.Router();


// router.get("/stats", PostController.getBlogStat)

router.post(
    "/",
    CategoryController.createCategory
)

// router.get("/", PostController.getAllPosts);
// router.get("/:id", PostController.getPostById);
// router.patch("/:id", PostController.updatePost);
// router.delete("/:id", PostController.deletePost);


export const CategoryRouter = router;