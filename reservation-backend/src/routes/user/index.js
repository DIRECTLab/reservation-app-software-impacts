const router = require('express').Router();
const shared = require('../../shared');
const { InvalidRequestError, UnauthenticatedError, UnauthorizedError } = require('../../shared/error');
const { sign, verify } = require('../../auth');
const bcrypt = require('bcrypt');

// Get queries for user
router.get('/', shared.asyncWrapper(async (req, res) => {
  const { User } = res.locals.models;

  if (!req.query.id){
    throw new InvalidRequestError("Must include a user id");
  }

  const user = await User.findByPk(req.query.id, {
    attributes: ['id', 'username', 'firstName', 'lastName', 'numberOfChargerTokens'],
  });
  return res.json(shared.makeResponse(user));

}));

// Create new user
router.post('/', shared.asyncWrapper(async (req, res) => {
  const { User } = res.locals.models;
  const existingUser = await User.findOne({
    where: {
      username: req.body.username,
    },
  });

  if (existingUser){
    return res.json(shared.makeResponse(null, "Username is already taken."));
  }

  const hashedPassword = await bcrypt.hash(req.body.password, 10);
  const user = await User.create({ ...req.body, password: hashedPassword, numberOfChargerTokens: 10 });
  return res.json(shared.makeResponse(user));
}));

// Patch user
router.patch('/', shared.asyncWrapper(async (req, res) => {
  const { User } = res.locals.models;

  const decodedAuth = verify(req.headers.authorization);
  if (!decodedAuth){
    throw new UnauthenticatedError("Your session has expired, please login again");
  }

  if (req.body.username){
    throw new InvalidRequestError("Cannot update usernames at this time, do not include in the request");
  }

  if (!req.body.id){
    throw new InvalidRequestError("Must include the user id");
  }

  if (decodedAuth.id !== req.body.id && !decodedAuth.admin){
    throw new UnauthorizedError("Cannot update an account which is not yours.")
  }

  if (req.body.password){
    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const user = await User.update({...req.body, password: hashedPassword}, {
        where: {
          id: req.body.id
        },
      });
      return res.json(shared.makeResponse("Success"));
    } catch (err) {
      throw new InvalidRequestError(err);
    }
  }

  try {
    const user = await User.update(req.body, {
      where: {
        id: req.body.id
      },
    });
    return res.json(shared.makeResponse("Success"));

  } catch (err) {
    throw new InvalidRequestError(err);
  }
}));

router.post('/login', shared.asyncWrapper(async (req, res) => {
  const { User } = res.locals.models;

  const existingAccount = await User.findOne({
    where: {
      username: req.body.username,
    }
  });

  if (!existingAccount){
    throw new InvalidRequestError("The username or password was incorrect");

  }

  const correctPassword = await bcrypt.compare(req.body.password, existingAccount.password);

  if (!correctPassword){
    throw new InvalidRequestError("The username or password was incorrect");
  }

  return res.json(shared.makeResponse({
    token: sign({
      firstName: existingAccount.firstName,
      lastName: existingAccount.lastName,
      id: existingAccount.id,
      username: existingAccount.username,
      admin: true, // TODO: THIS SHOULD NOT BE THIS WAY
    })
  }));

}));

router.patch('/spend-tokens', shared.asyncWrapper(async (req, res) => {
  const { User } = res.locals.models;


  const decodedAuth = verify(req.headers.authorization.replace(/['"]+/g, ''));
  if (!decodedAuth){
    throw new UnauthenticatedError("Your session has expired, please login again");
  }
  if (decodedAuth.id !== req.body.id && !decodedAuth.admin){
    throw new UnauthorizedError("Cannot update an account which is not yours.")
  }


  if (!req.body.id) 
    throw new InvalidRequestError("Must include user id");
  if (!req.body.cost)
    throw new InvalidRequestError("Must include cost");

  try {
    const user = await User.findOne({
      where: {
        id: req.body.id,
      }
    });

  
    const updatedUser = await User.update({
        numberOfChargerTokens: user.numberOfChargerTokens -= req.body.cost
      }, {
      where: {
        id: req.body.id
      },
    });
    return res.json(shared.makeResponse("Success"));

  } catch (err) {
    throw new InvalidRequestError(err);
  }



  
}));


module.exports = router;