// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init({ env: "blog-962265" });
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const { userId } = event;
  try {
    return await db
      .collection("notification")
      .where({ userId, read: false })
      .count();
  } catch (err) {
    throw err;
  }
};
