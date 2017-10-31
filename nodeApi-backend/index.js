
var http     = require('http'),
	express  = require('express'),
	mysql    = require('mysql'),
	parser   = require('body-parser');

// Database Connection
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'admin',
  database : 'mydb'
});

try {
	connection.connect();
	console.log("Connected!");
	
} catch(e) {
	console.log('Database Connetion failed:' + e);
}

var app = express();
app.use(parser.json());
app.use(parser.urlencoded({ extended: true }));
app.set('port', process.env.PORT || 8080);

app.get('/', function (req, res) {
	res.send('<html><body><p>Welcome to person 0.1</p></body></html>');
});


 //end points for inserting a persons
app.post('/person/add', function (req,res) {
	var response = [];
   console.log("add one person...");
	if (
		 
		typeof req.body.name !== 'undefined' && 
		typeof req.body.age !== 'undefined' && 
		typeof req.body.gender !== 'undefined'
	) {
		 console.log("add one...");
		var name = req.body.name, age = req.body.age, gender = req.body.gender;
 
		connection.query('INSERT INTO persons (name, age, gender) VALUES (?, ?, ?)', 
			[name, age, gender], 
			function(err, result) {
		  		if (!err){
 
					if (result.affectedRows != 0) {
						response.push({'result' : 'success'});
					} else {
						response.push({'msg' : 'No Result Found'});
					}
 
					res.setHeader('Content-Type', 'application/json');
			    	res.status(200).send(JSON.stringify(response));
		  		} else {
				    res.status(400).send(err);
			  	}
			});
 
	} else {
		response.push({'result' : 'error', 'msg' : 'Please fill required details'});
		res.setHeader('Content-Type', 'application/json');
    	res.status(200).send(JSON.stringify(response));
	}
});


 //end points for getting list of persons
app.get('/person', function (req,res) {
	connection.query('SELECT * from persons', function(err, rows, fields) {
  		if (!err){
  			var response = [];
			// response.push({'result' : 'success'});
			if (rows.length != 0) {
				console.log("+++++",rows);
				response.push(rows);
			} else {
				response.push({'msg' : 'No Result Found'});
			}
 
			res.setHeader('Content-Type', 'application/json');
	    	res.status(200).send(JSON.stringify(rows));
  		} else {
		    res.status(400).send(err);
	  	}
	  });
	});


 //end points for editing a persons
app.post('/person/edit/:id', function (req,res) {
	var id = req.params.id, response = [];
	 console.log("add one...");

	if (
		typeof req.body.name !== 'undefined' && 
		typeof req.body.age !== 'undefined' && 
		typeof req.body.gender !== 'undefined'
	) {
		var name = req.body.name, age = req.body.age, gender = req.body.gender;

		connection.query('UPDATE persons SET name = ?, age = ?, gender = ? WHERE id = ?', 
			[name, age, gender, id], 
			function(err, result) {
		  		if (!err){

					if (result.affectedRows != 0) {
						response.push({'result' : 'success'});
					} else {
						response.push({'msg' : 'No Result Found'});
					}

					res.setHeader('Content-Type', 'application/json');
			    	res.status(200).send(JSON.stringify(response));
		  		} else {
				    res.status(400).send(err);
			  	}
			});

	} else {
		response.push({'result' : 'error', 'msg' : 'Please fill required details'});
		res.setHeader('Content-Type', 'application/json');
    	res.status(200).send(JSON.stringify(response));
	}
});


 //end points for deleting a persons
app.delete('/person/delete/:id', function (req,res) {
	var id = req.params.id;

	connection.query('DELETE FROM persons WHERE id = ?', [id], function(err, result) {
  		if (!err){
  			var response = [];

			if (result.affectedRows != 0) {
				response.push({'result' : 'success'});
			} else {
				response.push({'msg' : 'No Result Found'});
			}

			res.setHeader('Content-Type', 'application/json');
	    	res.status(200).send(JSON.stringify(response));
  		} else {
		    res.status(400).send(err);
	  	}
	});
});


 //end points for getting a single persons
app.get('/person/:id', function (req,res) {
	var id = req.params.id;

	connection.query('SELECT * from persons where id = ?', [id], function(err, rows, fields) {
  		if (!err){
  			var response = [];

			if (rows.length != 0) {
				response.push({'result' : 'success', 'data' : rows});
			} else {
				response.push({'result' : 'error', 'msg' : 'No Results Found'});
			}

			res.setHeader('Content-Type', 'application/json');
	    	res.status(200).send(JSON.stringify(rows));
  		} else {
		    res.status(400).send(err);
	  	}
	});
});


http.createServer(app).listen(app.get('port'), function(){
	console.log('Server listening on port ' + app.get('port'));
});
