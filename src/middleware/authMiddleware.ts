import { Request, Response, NextFunction } from "express"; 
import { Token } from "../utils/jsonwebtoken";

export interface AuthRequest extends Request {
    user?: any;
}

export class AuthMiddleware {
    public authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
        const tokenInstance = new Token();
        try {
            const accessToken =
                req.cookies.accessToken ||
                req.headers.authorization?.split(' ')[1];

            if (!accessToken) {
                return res.status(401).json({
                    success: false,
                    message: 'Token de acesso não fornecido'
                });
            }

            const decoded = tokenInstance.verifyAccessToken(accessToken);
            if(!decoded) {
                return res.status(403).json({
                    success: false,
                    message: 'Token de acesso inválido ou expirado'
                });
            }
            req.user = decoded;
            next();
        } catch (error) {
            return res.status(403).json({
                success: false,
                message: 'Token inválido'
            });
        }
    }
}