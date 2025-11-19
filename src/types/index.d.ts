declare namespace Express {
    export interface Request{
        user?: {
            companyId: number;
        };
    }
}