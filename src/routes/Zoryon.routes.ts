import { Router } from "express";
import { companyController } from "../controllers/companyController";
import { StatusMysqlController } from "../controllers/StatusMysqlController";

const ZoryonRouter = Router();

ZoryonRouter.get("/", companyController.listAll);
ZoryonRouter.post("/", companyController.create);
ZoryonRouter.delete("/:id", companyController.delete);
ZoryonRouter.get('/status', new StatusMysqlController().status);

export default ZoryonRouter;