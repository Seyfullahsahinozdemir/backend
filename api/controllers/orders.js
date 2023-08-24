const Cart = require("../db/models/Cart");
const CartItem = require("../db/models/CartItem");
const Product = require("../db/models/Product");
const Menu = require("../db/models/Menu");
const Order = require("../db/models/Order");
const OrderItem = require("../db/models/OrderItem");
const Address = require("../db/models/Addresses");
const Response = require("../lib/Response");
const CustomError = require("../lib/Error");
const Enum = require("../config/Enum");
const is = require("is_js");
const config = require("../config");

exports.completeOrder = async (req, res, next) => {
  const { addressId } = req.body;
  try {
    if (!addressId) {
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        "Validation Error!",
        "address field must be filled."
      );
    }

    const existingAddress = await Address.findOne({ where: { id: addressId } });

    if (!existingAddress) {
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        "Validation Error!",
        "Unknown Address"
      );
    }

    const cartItems = await CartItem.findAll({
      where: { cartId: req.user.cartId },
      include: [{ model: Product }, { model: Menu }],
    });

    if (cartItems.length < 1) {
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        "Validation Error!",
        "Your cart is empty"
      );
    }

    const order = await Order.create({
      userId: req.user.id,
      addressId: addressId,
      totalPrice: 0,
    });

    for (let cartItem of cartItems) {
      await OrderItem.create({
        orderId: order.id,
        productId: cartItem.product?.id,
        menuId: cartItem.menu?.id,
        price: cartItem.product
          ? cartItem.product.price
          : cartItem.menu.price * cartItem.quantity,
        quantity: cartItem.quantity,
      });
      order.totalPrice += cartItem.product
        ? cartItem.product.price * cartItem.quantity
        : cartItem.menu.price * cartItem.quantity;
    }
    order.save();
    await Cart.destroy({ where: { id: req.user.cartId } });

    res.json(Response.successResponse({ success: true }));
  } catch (error) {
    let errorResponse = Response.errorResponse(error);
    res.status(errorResponse.code).json(errorResponse);
  }
};

exports.getOrderDetailById = async (req, res, next) => {
  const orderId = req.params.id;
  try {
    const order = await Order.findOne({
      where: { userId: req.user.id, id: orderId },
      include: [{ model: Address }],
    });

    if (!order) {
      return res.json(Response.successResponse({}));
    }

    const orderItems = await OrderItem.findAll({
      where: { orderId: order.id },
      include: [{ model: Product }, { model: Menu }],
    });

    const orderInfo = {
      orderInfo: {
        id: order.id,
        totalPrice: order.totalPrice,
        address: order.address,
        createdAt: order.createdAt,
      },
      items: orderItems.map((item) => {
        return {
          id: item.id,
          quantity: item.quantity,
          price: item.price,
          orderId: item.orderId,
          productId: item.productId,
          menuId: item.menuId,
          product: item.product,
          menu: item.menu,
        };
      }),
    };

    res.json(Response.successResponse(orderInfo));
  } catch (error) {
    let errorResponse = Response.errorResponse(error);
    res.status(errorResponse.code).json(errorResponse);
  }
};

exports.reOrder = async (req, res, next) => {
  const orderId = req.params.id;
  const { addressId } = req.body;
  try {
    if (!orderId) {
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        "Validation Error!",
        "order field must be filled."
      );
    }

    const existingOrder = await Order.findOne({
      where: { id: orderId, userId: req.user.id },
    });

    if (!existingOrder) {
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        "Validation Error!",
        "Unknown Order"
      );
    }

    const existingAddress = await Address.findOne({ where: { id: addressId } });

    if (!existingAddress) {
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        "Validation Error!",
        "Unknown Address"
      );
    }

    const newOrder = await Order.create({
      userId: existingOrder.userId,
      addressId: addressId ? addressId : existingOrder.addressId,
      totalPrice: existingOrder.totalPrice,
    });

    const existingOrderItems = await OrderItem.findAll({
      where: { orderId: existingOrder.id },
    });

    for (let orderItem of existingOrderItems) {
      await OrderItem.create({
        quantity: orderItem.quantity,
        price: orderItem.price,
        orderId: newOrder.id,
        productId: orderItem.productId,
        menuId: orderItem.menuId,
      });
    }

    res.json(Response.successResponse({ success: true }));
  } catch (error) {
    let errorResponse = Response.errorResponse(error);
    res.status(errorResponse.code).json(errorResponse);
  }
};

exports.getPastOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll({
      where: { userId: req.user.id },
      include: [{ model: Address }],
    });

    const result = [];

    for (let order of orders) {
      const orderItems = await OrderItem.findAll({
        where: { orderId: order.id },
        include: [{ model: Product }, { model: Menu }],
      });

      const orderInfo = {
        orderInfo: {
          id: order.id,
          totalPrice: order.totalPrice,
          address: order.address,
          createdAt: order.createdAt,
        },
        items: orderItems.map((item) => {
          return {
            id: item.id,
            quantity: item.quantity,
            price: item.price,
            orderId: item.orderId,
            productId: item.productId,
            menuId: item.menuId,
            product: item.product,
            menu: item.menu,
          };
        }),
      };
      result.push(orderInfo);
    }

    res.json(Response.successResponse(result));
  } catch (error) {
    let errorResponse = Response.errorResponse(error);
    res.status(errorResponse.code).json(errorResponse);
  }
};
