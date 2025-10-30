import { Request, Response, NextFunction } from "express"; 
import { verifyAccessToken } from "../utils/jsonwebtoken";

export interface AuthRequest extends Request {
    user?: any;
}

export function authenticateToken(req: AuthRequest, res: Response, next: NextFunction) {
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

        const decoded = verifyAccessToken(accessToken);
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