const Cart = require("../db/models/Cart");
const CartItem = require("../db/models/CartItem");
const Product = require("../db/models/Product");
const Response = require("../lib/Response");
const CustomError = require("../lib/Error");
const Enum = require("../config/Enum");
const is = require("is_js");
const config = require("../config");
const Menu = require("../db/models/Menu");
const { Sequelize } = require("sequelize");

exports.getCartItems = async (req, res, next) => {
  const cartId = req.user.cartId;

  try {
    const cartItems = await CartItem.findAll({
      where: { cartId },
      include: [
        {
          model: Product,
          attributes: ["id", "name", "price"],
        },
        {
          model: Menu,
          attributes: ["id", "name", "price"],
          include: {
            model: Product,
            attributes: ["id", "name", "price"],
            through: {
              attributes: [],
            },
          },
        },
      ],
      attributes: ["id", "quantity"],
    });
    res.json(Response.successResponse({ cartItems }));
  } catch (error) {
    let errorResponse = Response.errorResponse(error);
    res.status(errorResponse.code).json(errorResponse);
  }
};

exports.addCartItem = async (req, res, next) => {
  const { product, menu } = req.body;
  try {
    if ((!product && !menu) || (product && menu)) {
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        "Validation Error!",
        "Just send product or menu"
      );
    }

    if (product) {
      const existingProduct = await Product.findOne({
        where: { id: product.id },
      });

      if (!existingProduct) {
        throw new CustomError(
          Enum.HTTP_CODES.BAD_REQUEST,
          "Validation Error!",
          "Unknown product."
        );
      }
    }

    if (menu) {
      const existingMenu = await Menu.findOne({
        where: { id: menu.id },
      });

      if (!existingMenu) {
        throw new CustomError(
          Enum.HTTP_CODES.BAD_REQUEST,
          "Validation Error!",
          "Unknown menu."
        );
      }
    }

    const existingCartItem = await CartItem.findOne({
      where: {
        cartId: req.user.cartId,
        [Sequelize.Op.or]: [
          product ? { productId: product.id } : null,
          menu ? { menuId: menu.id } : null,
        ].filter(Boolean),
      },
    });

    if (existingCartItem) {
      existingCartItem.quantity += 1;
      await existingCartItem.save();
    } else {
      await CartItem.create({
        quantity: 1,
        productId: product?.id,
        menuId: menu?.id,
        cartId: req.user.cartId,
      });
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

exports.clearCart = async (req, res, next) => {
  console.log("clearCart");
};

exports.increaseCartItemByOne = async (req, res, next) => {
  console.log("increaseCartItemByOne");
};

exports.decreaseCartItemByOne = async (req, res, next) => {
  console.log("decreaseCartItemByOne");
};

exports.deleteCartItem = async (req, res, next) => {
  console.log("deleteCartItem");
};

exports.increaseMenuCartItemByOne = async (req, res, next) => {
  console.log("increaseCartItemByOne");
};

exports.decreaseMenuCartItemByOne = async (req, res, next) => {
  console.log("decreaseCartItemByOne");
};

exports.deleteMenuCartItem = async (req, res, next) => {
  console.log("deleteCartItem");
};
