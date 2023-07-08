const express = require("express");
const cors = require("cors");
const port = 8080;
const app = express();
const { connectToDatabase } = require("./loaders/connectDB");

const createWallet = require("./routes/create");
const reward = require("./routes/reward");
const createNFT = require("./routes/createNFT");
const userNFT = require("./routes/userNFT");
const transferToken = require("./routes/transferToken");
const tokenSwap = require("./routes/tokenSwap");

// const mainRouter = require('./router/main');

// app.use(
//   //cors설정
//   cors({
//     origin: ["http://main-server:4000"],
//     methods: ["GET", "POST", "OPTIONS", "DELETE"],
//     credentials: true,
//   })
// );
app.use(express.json()); //json으로 이루어진 Request Body를 받는다.

app.use("/api/v1/wallets", createWallet);
app.use("/api/v1/wallets", reward);
app.use("/api/v1/nft", createNFT);
app.use("/api/v1/nft", userNFT);
app.use("/api/v1/wallets", transferToken);
app.use("/api/v1/wallets", tokenSwap);

connectToDatabase;

// 에러처리
app.use((err, req, res, next) => {
  //에러발생시 처리 next(err)
  console.error(err.stack);
  return res.status(400).send({ message: "something broke" });
});

app.use((req, res, next) => {
  //잘못된 경로(path)접근시 에러처리
  return res.status(404).send({ message: "invalid Access" });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
