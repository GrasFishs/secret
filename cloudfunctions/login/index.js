const cloud = require("wx-server-sdk");

// 初始化 cloud
cloud.init({ env: "blog-962265" });
const db = cloud.database();

exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext();
  const openId = wxContext.OPENID;
  const { data } = await db
    .collection("user")
    .where({ openId })
    .get();
  if (data.length > 0) {
    return data[0];
  } else {
    return await db.collection("user").add({
      data: {
        openId,
        createdTime: new Date()
      }
    });
  }
};
