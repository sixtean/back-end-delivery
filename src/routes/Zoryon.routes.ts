import { Router } from "express";
import { companyController } from "../controllers/companyController";
import { statusMysqlController } from "../controllers/StatusMysqlController";

const ZoryonRouter = Router();


ZoryonRouter.get("/", companyController.listAll);
ZoryonRouter.post("/", companyController.create);
ZoryonRouter.delete("/:id", companyController.delete);
ZoryonRouter.get('/status', statusMysqlController.status);

export default ZoryonRouter;