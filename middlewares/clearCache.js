const { clearHash } = require('../services/cache');

module.exports = async (req, res, next) =>{
    await next();// this will allow the route handler to run first and then execute the below function

    clearHash(req.user.id);
}