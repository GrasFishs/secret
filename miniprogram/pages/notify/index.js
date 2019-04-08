const app = getApp();

Page({
  data: {
    page: 0,
    size: 20,
    reachable: true,
    notifications: []
  },
  onLoad(option) {
    const ids = JSON.parse(option.ids);
    this.readNotify(ids);
  },
  onShow() {
    this.getNotifications(1).then(notifications => {
      this.setData({ notifications });
      if (notifications.length < 20) {
        this.setData({ reachable: false });
      }
    });
  },
  getNotifications(page) {
    if (this.data.reachable) {
      wx.showToast({
        title: "加载中...",
        mask: true,
        icon: "loading"
      });
      return new Promise((resolve, reject) => {
        wx.cloud
          .callFunction({
            name: "notifications",
            data: {
              page,
              size: this.data.size,
              userId: app.globalData.userId
            }
          })
          .then(res => {
            wx.hideToast();
            resolve(res.result);
          })
          .catch(err => {
            wx.hideToast();
            reject(err);
          });
      });
    } else {
      wx.showToast({ title: "没有更多数据了", icon: "none" });
    }
  },
  readNotify(ids) {
    wx.cloud.callFunction({
      name: "read",
      data: {
        ids
      }
    });
  },
  toDetail(e) {
    const id = e.currentTarget.dataset.id;
    console.log(e);
    wx.navigateTo({ url: "/pages/detail/index?id=" + id });
  },
  onPullDownRefresh() {
    this.getNotifications(1).then(notifications => {
      wx.stopPullDownRefresh();
      this.setData({ notifications });
      if (notifications.length < 20) {
        this.setData({ reachable: false });
      }
    });
  },
  onReachBottom() {
    this.getNotifications(this.data.page + 1).then(notifications => {
      this.setData({ notifications });
      if (notifications.length < 20) {
        this.setData({ reachable: false });
      }
    });
  }
});
