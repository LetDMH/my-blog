const { Sequelize } = require('sequelize');
const { sqlLogger } = require('../logger');
const sequelize = new Sequelize('my-blog', 'root', 'edisonchen', {
  host: 'localhost',
  dialect: 'mysql',
  logging: (msg) => {
    sqlLogger.debug(msg);
  },
  define: {
    freezeTableName: true,
    timestamps: false
  }
});
module.exports = sequelize;
