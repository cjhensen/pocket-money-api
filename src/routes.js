module.exports = function(app, passport, express, pathVar) {
  const {User} = require('./models/user.js');

  // app.use(express.static('public/'));

  // app.get('/api/*', function(request, response) {
  //   console.log('new router works');
  //   response.json({ok: true});
  //   // response.sendFile('index.html', { root: ''})
  // });

  app.get('/api/', function(request, response) {
    response.send(200);
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

  app.get('/api/signup/failure', function(request, response) {
    console.log('signup failure');
    response.send(401);
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
    response.send(401);
  });

  function isLoggedIn(request, response, next) {
    if(request.isAuthenticated()) {
      console.log('user is authenticated');
      next();
    } else {
      console.log('not authenticated');
      response.redirect('/api/login/failure');
    }
  }


  // Initialize user data
  app.get('/api/userdata', isLoggedIn, function(request, response) {
    console.log('GET userdata');

    User
      .findById(request.user._id)
      .exec()
      .then(user => response.json(user.apiRepr()))
      .catch(error => {
        console.error(error);
        response.status(500).json({ message: 'Internal server error'})
      });
  });

  // Transactions
  app.put('/api/transaction', isLoggedIn, function(request, response) {
    console.log('PUT transaction');
    console.log(request.body);

    const updateItem = request.body;

    User
      .findOneAndUpdate({_id: request.user._id}, {$push: {'userData.transactions': updateItem}})
      .exec()
      .then(user => response.status(204).end())
      .catch(error => response.status(500).json({message: 'Internal server error'}));
  });

  app.delete('/api/transaction/:id', isLoggedIn, function(request, response) {
    console.log('DELETE transaction');

    const itemToDel = request.params.id;
    console.log('request.params.id', request.params.id);

    User
      .findOneAndUpdate(
        {_id: request.user._id},
        {$pull: {'userData.transactions': {id: itemToDel}}})
      .exec()
      .then(user => response.status(204).end())
      .catch(error => response.status(500).json({message: 'Internal server error'}));
  });

  // Income
  app.put('/api/income', isLoggedIn, function(request, response) {
    console.log('PUT income');

    console.log(request.body);

    const updateItem = request.body;

    User
      .findOneAndUpdate({_id: request.user._id}, {$push: {'userData.income': updateItem}})
      .exec()
      .then(user => response.status(204).end())
      .catch(error => response.status(500).json({message: 'Internal server error'}));
  });

  app.delete('/api/income/:id', isLoggedIn, function(request, response) {
    console.log('DELETE income');

    const itemToDel = request.params.id;
    console.log('request.params.id', request.params.id);

    User
      .findOneAndUpdate(
        {_id: request.user._id},
        {$pull: {'userData.income': {id: itemToDel}}})
      .exec()
      .then(user => response.status(204).end())
      .catch(error => response.status(500).json({message: 'Internal server error'}));
  });

  // Categories
  app.put('/api/category', isLoggedIn, function(request, response) {
    console.log('PUT category');

    console.log(request.body);

    const updateItem = request.body;

    User
      .findOneAndUpdate({_id: request.user._id}, {$push: {'userData.categories': updateItem}})
      .exec()
      .then(user => response.status(204).end())
      .catch(error => response.status(500).json({message: 'Internal server error'}));
  });

  app.delete('/api/category/:id', isLoggedIn, function(request, response) {
    console.log('DELETE category');

    const itemToDel = request.params.id;
    console.log('request.params.id', request.params.id);

    User
      .findOneAndUpdate(
        {_id: request.user._id},
        {$pull: {'userData.categories': {id: itemToDel}}})
      .exec()
      .then(user => response.status(204).end())
      .catch(error => response.status(500).json({message: 'Internal server error'}));
  });

}