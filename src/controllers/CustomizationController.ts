import { Request, Response } from "express";
import { CustomizationService } from "../service/CustomizationService";

const service = new CustomizationService();

interface MulterFiles {
  [fieldname: string]: Express.Multer.File[];
}

export class CustomizationController {
  // Para o site: pega companyId do token
  async getCompany(req: Request, res: Response) {
    try {
      const companyId = (req as any).companyId;
      const customization = await service.getCustomization(companyId);
      res.json(customization);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  async get(req: Request, res: Response) {
    try {
      const companyId = Number(req.params.companyId);
      const customization = await service.getCustomization(companyId);
      res.json(customization);
    } catch (err: any) {
      res.status(500).json({ message: err.message });
    }
  }

  async update(req: Request, res: Response) {
    try {
      const companyId = (req as any).companyId;
      const { primaryColor, secondaryColor, tertiaryColor } = req.body;

      const files = req.files as MulterFiles | undefined;

      let logoFile: Express.Multer.File | undefined = undefined;
      if (files?.logo && files.logo.length > 0) {
        logoFile = files.logo[0];
      }

      let adsFiles: Express.Multer.File[] | undefined = undefined;
      if (files?.ads && files.ads.length > 0) {
        adsFiles = files.ads.slice(0, 3);
      }

      const customization = await service.updateCustomization({
        companyId,
        primaryColor,
        secondaryColor,
        tertiaryColor,
        logoFile,
        adsFiles,
      });

      res.json(customization);
    } catch (err: any) {
      console.error(err);
      res.status(500).json({ message: err.message });
    }
  }
}