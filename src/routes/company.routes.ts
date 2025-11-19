import { Router } from "express";
import { companyController } from "../controllers/companyController";
import { AuthMiddleware } from "../middleware/authMiddleware";
import { ProductController } from "../controllers/productController";
import { upload } from "../utils/uploads";

const companyRouter = Router();
const authenticateMiddleware = new AuthMiddleware();

companyRouter.get(
  "/profile",
  authenticateMiddleware.authenticateToken.bind(authenticateMiddleware),
  companyController.getProfile
);

// Produtos
companyRouter.post(
  "/newproduct",
  authenticateMiddleware.authenticateToken.bind(authenticateMiddleware),
  upload.array("image", 5),
  ProductController.create
);

companyRouter.get(
  "/products",
  authenticateMiddleware.authenticateToken.bind(authenticateMiddleware),
  ProductController.getAll
);

companyRouter.get(
    "/products/mobile",
    ProductController.getAll
);

companyRouter.put(
    "/updateproducts/:id",
    authenticateMiddleware.authenticateToken.bind(authenticateMiddleware),
    upload.array("image", 5),
    ProductController.update
);
companyRouter.delete(
    "/products/delete/:id",
    authenticateMiddleware.authenticateToken.bind(authenticateMiddleware),
    ProductController.delete
);

export default companyRouter;
