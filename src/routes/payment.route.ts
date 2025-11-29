import { Router } from "express";
import { GetnetAuthService } from "../service/Getnet-authService";

const paymentRouter = Router();

paymentRouter.get("/getnet/token", async (req, res) => {
  try {
    const token = await GetnetAuthService.getToken();
    return res.json({ token });
  } catch (err: any) {
    console.error(err);
    return res.status(500).json({
      error: "Erro ao gerar token",
      message: err.response?.data || err.message,
    });
  }
});

export default paymentRouter;
