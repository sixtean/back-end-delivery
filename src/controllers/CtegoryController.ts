import { Request, Response } from "express";
import { CategoryService } from "../service/CategoryService";

const categoryService = new CategoryService();

export class CategoryController {
  async create(req: Request, res: Response) {
    try {
      const { name } = req.body;
      const category = await categoryService.createCategory(name);
      res.status(201).json(category);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async list(req: Request, res: Response) {
    try {
      const categories = await categoryService.listCategories();
      res.json(categories);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  }

  async addProduct(req: Request, res: Response) {
    try {
      const { productId, categoryId } = req.body;
      const product = await categoryService.addProductToCategory(productId, categoryId);
      res.json(product);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }

  async listProducts(req: Request, res: Response) {
    try {
      const { categoryId } = req.params;
      const products = await categoryService.listProductsByCategory(Number(categoryId));
      res.json(products);
    } catch (err: any) {
      res.status(400).json({ error: err.message });
    }
  }
}