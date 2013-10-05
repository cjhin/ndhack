/*var mongo = require('mongodb');

var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;

var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('ndhack', server);
*/
//////

var express = require('express'),
	app = express(),
	users = require('./routes/users'),
	tickets = require('./routes/tickets'),
	rides = require('./routes/rides');
	books = require('./routes/books');
 
app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
	// Add headers
	app.use(function (req, res, next) {

		// Website you wish to allow to connect
		res.setHeader('Access-Control-Allow-Origin', '*');

		// Request methods you wish to allow
		res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

		// Request headers you wish to allow
		res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

		// Set to true if you need the website to include cookies in the requests sent
		// to the API (e.g. in case you use sessions)
		res.setHeader('Access-Control-Allow-Credentials', true);

		// Pass to next layer of middleware
		next();
	});
});
 
app.get('/users', users.findAll);
app.get('/users/:id', users.findById);
app.post('/users', users.addUser);
app.put('/users/:id', users.updateUser);
app.delete('/users/:id', users.deleteUser);

app.post('/login', users.login);

app.get('/tickets', tickets.findAll);
app.get('/tickets/:id', tickets.findById);
app.post('/tickets', tickets.addTicket);
app.put('/tickets/:id', tickets.updateTicket);
app.delete('/tickets/:id', tickets.deleteTicket);

app.post('/buyticket',tickets.buyTicket);
app.get('/acceptoffer/:buyerid/:seller/:offer/:game/:section/:price',tickets.acceptOffer);

app.get('/rides', rides.findAll);
app.get('/rides/:id', rides.findById);
app.post('/rides', rides.addRide);
app.put('/rides/:id', rides.updateRide);
app.delete('/rides/:id', rides.deleteRide);

app.get('/books', books.findAll);
app.get('/books/:id', books.findById);
app.post('/books', books.addBook);
app.put('/books/:id', books.updateBook);
app.delete('/books/:id', books.deleteBook);


app.listen(8009);
console.log('Listening on port 8009...');
