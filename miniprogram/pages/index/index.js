const app = getApp();

Page({
  data: {
    secrets: [],
    page: 1,
    size: 20
  },
  onLoad() {
    this.getSecrets(1, this.data.size).then(secrets => {
      this.setData({ secrets });
    });
  },
  onShow() {
    this.getSecrets(1, this.data.size).then(secrets => {
      this.setData({ secrets });
    });
  },
  getSecrets(page, size) {
    return new Promise(resolve => {
      wx.cloud.callFunction({
        name: "secrets",
        data: {
          userId: app.globalData.userId,
          page,
          size
        },
        success: res => {
          resolve(res.result);
        }
      });
    });
  },
  like(e) {
    const userId = app.globalData.userId;
    const secretId = Number(e.target.dataset.id);
    const type = JSON.parse(e.target.dataset.liked) ? 1 : 0;
    wx.cloud.callFunction({
      name: "like",
      data: {
        userId,
        secretId,
        type
      },
      success: () => {
        this.setData({
          secrets: this.data.secrets.map(secret =>
            secret.id === id
              ? {
                  ...secret,
                  liked: !secret.liked
                }
              : secret
          )
        });
      }
    });
  },
  toWrite() {
    wx.navigateTo({ url: "/pages/write/index" });
  },

  onPullDownRefresh() {
    this.getSecrets(1, this.data.size).then(secrets => {
      this.setData({ secrets });
    });
  },
  onReachBottom() {
    this.setData({ page: this.data.page }, () => {
      this.getSecrets(this.data.page, this.data.size).then(secrets => {
        this.setData({ secrets: [...this.data.secrets, ...secrets] });
      });
    });
  }
});
