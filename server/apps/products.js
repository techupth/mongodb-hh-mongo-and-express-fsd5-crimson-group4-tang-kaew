import { Router } from "express";
import { db } from "../utils/db.js";
import { ObjectId } from "mongodb";
// const { ObjectId } = require("mongodb"); // for using without `new` keyword

const productRouter = Router();

productRouter.get("/", async (req, res) => {
  try {
    const collection = db.collection("products");
    const products = await collection.find().toArray();

    return res.json({
      data: products,
    });
  } catch (error) {
    console.error("Error fetching products:", error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

productRouter.get("/:id", async (req, res) => {
  try {
    const collection = db.collection("products");
    const productId = req.params.id;

    const product = await collection.findOne({ _id: new ObjectId(productId) });

    if (!product) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    return res.json({
      data: product,
    });
  } catch (error) {
    console.error("Error fetching product by ID:", error);
    return res.status(500).json({
      error: "Internal Server Error",
    });
  }
});

productRouter.post("/", async (req, res) => {
  const collection = db.collection("products");

  const productData = { ...req.body };
  const products = await collection.insertOne(productData);

  return res.json({
    message: `Product record (${products.insertedId}) has been created successfully`,
  });
});

productRouter.put("/:id", async (req, res) => {
  try {
    const collection = db.collection("products");
    const productId = req.params.id;

    const result = await collection.updateOne(
      { _id: new ObjectId(productId) },
      { $set: req.body }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({
        error: "Product not found",
      });
    }

    if (result.modifiedCount === 0) {
      return res.status(200).json({
        message: "No changes made to the product",
      });
    }

    return res.json({
      message: `Product record (${productId}) has been updated successfully`,
    });
  } catch (error) {
    console.error("Error updating product:", error);
    return res.status(500).json({
      error: "Internal Server Error",
      details: error.message,
    });
  }
});

productRouter.delete("/:id", async (req, res) => {
  const collection = db.collection("products");

  const productId = new ObjectId(req.params.id);
  console.log(productId);

  const existingProduct = await collection.findOne({ _id: productId });
  if (!existingProduct) {
    return res.status(404).json({
      error: "Product not found",
    });
  }

  await collection.deleteOne({
    _id: productId,
  });

  return res.json({
    message: `Product record (${productId}) has been deleted successfully`,
    deletedProductId: productId,
  });
});

export default productRouter;
