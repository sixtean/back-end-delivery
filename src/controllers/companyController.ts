import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { CompanyService } from "../service/companyService";

export const companyController = {
    async getProfile(req: AuthRequest, res: Response) {
        try {
            console.clear();
            const companyId = Number(req.user?.companyId);
            const company = await CompanyService.getProfile(companyId);
            return res.json({
                success: true,
                company: {
                    id: company.id,
                    name: company.name,
                    createdAt: company.created_at,
                    updatedAt: company.updated_at,
                    users: company.users,
                    orders: company.orders,
                }
            });
        } catch (error: any) {
            console.error(error);
            return res.status(500).json({ success: false, message: error.message });
        }
    }
}