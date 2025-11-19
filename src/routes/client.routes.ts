import { Router } from "express";
import { RegisterClient } from "../controllers/Client/registerController";
import { LoginClientController } from "../controllers/Client/loginController";

const ClientRouter = Router();

ClientRouter.post('/register', RegisterClient.RegisterYouClient);
ClientRouter.post("/login", LoginClientController.login);


export default ClientRouter;