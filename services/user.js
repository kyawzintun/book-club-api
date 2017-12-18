const { ServerError } = require('../helpers/server');
const { User } = require('../models');

async function updateUserInfo(userId, body) {
  const user = await User.findOneAndUpdate({"_id":userId},{$set :{"username": body.username, "address": body.address }},{new: true});
  try {
    return user;
  } catch (err) {
    throw new ServerError(err, 500);
  }
}


module.exports = {
  updateUserInfo
};
