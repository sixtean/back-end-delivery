import { Router } from "express";
import { companyController } from "../controllers/companyController";
import { StatusMysqlController } from "../controllers/StatusMysqlController";

const ZoryonRouter = Router();
const StatusMysql = new StatusMysqlController();

ZoryonRouter.get("/", companyController.listAll);
ZoryonRouter.post("/", companyController.create);
ZoryonRouter.delete("/:id", companyController.delete);
ZoryonRouter.get('/status', (req, res) => StatusMysql.status(req, res));

export default ZoryonRouter;