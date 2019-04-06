// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init({ env: "blog-962265" });
const db = cloud.database();
const _ = db.command;
// 云函数入口函数
exports.main = async (event, context) => {
  const { userId, page, size } = event;
  const { data } = await db
    .collection("secret")
    .skip((page - 1) * size)
    .limit(size)
    .where({
      userId: _.neq(userId)
    })
    .get();
  
};
