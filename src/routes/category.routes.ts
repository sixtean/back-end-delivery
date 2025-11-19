import { Router } from "express";
import { CategoryController } from "../controllers/CtegoryController";

const categoryController = new CategoryController();
const categoryRoutes= Router();

categoryRoutes.post("/", categoryController.create);
categoryRoutes.get("/", categoryController.list);
categoryRoutes.post("/add-product", categoryController.addProduct);
categoryRoutes.get("/:categoryId/products", categoryController.listProducts);

export default categoryRoutes;
