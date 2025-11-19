import { Request, Response } from "express";
import { AuthService } from "../service/AuthService";
import { Token } from "../utils/jsonwebtoken";

const authService = new AuthService();

export class AuthController {
  public async loginCompanyById(req: Request, res: Response) {
    try {
      const result = await authService.loginCompany(req.body);

      // Salva cookies
      res.cookie("accessToken", result.accessToken, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 30 * 60 * 1000, // 30min
      });

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        sameSite: "lax",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
      });

      return res.status(200).json({
        success: true,
        accessToken: result.accessToken,
        company: result.company,
      });
    } catch (error: any) {
      return res.status(error.status || 400).json({
        success: false,
        message: error.message || "Erro ao realizar login",
      });
    }
  }

  public async refresh(req: Request, res: Response) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res.status(400).json({ success: false, message: "Refresh token ausente." });
    }

    try {
      const newTokens = Token.refresh(refreshToken);
      if (!newTokens) throw new Error("Refresh token inválido ou expirado.");

      // Regrava cookies atualizados
      res.cookie("accessToken", newTokens.accessToken, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 30 * 60 * 1000,
      });

      res.cookie("refreshToken", newTokens.refreshToken, {
        httpOnly: true,
        sameSite: "strict",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      return res.status(200).json({
        success: true,
        message: "Tokens atualizados com sucesso!",
      });
    } catch (error) {
      console.error("Erro ao atualizar token:", error);
      return res.status(401).json({ success: false, message: "Token expirado ou inválido." });
    }
  }
}