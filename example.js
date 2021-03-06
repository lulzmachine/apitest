var apisend = require('apisend'), apitest = require('./lib'), request = require('supertest')

describe('My service', function() {
  var app,
    errors = {
      NO_TOKEN: { code: 1, http: 401, response: 'There is no such access token' },
      LOGIN_FAIL: { code: 2, http: 401, response: 'Login failed' }
    }

  before(function(done) {
    app = require('express')()

    app.use(apisend(errors))
    app.get('/', function(req, res) {
      res.apisend(0)
    })
    app.get('/auth', function(req, res) {
      res.apisend(errors.NO_TOKEN)
    })
    app.listen(3000, done)
  })

  it('should say NO_TOKEN when doing auth', function(done) {
    // request(app).expect(401, done) 
    // ^^ this would work, but lacks precision:
    request(app).get('/auth').api(errors.NO_TOKEN, done)
  })

  it('this test will fail', function(done) {
    // request(app).expect(401, done) 
    // ^^ the above wouldn't throw, but the next one will:
    request(app).get('/auth').api(errors.LOGIN_FAIL, done)
  })

  it('should be able to test for success', function(done) {
    // expect success
    request(app).get('/').api(0, done)
  })

})
