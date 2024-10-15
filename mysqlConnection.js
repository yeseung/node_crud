const mysql = require('mysql');
const dbInfo = {
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: 3306,
  waitForConnections: true,
  connectionLimit: 10,
  maxIdle: 10,
  idleTimeout: 60000,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  multipleStatements: true,
  typeCast: function (field, next) {
      if (field.type == 'VAR_STRING') return field.string();
      if (field.type === "BLOB" || field.type === "TEXT") {
          return field.buffer().toString('utf8');
      }
      return next();
  }
};

module.exports = {
  init: function () {
    return mysql.createConnection(dbInfo);
  },
  connect: function(conn) {
    conn.connect(function(err) {
      if (err) {
        console.error('mysql 연결 에러 : ' + err);
      } else {
        console.log('mysql 연결 성공');
        // 연결이 성공하면 시간대 설정
        // conn.query("SET time_zone='Asia/Seoul'", (err) => {
        //   if (err) console.error('시간대 설정 오류: ' + err);
        //   else console.log("시간대가 'Asia/Seoul'로 설정되었습니다.");
        // });
      }
    });
  }
};