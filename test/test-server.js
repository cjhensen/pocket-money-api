const chai = require('chai');
const expect = chai.expect;

const chaiHttp = require('chai-http');

const faker = require('faker');
const mongoose = require('mongoose');

const request = require('supertest');

const should = chai.should();

const {User} = require('../src/models/user');
const {TEST_DATABASE_URL} = require('../src/config/database');
const {app, runServer, closeServer} = require('../src/server');

chai.use(chaiHttp);

const bcrypt = require('bcrypt-nodejs');

function seedUserData() {
  console.log('seeding user data');
  const seedData = [];
  seedData.push(generateUserData());

  return User.insertMany(seedData);
}

function generateUserData() {
  return {
    userData : {
      income : [
        {
          "incomeRecurring" : false,
          "incomeAmount" : 1000,
          "id" : "r1zUF1Mvgz",
          "incomeName" : "work"
        }
      ],
      transactions : [
        {
          "category" : "test",
          "moneySpent" : 10,
          "id" : "HyGv1abwgM",
          "transactionName" : "testt"
        },
        {
          "category" : "test",
          "moneySpent" : 10,
          "id" : "rJM2ypbveG",
          "transactionName" : "testt"
        }
      ],
      categories : [
        {
          "totalBudget" : 200,
          "id" : "Hy--yp-PgG",
          "categoryName" : "test"
        }
      ]
    },
    userInfo : {
      password : bcrypt.hashSync('adminTestPw', bcrypt.genSaltSync(8), null),
      username : "adminTest",
      _id: 1234567890
    }
  }
}

function tearDownDb() {
  console.log('deleting database');
  return mongoose.connection.dropDatabase();
}

describe('Pocket Money API', function() {
  /*before(function(done) {
    // return runServer(TEST_DATABASE_URL);
    
    runServer(TEST_DATABASE_URL)
    .then(seedUserData()
      .then(function() {
      done();
    }));
  });

  beforeEach(function() {
    // return seedUserData();
  });

  afterEach(function() {
    // return tearDownDb();
  });

  after(function(done) {
    // return closeServer();
    
    tearDownDb()
    .then(closeServer()
      .then(function() {
      done();
    }));
  });*/

  const username = 'adminTest';
  const password = 'adminTestPw';
  const pwd = bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
  before(function(done) {
    // runServer(TEST_DATABASE_URL)
    //   .then(() => {
    //     const testUser = {
    //       "userData" : {
    //         "income" : [
    //           {
    //             "incomeRecurring" : false,
    //             "incomeAmount" : 1000,
    //             "id" : "r1zUF1Mvgz",
    //             "incomeName" : "work"
    //           }
    //         ],
    //         "transactions" : [
    //           {
    //             "category" : "test",
    //             "moneySpent" : 10,
    //             "id" : "HyGv1abwgM",
    //             "transactionName" : "testt"
    //           },
    //           {
    //             "category" : "test",
    //             "moneySpent" : 10,
    //             "id" : "rJM2ypbveG",
    //             "transactionName" : "testt"
    //           }
    //         ],
    //         "categories" : [
    //           {
    //             "totalBudget" : 200,
    //             "id" : "Hy--yp-PgG",
    //             "categoryName" : "test"
    //           }
    //         ]
    //       },
    //       "userInfo" : {
    //         "password" : bcrypt.hashSync('adminTestPw', bcrypt.genSaltSync(8), null),
    //         "username" : "adminTest",
    //         _id: 1234567890
    //       }
    //     };
    //     User.insertMany(testUser);
    //     done();
    //   });

    runServer(TEST_DATABASE_URL)
      .then(seedUserData()
        .then(function() {
          done();
        }));
    //   done();

      // return runServer(TEST_DATABASE_URL)
      //   .then(() => seedUserData());

      // return runServer(TEST_DATABASE_URL);
  });

  after(function(done) {
    // return closeServer();
    // return tearDownDb()
    // .then(() => closeServer());

    tearDownDb()
    .then(closeServer()
      .then(function() {
        done();
        process.exit(0);
      }));
  });

  beforeEach(function() {
    // User.create({
    //   username,
    //   pwd
    // });
    // const testUser = {
    //   "userData" : {
    //     "income" : [
    //       {
    //         "incomeRecurring" : false,
    //         "incomeAmount" : 1000,
    //         "id" : "r1zUF1Mvgz",
    //         "incomeName" : "work"
    //       }
    //     ],
    //     "transactions" : [
    //       {
    //         "category" : "test",
    //         "moneySpent" : 10,
    //         "id" : "HyGv1abwgM",
    //         "transactionName" : "testt"
    //       },
    //       {
    //         "category" : "test",
    //         "moneySpent" : 10,
    //         "id" : "rJM2ypbveG",
    //         "transactionName" : "testt"
    //       }
    //     ],
    //     "categories" : [
    //       {
    //         "totalBudget" : 200,
    //         "id" : "Hy--yp-PgG",
    //         "categoryName" : "test"
    //       }
    //     ]
    //   },
    //   "userInfo" : {
    //     "password" : bcrypt.hashSync('adminTestPw', bcrypt.genSaltSync(8), null),
    //     "username" : "adminTest",
    //     _id: 1234567890
    //   }
    // };
    // User.insertMany(testUser);
    // return seedUserData();
  });

  afterEach(function() {
    // return User.remove({});
  });



  describe('TEST GET', function() {
    it('should return 200 status code', function() {
      return chai.request(app)
        .get('/api/')
        .then(function(response) {
          response.should.have.status(200);
        });
    });
  });

  describe('/api/login', function() {
    it('should redirect to /api/login/failure with non-existent credentials', function() {
      return chai.request(app)
        .post('/api/login')
        .then(() => {
          expect.fail(null, null, 'Request should not succeed');
          expect(res).to.have.status(401);
          expect('Location', '/api/login/failure');
        })
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }

          const res = err.response;
        });
    });

    it('should redirect to /api/login/failure with incorrect credentials', function() {
      const incorrectCredentials = {
        username: 'adminTest',
        password: 'wrongPw'
      };

      return chai.request(app)
        .post('/api/login')
        .send(incorrectCredentials)
        .then((res) => {
          expect.fail(null, null, 'Request should not succeed');
          expect(res).to.have.status(401);
          expect('Location', '/api/login/failure');
        })
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }

          const res = err.response;
        });
    });

    it('should redirect to /api/login/success with correct credentials', function() {
      const correctUser = {
        username: 'adminTest',
        password: 'adminTestPw'
      };

      // return chai.request(app)
      //   .post('/api/login')
      //   .send(correctUser)
      //   .then((res) => {
      //     expect(res).to.have.status(200);
      //     expect('Location', '/api/login/success');
      //   })
      //   .catch(err => {
      //     if (err instanceof chai.AssertionError) {
      //       throw err;
      //     }

      //     const res = err.response;
      //   });

      const authenticatedUser = request.agent(app);

      authenticatedUser
        .post('/api/login')
        .send(correctUser)
        .end(function(err, response) {
          expect(response).to.have.status(302);
          expect('Location', '/api/login/success');
        });

      // return chai.request(app)
      //   .post('/api/login')
      //   .send(correctUser)
      //   .then((res) => {
      //     console.log('RESPONSE', res.statusCode);
      //   })
      //   .catch(err => {
      //     if (err instanceof chai.AssertionError) {
      //       throw err;
      //     }

      //     const res = err.response;
      //     console.log(res.statusCode);
      //   });
    });

  });

  describe('/api/signup', function() {
    it('should redirect to /api/signup/failure with existing credentials', function() {
      return chai.request(app)
        .post('/api/signup')
        .send({username, password})
        .then(() => {
          expect.fail(null, null, 'Request should not succeed');
          expect(res).to.have.status(401);
          expect('Location', '/api/signup/failure');
        })
        .catch(err => {
          if (err instanceof chai.AssertionError) {
            throw err;
          }

          const res = err.response;
        });
    });

    it('should redirect to /api/signup/success with new credentials', function() {
      const newUserCredentials = {
        username: 'newUser',
        password: 'newUserPw'
      };

      const authenticatedUser = request.agent(app);

      authenticatedUser
        .post('/api/signup')
        .send(newUserCredentials)
        .end(function(err, response) {
          expect(response).to.have.status(302);
          expect('Location', '/api/signup/success');
        });

      // return chai.request(app)
      //   .post('/api/signup')
      //   .send(newUserCredentials)
      //   .withCredentials()
      //   .then((res) => {
      //     expect(res).to.have.status(200);
      //     expect('Location', '/api/signup/success');
      //   })
      //   .catch(err => {
      //     if (err instanceof chai.AssertionError) {
      //       throw err;
      //     }

      //     const res = err.response;
      //   });
    });

  });

  describe('userdata operations', function() {
    const correctUser = {
            username: 'adminTest',
            password: 'adminTestPw'
          };

    const authenticatedUser = request.agent(app);
    
    before(function(done) {
      authenticatedUser
        .post('/api/login')
        .send(correctUser)
        .end(function(err, response) {
          expect(response).to.have.status(302);
          expect('Location', '/api/signup/success');
          done();
        });
    });
    

    describe('GET userdata', function() {
      it('should return all user data', function(done) {
        authenticatedUser.get('/api/userdata')
        .end(function(err, response) {
          // console.log(response.body);
          expect(response.body).to.be.a('object');
          expect(response.body.userData).to.include.keys('categories', 'transactions', 'income');
          done();
        });
      });

    });

    describe('/api/transaction', function() {
      it('PUT should add a new transaction to the userdata', function(done) {
        const objToInsert = {
          "category" : "test",
          "moneySpent" : 200,
          "id" : "8hl90",
          "transactionName" : "newTransaction"
        };

        authenticatedUser
          .put('/api/transaction')
          .query(objToInsert)
          .end(function(err, response) {
            expect(response).to.have.status(204);
            done();
          });
      });

      xit('DELETE should delete a transaction from the userdata', function(done) {
        const idToDelete = '8hl90';

        authenticatedUser
          .delete(`/api.transaction/${idToDelete}`)
          .then(function(err, response) {
            expect(response).to.have.status(204);
            done();
          });
      });
    });

  });





});




