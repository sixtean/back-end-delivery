import { Router } from "express";
import { companyController } from "../controllers/companyController";
import { authenticateToken } from "../middleware/authMiddleware";

const companyRouter = Router();

companyRouter.get("/profile", authenticateToken, companyController.getProfile);

export default companyRouter;