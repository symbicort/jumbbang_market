const express = require('express');
const app = express();
const PORT = 8000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

/* app.get('/', (req, res) => {
	res.render('index', { title: '점빵' });
}); */
const indexRouter = require('./routes/index');
app.use('/', indexRouter);

const marketRouter = require('./routes/market');
app.use('/market', marketRouter);
/*
// 임시 : 중고거래
app.get('/market', (req, res) => {
	res.render('market', { title: '중고거래 - 점빵' });
});
// 임시 : 중고거래
app.get('/login', (req, res) => {
	res.render('login', { title: '로그인 - 점빵' });
}); */

// TODO: 404 처리
app.get('*', (req, res) => {
	res.render('404');
});

app.listen(PORT, () => {
	console.log(`http://localhost:${PORT}`);
});
