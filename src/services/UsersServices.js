// import jwt from 'jwt-simple';
import jwt from 'jsonwebtoken';
import isEmail from 'validator/lib/isEmail';
import isMobilePhone from 'validator/lib/isMobilePhone';
import config from '../config/config';

import User from '../models/User';

const roleAuthorization = roles => {
  return (req, res, next) => {
    const { user } = req;

    User.findById(user._id, (err, foundUser) => {
      if (err) {
        res.status(422).json({ result: 'No user found!' });
        return next(err);
      }

      if (roles.indexOf(foundUser.role) > -1) {
        return next();
      }

      res
        .status(401)
        .json({ result: 'You are not authorized to view this content!' });
      return next('Unauthorized');
    });
  };
};

const generateToken = user => {
  return jwt.sign(user, config.jwtSecret, {
    expiresIn: '30d'
  });
};

const setUserInfo = user => {
  return {
    _id: user._id,
    phone: user.phone,
    name: user.name,
    email: user.email,
    role: user.role
  };
};

const validate = data => {
  if (!isMobilePhone(data.phone, 'ru-RU')) {
    return 'Incorrect phone number';
  }
  if (!data.phone) {
    return "Phone number can't be empty";
  }

  if (data.email && !isEmail(data.email)) {
    return 'Incorrect email';
  }

  if (!data.password) {
    return "Pasword can't be empty";
  }

  return '';
};

module.exports = {
  roleAuthorization,
  validate,
  generateToken,
  setUserInfo
};
