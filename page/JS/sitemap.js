var blogs = new Vue({
  el: '#blogs',
  data: {
    blogList: []
  },
  computed: {
    jumpTo() {
      return (id) => (location.href = '/blogDetail.html?id=' + id);
    }
  },
  created() {
    axios({
      url: '/blog/getAllBlog',
      method: 'get'
    }).then((res) => {
      this.blogList = res.data.data;
      console.log(this.blogList);
    });
  }
});
var category = new Vue({
  el: '#category',
  data: {
    tagList: []
  },
  created() {
    axios({
      url: '/blog/getTagsCloud',
      method: 'get'
    }).then((res) => {
      this.tagList = res.data.data;
    });
  }
});
