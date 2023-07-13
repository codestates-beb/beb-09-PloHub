const { Sequelize } = require("sequelize");
const env = process.env.NODE_ENV || "development";
const config = require("../config/config")[env]; //설정한 config 에서 'development' config 가져오자.
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    dialect: "mysql",
    dialectOptions: {
      host: config.host,
      port: config.port,
    },
  }
); // 시퀄라이즈 노드랑mysql 연결해주는 역할.

db.Wallets = require("./Wallets")(sequelize, Sequelize);
db.nfts = require("./nfts")(sequelize, Sequelize);
db.transactions = require("./transactions")(sequelize,Sequelize);

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
