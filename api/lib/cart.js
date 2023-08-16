const express = require("express");
const Cart = require("../db/models/Cart");
const Response = require("../lib/Response");

module.exports = async function checkCart(req, res, next) {
  try {
    const cart = await Cart.findOne({ where: { userId: req.user.id } });
    if (cart) {
      req.user.cartId = cart.id;
      next();
    } else {
      const newCart = await Cart.create({
        userId: req.user.id,
      });
      req.user.cartId = newCart.id;
      next();
    }
  } catch (error) {
    let errorResponse = Response.errorResponse(error);
    res.status(errorResponse.code).json(errorResponse);
  }
};
