var restify = require('restify');

var app = restify.createServer({
	name: 'TravMsg_REST'
});

var ArticleProvider = require('./userprovider-mongodb').UserProvider;

app.use(restify.CORS());
app.use(restify.queryParser());
app.use(restify.bodyParser());

var userProvider = new UserProvider('localhost', 27017);

// Routes
app.get('/', function(req, res) {
    res.send('Hello World');
});

app.get('/user/:id', function(req, res) {

});

app.post('/callback', function(req, res) {

	var access_token = req.query.access_token;
	var refresh_token = req.query.refresh_token;

	userProvider.save({
        'refresh_token': refresh_token,
    }, function( error, docs) {
    	if (error) {
        	res.redirect('/')
    	} else {
			//Store tokens
			res.header('Location', 'http://localhost:5000/callback?access_token=' + access_token);
    		res.send(302);
    	}
    });
});

app.post('/login/google', function(req, res) {
	var access_token = req.access_token;
	var googleId = req.google_id;
	userProvider.find({
		'access_token': access_token,
		'google_id': google_id
	}, function( error, docs) {
		if (error) {
			res.redirect('/');
		} else {
			res.header('Location', 'http://localhost:5000/callback?access_token=' + access_token);
    		res.send(302);
		}
	});
});

app.post('/test', function(req, res){
    userProvider.save({
        title: req.param('title'),
        body: req.param('body')
    }, function( error, docs) {
        res.redirect('/');
    });
});

app.listen(3000);
console.log("Express server listening on port %d", app.address().port);