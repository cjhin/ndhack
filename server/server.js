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
});
 
app.get('/users', users.findAll);
app.get('/users/:id', users.findById);
app.post('/users', users.addUser);
app.put('/users/:id', users.updateUser);
app.delete('/users/:id', users.deleteUser);

app.get('/tickets', tickets.findAll);
app.get('/tickets/:id', tickets.findById);
app.post('/tickets', tickets.addTicket);
app.put('/tickets/:id', tickets.updateTicket);
app.delete('/tickets/:id', tickets.deleteTicket);

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
