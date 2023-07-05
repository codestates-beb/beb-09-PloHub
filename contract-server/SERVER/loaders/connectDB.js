const db = require('../models');
const sequelize = db.sequelize;

async function connectToDatabase() {
  try {
    await sequelize.authenticate();
    console.log('db 연결 성공');
  } catch (error) {
    console.error('db 연결 실패:', error);
  }
}

module.exports = connectToDatabase();