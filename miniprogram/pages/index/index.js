const app = getApp();

Page({
  data: {
    secrets: [],
    page: 1,
    size: 20,
    reachable: true,
    notifications: []
  },
  onShow() {
    this.getNotifications();
    this.getSecrets(1, this.data.size).then(secrets => {
      this.setData({ secrets });
    });
  },
  getNotifications() {
    if (app.globalData.userId === "") {
      wx.cloud
        .callFunction({
          name: "login"
        })
        .then(res => {
          const user = res.result;
          app.globalData.userId = user._id;
          wx.cloud
            .callFunction({
              name: "notificationCount",
              data: {
                userId: user._id
              }
            })
            .then(res => {
              const notifications = res.result;
              this.setData({ notifications });
            });
        });
    } else {
      wx.cloud
        .callFunction({
          name: "notificationCount",
          data: {
            userId: app.globalData.userId
          }
        })
        .then(res => {
          const notifications = res.result;
          this.setData({ notifications });
        });
    }
  },
  getSecrets(page, size) {
    wx.showToast({
      title: "加载中...",
      mask: true,
      icon: "loading"
    });
    if (app.globalData.userId === "") {
      return new Promise(resolve => {
        wx.cloud.callFunction({
          name: "login",
          success: res => {
            const user = res.result;
            app.globalData.userId = user._id;
            wx.cloud.callFunction({
              name: "secrets",
              data: {
                userId: user._id,
                page,
                size
              },
              success: res => {
                wx.hideToast();
                resolve(res.result);
              }
            });
          }
        });
      });
    } else {
      return new Promise(resolve => {
        wx.cloud.callFunction({
          name: "secrets",
          data: {
            userId: app.globalData.userId,
            page,
            size
          },
          success: res => {
            wx.hideToast();
            resolve(res.result);
          }
        });
      });
    }
  },
  like(e) {
    const userId = app.globalData.userId;
    const index = e.target.dataset.index;
    const secret = this.data.secrets[index];
    wx.showToast({
      title: "加载中...",
      mask: true,
      icon: "loading"
    });
    wx.cloud.callFunction({
      name: "like",
      data: {
        userId,
        secretId: secret._id,
        type: secret.liked ? 1 : 0
      },
      success: () => {
        wx.hideToast();
        // 非自赞
        if (!secret.liked && userId !== secret.userId) {
          wx.cloud.callFunction({
            name: "notify",
            data: {
              type: "like",
              content: "",
              secret
            }
          });
        }
        this.setData(
          {
            [`secrets[${index}].liked`]: !secret.liked,
            [`secrets[${index}].likeCount`]: secret.liked
              ? secret.likeCount - 1
              : secret.likeCount + 1
          },
          () => {
            wx.showToast({
              title: secret.liked ? "取消成功" : "点赞成功!",
              icon: "none"
            });
          }
        );
      }
    });
  },
  toWrite() {
    wx.navigateTo({ url: "/pages/write/index" });
  },

  toDetail(e) {
    console.log(e);
    const { index } = e.currentTarget.dataset;
    const secret = this.data.secrets[index];
    app.globalData.secret = secret;
    wx.navigateTo({ url: "/pages/detail/index?secretId=" + secret._id });
  },
  toNotify() {
    const ids = this.data.notifications.map(({ _id }) => _id);
    wx.navigateTo({
      url:
        "/pages/notify/index?ids=" +
        JSON.stringify(ids)
    });
  },
  onPullDownRefresh() {
    this.getSecrets(1, this.data.size).then(secrets => {
      wx.stopPullDownRefresh();
      this.setData({ secrets });
    });
  },
  onReachBottom() {
    if (this.data.reachable) {
      this.setData({ page: this.data.page + 1 }, () => {
        this.getSecrets(this.data.page, this.data.size).then(secrets => {
          if (secrets.length >= this.data.size) {
            this.setData({ secrets: [...this.data.secrets, ...secrets] });
          } else {
            wx.showToast({ title: "没有更多数据了", icon: "none" });
            this.setData({ reachable: false });
          }
        });
      });
    } else {
      wx.showToast({ title: "没有更多数据了", icon: "none" });
    }
  }
});
