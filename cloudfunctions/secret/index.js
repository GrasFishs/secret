// 云函数入口文件
const cloud = require("wx-server-sdk");

cloud.init({ env: "blog-962265" });
const db = cloud.database();

// 云函数入口函数
exports.main = async (event, context) => {
  const { secretId } = event;
  try {
    const { data } = await db
      .collection("secret")
      .doc(secretId)
      .get();
    return data;
  } catch (err) {
    throw err;
  }
};
