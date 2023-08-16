const Category = require("../db/models/Category");
const Response = require("../lib/Response");
const CustomError = require("../lib/Error");
const Enum = require("../config/Enum");
const is = require("is_js");
const config = require("../config");

exports.addCategory = async (req, res, next) => {
  let { name, description } = req.body;

  try {
    if (!name) {
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        "Validation Error!",
        "name field must be filled."
      );
    }
    const existingCategory = await Category.findOne({ where: { name: name } });

    if (existingCategory) {
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        "Validation Error!",
        "category name already using."
      );
    }

    await Category.create({
      name: name,
      description: description,
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

exports.updateCategory = async (req, res, next) => {
  let { name, description } = req.body;
  let categoryId = req.params.id;

  try {
    await Category.update(
      {
        name: name,
        description: description,
      },
      { where: { id: categoryId } }
    );
    res.json(Response.successResponse({ success: true }));
  } catch (error) {
    let errorResponse = Response.errorResponse(error);
    res.status(errorResponse.code).json(errorResponse);
  }
};

exports.deleteCategory = async (req, res, next) => {
  let categoryId = req.params.id;
  try {
    await Category.destroy({ where: { id: categoryId } });
    res.json(Response.successResponse({ success: true }));
  } catch (error) {
    let errorResponse = Response.errorResponse(error);
    res.status(errorResponse.code).json(errorResponse);
  }
};

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll({
      attributes: ["id", "name", "description"],
    });
    res.json(Response.successResponse({ categories }));
  } catch (error) {
    let errorResponse = Response.errorResponse(error);
    res.status(errorResponse.code).json(errorResponse);
  }
};
