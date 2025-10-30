import { Request, Response } from "express";
import { AuthService } from "../service/AuthService";
import { verifyRefreshToken ,generateTokens } from "../utils/jsonwebtoken";

const authService = new AuthService();

export class AuthController {
  async loginCompanyById(req: Request, res: Response) {
    try {
      const result = await authService.loginCompany(req.body);

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        success: true,
        accessToken: result.accessToken,
        company: result.company,
      });
    } catch (error: any) {
      const status = error.message === "Senha incorreta." ? 401 : 400;
      return res.status(status).json({
        success: false,
        message: error.message
      });
    }
  }

  static async refresh(req: Request, res: Response) {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(400).json({ success: false, message: "Refresh token ausente." });
    }

    try {
      const decoded = verifyRefreshToken(token);
      if (!decoded) throw new Error("Refresh token inválido.");

      const newtokens = generateTokens({ id: decoded.id, name: decoded.name, companyId: decoded.companyId });

      res.cookie("refreshToken", newtokens.refreshToken, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        success: true,
        message: "Tokens atualizados com sucesso!",
        acessToken: newtokens.accessToken,
      });
    } catch (error) {
      console.error("Erro ao atualizar token:", error);
      return res.status(401).json({ success: false, message: "Token expirado ou inválido." });
    }
  }
}