import { Response } from "express";
import { ProductService } from "../service/productService";
import { AuthRequest } from "../middleware/authMiddleware";

const productService = new ProductService();

export class ProductController {
  static async create(req: AuthRequest, res: Response) {
    try {
      const companyId = req.user?.companyId || Number(req.body.companyId);
      if (!companyId)
        return res.status(403).json({ message: "Empresa não identificada" });

      const { name, description, price, stock, categoryId } = req.body;

      if (!name || !price || !stock) {
        return res.status(400).json({ message: "Campos obrigatórios faltando" });
      }

      const files = req.files as Express.Multer.File[] | undefined;

      const product = await productService.createProduct(
        {
          companyId,
          name,
          description,
          price: Number(price),
          stock: Number(stock),
          categoryId: categoryId ? Number(categoryId) : undefined,
        },
        files
      );

      return res.status(201).json({
        message: "✅ Produto criado com sucesso!",
        product
      });
    } catch (err: any) {
      console.error("❌ Erro ao criar produto:", err);
      return res
        .status(500)
        .json({ error: err.message || "Erro ao criar produto" });
    }
  }

  static async getAll(req: AuthRequest, res: Response) {
    try {
      const companyId = req.user?.companyId || Number(req.query.companyId);
      if (!companyId || isNaN(companyId)) {
        return res.status(403).json({ message: "Empresa não identificada" });
      }

      const products = await productService.getProducts(companyId);
      return res.status(200).json(products);
    } catch (err: any) {
      console.error("❌ Erro ao listar produtos:", err);
      return res
        .status(500)
        .json({ error: err.message || "Erro ao listar produtos" });
    }
  }

  static async update(req: AuthRequest, res: Response) {
    try {
      const id = Number(req.params.id);
      if (!id)
        return res
          .status(400)
          .json({ message: "ID do produto é obrigatório." });

      const files = req.files as Express.Multer.File[] | undefined;

      const updatedProduct = await productService.updateProduct(
        id,
        req.body,
        files
      );

      return res.status(200).json({
        message: "✅ Produto atualizado com sucesso!",
        product: updatedProduct,
      });
    } catch (err: any) {
      console.error("❌ Erro ao atualizar produto:", err);
      return res
        .status(500)
        .json({ error: err.message || "Erro ao atualizar produto" });
    }
  }

  static async delete(req: AuthRequest, res: Response) {
    try {
      const id = Number(req.params.id);
      if (!id)
        return res
          .status(400)
          .json({ message: "ID do produto obrigatório" });

      await productService.deleteProduct(id);

      return res
        .status(200)
        .json({ message: "🗑️ Produto excluído com sucesso!" });
    } catch (err: any) {
      console.error("❌ Erro ao excluir produto:", err);
      return res
        .status(500)
        .json({ error: err.message || "Erro ao excluir produto" });
    }
  }
}