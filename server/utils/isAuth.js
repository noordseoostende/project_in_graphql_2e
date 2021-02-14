const jwt = require('jsonwebtoken');
require('dotenv').config();
const { AuthenticationError } = require('apollo-server-express');

const authorize = (req) => {
  const authorizationHeader = req.headers.authorization || '';
  if(!authorizationHeader) {
    req.isAuth = false;
    throw new AuthenticationError('u bent niet geautoriseerd 1');
  }
  const token = authorizationHeader.replace('Bearer ','');
  if(!token || token === ''){
    req.isAuth = false;
    throw new AuthenticationError('u bent niet geautoriseerd 2');
  }
  let decodedJWT;
  try {
    decodedJWT = jwt.verify(token,process.env.SECRET);
    if(!decodedJWT){
      req.isAuth = false;
      throw new AuthenticationError('u bent niet geautoriseerd 3');
    }
    req.isAuth = true;
    req._id = decodedJWT._id;
    req.email = decodedJWT.email;
  } catch (err) {
    req.isAuth = false;
    throw new AuthenticationError('u bent niet geautoriseerd 4');
    
  }

  return req;
}

module.exports = authorize;