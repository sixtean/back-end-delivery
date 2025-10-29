import { Request, Response } from "express";
import { AuthService } from "../service/AuthService";
import jwt from "jsonwebtoken";
import { generateTokens } from "../utils/jsonwebtoken";

const authService = new AuthService();

export class AuthController {
  async login(req: Request, res: Response) {
    try {
      const result = await authService.login(req.body);
      return res.status(200).json(result);
    } catch (error: any) {
      console.error("Erro no login:", error);
      return res.status(400).json({ message: error.message });
    }
  }

  async loginCompanyById(req: Request, res: Response) {
    try {
      const result = await authService.loginCompany(req.body);
      return res.status(200).json(result);
    } catch (error: any) {
      const status = error.message === "Senha incorreta." ? 401 : 400;
      return res.status(status).json({
        success: false,
        message: error.message
      });
    }
  }

  static async refresh(req: Request, res: Response) {
    try {
      const { refreshToken } = req.body;

      if (!refreshToken) {
        return res.status(400).json({ success: false, message: "Refresh token ausente." });
      }

      // Verifica o refresh token
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!);

      if (!decoded || typeof decoded !== "object") {
        return res.status(401).json({ success: false, message: "Refresh token inválido." });
      }

      // Gera novos tokens com base no payload original
      const newTokens = generateTokens({ id: decoded.id });

      return res.status(200).json({
        success: true,
        message: "Tokens atualizados com sucesso!",
        ...newTokens,
      });
    } catch (error) {
      console.error("Erro ao atualizar token:", error);
      return res.status(401).json({ success: false, message: "Token expirado ou inválido." });
    }
  }
}