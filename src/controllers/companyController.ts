import { Response, Request } from "express-serve-static-core";
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
    },

    async listAll(req:Request, res: Response) {
        try {
            const companies = await CompanyService.listAll();
            return res.status(200).json({ companies });
        } catch (err: any) {
            return res.status(400).json({ error: err.message || 'Erro ao listar empresas.' });
        }
    },

    async create(req: Request<{}, {}, { name: string; password: string; billing_day: number }>, res: Response) {
        try {
            const { name, password, billing_day } = req.body;

            const created = await CompanyService.create({
                name,
                password,
                billing_day
            }); 
            return res.status(201).json(created);
        }  catch (err: any) {
            return res.status(400).json({ error: err.message });
        }
    },

    async delete(req: Request, res: Response) {
        try {
            const companyId = Number(req.params.id);
            const deleted = await CompanyService.delete(companyId);
            return res.status(200).json(deleted);
        } catch (err: any) {
            return res.status(400).json({ error: err.message });
        }
    }
}