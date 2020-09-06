const sequelize = require('./DBUtil');
const { DataTypes, Op } = require('sequelize');
const comments = sequelize.define(
  'comments',
  {
    blog_id: {
      type: DataTypes.NUMBER,
      allowNull: false
    },
    comment_id: {
      type: DataTypes.NUMBER,
      allowNull: false
    },
    user_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    comment: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
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
exports.insertComments = async (
  blog_id,
  comment_id,
  user_name,
  comment,
  email,
  ctime
) => {
  return await comments.create({
    blog_id,
    comment_id,
    user_name,
    comment,
    email,
    ctime
  });
};
exports.queryCommentsByBlogId = async (blog_id) => {
  return await comments.findAll({
    where: {
      blog_id
    }
  });
};
exports.queryCommentsByTime = async (limit) => {
  return await comments.findAll({
    order: [['id', 'DESC']],
    limit
  });
};
exports.queryReplyByCommentsId = async (comment_id) =>{
  return await comments.findAll({
    where:{
      comment_id
    }
  })
}
