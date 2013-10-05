var mongo = require('mongodb');
 
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
 
var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('ndhack', server);
 
db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'ndhack' database");
        db.collection('rides', {strict:true}, function(err, collection) {
            if (err) {
				console.log(err);
                console.log("The 'rides' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});
 
exports.findById = function(req, res) {
    var id = req.params.id;
    console.log('Retrieving ride: ' + id);
    db.collection('rides', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
            res.send(item);
        });
    });
};
 
exports.findAll = function(req, res) {
    db.collection('rides', function(err, collection) {
        collection.find().toArray(function(err, items) {
            res.send(items);
        });
    });
};
 
exports.addRide = function(req, res) {
    var ride = req.body;
    console.log('Adding ride: ' + JSON.stringify(ride));
    db.collection('rides', function(err, collection) {
        collection.insert(ride, {safe:true}, function(err, result) {
            if (err) {
                res.send({'error':'An error has occurred'});
            } else {
                console.log('Success: ' + JSON.stringify(result[0]));
                res.send(result[0]);
            }
        });
    });
}
 
exports.updateRide = function(req, res) {
    var id = req.params.id;
    var ride = req.body;
    console.log('Updating ride: ' + id);
    console.log(JSON.stringify(ride));
    db.collection('rides', function(err, collection) {
        collection.update({'_id':new BSON.ObjectID(id)}, ride, {safe:true}, function(err, result) {
            if (err) {
                console.log('Error updating ride: ' + err);
                res.send({'error':'An error has occurred'});
            } else {
                console.log('' + result + ' document(s) updated');
                res.send(ride);
            }
        });
    });
}
 
exports.deleteRide = function(req, res) {
    var id = req.params.id;
    console.log('Deleting ride: ' + id);
    db.collection('rides', function(err, collection) {
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

var populateDB = function() {
 
    var rides = [
    {
        email: "cjhin@nd.edu",
        destination: "Houston",
		direction: "from",
		time: "5:00pm",
		date: "Sep 5",
		seats: "4"
    }];
 
    db.collection('rides', function(err, collection) {
        collection.insert(rides, {safe:true}, function(err, result) {});
    });
 
}; 
