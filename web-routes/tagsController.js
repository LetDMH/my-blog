const express = require('express');
const { asyncHandler } = require('../dao-models/getSendResult');
const router = express.Router();
const tagsDao = require('../dao-models/tagsDao');
const handleTime = require('../util/handleTime');
router.get(
  '/getTagsCloud',
  asyncHandler(async (req, res) => {
    return (await tagsDao.queryAllTags()).sort(() => Math.random() - 0.5);
  })
);
module.exports = router;
