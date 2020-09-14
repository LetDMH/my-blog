function timeFormat1(unixTime) {
  var date = new Date(unixTime * 1000).getDate();
  var now = new Date().getDate();
  var diff = now - date;
  return (diff = diff / 7 > 1 ? parseInt(diff / 7) + '周前' : diff + '天前');
}
var tagsCloud = new Vue({
  el: '#tags-cloud',
  //ES6 PHP C# 数据结构 python nginx C++
  data: {
    tags: []
  },
  computed: {
    randomColor() {
      return () => {
        var r = Math.floor(Math.random() * 205) + 50;
        var g = Math.floor(Math.random() * 205) + 50;
        var b = Math.floor(Math.random() * 205) + 50;
        return `rgb(${r},${g},${b})`;
      };
    },
    randomSize() {
      return () => {
        var size = Math.floor(Math.random() * 20) + 10;
        return `${size}px`;
      };
    }
  },
  created() {
    axios({
      url: '/blog/getTagsCloud',
      method: 'get'
    }).then((res) => {
      this.tags = res.data.data;
      footer.tags = res.data.data;
    });
  }
});
var popularNews = new Vue({
  el: '#popular-news',
  data: {
    allNews: []
  },
  computed: {},
  created() {
    axios({
      method: 'get',
      url: '/blog/getBlogByPage',
      params: {
        offset: 0,
        limit: 10
      }
    }).then((res) => {
      this.allNews = res.data.data;
      console.log(this.allNews)
    });
  }
});
var latestComments = new Vue({
  el: '#latest-comments',
  data: {
    commentsList: []
  },
  created() {
    axios({
      url: '/blog/getLatestComments',
      method: 'get',
      params: {
        limit: 6
      }
    }).then((res) => {
      // console.log(res);
      const data = res.data.data;
      this.commentsList = data.map((item) => {
        item.ctime = timeFormat1(item.ctime);
        return item;
      });
    });
  }
});
var footer = new Vue({
  el: '#footer',
  data: {
    tags: []
  }
});
var search = new Vue({
  el: '#search',
  data: {
    search: '',
  },
  methods: {
    sendSearch() {
      location.href='/?search=' + this.search
    }
  }
});
