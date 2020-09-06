const express = require('express');
const { asyncHandler } = require('../dao-models/getSendResult');
const router = express.Router();
const blogDao = require('../dao-models/blogDao');
const tagsDao = require('../dao-models/tagsDao');
const tagsBlogMappingDao = require('../dao-models/tagBlogMappingDao');
const handleTime = require('../util/handleTime');
router.post(
  '/editBlog',
  asyncHandler(async (req, res) => {
    const data = req.body;
    // console.log(data);
    const tags = data.tags.split(',');
    const blogRes = await blogDao.insertBlog(
      data.title,
      decodeURI(data.content),
      data.author,
      0,
      handleTime.getNow(),
      data.tags
    );
    for (let i = 0; i < tags.length; i++) {
      let tagRes = await tagsDao.queryTags(tags[i]);
      if (tagRes.length > 0) {
        await tagsBlogMappingDao.insertBlogTagsMapping(
          blogRes.id,
          tagRes[0].id,
          handleTime.getNow()
        );
      } else {
        let res = await tagsDao.insertTags(tags[i], handleTime.getNow());
        await tagsBlogMappingDao.insertBlogTagsMapping(
          blogRes.id,
          res.id,
          handleTime.getNow()
        );
      }
    }
    return blogRes;
  })
);
router.get(
  '/getBlogByPage',
  asyncHandler(async (req, res) => {
    const data = req.query;
    return await blogDao.queryBlogByPage(
      Number(data.offset),
      Number(data.limit)
    );
  })
);
router.get(
  '/getTotalBlogCount',
  asyncHandler(async (req, res) => {
    return await blogDao.queryBlogCount();
  })
);
router.get(
  '/getBlogDetail',
  asyncHandler(async (req, res) => {
    const data = req.query;
    return await blogDao.queryBlogById(Number(data.id));
  })
);
router.get(
  '/getAllBlog',
  asyncHandler(async (req, res) => {
    // res.setHeader('cache-control', 'no-store')
    return await blogDao.queryAllBlog();
  })
);
router.get(
  '/addViews',
  asyncHandler(async (req, res) => {
    const data = req.query;
    return await blogDao.addViews(Number(data.id));
  })
);
router.get(
  '/getBlogByTagId',
  asyncHandler(async (req, res) => {
    const data = req.query;
    const result = await tagsBlogMappingDao.queryBlogTagsMappingByTagsId(
      Number(data.id)
    );
    // console.log(result)
    async function insetBlog() {
      const blogList = [];
      for (let i = 0; i < result.length; i++) {
        const blog = await blogDao.queryBlogById(result[i].blog_id);
        blogList.push(...blog);
      }
      return blogList;
    }
    return insetBlog().then((res) => res);
  })
);
router.get(
  '/getTotalBlogCountByTagId',
  asyncHandler(async (req, res) => {
    const data = req.query;
    return await tagsBlogMappingDao.queryBlogTagsMappingCountByTagsId(
      Number(data.id)
    );
  })
);
router.get(
  '/getBlogBySearch',
  asyncHandler(async (req,res)=>{
    const data = req.query;
    return await blogDao.queryBlogBySearch(data.search)
  })
)
module.exports = router;
