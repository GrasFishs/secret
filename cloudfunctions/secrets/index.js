// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init({ env: "blog-962265" });
const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  const { userId, page, size } = event;
  const { data } = await db
    .collection("secret")
    .skip((page - 1) * size)
    .limit(size)
    .get();
  for (const d of data) {
    const secretId = d._id;
    const { total: liked } = await db
      .collection("like")
      .where({
        secretId,
        userId
      })
      .count();
    d.liked = liked > 0;
  }
  return data;
};
