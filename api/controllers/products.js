const Product = require("../db/models/Product");
const Category = require("../db/models/Category");
const Response = require("../lib/Response");
const CustomError = require("../lib/Error");
const Enum = require("../config/Enum");
const is = require("is_js");
const config = require("../config");
const { Op } = require("sequelize");

exports.addProduct = async (req, res, next) => {
  let { name, price, description, categoryId } = req.body;

  try {
    if (!name) {
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        "Validation Error!",
        "name field must be filled."
      );
    }

    if (!price) {
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        "Validation Error!",
        "price field must be filled."
      );
    }

    if (!categoryId) {
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        "Validation Error!",
        "category field must be filled."
      );
    }

    const existingProduct = await Product.findOne({ where: { name: name } });

    if (existingProduct) {
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        "Validation Error!",
        "product name already using."
      );
    }

    const existingCategory = await Category.findOne({
      where: { id: categoryId },
    });

    if (!existingCategory) {
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        "Validation Error!",
        "Invalid categoryId."
      );
    }

    await Product.create({
      name: name,
      description: description,
      price: price,
      categoryId: categoryId,
      createdBy: req.user.id,
    });

    res
      .status(Enum.HTTP_CODES.CREATED)
      .json(
        Response.successResponse({ success: true }, Enum.HTTP_CODES.CREATED)
      );
  } catch (error) {
    let errorResponse = Response.errorResponse(error);
    res.status(errorResponse.code).json(errorResponse);
  }
};

exports.updateProduct = async (req, res, next) => {
  let { name, description, price, categoryId } = req.body;
  let productId = req.params.id;

  try {
    await Product.update(
      {
        name: name,
        description: description,
        price: price,
        categoryId: categoryId,
      },
      { where: { id: productId } }
    );
    res.json(Response.successResponse({ success: true }));
  } catch (error) {
    let errorResponse = Response.errorResponse(error);
    res.status(errorResponse.code).json(errorResponse);
  }
};

exports.deleteProduct = async (req, res, next) => {
  let productId = req.params.id;
  try {
    await Product.destroy({ where: { id: productId } });
    res.json(Response.successResponse({ success: true }));
  } catch (error) {
    let errorResponse = Response.errorResponse(error);
    res.status(errorResponse.code).json(errorResponse);
  }
};

exports.getProducts = async (req, res, next) => {
  const { name } = req.query;

  try {
    if (!name) {
      const products = await Product.findAll();
      res.json(Response.successResponse(products));
    } else {
      const products = await Product.findAll({
        where: {
          name: {
            [Op.like]: `%${name}%`,
          },
        },
      });
      res.json(Response.successResponse(products));
    }
  } catch (error) {
    let errorResponse = Response.errorResponse(error);
    res.status(errorResponse.code).json(errorResponse);
  }
};

exports.getByCategoryId = async (req, res, next) => {
  const { categoryId } = req.body;
  try {
    const existingCategory = await Category.findOne({
      where: { id: categoryId },
    });

    if (!existingCategory) {
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        "Validation Error!",
        "unknown category"
      );
    }

    const products = await Product.findAll({
      where: { categoryId: categoryId },
    });

    res.json(Response.successResponse({ products }));
  } catch (error) {
    let errorResponse = Response.errorResponse(error);
    res.status(errorResponse.code).json(errorResponse);
  }
};
