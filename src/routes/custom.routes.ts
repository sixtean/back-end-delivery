import { Router } from "express";
import { CustomizationController } from "../controllers/CustomizationController";
import { AuthMiddleware } from "../middleware/authMiddleware";
import { upload } from "../utils/uploads";

const customRouter = Router();
const authenticateMiddleware = new AuthMiddleware();
const controller = new CustomizationController();

customRouter.get(
  "/company",
  authenticateMiddleware.authenticateToken.bind(authenticateMiddleware),
  (req, res) => controller.getCompany(req, res)
);

customRouter.get("/:companyId", (req, res) => controller.get(req, res));

customRouter.put(
  "/",
  authenticateMiddleware.authenticateToken.bind(authenticateMiddleware),
  upload.fields([
    { name: "logo", maxCount: 1 },
    { name: "ads", maxCount: 3 },
  ]),
  (req, res) => controller.update(req, res)
);

export default customRouter;