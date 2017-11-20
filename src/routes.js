module.exports = function(app, passport, express, pathVar) {
  const {User} = require('./models/user.js');

  // app.use(express.static('public/'));

  app.get('/api/*', function(request, response) {
    console.log('new router works');
    response.json({ok: true});
    // response.sendFile('index.html', { root: ''})
  });

  app.post('/api/signup',
    passport.authenticate('local-signup', {
      successRedirect: '/api/signup/success',
      failureRedirect: '/api/signup/failure',
      failureFlash: true
    })
  );

  app.get('/api/signup/success', isLoggedIn, function(request, response) {
    console.log('signup success');
    response.send(200);
  });

  app.get('/api/signup/error', function(request, response) {
    console.log('signup failure');
    response.send(400);
  });

  app.post('/api/login',
    passport.authenticate('local-login', {
      successRedirect: '/api/login/success',
      failureRedirect: '/api/login/failure',
      failureFlash: true
    })
  );

  app.get('/api/login/success', isLoggedIn, function(request, response) {
    console.log('login success');
    response.send(200);
  });

  app.get('/api/login/failure', function(request, response) {
    console.log('login failure');
    response.send(400);
  });

  function isLoggedIn(request, response, next) {
    if(request.isAuthenticated()) {
      console.log('user is authenticated');
      next();
    } else {
      console.log('not authenticated');
      response.redirect('/');
    }
  }

}