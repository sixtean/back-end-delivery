import { Response } from "express";
import { AuthRequest } from "../middleware/authMiddleware";
import { CompanyConfigService } from "../service/ConfigService";

const service = new CompanyConfigService();

export class CompanyConfigController {
  static async get(req: AuthRequest, res: Response) {
    try {
      const companyId = req.user?.companyId || Number(req.body.companyId);
      const data = await service.getConfig(companyId);

      return res.json({
        success: true,
        settings: data.settings,
      });
    } catch (error: any) {
      return res.status(500).json({ error: error.message });
    }
  }

    static async update(req: AuthRequest, res: Response) {
        try {
            const companyId = req.user?.companyId || Number(req.body.companyId); 
            const newSettings = req.body;

            const updated = await service.updateConfig(companyId, newSettings);

            return res.json({
                success: true,
                settings: updated.settings
            });
        } catch (error: any) {
            console.log("🟥 BACK ERROR:", error);
            return res.status(500).json({ error: error.message });
        }
    }
}