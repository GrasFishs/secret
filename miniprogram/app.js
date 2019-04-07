//app.js
App({
  globalData: {
    userId: "",
    secret: null
  },
  onLaunch: function() {
    if (!wx.cloud) {
      console.error("请使用 2.2.3 或以上的基础库以使用云能力");
    } else {
      wx.cloud.init({
        traceUser: true,
        env: "blog-962265"
      });
      wx.cloud.callFunction({
        name: "login",
        success: res => {
          const user = res.result;
          this.globalData.userId = user._id;
        }
      });
    }
  }
});
