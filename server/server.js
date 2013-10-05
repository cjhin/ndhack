var express = require('express'),
	tickets = require('./routes/tickets');
 
var app = express();

app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
});
 
app.get('/tickets', tickets.findAll);
app.get('/tickets/:id', tickets.findById);
app.post('/tickets', tickets.addTicket);
app.put('/tickets/:id', tickets.updateTicket);
app.delete('/tickets/:id', tickets.deleteTicket);
 
app.listen(8009);
console.log('Listening on port 8009...');
