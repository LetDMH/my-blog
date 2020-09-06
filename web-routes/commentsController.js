const express = require('express');
const { asyncHandler } = require('../dao-models/getSendResult');
const router = express.Router();
const commentsDao = require('../dao-models/commentsDao');
const handleTime = require('../util/handleTime');
const captcha = require('svg-captcha');
router.post(
  '/sendComment',
  asyncHandler(async (req, res) => {
    const data = req.body;
    return await commentsDao.insertComments(
      data.blogId,
      data.commentId,
      data.name,
      data.content,
      data.email,
      handleTime.getNow()
    );
  })
);
router.get(
  '/getComment',
  asyncHandler(async (req, res) => {
    const data = req.query;
    // console.log(data);
    return await commentsDao.queryCommentsByBlogId(Number(data.id));
  })
);
// router.get(
//   '/getReply',
//   asyncHandler(async (req,res)=>{
//     const data = req.query;
//     return await commentsDao.queryReplyByCommentsId(Number(data.commentId))
//   })
// )
router.get(
  '/getCaptcha',
  asyncHandler(async (req, res) => {
    var img = captcha.create({ fontSize: 50, width: 100, height: 34 });
    return img;
  })
);
router.get(
  '/getLatestComments',
  asyncHandler(async (req, res) => {
    const data = req.query;
    return await commentsDao.queryCommentsByTime(Number(data.limit));
  })
);
module.exports = router;
