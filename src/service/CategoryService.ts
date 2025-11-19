import { Connection } from "../data/Data-Source";
import { Category } from "../models/Category";
import { Product } from "../models/Product";

export class CategoryService {
  private categoryRepository = Connection.getRepository(Category);
  private productRepository = Connection.getRepository(Product);

  async createCategory(name: string) {
    const existing = await this.categoryRepository.findOne({ where: { name } });
    if (existing) throw new Error("Categoria já existe");

    const category = this.categoryRepository.create({ name });
    return await this.categoryRepository.save(category);
  }

  async listCategories() {
    return await this.categoryRepository.find({ relations: ["products"] });
  }

  async addProductToCategory(productId: number, categoryId: number) {
    const category = await this.categoryRepository.findOne({ where: { id: categoryId } });
    if (!category) throw new Error("Categoria não encontrada");

    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) throw new Error("Produto não encontrado");

    product.category = category;
    return await this.productRepository.save(product);
  }

  async listProductsByCategory(categoryId: number) {
    const category = await this.categoryRepository.findOne({
      where: { id: categoryId },
      relations: ["products"],
    });

    if (!category) throw new Error("Categoria não encontrada");
    return category.products;
  }
}