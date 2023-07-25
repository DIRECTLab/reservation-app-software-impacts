const router = require('express').Router();
const shared = require('../../shared');
const { InvalidRequestError, UnauthenticatedError, UnauthorizedError } = require('../../shared/error');
const { verify } = require('../../auth');

router.get('/', shared.asyncWrapper(async (req, res) => {
  const { Car } = res.locals.models;

  if (!req.headers.authorization) {
    throw new UnauthenticatedError("Your session has expired, please login again")
  }
  const authString = req.headers.authorization.replaceAll('"', "");

  const decodedAuth = verify(authString);
  if (!decodedAuth) {
    console.log("Invalid, needs to login again");
    throw new UnauthenticatedError("Your session has expired, please login again");
  }
  if (!req.query.UserId) {
    throw new InvalidRequestError("Must include a user id");
  }

  if (req.query.UserId !== decodedAuth.id && !decodedAuth.admin) {
    throw new UnauthorizedError("You are not this user");
  }

  const cars = await Car.findAll({
    where: {
      UserId: decodedAuth.id,
    },
    order: [['createdAt', 'ASC']],
  });
  return res.json(shared.makeResponse(cars));
}));

router.post('/', shared.asyncWrapper(async (req, res) => {
  const { Car } = res.locals.models;

  if (!req.headers.authorization) {
    throw new UnauthenticatedError("Your session has expired, please login again")
  }
  const authString = req.headers.authorization.replaceAll('"', "")

  const decodedAuth = verify(authString);
  if (!decodedAuth) {
    console.log("Invalid, needs to login again");
    throw new UnauthenticatedError("Your session has expired, please login again");
  }

  if (!req.body.UserId) {
    throw new InvalidRequestError("Must include the UserId for who is making the reservation");
  }

  if (req.body.UserId !== decodedAuth.id && !decodedAuth.admin) {
    throw new UnauthorizedError("Cannot make reservations for someone you are not");
  }

  if (!req.body.make) {
    throw new InvalidRequestError("Must include car's make");
  }
  if (!req.body.model) {
    throw new InvalidRequestError("Must include car's model");
  }
  if (!req.body.year) {
    throw new InvalidRequestError("Must include car's year");
  }
  const reg = new RegExp(/^\d*$/);
  if (!reg.test(req.body.year)) {
    throw new InvalidRequestError("Year is not a number");
  }

  const car = await Car.create({ ...req.body });
  return res.json(shared.makeResponse(car));
}));

router.patch('/', shared.asyncWrapper(async (req, res) => {
  const { Car } = res.locals.models;

  if (!req.headers.authorization) {
    throw new UnauthenticatedError("Your session has expired, please login again")
  }

  const decodedAuth = verify(req.headers.authorization);
  if (!decodedAuth) {
    console.log("Invalid, needs to login again");
    throw new UnauthenticatedError("Your session has expired, please login again");
  }

  if (!req.body.UserId) {
    throw new InvalidRequestError("Must include the UserId for who is updating the car");
  }

  if (req.body.UserId !== decodedAuth.id && !decodedAuth.admin) {
    throw new UnauthorizedError("Cannot update car for someone you are not!");
  }

  if (!req.body.id) {
    throw new InvalidRequestError("Must include id of the car you want to update")
  }


  try {
    const car = await Car.update(req.body, {
      where: {
        id: req.body.id,
        UserId: decodedAuth.id,
      },
    });
    return res.json(shared.makeResponse("Success"));
  } catch (err) {
    throw new InvalidRequestError(err);
  }
}));

router.delete('/', shared.asyncWrapper(async (req, res) => {
  const { Car } = res.locals.models;

  if (!req.headers.authorization) {
    throw new UnauthenticatedError("Your session has expired, please login again")
  }

  const decodedAuth = verify(req.headers.authorization);
  if (!decodedAuth) {
    console.log("Invalid, needs to login again");
    throw new UnauthenticatedError("Your session has expired, please login again");
  }

  if (!req.body.UserId) {
    throw new InvalidRequestError("Must include the UserId for who is deleting the car");
  }

  if (req.body.UserId !== decodedAuth.id && !decodedAuth.admin) {
    throw new UnauthorizedError("Cannot delete car for someone you are not!");
  }

  if (!req.body.id) {
    throw new InvalidRequestError("Must include id of the car you want to delete")
  }

  try {
    const car = await Car.destroy({
      where: {
        id: req.body.id,
        UserId: decodedAuth.id,
      },
    });
    return res.json(shared.makeResponse("Success"));
  } catch (err) {
    throw new InvalidRequestError(err);
  }


}));

module.exports = router;