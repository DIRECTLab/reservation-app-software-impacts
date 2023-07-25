const router = require('express').Router();
const shared = require('../../shared');
const { InvalidRequestError, UnauthenticatedError, UnauthorizedError } = require('../../shared/error');
const { sign, verify } = require('../../auth');
const bcrypt = require('bcrypt');

// Get queries for user
router.get('/', shared.asyncWrapper(async (req, res) => {
  const { FavoriteCharger, User } = res.locals.models;


  const authString = req.headers.authorization.replaceAll('"', "");

  const decodedAuth = verify(authString);
  if (!decodedAuth){
    console.log("Invalid, needs to login again");
    throw new UnauthenticatedError("Your session has expired, please login again");
  }

  if (!req.query.UserId){
    throw new InvalidRequestError("Must include a user id");
  }

  if (req.query.UserId !== decodedAuth.id && !decodedAuth.admin){
    throw new UnauthorizedError("You are not this user");
  }

  const user = await User.findByPk(req.query.UserId, {
    attributes: ['id'],
    include: {
      model: FavoriteCharger,
    },
  });
  return res.json(shared.makeResponse(user));

}));


router.post('/', shared.asyncWrapper(async (req, res) => {
  const { FavoriteCharger, User } = res.locals.models;

  const authString = req.headers.authorization.replaceAll('"', "");
  const decodedAuth = verify(authString);
  if (!decodedAuth){
    console.log("Invalid, needs to login again");
    throw new UnauthenticatedError("Your session has expired, please login again");
  }

  if (!req.body.UserId){
    throw new InvalidRequestError("Must include a user id");
  }

  if (!req.body.ChargerId){
    throw new InvalidRequestError("Must include the charger id");
  }

  if (req.query.UserId !== decodedAuth.id && !decodedAuth.admin){
    throw new UnauthorizedError("You are not this user");
  }

  const favoriteCharger = await FavoriteCharger.create(req.body);

  return res.json(shared.makeResponse(favoriteCharger));

}));

router.delete('/', shared.asyncWrapper(async (req, res) => {
  const { FavoriteCharger } = res.locals.models;

  const authString = req.headers.authorization.replaceAll('"', "")

  if (!req.query.id){
    throw new InvalidRequestError("Must specify the id to delete");
  }

  const decodedAuth = verify(authString);
  if (!decodedAuth){
    throw new UnauthenticatedError("Your session has expired, please login again");
  }

  if (decodedAuth.admin) {
    await FavoriteCharger.destroy({
      where: {
        id: req.query.id,
      },
    });
  }

  else {
    await FavoriteCharger.destroy({
      where: {
        id: req.query.id,
        UserId: decodedAuth.id,
      },
    });
  }
  return res.json(shared.makeResponse("Successfully deleted the favorite charger"));
}));

module.exports = router;