// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init({ env: "blog-962265" });
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const { userId } = event;
  try {
    const { data } = await db
      .collection("notification")
      .where({ "secret.userId": userId, read: false })
      .get();
    return data;
  } catch (err) {
    throw err;
  }
};
