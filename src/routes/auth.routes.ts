import { Router } from "express";
import { AuthController } from "../controllers/AuthController";

const authRouter = Router();
const authController = new AuthController();

authRouter.post("/login-company", (req, res) => authController.loginCompanyById(req, res));
authRouter.post("/login", (req, res) => authController.login(req, res));
authRouter.post("/refresh", AuthController.refresh);

export default authRouter
