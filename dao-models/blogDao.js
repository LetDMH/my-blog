const sequelize = require('./DBUtil');
const { DataTypes, Op } = require('sequelize');
const EditBlog = sequelize.define(
  'blog',
  {
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false
    },
    author: {
      type: DataTypes.STRING,
      allowNull: false
    },
    views: {
      type: DataTypes.NUMBER,
      allowNull: false
    },
    tags: {
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
exports.insertBlog = async function (
  title,
  content,
  author,
  views,
  ctime,
  tags
) {
  const ins = await EditBlog.create({
    title,
    content,
    author,
    views,
    ctime,
    tags
  });
  return ins;
};
exports.deleteBlog = async function (id) {
  return await EditBlog.destroy({
    where: {
      id
    }
  });
};
exports.addViews = async function (id) {
  var data = (
    await EditBlog.findAll({
      raw: true,
      where: {
        id
      }
    })
  )[0].views;
  return await EditBlog.update(
    { views: data + 1 },
    {
      where: {
        id
      }
    }
  );
};
exports.queryAllBlog = async function () {
  return await EditBlog.findAll();
};
exports.queryBlogCount = async function () {
  return await EditBlog.findAndCountAll();
};
exports.queryBlogByPage = async function (offset = 0, limit = 5) {
  return await EditBlog.findAll({
    order: [['id', 'DESC']],
    limit,
    offset
  });
};
exports.queryBlogByViews = async function () {
  return await EditBlog.findAll({
    order: [['views', 'DESC']],
    limit: 10
  });
};
exports.queryBlogById = async function (id) {
  return await EditBlog.findAll({
    raw: true,
    where: {
      id
    }
  });
};
exports.queryBlogBySearch = async function (search) {
  //select * from blog where title like concat(concat('%', ?), '%') or content like concat(concat('%', ?), '%');
  return await EditBlog.findAndCountAll({
    where: {
      [Op.or]: [
        {
          title: {
            [Op.like]: '%' + search + '%'
          }
        },
        {
          content: {
            [Op.like]: '%' + search + '%'
          }
        }
      ]
    }
  });
};
