var mongo = require('mongodb');
 
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
 
var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('ticketdb', server);
 
db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'ticketdb' database");
        db.collection('tickets', {strict:true}, function(err, collection) {
            if (err) {
                console.log("The 'tickets' collection doesn't exist. Creating it with sample data...");
//                populateDB();
            }
        });
    }
});
 
exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving ticket: ' + id);
    db.collection('tickets', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};
 
exports.findAll = function(req, res) {
    db.collection('tickets', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};
 
exports.addTicket = function(req, res) {
    var ticket = req.body;
    console.log('Adding ticket: ' + JSON.stringify(ticket));
    db.collection('tickets', function(err, collection) {
        collection.insert(ticket, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);//send back a static html page:
            }
        });
    });
}
 
exports.updateTicket = function(req, res) {
    var id = req.params.id;
    var ticket = req.body;
    console.log('Updating ticket: ' + id);
    console.log(JSON.stringify(ticket));
    db.collection('tickets', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, ticket, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating ticket: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(ticket);
            }
        });
    });
}
 
exports.deleteTicket = function(req, res) {
    var id = req.params.id;
    console.log('Deleting ticket: ' + id);
    db.collection('tickets', function(err, collection) {
        collection.remove({'_id':new BSON.ObjectID(id)}, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred - ' + err});
            } else {
                console.log('' + result + ' document(s) deleted');
                res.send(req.body);
            }
        });
    });
}

/*--------------------------------------------------------------------------------------------------------------------*/
// Populate database with sample data -- Only used once: the first time the application is started.
// You'd typically not find this code in a real-life app, since the database would already exist.
/*
var populateDB = function() {
 
    var tickets = [
    {
        year: "2013",
        game: "Navy",
        email: "cjhin@nd.edu",
        section: "Senior",
    },
    {
        year: "2013",
        game: "USC",
        email: "npawelcz@nd.edu",
        section: "Junior",
    }];
 
    db.collection('tickets', function(err, collection) {
        collection.insert(tickets, {safe:true}, function(err, result) {});
    });
 
};*/ 
