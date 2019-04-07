const app = getApp();

const pick = arr => arr[Math.floor(Math.random() * arr.length)];

const avatars = [
  "cloud://blog-962265.626c-blog-962265/animal1.png",
  "cloud://blog-962265.626c-blog-962265/animal2.png",
  "cloud://blog-962265.626c-blog-962265/animal3.png",
  "cloud://blog-962265.626c-blog-962265/animal4.png",
  "cloud://blog-962265.626c-blog-962265/animal5.png",
  "cloud://blog-962265.626c-blog-962265/animal6.png",
  "cloud://blog-962265.626c-blog-962265/animal7.png",
  "cloud://blog-962265.626c-blog-962265/animal8.png",
  "cloud://blog-962265.626c-blog-962265/animal9.png"
];

Page({
  data: {
    id: "",
    isFocus: false,
    secret: null,
    height: 0,
    comments: [],
    content: "",
    currentId: ""
  },
  onLoad(options) {
    this.setData({ secret: app.globalData.secret });
    const id = options.secretId;
    this.getComments(id);
  },
  getComments(secretId) {
    wx.showToast({
      title: "加载中...",
      mask: true,
      icon: "loading"
    });
    wx.cloud
      .callFunction({
        name: "comments",
        data: {
          secretId
        }
      })
      .then(res => {
        this.setData(
          {
            comments: res.result.data.map((comment, index) => ({
              ...comment,
              createdTIme: this.formatDate(comment.createdTIme)
            }))
          },
          () => {
            wx.hideToast();
          }
        );
      })
      .catch(err => {
        console.error(err);
      });
  },
  like(e) {
    const userId = app.globalData.userId;
    const secretId = e.target.dataset.id;
    const type = JSON.parse(e.target.dataset.liked) ? 1 : 0;
    wx.showToast({
      title: "加载中...",
      mask: true,
      icon: "loading"
    });
    wx.cloud.callFunction({
      name: "like",
      data: {
        userId,
        secretId,
        type
      },
      success: () => {
        wx.hideToast();
        const secret = this.data.secret;
        this.setData(
          {
            ["secret.liked"]: !secret.liked,
            ["secret.likeCount"]:
              type === 1 ? secret.likeCount - 1 : secret.likeCount + 1
          },
          () => {
            wx.showToast({
              title: type === 0 ? "点赞成功！" : "取消成功！",
              icon: "none"
            });
          }
        );
      }
    });
  },
  onCommentChange(e) {
    this.setData({ content: e.detail.value });
  },
  send() {
    if (this.data.content) {
      wx.showToast({
        title: "加载中...",
        mask: true,
        icon: "loading"
      });
      let avatar;
      const findSelfComments = this.data.comments.filter(
        comment => comment.userId === app.globalData.userId
      );
      if (findSelfComments.length > 0) {
        avatar = findSelfComments[0].avatar;
      }
      const comment = {
        content: this.data.content,
        avatar: avatar ? avatar : pick(avatars),
        userId: app.globalData.userId,
        secretId: this.data.secret._id,
        type: this.data.currentId === "" ? 0 : 1,
        parentId: this.data.currentId
      };
      console.log(comment);
      wx.cloud
        .callFunction({
          name: "comment",
          data: comment
        })
        .then(res => {
          wx.hideToast();
          wx.showToast({ title: "评论成功！", icon: "none" });
          this.setData({
            content: "",
            isFocus: false,
            ["secret.commentCount"]: this.data.secret.commentCount + 1
          });
          this.getComments(this.data.secret._id);
        })
        .catch(err => {
          wx.hideToast();
          console.log(err);
        });
    } else {
      wx.showToast({ title: "内容不能为空", icon: "none" });
    }
  },
  onSelectComment(e) {
    const parentId = e.currentTarget.dataset.id;
    console.log(parentId);
    this.setData({ currentId: parentId, isFocus: true });
  },
  input() {
    this.setData({ isFocus: true });
  },
  onFocus(e) {
    this.setData({ height: e.detail.height ? e.detail.height : 0 });
  },
  onBlur(e) {
    console.log(e);
    const blurTimer = setTimeout(() => {
      this.setData({
        currentId: "",
        isFocus: false,
        height: 0
      });
      clearTimeout(blurTimer);
    }, 1000);
  },
  formatDate(date) {
    const d = new Date(date);
    const m = (d.getMonth() + 1).toString().padStart(2, "0");
    const dy = d
      .getDate()
      .toString()
      .padStart(2, "0");
    const h = d
      .getHours()
      .toString()
      .padStart(2, "0");
    const mm = d
      .getMinutes()
      .toString()
      .padStart(2, "0");
    return m + "月" + dy + "日 " + h + ":" + mm;
  }
});
