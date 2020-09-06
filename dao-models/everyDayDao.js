const sequelize = require('./DBUtil');
const { DataTypes } = require('sequelize');
const EveryDay = sequelize.define(
  'every_day',
  {
    content: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ctime: {
      type: DataTypes.NUMBER,
      allowNull: false
    }
  },
  {
    createdAt: false,
    updatedAt: false,
    paranoid: true
  }
);
exports.insertEveryDay = async function (content, ctime) {
  const ins = await EveryDay.create({ content, ctime });
  return ins;
};
exports.queryLastEveryDay = async function () {
  const ins = await EveryDay.findAll({
    order: [['id', 'DESC']],
    limit: 1
  });
  return ins;
};
