const express = require('express')
const ejs = require('ejs') 
const app = express()
const port = 3000
var bodyParser = require('body-parser')
var session = require('express-session')

//const connection = require('./mysql-connection')


require('dotenv').config()


const mybatisMapper = require('mybatis-mapper')
mybatisMapper.createMapper([ './testMapper.xml' ]);



const dbConfig = require('./mysqlConnection');
const connection = dbConfig.init();
dbConfig.connect(connection);

// const mysql = require('mysql')
// const connection = mysql.createPool({ //풀 생성
//   host: process.env.DATABASE_HOST,
//   user: process.env.DATABASE_USER,
//   password: process.env.DATABASE_PASSWORD,
//   database: process.env.DATABASE_NAME,
//   port: 3306,
//   waitForConnections: true, // 풀에 있는 연결이 모두 사용중일 때 대기
//   connectionLimit: 10, //풀에 넣을 수 있는 최대 연결 수 
//   maxIdle: 10, // 최대 유휴 커넥션, default는 connectionLimit와 동일
//   idleTimeout: 60000, // 유휴 커넥션 timeout(ms), default는 60000
//   queueLimit: 0, //대기열에 넣을 수 있는 최대 요청 수
//   enableKeepAlive: true, //TCP 연결에 keep-alive를 넣을지 결정
//   keepAliveInitialDelay: 0, //keepAlive 패킷을 처음으로 보낼 때까지의 지연 시간

//   // buffer로 들어오는 문자열에 대한 변환
//   multipleStatements: true,
//   typeCast: function (field, next) {
//       if (field.type == 'VAR_STRING') return field.string();
//       if (field.type === "BLOB" || field.type === "TEXT") {
//           return field.buffer().toString('utf8');
//       }
//       return next();
//   }
// });
// //console.log('Connected to PlanetScale!')

// connection.query("SET time_zone='Asia/Seoul'"); 



app.set('view engine','ejs') 
app.set('views','./views')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static(__dirname+'/public')) 

app.use(session({ secret: '___________seung', cookie: { maxAge: 60000 }, resave:true, saveUninitialized:true, }))


app.use((req, res, next) => {    

  console.log(req.session)
  res.locals.user_id = "";
  res.locals.name = "";

  if(req.session.member){ 
     res.locals.user_id = req.session.member.user_id 
     res.locals.name = req.session.member.name 
  }
  next()
})





app.get('/', (req, res) => {
  //res.send('<h1>hello world</h1>')
  res.render('index')
})

app.get('/profile', (req, res) => {
  res.render('profile')
})

app.get('/map', (req, res) => {
  res.render('map')  
})

app.get('/contact', (req, res) => {
  res.render('contact')  
})


app.post('/contactProc', (req, res) => {
  // const name = req.body.name; 
  // const phone = req.body.phone; 
  // const email = req.body.email; 
  // const memo = req.body.memo; 

  // //var a = ` ${name} ${phone} ${email} ${memo}`

  // var sql = `insert into contact(name,phone,email,memo,regdate)
  //  values(?,?,?,?,now() )`
    
  // var values = [name,phone,email,memo]; 

  var param = {
    name : req.body.name,
    phone : req.body.phone, 
    email : req.body.email,
    memo : req.body.memo
   };
   let query = mybatisMapper.getStatement('testMapper', 'create', param);
   console.log(query)

   connection.query(query, function (err, result){
       if(err) throw err; 
       console.log('자료 1개를 삽입하였습니다.');
       res.send("<script> alert('문의사항이 등록되었습니다.'); location.href='/';</script>"); 
   })

  //res.send(a);

})


app.get('/contactList', (req, res) => {

  //let format = {language: 'sql', indent: '  '};
  let query = mybatisMapper.getStatement('testMapper', 'list');
  console.log(query)

  //var sql = `select * from contact order by idx desc `
  connection.query(query, function (err, results, fields){
     if(err) throw err; 
     res.render('contactList',{lists:results})
     
     console.log(results)
     //console.log(fields)
  })
  
})


app.get('/contactForm', (req, res) => {
      var param = {
        idx : req.query.idx
      };
      let query = mybatisMapper.getStatement('testMapper', 'findByIdx', param);
      console.log(query)

    connection.query(query, function (err, result){
        if(err) throw err;

        console.log(result[0]);
        res.render('contactView',{view:result[0]})
    })
})

app.post('/contactForm', (req, res) => {
    var param = {
        idx : req.body.idx,
        name : req.body.name,
        phone : req.body.phone,
        email : req.body.email,
        memo : req.body.memo
    }
    let query = mybatisMapper.getStatement('testMapper', 'update', param);
    console.log(query)

    connection.query(query, function (err, result){
        if(err) throw err;

        console.log("1111__ " + result)
        res.redirect('contactForm?idx=' + param.idx)
    })
})

app.get('/contactDelete', (req, res) => {
  //var idx = req.query.idx
  var param = {
    idx : req.query.idx
  };
  let query = mybatisMapper.getStatement('testMapper', 'del', param);
  console.log(query)


  //var sql = `delete from contact where idx='${idx}' `
  connection.query(query, function (err, result){
     if(err) throw err;
      console.log("del__ " + result)
     res.send("<script> alert('삭제되었습니다.'); location.href='/contactList';</script>"); 
 })
})




app.get('/login', (req, res) => {
  res.render('login')  
})


app.post('/loginProc', (req, res) => {
  // const user_id = req.body.user_id; 
  // const pw = req.body.pw; 

  // var sql = `select * from member where user_id=? and pw=? `

  // var values = [user_id, pw]; 
  // console.log(sql); 
  // console.log(values);



  var param = {
    user_id : req.body.user_id, 
    pw : req.body.pw
  };
  let query = mybatisMapper.getStatement('testMapper', 'findByUserIdAndPw', param);
  console.log(query)



  //connection.query(sql, values, function (err, result){
  connection.query(query, function (err, result){
      if(err) throw err;      
      
      if(result.length==0){
        res.send("<script> alert('존재하지 않는 아이디입니다.'); location.href='/login';</script>");          
      }else{  
        console.log(result[0]); 

        req.session.member = result[0]  
        res.send("<script> alert('로그인 되었습니다.'); location.href='/';</script>");          
        //res.send(result); 
      }
  })

})

app.get('/logout', (req, res) => {
  req.session.member = null; 
  res.send("<script> alert('로그아웃 되었습니다.'); location.href='/';</script>");             
})



app.listen(port, ()=>{
    console.log(`서버가 실행되었습니다. 접속주소 : http://localhost:${port}`)
})