import { Request, Response, NextFunction } from "express";
import { Token, CompanyJwtPayload } from "../utils/jsonwebtoken";

export interface AuthRequest extends Request {
  user?: CompanyJwtPayload;
}

export class AuthMiddleware {
  public authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
    const tokenInstance = new Token();

    try {
      const accessToken =
        req.cookies.accessToken ||
        req.headers.authorization?.split(" ")[1];

      if (!accessToken) {
        return res.status(401).json({
          success: false,
          message: "Token de acesso não fornecido",
        });
      }

      const decoded = tokenInstance.verifyAccessToken(accessToken);
      if (!decoded || !decoded.companyId) {
        return res.status(403).json({
          success: false,
          message: "Token inválido ou sem companyId",
        });
      }

      req.user = decoded;
      next();
    } catch (error) {
      console.error("Erro ao autenticar token:", error);
      return res.status(403).json({
        success: false,
        message: "Token inválido",
      });
    }
  }
}