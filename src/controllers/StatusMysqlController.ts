import { Request, Response } from "express";
import { StatusMysql } from "../service/StatusMysqlService";
import { Connection } from "../data/Data-Source";
export class statusMysqlController {
    
    static async status( req: Request, res: Response ) {
        console.log("\n========== [CONTROLLER] /zoryon/status ==========");
        console.log("📌 Método:", req.method);
        console.log("📌 URL:", req.originalUrl);
        console.log("📌 IP:", req.ip);

        try{
            console.log("🔵 Testando conexão com DB (SELECT 1)");
            const start = Date.now();
            await Connection.query("SELECT 1");
            const ping = Date.now() - start;
            console.log(`🟢 DB respondeu em ${ping} ms`);

            console.log("🔵 Buscando status detalhado do DB...");
            const dbStatus = await StatusMysql.getStatus();
            console.log("🟢 Status do DB obtido:", dbStatus);

            const total = Date.now() - start;
            console.log(`🟢 Requisição finalizada em ${total} ms`);
            console.log("=================================================\n");

            return res.status(200).json({
                ...dbStatus,
                ping_ms: ping
            });

        } catch (err) {
            console.error("\n❌ [ERRO NO CONTROLLER /zoryon/status]");
            console.error(err);
            console.log("=================================================\n");
            return res.status(500).json({
                status: 'Offline',
                error: 'Erro ao obter status do banco de dados',
                ping_ms: 999
            });
        }
    }
}