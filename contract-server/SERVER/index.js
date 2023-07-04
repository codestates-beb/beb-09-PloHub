const express = require('express');
const cors = require('cors');
const port = 8080;
const app = express();

const createWallet = require('./routes/create');

// const mainRouter = require('./router/main');

app.use( //cors설정
  cors({
    origin: ["http://localhost:3000"],
    methods: ["GET", "POST", "OPTIONS", "DELETE"],
    credentials: true
  })
);
app.use(express.json()); //json으로 이루어진 Request Body를 받는다.

app.use('/api/v1', createWallet);


const db = require('./models');
const sequelize = db.sequelize;

async function connectToDatabase() {
  try {
    await sequelize.authenticate();
    console.log('db 연결 성공');
  } catch (error) {
    console.error('db 연결 실패:', error);
  }
}

connectToDatabase();




// 에러처리
app.use((err, req, res, next) => { //에러발생시 처리 next(err)
  console.error(err.stack);
  return res.status(400).send({ message: "something broke" });
});

app.use((req, res, next) => { //잘못된 경로(path)접근시 에러처리
  return res.status(404).send({ message: "invalid Access" });
});

app.listen(port, () => {
  console.log(`OpenSee Server listening on port ${port}`);
});