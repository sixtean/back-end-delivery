import { Request, Response } from "express";
import { StatusMysql } from "../service/StatusMysqlService";
import { Connection } from "../data/Data-Source";

export class StatusMysqlController {
    async status(req: Request, res: Response) {
        try{
            const start = Date.now();
            await Connection.query("SELECT 1");
            const ping = Date.now() - start;

            const dbStatus = await StatusMysql.getStatus();

            return res.status(200).json({
                ...dbStatus,
                ping_ms: ping
            });
        } catch (err) {
            console.error(err);
            return res.status(500).json({
                status: 'Offline',
                error: 'Erro ao obter status do banco de dados',
                ping_ms: 999
            });
        }
    }
}