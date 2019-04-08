// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init({ env: "blog-962265" });
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const { ids } = event;
  try {
    return await db
      .collection("notification")
      .where({
        _id: db.command.in(ids)
      })
      .update({
        data: {
          read: true
        }
      });
  } catch (err) {
    throw err;
  }
};
