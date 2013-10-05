var mongo = require('mongodb');
var email = require('./email');
 
var Server = mongo.Server,
    Db = mongo.Db,
    BSON = mongo.BSONPure;
 
var server = new Server('localhost', 27017, {auto_reconnect: true});
db = new Db('ndhack', server);
 
db.open(function(err, db) {
    if(!err) {
        console.log("Connected to 'ndhack' database");
        db.collection('tickets', {strict:true}, function(err, collection) {
            if (err) {
				console.log(err);
                console.log("The 'tickets' collection doesn't exist. Creating it with sample data...");
                populateDB();
            }
        });
    }
});


exports.acceptOffer = function(req, res) {
    var buyer_id = req.params.buyerid;
    var seller_email = req.params.seller;

	db.collection('users', function(err, collection) {
		collection.findOne({'_id':new BSON.ObjectID(buyer_id)}, function(err, buyer_obj) {
			var item = {
				"buyer":buyer_obj.email,
				"seller":seller_email,
				"offer":req.params.offer,
				"game":req.params.game,
				"section":req.params.section,
				"price":req.params.price
			}
			email.sendConnectEmail(item);	

			res.redirect("http://chasjhin.com/ndhack/offer_complete.html");

		});
	});	
};

exports.buyTicket = function(req, res) {
    var id = req.body.id;
	var offer = req.body.offer;
    console.log('Retrieving ticket: ' + id);
    db.collection('tickets', function(err, collection) {
        collection.findOne({'_id':new BSON.ObjectID(id)}, function(err, item) {
			if(err|| !item){
				res.send(err);
			}
			//the ticket has been found in the database
			if(!err && item) {
				//before we send the email to the seller, we need to grab the buyer id
				db.collection('users', function(err, collection) {
					collection.findOne({'email':req.body.email}, function(err, buyer_obj) {
						item.buyer = buyer_obj._id;
						item.offer = offer;
			console.log("ticket");
						email.sendOfferEmail(item);

						var return_item = "yay";
						res.redirect("http://chasjhin.com/ndhack/offer_success.html");

					});
				});	
			}
        });
    });
};
 
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
				res.redirect("http://chasjhin.com/ndhack/tickets_success.html");
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

var populateDB = function() {
 
    var ticket = [
    {
        game: "Navy",
        email: "cjhin@nd.edu",
        section: "Senior",
		price: "52.32",
		status: "listed"
    },
    {
        game: "USC",
        email: "npawelcz@nd.edu",
        section: "Junior",
		price: "41.32",
		status: "listed"
    }];
 
    db.collection('tickets', function(err, collection) {
        collection.insert(ticket, {safe:true}, function(err, result) {
			console.log(err);
		});
    });
 
}; 
