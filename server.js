// Dependencies
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var mongoose = require('mongoose');
var session = require('express-session');
var passport = require('passport');
// var keys = require('./models/keys.js');


// App definition
var app = express();


// Serving app
app.use(express.static(__dirname + '/'));

require('./config/passport')(passport); // pass passport for configuration


// Middleware
app.use(cors());


// Expanding server capacity
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));


// Controllers
var Lesson = require('./controllers/LessonController.js');
var User = require('./controllers/UserController.js');
var CourseController = require('./controllers/CourseController.js');
var CohortController = require('./controllers/CohortController.js');
var EmailController = require('./controllers/EmailController.js');




// required for passport
app.use(session({
    secret: 'best secret ever',
    resave: true,
    saveUninitialized: true

}));
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions

////////////////////////////////////
//////////// REST API //////////////
////////////////////////////////////

// Lessons
app.post('/api/lessons', Lesson.create);
app.post('/api/lesson/sections/:lessonId', Lesson.addSection);
app.get('/api/lessons', Lesson.get);
app.put('/api/lessons/', Lesson.update);
app.put('/api/lessons/:sectionId', Lesson.updateSection);
app.put('/api/lessons/remove/:sectionId', Lesson.removeSection);
app.delete('/api/lessons', Lesson.delete);


//Courses
app.post('/api/course', CourseController.createNewCourse);
app.get('/api/course/:courseId', CourseController.getCourse);
app.get('/api/all-courses', CourseController.getAllCourses);
app.put('/api/course/:curriculumId', CourseController.updateCourseCurriculum);

// Cohorts lolz
app.post('/api/cohort', CohortController.createNewCohort);
app.put('/api/cohort/:cohortId', CohortController.updateLessonOrder);
app.get('/api/cohort/:cohortId', CohortController.getCohort);
app.get('/api/all-cohorts', CohortController.getAllCohorts);

// Emails
app.post('/api/email', EmailController.sendEmail);

// Users
app.get('/api/users', User.getAll);
app.put('/api/user/:id', User.put);

// Auth
app.post('/api/user', passport.authenticate('local-signup'), function (req, res) {
    res.redirect('/#')
    res.json(req.use);
});

app.post('/auth/login', passport.authenticate('local-login'), function (req, res){
	if(!req.user){
		res.redirect('/#/login');
	}
    res.send(req.user); // redirect to the secure profile section
});


app.get('/api/auth', isAuth, function(req, res) {
	res.json(req.user)
});


// TODO: does this work?
app.get('/logout', function(req, res) {
	req.session.destroy();
    res.redirect('/#/');
});




// DEPRECATED
// app.get('/api/user/:id', User.get);


////////////////////////////////////
////////////////////////////////////
////////////////////////////////////



// Connections
var portNum = 3000;

var mongooseUri = 'mongodb://localhost/devkittens';
mongoose.connect(mongooseUri);

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function (callback) {
  console.log('Mongoose listening to your soul on:', mongooseUri);
});


app.listen(portNum, function () {
    console.log('Making some pancakes on port:', portNum);
});




function isAuth(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.user){
        next();
    } else {
   	// if they aren't redirect them to the home page
    	res.status(403).send('not allowed');
    }

}