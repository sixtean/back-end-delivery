import { Connection } from "../data/Data-Source";
import { Product } from "../models/Product";
import { Company } from "../models/Company";
import { Category } from "../models/Category";
import { validateOrReject } from "class-validator";
import cloudinary from "../data/cloudnary";

export class ProductService {
  private productRepository = Connection.getRepository(Product);
  private companyRepository = Connection.getRepository(Company);
  private categoryRepository = Connection.getRepository(Category);

  async createProduct(
    data: {
      companyId: number;
      name: string;
      description?: string;
      price: number;
      stock: number;
      categoryId?: number;
    },
    files?: Express.Multer.File[]
  ): Promise<Product> {
    const { companyId, name, description, price, stock, categoryId } = data;

    const company = await this.companyRepository.findOne({ where: { id: companyId } });
    if (!company) throw new Error("Empresa não encontrada");

    let category: Category | null = null;
    if (categoryId) {
      category = await this.categoryRepository.findOne({ where: { id: categoryId } });
      if (!category) throw new Error("Categoria não encontrada");
    }

    let image_data: string[] | undefined = undefined;

    // === UPLOAD PARA CLOUDINARY ===
    if (files && files.length > 0) {
      if (files.length > 5) throw new Error("Máximo de 5 imagens permitidas.");

      const uploadedImages = [];

      for (const file of files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "products",
        });

        uploadedImages.push(result.secure_url);
      }

      image_data = uploadedImages;
    }

    const newProduct = this.productRepository.create({
      name,
      description,
      price,
      stock,
      company,
      category,
      image_data,
    });

    await validateOrReject(newProduct);
    return await this.productRepository.save(newProduct);
  }

  async getProducts(companyId: number): Promise<Product[]> {
    return await this.productRepository.find({
      where: { company: { id: companyId } },
      relations: ["company", "category"],
      order: { id: "DESC" },
    });
  }

  async updateProduct(
    id: number,
    data: any,
    files?: Express.Multer.File[]
  ): Promise<Product> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new Error("Produto não encontrado.");

    if (data.name) product.name = data.name;
    if (data.description) product.description = data.description;
    if (data.price) product.price = Number(data.price);
    if (data.stock) product.stock = Number(data.stock);

    if (data.categoryId) {
      const category = await this.categoryRepository.findOne({
        where: { id: Number(data.categoryId) },
      });
      if (!category) throw new Error("Categoria não encontrada");
      product.category = category;
    }

    // === SUBSTITUIR AS IMAGENS NA CLOUDINARY ===
    if (files && files.length > 0) {
      // apagar imagens antigas
      if (product.image_data && product.image_data.length > 0) {
        for (const url of product.image_data) {
          try {
            const publicId = url.split("/").slice(-1)[0].split(".")[0];
            await cloudinary.uploader.destroy(`products/${publicId}`);
          } catch {}
        }
      }

      // fazer upload das novas
      const uploadedImages = [];
      for (const file of files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "products",
        });

        uploadedImages.push(result.secure_url);
      }

      product.image_data = uploadedImages;
    }

    await validateOrReject(product);
    return await this.productRepository.save(product);
  }

  async deleteProduct(id: number): Promise<{ success: boolean }> {
    const product = await this.productRepository.findOne({ where: { id } });
    if (!product) throw new Error("Produto não encontrado.");

    // remover imagens do Cloudinary
    if (product.image_data) {
      for (const url of product.image_data) {
        try {
          const publicId = url.split("/").slice(-1)[0].split(".")[0];
          await cloudinary.uploader.destroy(`products/${publicId}`);
        } catch {}
      }
    }

    await this.productRepository.remove(product);
    return { success: true };
  }
}