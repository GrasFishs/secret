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
    const [{ data: likes }, { total: commentCount }] = await Promise.all([
      db
        .collection("like")
        .where({
          secretId
        })
        .get(),
      db
        .collection("comment")
        .where({
          secretId
        })
        .count()
    ]);
    d.likeCount = likes.length;
    d.liked = likes.filter(like => like.userId === userId).length > 0;
    d.commentCount = commentCount;
  }
  return data;
};
