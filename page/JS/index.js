function timeFormat(unixTime) {
  var date = new Date(unixTime * 1000);
  return (
    date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate()
  );
}
var everyDay = new Vue({
  el: '#every_day',
  data: {
    english: '',
    chinese: '',
    author: '',
    dateTime: ''
  },
  created() {
    axios({
      url: '/blog/queryEveryDay',
      method: 'get'
    }).then((res) => {
      var data = res.data.data[0].content;
      // console.log(res.data.data[0]);
      this.english = data.split('.')[0];
      this.author = data.split('。')[1];
      this.chinese = data.split('.')[1].split('。')[0];
      this.dateTime = timeFormat(res.data.data[0].ctime);
    });
  }
});
var articleList = new Vue({
  el: '#article_list',
  data: {
    dataList: []
  },
  computed: {
    updateData() {
      return this.dataList;
    }
  },
  created() {
    if (location.search.indexOf('?') < 0) {
      axios({
        method: 'get',
        url: '/blog/getBlogByPage',
        params: {
          offset: 0,
          limit: 5
        }
      }).then((res) => {
        this.dataList = res.data.data.map((item) => {
          item.ctime = timeFormat(item.ctime);
          item.content = item.content.replace(/<img[\w\W]*>/g, '');
          item.content = item.content.replace(/<[^>]+>/g, '');
          item.content = item.content.replace(/&lt;.*&gt;/g, '');
          item.content = item.content.substring(0, 250) + '...';
          return item;
        });
        // console.log(this.dataList);
      });
    } else {
      if (location.search.indexOf('?') >= 0) {
        var searchList = location.search.split('?')[1].split('&');
        for (var i = 0; i < searchList.length; i++) {
          if (searchList[i].split('=')[0] == 'tagId') {
            var id = searchList[i].split('=')[1];
            axios({
              url: '/blog/getBlogByTagId',
              method: 'get',
              params: {
                id,
                limit: 5,
                offset: 0
              }
            }).then((res) => {
              console.log(res.data.data);
              this.dataList = res.data.data.map((item) => {
                item.ctime = timeFormat(item.ctime);
                item.content = item.content.replace(/<img[\w\W]*>/g, '');
                item.content = item.content.replace(/<[^>]+>/g, '');
                item.content = item.content.replace(/&lt;.*&gt;/g, '');
                item.content = item.content.substring(0, 250) + '...';
                return item;
              });
            });
          }
        }
      }
    }
  }
});
var pagination = new Vue({
  el: '#pagination',
  data: {
    total: 0,
    now: 1,
    limit: 5,
    pageList: []
  },
  methods: {
    refresh() {
      //总页数+（总页数/每页最大记录数的最大余数）/ 每页最大记录数
      var totalPage = Math.floor((this.total + this.limit - 1) / this.limit);
      // var totalPage = Math.ceil(this.total / this.limit);
      this.pageList = [];
      this.pageList.push({
        text: '上一页',
        pageNum: this.now > 1 ? this.now - 1 : 1
      });
      if (this.now - 2 > 0) {
        this.pageList.push({
          text: this.now - 2,
          pageNum: this.now - 2
        });
      }
      if (this.now - 1 > 0) {
        this.pageList.push({
          text: this.now - 1,
          pageNum: this.now - 1
        });
      }
      this.pageList.push({ text: this.now, pageNum: this.now });
      if (this.now + 1 <= totalPage) {
        this.pageList.push({
          text: this.now + 1,
          pageNum: this.now + 1
        });
      }
      if (this.now + 2 <= totalPage) {
        this.pageList.push({
          text: this.now + 2,
          pageNum: this.now + 2
        });
      }
      this.pageList.push({
        text: '下一页',
        pageNum: this.now < totalPage ? this.now + 1 : totalPage
      });
    }
  },
  computed: {
    changePage() {
      return (pageNum) => {
        pagination.now = pageNum;
        if (location.search.indexOf('?') < 0) {
          axios({
            method: 'get',
            url: '/blog/getBlogByPage',
            params: {
              offset: (pageNum - 1) * pagination.limit,
              limit: pagination.limit
            }
          }).then((res) => {
            articleList.dataList = res.data.data.map((item) => {
              // console.log(res);
              item.ctime = timeFormat(item.ctime);
              item.content = item.content.replace(/<img[\w\W]*>/g, '');
              item.content = item.content.replace(/<[^>]+>/g, '');
              item.content = item.content.replace(/&lt;.*&gt;/g, '');
              item.content = item.content.substring(0, 250) + '...';
              return item;
            });
            // console.log(articleList.dataList);
          });
        } else {
          var searchList = location.search.split('?')[1].split('&');
          for (var i = 0; i < searchList.length; i++) {
            if (searchList[i].split('=')[0] == 'tagId') {
              var id = searchList[i].split('=')[1];
              axios({
                url: '/blog/getBlogByTagId',
                method: 'get',
                params: {
                  id,
                  limit: pagination.limit,
                  offset: (pageNum - 1) * pagination.limit
                }
              }).then();
            }
          }
        }
        pagination.refresh();
        window.scrollTo(0, 0);
      };
    }
  },
  created() {
    if (location.search.indexOf('?') < 0) {
      axios({
        method: 'get',
        url: '/blog/getTotalBlogCount'
      }).then((res) => {
        // console.log(res.data.data);
        this.total = res.data.data.count;
        this.refresh();
      });
    } else {
      var searchList = location.search.split('?')[1].split('&');
      for (var i = 0; i < searchList.length; i++) {
        if (searchList[i].split('=')[0] == 'tagId') {
          var id = searchList[i].split('=')[1];
          axios({
            method: 'get',
            url: '/blog/getTotalBlogCountByTagId',
            params: {
              id
            }
          }).then((res) => {
            // console.log(res)
            this.total = res.data.data.count;
            this.refresh();
          });
        } else {
          var search = searchList[0].split('=')[1];
          axios({
            url: '/blog/getBlogBySearch',
            method: 'get',
            params: {
              search
            }
          }).then((res) => {
            console.log(res);
            articleList.dataList = res.data.data.rows.map((item) => {
              item.ctime = timeFormat(item.ctime);
              item.content = item.content.replace(/<img[\w\W]*>/g, '');
              item.content = item.content.replace(/<[^>]+>/g, '');
              item.content = item.content.replace(/&lt;.*&gt;/g, '');
              item.content = item.content.substring(0, 250) + '...';
              return item;
            });
            pagination.total = res.data.data.count;
            pagination.refresh();
          });
        }
      }
    }
  }
});
