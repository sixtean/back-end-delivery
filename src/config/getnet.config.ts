export const getnetConfig = {
    sandBox: true,

    clientId: process.env.GETNET_CLIENT_ID,
    clientSecret: process.env.GETNET_CLIENT_SECRET,
    sellerId: process.env.GETNET_SELLER_ID,

    get baseUrl() {
        return this.sandBox
            ? "https://api-sbx.pre.globalgetnet.com"
            : "https://api.pre.globalgetnet.com";
    },

    authEndpoint: "/authentication/oauth2/access_token",
}