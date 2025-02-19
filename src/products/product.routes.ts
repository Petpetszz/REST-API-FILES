import express, { Request, Response } from "express";
import { Product, UnitProduct } from "./product.interface";
import * as database from "./product.database";
import { StatusCodes } from "http-status-codes";

export const productRouter = express.Router();

productRouter.get('/products', async (req: Request, res: Response) => {
  try {
    const allProducts = await database.findAll();

    if (!allProducts) {
      return res.status(StatusCodes.NOT_FOUND).json({ error: "No products found!" });
    }

    return res.status(StatusCodes.OK).json({ total: allProducts.length, allProducts });
  } catch (error) {
    return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error });
  }
})

productRouter.get("/product/:id", async (req: Request, res: Response) => {
    try {
      const product = await database.findOne(req.params.id);
  
      if (!product) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: "Product does not exist" });
      }
  
      return res.status(StatusCodes.OK).json(product);
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
  })

  productRouter.post("/product", async (req: Request, res: Response) => {
    try {
      const { name, price, quantity, image } = req.body;
  
      if (!name || !price || !quantity || !image) {
        return res.status(StatusCodes.BAD_REQUEST).json({ error: "Please provide all the required parameters.." });
      }
  
      const newProduct = await database.create({ ...req.body });
  
      return res.status(StatusCodes.CREATED).json({ newProduct }); // Wrap newProduct in an object
    } catch (error) {
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json(error);
    }
  })

  productRouter.put("/product/:id", async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const updatedProduct = req.body; // More descriptive variable name
  
      const existingProduct = await database.findOne(id); // More descriptive variable name
  
      if (!existingProduct) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: "Product does not exist." }); // Corrected error message
      }
  
      const newProduct = await database.update(id, updatedProduct); // Actually perform the update and store the result
  
      return res.status(StatusCodes.OK).json(newProduct); // Send the updated product back to the client
    } catch (error) {
      console.error("Error updating product:", error); // Log the error for debugging
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "An error occurred while updating the product." }); // Send a generic error message to the client
    }
  })

  productRouter.delete("/product/:id", async (req: Request, res: Response) => {
    try {
      const product = await database.findOne(req.params.id); // More descriptive variable name
  
      if (!product) {
        return res.status(StatusCodes.NOT_FOUND).json({ error: `No product with ID ${req.params.id}` }); // Template literal for ID
      }
  
      await database.remove(req.params.id);
  
      return res.status(StatusCodes.OK).json({ msg: "Product deleted.." }); // Corrected JSON structure
    } catch (error) {
      console.error("Error deleting product:", error); // Log the error for debugging
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ error: "An error occurred while deleting the product." }); // Generic error message
    }
  })