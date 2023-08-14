const Users = require("../db/models/Users");
const Response = require("../lib/Response");
const CustomError = require("../lib/Error");
const Enum = require("../config/Enum");
const bcrypt = require("bcrypt");
const is = require("is_js");
const config = require("../config");
const jwt = require("jwt-simple");
const Address = require("../db/models/Addresses");

exports.register = async (req, res, next) => {
  let body = req.body;

  try {
    if (!body.email)
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        "Validation Error!",
        "email field must be filled"
      );

    if (is.not.email(body.email))
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        "Validation Error!",
        "wrong email format"
      );

    if (!body.password)
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        "Validation Error!",
        "password field must be filled"
      );

    if (body.password.length < Enum.PASS_LENGTH) {
      throw new CustomError(
        Enum.HTTP_CODES.BAD_REQUEST,
        "Validation Error!",
        "password length must be greater than " + Enum.PASS_LENGTH
      );
    }

    let password = bcrypt.hashSync(body.password, bcrypt.genSaltSync(8), null);

    await Users.create({
      email: body.email,
      password: password,
      firstName: body.firstName,
      lastName: body.lastName,
      birthDate: body.birthDate,
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

exports.login = async (req, res, next) => {
  let { email, password } = req.body;

  try {
    if (
      typeof password !== "string" ||
      password.length < Enum.PASS_LENGTH ||
      is.not.email(email)
    )
      throw new CustomError(
        Enum.HTTP_CODES.UNAUTHORIZED,
        "Validation Error",
        "email or password wrong"
      );

    let user = await Users.findOne({ where: { email: email } });
    if (!user)
      throw new CustomError(
        Enum.HTTP_CODES.UNAUTHORIZED,
        "Validation Error",
        "email or password wrong"
      );

    if (!bcrypt.compareSync(password, user.password))
      throw new CustomError(
        Enum.HTTP_CODES.UNAUTHORIZED,
        "Validation error",
        "Email or password Wrong"
      );

    let payload = {
      id: user.id,
      exp: parseInt(Date.now() / 1000) * config.JWT.EXPIRE_TIME,
    };

    let userData = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      isAdmin: user.isAdmin,
      email: user.email,
    };

    let token = jwt.encode(payload, config.JWT.SECRET);
    res.json(Response.successResponse({ token, user: { userData } }));
  } catch (error) {
    let errorResponse = Response.errorResponse(error);
    res.status(errorResponse.code).json(errorResponse);
  }
};

exports.addAddress = async (req, res, next) => {
  let { name, lastName, phoneNumber, description } = req.body;
  const userId = req.user.id;

  try {
    await Address.create({
      name: name,
      lastName: lastName,
      phoneNumber: phoneNumber,
      description: description,
      userId: userId,
    });

    res.json(Response.successResponse({ success: true }));
  } catch (error) {
    let errorResponse = Response.errorResponse(error);
    res.status(errorResponse.code).json(errorResponse);
  }
};

exports.getAddresses = async (req, res, next) => {
  const userId = req.user.id;
  try {
    const addresses = await Address.findAll({
      attributes: ["id", "name", "lastName", "phoneNumber", "description"],
      where: { userId: userId },
    });
    res.json(Response.successResponse(addresses));
  } catch (error) {
    let errorResponse = Response.errorResponse(error);
    res.status(errorResponse.code).json(errorResponse);
  }
};

exports.updateAddress = async (req, res, next) => {
  let { name, lastName, phoneNumber, description } = req.body;
  let id = req.params.id;
  const userId = req.user.id;

  try {
    await Address.update(
      {
        name: name,
        lastName: lastName,
        phoneNumber: phoneNumber,
        description: description,
      },
      { where: { id: id, userId: userId } }
    );

    res.json(Response.successResponse({ success: true }));
  } catch (error) {
    let errorResponse = Response.errorResponse(error);
    res.status(errorResponse.code).json(errorResponse);
  }
};

exports.deleteAddress = async (req, res, next) => {
  let id = req.params.id;
  const userId = req.user.id;

  try {
    await Address.destroy({ where: { id: id, userId: userId } });

    res.json(Response.successResponse({ success: true }));
  } catch (error) {
    let errorResponse = Response.errorResponse(error);
    res.status(errorResponse.code).json(errorResponse);
  }
};
