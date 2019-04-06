const app = getApp();

Page({
  data: {
    secrets: [],
    page: 1,
    size: 20
  },
  onLoad() {
    this.setData({
      secrets: this.getSecrets()
    });
  },
  getSecret() {
    return {
      id: this.data.secrets.length,
      content: Math.random(),
      bg: [
        "#880e4f",
        "#283593",
        "#1565c0",
        "#2e7d32",
        "#ef6c00",
        "#37474f",
        "#212121"
      ][Math.floor(Math.random() * 5)],
      likeCount: Math.floor(Math.random() * 10),
      commentCount: Math.floor(Math.random() * 10),
      liked: Math.random() > 0.5
    };
  },
  getSecrets() {
    return Array.from({ length: 5 }).map(_ => this.getSecret());
  },
  like(e) {
    const id = e.target.dataset.id;
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
  },
  toWrite() {
    wx.navigateTo({ url: "/pages/write/index" });
  },

  onPullDownRefresh() {
    wx.showNavigationBarLoading();
    setTimeout(() => {
      this.setData({
        secrets: this.getSecrets()
      });
      wx.hideNavigationBarLoading();
      wx.stopPullDownRefresh();
    }, 3000);
  },
  onReachBottom() {
    wx.showNavigationBarLoading();
    this.setData(
      {
        secrets: [...this.data.secrets, ...this.getSecrets()]
      },
      () => {
        wx.hideNavigationBarLoading();
      }
    );
  }
});
