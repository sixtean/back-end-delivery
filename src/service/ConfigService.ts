// src/services/CompanyConfigService.ts
import { Connection } from "../data/Data-Source";
import { Company } from "../models/Company";
import { SistemConfig } from "../models/SistemConfigs";

export class CompanyConfigService {
private configRepo = Connection.getRepository(SistemConfig);
  private companyRepo = Connection.getRepository(Company);


  async getConfig(companyId: number) {
    let config = await this.configRepo.findOne({
      where: { company: { id: companyId } }
    });

    if (!config) {
      const company = await this.companyRepo.findOneBy({ id: companyId });

      if (!company) throw new Error("Empresa não encontrada");

      config = this.configRepo.create({
        company,
        settings: {},
      });

      await this.configRepo.save(config);
    }

    return config;
  }

    async updateConfig(companyId: number, newSettings: any) {
        const config = await this.getConfig(companyId);

        config.settings = {
            ...config.settings,
            ...newSettings
        };

        return await this.configRepo.save(config);
    }
}