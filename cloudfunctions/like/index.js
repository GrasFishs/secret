// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init({ env: "blog-962265" });
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const { userId, secretId, type } = event;
  // 点赞
  if (type === 0) {
    try {
      db.collection("like").add({
        data: {
          userId,
          secretId
        }
      });
      return true;
    } catch (err) {
      return false;
    }
  }
  //取消
  else {
    try {
      await db
        .collection("like")
        .where({
          userId,
          secretId
        })
        .remove();
      return true;
    } catch (err) {
      return false;
    }
  }
};
