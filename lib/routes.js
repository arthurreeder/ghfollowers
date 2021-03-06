var Router = require('express').Router;
var checkAuth = require('./check_auth');
var user = require('./user');
var githubOAuth = require('./github_oauth');

module.exports = function(app) {

  app.get('/me', checkAuth, function(req, res) {
    req.user.summary().then(function(summary) {
      res.json(summary);
    });
  });

  var router = new Router();
  app.use('/info', router);

  router.use(checkAuth);

  router.get('/following', function(req, res) {
    req.user.getFollowing().then(function(users) {
      res.json(users);
    });
  });

  router.get('/followers', function(req, res) {
    req.user.updateFollowedBy().then(function() {
      return req.user.followers();
    }).then(function(users) {
      res.json(users);
    });
  });

  app.get('/logout', function(req, res) {
    req.session.destroy();
    res.redirect('/');
  });

  app.get('/user', checkAuth, function(req, res) {
    return res.json(req.user.model);
  });

  app.post('/follow', checkAuth, function(req, res) {
    req.user.summary().then(function(summary) {
      return req.user.addFollowers(summary.amount);
    }).then(function(result) {
      res.json(result);
    });
  });

  app.post('/unfollow', checkAuth, function(req, res) {
    req.user.removeFollowers().then(function(result) {
      res.json(result);
    });
  });

  githubOAuth.addRoutes(app, function(err, token, res, ignore, req) {
    if (token.error) {
      return res.send('There was an error logging in: ' + token.error_description);
    }
    req.session.token = token.access_token;
    res.redirect('/');
  });

};
