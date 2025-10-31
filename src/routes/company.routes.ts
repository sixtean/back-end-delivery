import { Router } from "express";
import { companyController } from "../controllers/companyController";
import { AuthMiddleware } from "../middleware/authMiddleware";

const companyRouter = Router();
const authenticateMiddleware =  new AuthMiddleware();

companyRouter.get("/profile", authenticateMiddleware.authenticateToken.bind(authenticateMiddleware), companyController.getProfile);

export default companyRouter;