import { Request, Response } from "express";
import { ClientRegisterService } from "../../service/Client/registerService";

export class RegisterClient {
    static async RegisterYouClient(req: Request, res: Response) {
        const userService = new ClientRegisterService();

        try {
            const { name, password, companyId } = req.body;
            const user = await userService.register(name, password, companyId);

            return res.status(201).json({
                success: true,
                message: "Usuário registrado com sucesso!",
                user,
            });
        } catch (error: any) {
            return res.status(400).json({ message: error.message });
        }

    }
}