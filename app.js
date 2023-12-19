const express = require('express');
const app = express();
const PORT = 8000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/static', express.static(__dirname + '/static'));

//메인, 회원가입, 로그인, 회원탈퇴, 마이페이지, 고객센터,
const indexRouter = require('./routes/index');
app.use('/', indexRouter);

//중고거래
const marketRouter = require('./routes/market');
app.use('/', marketRouter);

// TODO: 404 처리
app.get('*', (req, res) => {
  res.render('404');
});

app.listen(PORT, () => {
  console.log(`http://localhost:${PORT}`);
});
