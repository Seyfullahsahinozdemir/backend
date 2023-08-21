const Menu = require("../db/models/Menu");
const Category = require("../db/models/Category");

const Response = require("../lib/Response");
const CustomError = require("../lib/Error");
const Enum = require("../config/Enum");
const is = require("is_js");
const config = require("../config");
const Product = require("../db/models/Product");

exports.addMenu = async (req, res, next) => {
  let { name, price, description, categoryId, products } = req.body;

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
    if (products.length < 1) {
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        "Validation Error!",
        "menu needs to contain at least one product."
      );
    }

    const existingMenu = await Menu.findOne({ where: { name: name } });

    if (existingMenu) {
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        "Validation Error!",
        "menu name already using."
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

    const menu = await Menu.create({
      name: name,
      price: price,
      description: description,
      createdBy: req.user.id,
      categoryId: categoryId,
    });

    console.log(products);

    for (let product of products) {
      const existingProduct = await Product.findOne({
        where: { id: product.id },
      });
      if (existingProduct) await menu.addProduct(existingProduct);
      else {
        console.log(`Product with ID ${product.id} not found.`);
      }
    }

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

exports.updateMenu = async (req, res, next) => {
  const menuId = req.params.id;
  let { name, price, description, categoryId, products } = req.body;

  try {
    const menu = await Menu.findOne({ where: { id: menuId } });

    if (!menu) {
      throw new CustomError(
        Enum.HTTP_CODES.NOT_FOUND,
        "Menu not found!",
        "Menu with the specified ID was not found."
      );
    }

    if (name) {
      menu.name = name;
    }
    if (price) {
      menu.price = price;
    }
    if (description) {
      menu.description = description;
    }
    if (categoryId) {
      menu.categoryId = categoryId;
    }

    if (products && products.length > 0) {
      await menu.setProducts([]);

      for (let product of products) {
        const existingProduct = await Product.findOne({
          where: { id: product.id },
        });

        if (existingProduct) {
          await menu.addProduct(existingProduct);
        } else {
          console.log(`Product with ID ${product.id} not found.`);
        }
      }
    }

    await menu.save();

    res
      .status(Enum.HTTP_CODES.OK)
      .json(Response.successResponse({ success: true }, Enum.HTTP_CODES.OK));
  } catch (error) {
    let errorResponse = Response.errorResponse(error);
    res.status(errorResponse.code).json(errorResponse);
  }
};

exports.deleteMenu = async (req, res, next) => {
  const menuId = req.params.id;

  try {
    const menu = await Menu.findOne({ where: { id: menuId } });

    if (!menu) {
      throw new CustomError(
        Enum.HTTP_CODES.NOT_FOUND,
        "Menu not found!",
        "Menu with the specified ID was not found."
      );
    }

    await menu.destroy();

    res
      .status(Enum.HTTP_CODES.OK)
      .json(Response.successResponse({ success: true }, Enum.HTTP_CODES.OK));
  } catch (error) {
    let errorResponse = Response.errorResponse(error);
    res.status(errorResponse.code).json(errorResponse);
  }
};

exports.getMenus = async (req, res, next) => {
  try {
    const menus = await Menu.findAll({
      include: [
        {
          model: Product,
          attributes: ["id", "name", "price", "description"],
          through: { attributes: [] },
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "createdBy", "categoryId"],
      },
    });

    res
      .status(Enum.HTTP_CODES.OK)
      .json(Response.successResponse({ menus }, Enum.HTTP_CODES.OK));
  } catch (error) {
    let errorResponse = Response.errorResponse(error);
    res.status(errorResponse.code).json(errorResponse);
  }
};
