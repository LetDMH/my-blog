const path = require('path');
const express = require('express');
const app = express();
app.use(express.static(path.resolve(__dirname, './page/')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/blog', require('./web-routes/everyDayController'));
app.use('/blog', require('./web-routes/blogController'));
app.use('/blog', require('./web-routes/commentsController'));
app.use('/blog', require('./web-routes/tagsController'));
app.use(require('./dao-models/errorMiddleware'));
app.listen(12306, () => {
  console.log('sever start!!!');
});
