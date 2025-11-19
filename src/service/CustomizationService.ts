import { Connection } from "../data/Data-Source";
import { Customization } from "../models/Custom";
import { Company } from "../models/Company";
import fs from "fs";
import path from "path";

interface UpdateCustomizationDTO {
  companyId: number;
  primaryColor?: string;
  secondaryColor?: string;
  tertiaryColor?: string;
  logoFile?: Express.Multer.File;
  adsFiles?: Express.Multer.File[];
}

export class CustomizationService {
  private customizationRepo = Connection.getRepository(Customization);
  private companyRepo = Connection.getRepository(Company);

  async getCustomization(companyId: number) {
    const customization = await this.customizationRepo.findOne({ where: { companyId } });
    if (!customization) return null;


    return {
      ...customization,
      logo: customization.logo
        ? `uploads/logo/${path.basename(customization.logo)}`
        : undefined,
      ads: customization.ads?.length
        ? customization.ads.map(ad => `uploads/ads/${path.basename(ad)}`)
        : []
    };
  }

  async updateCustomization({
    companyId,
    primaryColor,
    secondaryColor,
    tertiaryColor,
    logoFile,
    adsFiles,
  }: UpdateCustomizationDTO) {

    let customization = await this.customizationRepo.findOne({ where: { companyId } });

    if (!customization) {
      const company = await this.companyRepo.findOne({ where: { id: companyId } });
      if (!company) throw new Error("Empresa não encontrada");
      customization = this.customizationRepo.create({ company });
    }

    // Atualiza cores
    if (primaryColor) customization.primaryColor = primaryColor;
    if (secondaryColor) customization.secondaryColor = secondaryColor;
    if (tertiaryColor) customization.tertiaryColor = tertiaryColor;

    // Atualiza logo
    if (logoFile) {
      if (customization.logo) {
        // remove logo antiga
        const oldLogoPath = path.join(__dirname, "..", "uploads", customization.logo);
        if (fs.existsSync(oldLogoPath)) fs.unlinkSync(oldLogoPath);
      }
      customization.logo = `logos/${logoFile.filename}`;
    }

    // Atualiza anúncios (até 3)
    if (adsFiles && adsFiles.length > 0) {
      if (customization.ads?.length) {
        customization.ads.forEach((ad) => {
          const adPath = path.join(__dirname, "..", "uploads", ad);
          if (fs.existsSync(adPath)) fs.unlinkSync(adPath);
        });
      }
      customization.ads = adsFiles.slice(0, 3).map(f => `ads/${f.filename}`);
    }

    return this.customizationRepo.save(customization);
  }
}