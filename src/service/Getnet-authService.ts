import axios from 'axios';
import { getnetConfig } from '../config/getnet.config';
import { toBase64 } from '../utils/base64';

export class GetnetAuthService {
    private static accessToken: string | null = null;
    private static expiresAt: number | null = null;

    static async getToken(): Promise<string> {
        const now = Date.now();

        if(this.accessToken && this.expiresAt && now < this.expiresAt) {
            return this.accessToken;
        }

        await this.generateToken();
        return this.accessToken!;
    }

    private static async generateToken(): Promise<void> {
        const { clientId, clientSecret, baseUrl, authEndpoint } = getnetConfig;

        const authBase64 = toBase64(`${clientId}:${clientSecret}`);

        const body = new URLSearchParams();
        body.append("grant_type", "client_credentials");

        const { data } = await axios.post(
            `${baseUrl}${authEndpoint}`,
            body.toString(),
            {
                headers: {
                    Authorization: `Basic ${authBase64}`,
                    "Content-Type": "application/x-www-form-urlencoded",
                }
            }
        );

        this.accessToken = data.access_token;
        this.expiresAt = Date.now() + data.expires_in * 1000;

        console.log("novo token Getnet gerado com sucesso!");
    }
}