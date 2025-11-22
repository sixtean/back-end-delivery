import { Router } from "express";
import { companyController } from "../controllers/companyController";

const ZoryonRouter = Router();

ZoryonRouter.get("/", companyController.listAll);
ZoryonRouter.post("/", companyController.create);
ZoryonRouter.delete("/:id", companyController.delete);

export default ZoryonRouter;