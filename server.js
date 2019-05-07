require('dotenv').config({ debug: process.env.DEBUG });
const http = require('http');
const app = require('./app');
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header("Access-Control-Allow-Headers", "Content-Type");
    res.header("Access-Control-Allow-Methods", "PUT, GET, POST, DELETE, OPTIONS");
    next();
});
//const socketManager = require('./helpers/socketManager');
const pusherManager = require('./helpers/pusher');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log('Server up and running on port ' + PORT);
});

//socketManager.init(server);
pusherManager.init();