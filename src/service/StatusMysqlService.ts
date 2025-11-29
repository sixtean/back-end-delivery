import { Connection } from "../data/Data-Source";
import { QueryRunner } from "typeorm";

export class StatusMysql {
    static async getStatus() {
        console.log("\n------ [SERVICE] StatusMysql.getStatus() ------");

        let queryRunner: QueryRunner;
        try {
            queryRunner = Connection.createQueryRunner();
            console.log("🔵 Criando conexão com QueryRunner...");
            await queryRunner.connect();
            console.log("🟢 QueryRunner conectado.");

            console.log("🔵 Executando SHOW STATUS...");
            const connections = await queryRunner.query(
                `SHOW STATUS LIKE 'Threads_connected'`
            );
            console.log("➡️ Threads_connected:", connections);

            console.log("🔵 Executando SHOW GLOBAL STATUS Questions...");
            const qpsQueries = await queryRunner.query(
                `SHOW GLOBAL STATUS LIKE 'Questions'`
            );
            console.log("➡️ Questions:", qpsQueries);

            console.log("🔵 Executando SHOW GLOBAL STATUS Uptime...");
            const uptime = await queryRunner.query(
                `SHOW GLOBAL STATUS LIKE 'Uptime'`
            );
            console.log("➡️ Uptime:", uptime);

            const connectionsActive = Number(connections[0]?.Value ?? 0);
            const totalQuestions = Number(qpsQueries?.[0]?.Value ?? 0);
            const totalUptime = Number(uptime?.[0]?.Value ?? 1);
            const queriesPerSecond = Math.round(totalQuestions / totalUptime);

            console.log("🟢 Dados processados:");
            console.log({
                connectionsActive,
                totalQuestions,
                totalUptime,
                queriesPerSecond,
            });

            await queryRunner.release();
            console.log("🟢 QueryRunner finalizado.");
            console.log("------------------------------------------------\n");

            return {
                status: 'Online',
                connections_active: connectionsActive,
                queries_per_second: queriesPerSecond,
                uptime_seconds: totalUptime
            };
        } catch (err) {
            console.error("❌ [ERRO NO SERVICE StatusMysql.getStatus]");
            console.error(err);

            console.log("------------------------------------------------\n");

            return {
                status: 'Offiline',
                connections_active: 0,
                queries_per_second: 0,
                uptime_seconds: 0
            };
        }
    }
}