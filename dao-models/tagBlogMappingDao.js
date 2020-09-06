const sequelize = require('./DBUtil');
const { DataTypes } = require('sequelize');
const tagBlogMappingDao = sequelize.define(
  'tag_blog_mapping',
  {
    tags_id: {
      type: DataTypes.NUMBER,
      allowNull: false
    },
    blog_id: {
      type: DataTypes.NUMBER,
      allowNull: false
    },
    ctime: {
      type: DataTypes.NUMBER,
      allowNull: false
    }
  },
  { createdAt: false, updatedAt: false, paranoid: true }
);
exports.insertBlogTagsMapping = async function (blog_id, tags_id, ctime) {
  return await tagBlogMappingDao.create({ blog_id, tags_id, ctime });
};
exports.queryBlogTagsMappingByBlogId = async function (blog_id) {
  return await tagBlogMappingDao.findAll({
    where: {
      blog_id
    }
  });
};
exports.queryBlogTagsMappingByTagsId = async function (
  tags_id,
  offset = 0,
  limit = 5
) {
  return await tagBlogMappingDao.findAll({
    raw: true,
    where: {
      tags_id
    },
    limit,
    offset
  });
};
exports.queryBlogTagsMappingCountByTagsId = async function (tags_id) {
  return await tagBlogMappingDao.findAndCountAll({
    where: {
      tags_id
    }
  });
};
