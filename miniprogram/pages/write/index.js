Page({
  data: {
    content: "",
    bgs: [
      "#880e4f",
      "#283593",
      "#1565c0",
      "#2e7d32",
      "#ef6c00",
      "#37474f",
      "#212121"
    ],
    bg: ""
  },
  onLoad() {
    this.setData({ bg: this.data.bgs[0] });
  },
  onPick(e) {
    const color = e.target.dataset.color;
    this.setData({ bg: color });
  },
  onContentChange(e) {
    const { value } = e.detail;
    if (value.length > 140) {
      wx.showToast({ title: "最多字数140", icon: "none" });
    }
    this.setData({
      content: value
    });
  },
  send() {
    if (this.data.content.length > 0) {
      wx.cloud.callFunction({
        name: "send",
        data: {
          userId: getApp().globalData.userId,
          content: this.data.content,
          bg: this.data.bg
        },
        success(res) {
          wx.showToast({ title: "发送成功！", icon: "none" });
          wx.navigateBack();
        }
      });
    } else {
      wx.showToast({ title: "内容不能为空", icon: "none" });
    }
  }
});
