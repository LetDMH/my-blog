function timeFormat(unixTime) {
  var date = new Date(unixTime * 1000);
  return (
    date.getFullYear() +
    '-' +
    (date.getMonth() + 1) +
    '-' +
    date.getDate() +
    ' ' +
    date.getHours() +
    ':' +
    (minute =
      date.getMinutes() > 10 ? date.getMinutes() : '0' + date.getMinutes())
  );
}
var blogDetail = new Vue({
  el: '#blogDetail',
  data: {
    title: '',
    author: '',
    tags: '',
    ctime: '',
    views: 0,
    content: ''
  },
  created() {
    if (location.search.indexOf('?') >= 0) {
      var searchList = location.search.split('?')[1].split('&');
      for (var i = 0; i < searchList.length; i++) {
        if (searchList[i].split('=')[0] == 'id') {
          var id = searchList[i].split('=')[1];
          axios({
            url: '/blog/getBlogDetail',
            method: 'get',
            params: {
              id
            }
          }).then(function (res) {
            const data = res.data.data[0];
            // console.log(data);
            blogDetail.title = data.title;
            blogDetail.author = data.author;
            blogDetail.tags = data.tags;
            blogDetail.ctime = timeFormat(data.ctime);
            blogDetail.views = data.views;
            blogDetail.content = data.content;
          });
          axios({
            url: '/blog/addViews',
            method: 'get',
            params: {
              id
            }
          });
        }
      }
    }
  }
});
var sendComment = new Vue({
  el: '#sendComment',
  data: {
    randomCode: '123',
    randomSvg: null,
    commentId: 0,
    name: '',
    email: '',
    content: '',
    inputRandomCode: ''
  },
  methods: {
    addComment() {
      if (
        this.name == '' ||
        this.email == '' ||
        this.content == '' ||
        this.inputRandomCode == ''
      ) {
        alert('输入的信息、内容或验证码不能为空!');
        return;
      }
      if (this.inputRandomCode.toLowerCase() != this.randomCode.toLowerCase()) {
        alert('二维码输入不正确！');
        return;
      }
      if (location.search.indexOf('?') >= 0) {
        var searchList = location.search.split('?')[1].split('&');
        for (var i = 0; i < searchList.length; i++) {
          if (searchList[i].split('=')[0] == 'id') {
            var blogId = searchList[i].split('=')[1];
            axios({
              url: '/blog/sendComment',
              method: 'post',
              data: {
                blogId,
                commentId: sendComment.commentId,
                name: sendComment.name,
                email: sendComment.email,
                content: sendComment.content
              }
            }).then((res) => {
              console.log(res);
              alert('提交成功！');
              // sendComment.name = '';
              // sendComment.email = '';
              // sendComment.content = '';
              // sendComment.inputRandomCode = '';
              // sendComment.commentId = 0;
              location.reload();
            });
          }
        }
      }
    },
    changeCaptcha() {
      axios({
        url: '/blog/getCaptcha',
        method: 'get'
      }).then((res) => {
        this.randomCode = res.data.data.text;
        this.randomSvg = res.data.data.data;
      });
    }
  },
  created() {
    axios({
      url: '/blog/getCaptcha',
      method: 'get'
    }).then((res) => {
      this.randomCode = res.data.data.text;
      this.randomSvg = res.data.data.data;
    });
  }
});
var commentsList = new Vue({
  el: '#commentsList',
  data: {
    dataList: [],
    replyList: [],
    title: ''
  },
  computed: {
    reply() {
      return (commentId) => {
        sendComment.commentId = commentId;
        console.log(sendComment.commentId);
      };
    },
    getTitle() {
      return blogDetail.title;
    }
  },
  created() {
    if (location.search.indexOf('?') >= 0) {
      var searchList = location.search.split('?')[1].split('&');
      for (var i = 0; i < searchList.length; i++) {
        if (searchList[i].split('=')[0] == 'id') {
          var id = searchList[i].split('=')[1];
          axios({
            url: '/blog/getComment',
            method: 'get',
            params: {
              id
            }
          }).then((res) => {
            const data = res.data.data;
            const list = data.map((item) => {
              item.ctime = timeFormat(item.ctime);
              return item;
            });
            const replyMsg = [];
            for (let i = 0; i < list.length; i++) {
              for (let j = i + 1; j < list.length; j++) {
                if (list[i].id == list[j].comment_id) {
                  let rep = list.splice(j, 1);
                  replyMsg.push(...rep);
                }
              }
            }
            commentsList.replyList = replyMsg;
            commentsList.dataList = list;
          });
        }
      }
    }
  }
});
