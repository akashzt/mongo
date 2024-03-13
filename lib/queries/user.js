const db = require("../../models/user");
const constants = require("../../constants/constants");
const logger = require('../../lib/logger'); 
const { options } = require("superagent");
const uuid= require("uuid");

createUser = async function (opts) {
  try {
    const user = await db.create(opts);
    return user;
  } catch (err) {
    logger.info(`Error in creating user db query: ${err.message}`);
    throw new Error(`Error in creating User`);
  }
};

findUser = async function (opts) {
  console.log(opts);
  const user = await db.findById( opts );
  return user;
};

getUserByEmail = async function (email) {
  const user = (await db.findOne({ email: email  }).exec());
  return user;
};

updateUser = async function (id, user) {
  await db.findByIdAndUpdate(id,user);
  const updatedUser = (await db.findById(id));
  return updatedUser ;
};
getAllUsers = async function (opts) {
  return db.findAll({
    limit: opts.limit,
    offset: opts.limit * (opts.page - constants.Numbers.one),
    order: [["createdAt", "DESC"]],
    attributes: opts.userProfileFields,
  });
};

getArrayUsers = async function (opts) {
  try {
   return db.findAll({
      where: { userId: { [Sequelize.Op.in]: opts } },
      attributes: ['email','userId'],
      raw: true
    });
  } catch (err) {
    logger.info(`Error in finding user email db query: ${err.message}`);
    throw new Error(`Error in finding a user using array of user id: ${err}`);
  }
};
createUserAddress = async function (id, add) {
  await db.findById(id).then(user=>{
    if(!user){
      throw new Error(`Error in finding a user `);
    }
    user.addresses.push(add);
    // save the address
    user.save();
    

  });
  const updatedUser = (await db.findById(id));
  return updatedUser ;
};

module.exports = {
  createUser,
  findUser,
  getUserByEmail,
  updateUser,
  getAllUsers,
  getArrayUsers,
  createUserAddress
};
