// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init({ env: "blog-962265" });
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const { userId, secretId, type } = event;
  // 点赞
  console.log(event);
  if (type === 0) {
    try {
      await db.collection("like").add({
        data: {
          userId,
          secretId
        }
      });
      await db
        .collection("secret")
        .where({
          _id: secretId
        })
        .update({
          data: {
            likeCount: db.command.inc(1)
          }
        });
    } catch (err) {
      throw err;
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
      await db
        .collection("secret")
        .where({
          _id: secretId
        })
        .update({
          data: {
            likeCount: db.command.inc(-1)
          }
        });
      return true;
    } catch (err) {
      throw err;
    }
  }
};
