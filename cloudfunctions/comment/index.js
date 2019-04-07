// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init({ env: "blog-962265" });
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const { content, userId, secretId, avatar, type, parentId } = event;

  // 基于秘密的评论
  if (type === 0) {
    try {
      await db.collection("comment").add({
        data: {
          content,
          userId,
          secretId,
          avatar,
          createdTIme: new Date(),
          children: []
        }
      });

      await db
        .collection("secret")
        .where({
          _id: secretId
        })
        .update({
          data: {
            commentCount: db.command.inc(1)
          }
        });
      return true;
    } catch (err) {
      throw err;
    }
    // 基于评论的评论
  } else {
    try {
      await db
        .collection("comment")
        .doc(parentId)
        .update({
          data: {
            children: db.command.push([
              {
                content,
                userId,
                secretId,
                avatar,
                createdTIme: new Date()
              }
            ])
          }
        });

      await db
        .collection("secret")
        .doc(secretId)
        .update({
          data: {
            commentCount: db.command.inc(1)
          }
        });
      return true;
    } catch (err) {
      throw err;
    }
  }
};
