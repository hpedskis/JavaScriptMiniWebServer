// fansite.js
// create your own fansite using your miniWeb framework

const App = require('./miniWeb.js').App;
const app = new App();

app.get('/toroto_background.jpg', function(req, res){
    res.sendFile('/img/toroto_background.jpg');
});
app.get('/T1.gif', function(req, res){
    res.sendFile('/img/T1.gif');
});
app.get('/T2.gif', function(req, res){
    res.sendFile('/img/totoro3.gif');
});
app.get('/css/base.css', function(req, res) {
    res.sendFile('/base.css');
});

app.get('/css/base.css/', function(req, res) {
    res.redirect('/css/base.css');
});
app.get('/totoroGoodbye.gif', function(req, res){
    res.sendFile('/img/totoroGoodbye.gif');
});

app.get('/0', function(req, res){
    res.sendFile('/img/totoro_hello.jpg');
});
app.get('/1', function(req, res){
    res.sendFile('/img/totoro1.gif');
});
app.get('/2', function(req, res){
    res.sendFile('/img/totoro0.gif');
});
app.get('/3', function(req, res){
    res.sendFile('/img/t_png.png');
});

app.get('/', function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.send(300, '<head><link href="/css/base.css" rel="stylesheet"/><img src = "/T1.gif"/></head> ' +
        '<body><h1>Welcome to the homepage of the website about Totoros!</h1></body>');
});
app.get('/about', function(req, res) {
    res.setHeader('Content-Type', 'text/html');
    res.send(300, '<head><link href="/css/base.css" rel="stylesheet"/><img src = "/T2.gif"/></head> ' +
        '<body><h2>This is a fan page for Totoros</h2> <p>Totoro are magical forest creatures that are usually hidden. They enjoy acorns</p>' +
        '<p>There are small totoros, medium totoros, and one super massive totoro</p></body>');
});

app.get('/about/', function(req, res) {
    res.redirect('/about');
});


app.get('/rando', function(req, res) {
    res.setHeader('Content-Type', 'text/html');

    res.send(300, '<head>' +
        '<link href="/css/base.css" rel="stylesheet"/> <img src ="placeholder.gif" id = "toChange"/>' +
        ' <script type=" text/javascript"> document.getElementById("toChange").src= "/" + Math.floor(Math.random() *4); </script></head>' +
        '<body onload="load()">' +
        '<body><h1>Enjoy a *random* view of totoro</h1></body>');
});

app.get('/rando/', function(req, res) {
    res.redirect('/rando');
    // ... do stuff here
});
app.get('/home', function(req, res) {
    res.redirect('/');
});
app.get('/home/', function(req, res) {
    res.redirect('/');
});

app.listen(8081, '127.0.0.1');


