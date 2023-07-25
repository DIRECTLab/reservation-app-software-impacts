const router = require('express').Router();
const shared = require('../../shared');
const { InvalidRequestError } = require('../../shared/error');
const { literal, col } = require('sequelize')

// Get queries for charger
router.get('/', shared.asyncWrapper(async (req, res) => {
  const { Charger } = res.locals.models;

  // Get Charger by ID
  if (req.query.id) {
    const charger = await Charger.findByPk(req.query.id);
    return res.json(shared.makeResponse(charger));
  }

  else if (req.query.latitude || req.query.longitude || req.query.radius) {
    if (!req.query.latitude || !req.query.longitude || !req.query.radius) {
      throw new InvalidRequestError("For location based queries, you need to include the latitude, longitude, and radius (kilometers) for search");
    }

    const haversine = `(
      6371 * acos(
          cos(radians(${req.query.latitude}))
          * cos(radians(latitude))
          * cos(radians(longitude) - radians(${req.query.longitude}))
          + sin(radians(${req.query.latitude})) * sin(radians(latitude))
      )
    )`;

    const chargers = await Charger.findAll({
      attributes: [
        'id',
        'latitude',
        'longitude',
        'name',
        [literal(haversine), 'distance'],
      ],
      order: col('distance'),
      where: literal(`distance <= ${req.query.radius}`),
      limit: req.query.limit ?? 20,
    });

    return res.json(shared.makeResponse(chargers));

  }

  else {
    const chargers = await Charger.findAll({
      offset: req.query.offset ?? 0,
      limit: req.query.limit ?? 20,
      order: [["id", "ASC"]],
    });

    return res.json(shared.makeResponse(chargers));
  }
}));

router.get('/optimal-range', shared.asyncWrapper(async (req, res) => {
  const { Charger } = res.locals.models;

  if (!req.query.id) {
    throw new InvalidRequestError("Missing required charger id");
  }
  if (!req.query.startTime) {
    throw new InvalidRequestError("Missing start time of reservation");
  }

  // TODO connect this with the database to get the optimal charge rate of the specific charger
  return res.json(shared.makeResponse({
    chargeRange: {
      low: 60,
      high: 90,
    },
  }))

}));

// Create new charger
router.post('/', shared.asyncWrapper(async (req, res) => {
  const { Charger } = res.locals.models;
  const charger = await Charger.create(req.body);
  return res.json(shared.makeResponse(charger));
}));

// Patch charger
router.patch('/', shared.asyncWrapper(async (req, res) => {
  const { Charger } = res.locals.models;
  try {
    const charger = await Charger.update(req.body, {
      where: {
        id: req.body.id
      }
    });
    return res.json(shared.makeResponse("Sucess"));
  } catch (err) {
    throw new InvalidRequestError(err);
  }
}));

// Patch charger
router.delete('/', shared.asyncWrapper(async (req, res) => {
  const { Charger } = res.locals.models;
  try {
    const charger = await Charger.destroy({
      where: {
        id: req.body.id
      }
    });
    return res.json(shared.makeResponse("Sucess"));
  } catch (err) {
    throw new InvalidRequestError(err);
  }
}));

router.get('/cost', shared.asyncWrapper(async (req, res) => {
  if (!req.query.id) {
    throw new InvalidRequestError("Missing required charger id");
  }
  if (!req.query.startTime) {
    throw new InvalidRequestError("Missing start time of reservation");
  }
  if (!req.query.chargeAmount) {
    throw new InvalidRequestError("Missing charge amount");
  }

  // TODO connect this with the database to get the cost of the reservation with the charger
  if (req.query.chargeAmount < 80) {
    return res.json(shared.makeResponse({
      cost: 1
    }));
  } else {
    return res.json(shared.makeResponse({
      cost: 3
    })); 
  }
}));


module.exports = router;