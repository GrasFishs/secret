// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init({ env: "blog-962265" });
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const { type, content, secret } = event;
  try {
    return await db.collection("notification").add({
      data: {
        type,
        content,
        read: false,
        secret,
        createdTime: new Date()
      }
    });
  } catch (err) {
    throw err;
  }
};
