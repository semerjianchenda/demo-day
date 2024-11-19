module.exports = function(app, passport, db) {

  // normal routes ===============================================================
  
      // show the home page (will also have our login links)
      app.get('/', function(req, res) {
          res.render('index.ejs');
      });
  
      // PROFILE SECTION =========================
      app.get('/profile', isLoggedIn, function (req, res) {
        db.collection('patients').find().toArray((err, result) => {
          if (err) return console.error(err);
          res.render('profile.ejs', {
            user: req.user,
            movies: result, // Correctly pass `movies` here
          });
        });
      });
  
      // LOGOUT ==============================
      app.get('/logout', function(req, res) {
          req.logout(() => {
            console.log('User has logged out!')
          });
          res.redirect('/');
      });
  
  // message board routes ===============================================================
  
  // GET: Fetch patients by floor and wing
app.get('/patients', (req, res) => {
  const { floor, wing } = req.query;

  db.collection('patients')
    .find({ floor: parseInt(floor), wing }) // Filter by floor and wing
    .toArray((err, patients) => {
      if (err) {
        console.error('Error fetching patients:', err);
        return res.status(500).json({ error: 'Failed to fetch patients' });
      }
      res.json(patients); // Send the list of patients as JSON
    });
});

// POST: Add a new patient
app.post('/patients', (req, res) => {
  const { name, age, floor, wing, roomNumber } = req.body;

  const newPatient = {
    name,
    age: parseInt(age),
    floor: parseInt(floor),
    wing,
    roomNumber,
  };

  db.collection('patients').insertOne(newPatient, (err) => {
    if (err) {
      console.error('Error adding patient:', err);
      return res.status(500).send('Error adding patient');
    }
    window.location.reload();
  });
});

//api summarization

const patientActivities = []; 


app.post('/patient-activity', (req, res) => {
  const { breakfast, lunch, dinner, changed, abrasions } = req.body;

  if (!breakfast || !lunch || !dinner || !changed || !abrasions) {
    return res.status(400).json({ error: 'All fields are required.' });
  }


  const summary = {
    breakfast: breakfast === "Yes" ? "Patient ate breakfast." : "Patient did not eat breakfast.",
    lunch: lunch === "Yes" ? "Patient ate lunch." : "Patient did not eat lunch.",
    dinner: dinner === "Yes" ? "Patient ate dinner." : "Patient did not eat dinner.",
    changed: changed === "Yes" ? "Patient was changed." : "Patient was not changed.",
    abrasions: abrasions === "Yes" ? "New abrasions found on the patient's skin." : "No new abrasions found on the patient's skin."
  };

  patientActivities.push(summary);

  // Return the summary as a response
  res.status(201).json({
    message: 'Patient activity summary recorded successfully.',
    summary: summary
  });
});

// Endpoint to get all activities (for testing)
app.get('/patient-activity', (req, res) => {
  res.json(patientActivities);
});

app.get('/profile', (req, res) => {
  res.render('profile', { patients });
});


app.get('/patients/:id', (req, res) => {
  const patientId = req.params.id;
  const patient = patients.find(p => p.id === parseInt(patientId));
  
  if (patient) {
    res.render('patients', { patient });
  } else {
    res.status(404).send('Patient not found');
  }
});


app.post('/submitQuestionnaire', (req, res) => {
  const { bathing, breakfast, lunch, dinner, changed, abrasions } = req.body;

  // Process the answers (you can save them to a database here)
  console.log({
    bathing, breakfast, lunch, dinner, changed, abrasions
  });

  // Redirect to the profile page after submission
  res.redirect('/profile');
});

  // =============================================================================
  // AUTHENTICATE (FIRST LOGIN) ==================================================
  // =============================================================================
  
      // locally --------------------------------
          // LOGIN ===============================
          // show the login form
          app.get('/login', function(req, res) {
              res.render('login.ejs', { message: req.flash('loginMessage') });
          });
  
          // process the login form
          app.post('/login', passport.authenticate('local-login', {
              successRedirect : '/profile', // redirect to the secure profile section
              failureRedirect : '/login', // redirect back to the signup page if there is an error
              failureFlash : true // allow flash messages
          }));
  
          // SIGNUP =================================
          // show the signup form
          app.get('/signup', function(req, res) {
              res.render('signup.ejs', { message: req.flash('signupMessage') });
          });
  
          // process the signup form
          app.post('/signup', passport.authenticate('local-signup', {
              successRedirect : '/profile', // redirect to the secure profile section
              failureRedirect : '/signup', // redirect back to the signup page if there is an error
              failureFlash : true // allow flash messages
          }));
  
  // =============================================================================
  // UNLINK ACCOUNTS =============================================================
  // =============================================================================
  // used to unlink accounts. for social accounts, just remove the token
  // for local account, remove email and password
  // user account will stay active in case they want to reconnect in the future
  
      // local -----------------------------------
      app.get('/unlink/local', isLoggedIn, function(req, res) {
          var user            = req.user;
          user.local.email    = undefined;
          user.local.password = undefined;
          user.save(function(err) {
              res.redirect('/profile');
          });
      });
  
  };
  
  // route middleware to ensure user is logged in
  function isLoggedIn(req, res, next) {
      if (req.isAuthenticated())
          return next();
  
      res.redirect('/');
  }
