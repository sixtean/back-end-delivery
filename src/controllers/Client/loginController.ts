import { Request, Response } from "express";
import { LoginClientService } from "../../service/Client/loginService";

export const LoginClientController = {
  async login(req: Request, res: Response) {
    try {
      const { name, password, companyId } = req.body;

      if (!name || !password || !companyId) {
        return res.status(400).json({
          success: false,
          message: "Preencha todos os campos.",
        });
      }

      const result = await LoginClientService.login({ name, password, companyId });

      return res.status(result.success ? 200 : 401).json(result);
    } catch (error) {
      console.error("❌ Erro no loginController:", error);
      return res.status(500).json({
        success: false,
        message: "Erro interno no servidor.",
      });
    }
  },
};