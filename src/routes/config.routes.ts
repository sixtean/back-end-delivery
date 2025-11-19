// src/routes/companyConfig.routes.ts
import { Router } from "express";
import { CompanyConfigController } from "../controllers/ConfigController";
import { AuthMiddleware } from "../middleware/authMiddleware";

const configRouter = Router();
const authenticateMiddleware = new AuthMiddleware();

configRouter.get("/",
    authenticateMiddleware.authenticateToken.bind(authenticateMiddleware),
    CompanyConfigController.get
);

configRouter.put("/update",
    authenticateMiddleware.authenticateToken.bind(authenticateMiddleware),
    CompanyConfigController.update
);

export default configRouter;
