const router = require('express').Router();
const { Op } = require('sequelize');
const shared = require('../../shared');
const { InvalidRequestError, UnauthorizedError, UnauthenticatedError } = require('../../shared/error');
const moment = require('moment');
const { verify } = require('../../auth');

// Get queries for reservation
router.get('/', shared.asyncWrapper(async (req, res) => {
  const { Reservation, Charger } = res.locals.models;

  if (req.query.id){
    const reservation = await Reservation.findByPk(req.query.id);
    return res.json(shared.makeResponse(reservation));
  }

  else if (req.query.UserId){
    if (req.query.upcoming){
      const reservations = await Reservation.findAll({
        where: {
          UserId: req.query.UserId,
          datetime: {
            [Op.gte]: moment().toDate(),
          },
        },
        limit: req.query.limit ?? 20,
        offset: req.query.offset ?? 0,
        order: [['datetime', 'ASC']],
        include: [{
          model: Charger,
          attributes: ['name', 'latitude', 'longitude'],
        }],
      });

      return res.json(shared.makeResponse(reservations));
    }
    else if (req.query.all){
      const reservations = await Reservation.findAll({
        where: {
          UserId: req.query.UserId,
        },
        limit: req.query.limit ?? 20,
        offset: req.query.offset ?? 0,
        order: [['datetime', 'DESC']],
        include: [{
          model: Charger,
          attributes: ['name', 'latitude', 'longitude'],
        }],
      });

      return res.json(shared.makeResponse(reservations));
    }
    else if (req.query.startDate && req.query.endDate) {
      const reservations = await Reservation.findAll({
        where: {
          UserId: req.query.UserId,
          datetime: {
            [Op.between]: [moment(req.query.startDate).toDate(), moment(req.query.endDate).toDate()],
          }
        },
        limit: req.query.limit ?? 20,
        offset: req.query.offset ?? 0,
        order: [['datetime', 'ASC']],
        include: [{
          model: Charger,
          attributes: ['name', 'latitude', 'longitude'],
        }],
      });

      return res.json(shared.makeResponse(reservations));
    }
    else {
      throw new InvalidRequestError("For upcoming user reservations, you must specify either upcoming or all reservations, or a startDate and endDate");
    }
  }

  else if (req.query.ChargerId){
    if (req.query.upcoming){
      const reservations = await Reservation.findAll({
        where: {
          ChargerId: req.query.ChargerId,
          datetime: {
            [Op.gte]: moment().toDate(),
          },
        },
        limit: req.query.limit ?? 20,
        offset: req.query.offset ?? 0,
        order: [['datetime', 'ASC']],
        include: [{
          model: Charger,
          attributes: ['name', 'latitude', 'longitude'],
        }],
      });
      return res.json(shared.makeResponse(reservations));
    }

    else if (req.query.all){
      const reservations = await Reservation.findAll({
        where: {
          ChargerId: req.query.ChargerId,
        },
        limit: req.query.limit ?? 20,
        offset: req.query.offset ?? 0,
        order: [['datetime', 'DESC']],
        include: [{
          model: Charger,
          attributes: ['name', 'latitude', 'longitude'],
        }],
      });
      return res.json(shared.makeResponse(reservations));
    }

    else {
      throw new InvalidRequestError("Must specify either query parameter 'all' or 'upcoming'");
    }
  }

  else {
    throw new InvalidRequestError("Need to have some form of query parameters");
  }

}));

router.get('/reserved_times', shared.asyncWrapper(async (req, res) => {
  const { Reservation } = res.locals.models;
  
  if (!req.query.date || !req.query.chargerId)
  {
    throw new InvalidRequestError("Must specify both query parameter for date or charger id");
  }
  
  let date = new Date(req.query.date);
  let tomorrow = new Date(req.query.date);
  tomorrow.setDate(tomorrow.getDate() + 1);
  let charger = req.query.chargerId;


  const reservations = await Reservation.findAll({
    where: {
      ChargerId: charger,
      datetime: {
        [Op.between]: [date, tomorrow]
      }
    }
  })
  
  return res.json(shared.makeResponse(reservations));



}));


router.get('/current', shared.asyncWrapper(async (req, res) => {
  const { Reservation, Charger } = res.locals.models;
  let date = new Date(req.query.startDate);
  let startDate = new Date(req.query.startDate)
  startDate.setHours((startDate.getHours())%24, 0, 0, 0)
  if (startDate.getHours() + 1 > 24) {
    date.setDate(date.getDate() + 1)
  }
  else {
    date.setDate(date.getDate())
  }
  date.setHours((startDate.getHours()+1)%24, 0, 0, 0);
  const reservations = await Reservation.findAll({
    where: {
      UserId: req.query.UserId,
      datetime: {
        [Op.between]: [startDate, date],
      }
    },
    limit: 1,
    order: [['datetime', 'DESC']],

    include: [{
      model: Charger,
      attributes: ['name', 'latitude', 'longitude'],
    }],
  });

  return res.json(shared.makeResponse(reservations));
}));

// Create new reservation
router.post('/', shared.asyncWrapper(async (req, res) => {
  const { Reservation, User } = res.locals.models;
  const datetime = moment(req.body.datetime).startOf('hour').toDate();
  
  const authString = req.headers.authorization.replaceAll('"', "")

  const decodedAuth = verify(authString);
  if (!decodedAuth){
    console.log("Invalid, needs to login again");
    throw new UnauthenticatedError("Your session has expired, please login again");
  }

  if (!req.body.UserId){
    throw new InvalidRequestError("Must include the UserId for who is making the reservation");
  }

  if (req.body.UserId !== decodedAuth.id && !decodedAuth.admin){
    throw new UnauthorizedError("Cannot make reservations for someone you are not");
  }

  const existingReservation = await Reservation.findOne({
    where: {
      ChargerId: req.body.ChargerId,
      datetime: datetime,
    }
  })

  if (existingReservation){
    return res.json(shared.makeResponse(null, "The given charger is already reserved at that time."));
  }
  if (!req.body.cost) {
    return res.json(shared.makeResponse(null, "No cost was included"));
  }
  if (req.body.cost <= 0) {
    return res.json(shared.makeResponse(null, "Cost was <= 0"));
  }

  const user = await User.findByPk(req.body.UserId);

  let tokenCost = 1;
  if (!req.body.chargeAmount || req.body.chargeAmount < 0) {
    return res.json(shared.makeResponse(null, "Did not include charge amount"));
  }
  // TODO connect this with the database to get the cost of the reservation with the charger
  if (req.body.chargeAmount < 80) {
    tokenCost = 1;
  } else {
    tokenCost = 3;
  }

  if (user.numberOfChargerTokens < tokenCost) {
    return res.json(shared.makeResponse(null, "Not enough tokens to make the reservation"));
  }
  await User.update({numberOfChargerTokens: user.numberOfChargerTokens - tokenCost}, {
    where: {
      id: req.body.UserId
    },
  });


  const reservation = await Reservation.create({ ...req.body, datetime: datetime });
  return res.json(shared.makeResponse(reservation));
}));

// Delete Reservation
router.delete('/', shared.asyncWrapper(async (req, res) => {

  // TODO: This should check whether the user is an admin or owns the reservation
  const { Reservation } = res.locals.models;
  const authString = req.headers.authorization.replaceAll('"', "")

  if (!req.body.id){
    throw new InvalidRequestError("Must specify the id to delete");
  }

  const decodedAuth = verify(authString);
  if (!decodedAuth){
    throw new UnauthenticatedError("Your session has expired, please login again");
  }

  if (decodedAuth.admin) {
    await Reservation.destroy({
      where: {
        id: req.body.id,
      },
    });
  }

  else {
    await Reservation.destroy({
      where: {
        id: req.body.id,
        UserId: decodedAuth.id,
      },
    });
  }
  return res.json(shared.makeResponse("Successfully deleted the reservation"));
}));


module.exports = router;