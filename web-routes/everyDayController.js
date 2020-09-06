const express = require('express');
const { asyncHandler } = require('../dao-models/getSendResult');
const router = express.Router();
const handleTime = require('../util/handleTime');
const everyDayDao = require('../dao-models/everyDayDao');
router.post(
  '/addEveryDay',
  asyncHandler(async (req, res) => {
    const data = req.body;
    // console.log(data.content);
    return await everyDayDao.insertEveryDay(decodeURI(data.content), handleTime.getNow());
  })
);
router.get(
  '/queryEveryDay',
  asyncHandler(async (req, res) => {
    return await everyDayDao.queryLastEveryDay();
  })
);
module.exports = router;
