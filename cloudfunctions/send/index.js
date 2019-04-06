const cloud = require("wx-server-sdk");

const pick = arr => arr[Math.floor(Math.random() * arr.length)];

cloud.init({ env: "blog-962265" });
const db = cloud.database();

const avatars = [
  "cloud://blog-962265.626c-blog-962265/animal1.png",
  "cloud://blog-962265.626c-blog-962265/animal2.png",
  "cloud://blog-962265.626c-blog-962265/animal3.png",
  "cloud://blog-962265.626c-blog-962265/animal4.png",
  "cloud://blog-962265.626c-blog-962265/animal5.png",
  "cloud://blog-962265.626c-blog-962265/animal6.png",
  "cloud://blog-962265.626c-blog-962265/animal7.png",
  "cloud://blog-962265.626c-blog-962265/animal8.png",
  "cloud://blog-962265.626c-blog-962265/animal9.png"
];

exports.main = async (event, context) => {
  const { userId, content, bg } = event;
  const avatar = pick(avatars);
  return await db.collection("secret").add({
    data: {
      userId,
      content,
      bg,
      avatar
    }
  });
};
