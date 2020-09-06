const sequelize = require('./DBUtil');
const { DataTypes } = require('sequelize');
const tags = sequelize.define(
  'tags',
  {
    tag: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ctime: {
      type: DataTypes.NUMBER,
      allowNull: false
    }
  },
  { createdAt: false, updatedAt: false, paranoid: true }
);
exports.insertTags = async function (tag, ctime) {
  return await tags.create({ tag, ctime });
};
exports.queryTags = async function (tag) {
  return await tags.findAll({
    where: {
      tag
    }
  });
};
exports.queryAllTags = async function () {
  return await tags.findAll()
};
