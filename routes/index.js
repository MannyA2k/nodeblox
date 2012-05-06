'use strict'

var util = require('util');
var Logger = require('devnull');
var logger = new Logger({namespacing : 0});
var User  = require('../schemas/User');
var Post = require('../schemas/Post');

/*
 * GET home page.
 */
module.exports = function(app){
  /**
    * Map the URL '/' to the callback
    */
  app.get('/', function(req, res){
    logger.log('Serving request for url [GET]' + req.route.path)
    
    res.render('index')
  });

  /**
    * Map the URL '/login' to the callback
    */
  app.post('/login', function(req, res){
    logger.log('Serving request for url [POST] ' + req.route.path);
    var username = req.body.User;
    var password = req.body.Password;

    User.validateUser(username, password, function(err, user){
      if(err && !user){
        res.json({
          retStatus : 'failure'  
        });
      }else{
        req.session.user = user;
        res.json({
          retStatus : 'success',
          user : user
        });
      }
    });
  });

  /**
    * Logout the current user and clear the session
    */
  app.get('/logout', function(req, res){
    logger.log('Serving request for url [GET] ' + req.route.path);
    req.session.user = undefined;
    res.redirect('/');
  });

  /**
    * Add a new User to database
    */
  app.post('/signup', function(req, res){
    util.log('Serving request for url [POST] ' + req.route.path);
    
    var username = req.body.User;
    var password = req.body.Password;

    util.log('Username' + username + '   Pass ' + password);
  });

  app.get('/admin', function(req, res){
    util.log('Serving request for url [GET] ' + req.route.path);    
    if(req.session.user){
      res.render('post');
    }else{
      res.redirect('/');
    }
  });

  /**
    * Save the post to database
    */
  app.post('/admin/save/post', function(req, res){
    var postContent = req.body.postContent;

    var post = new Post();
    post.postSubject =  postContent.postSubject;
    post.content= postContent.postContent;
    post.author = req.session.user.username;
    post.tags =  postContent.postTags;

    post.save(function(err, response){
      if(!err && response){
        util.log('Successfully saved Post with id : ' + response.id);
        res.json({
          'retStatus' : 'success',
          'data' : response
        })
      }else{
        res.json({
          'retStatus' : 'failure',
          'error' : err
        });
      }
    });
  });

  app.get('/contact', function(req, res){
    util.log('Serving request for url[GET] ' + req.route.path);
    res.render('contact');
  });
};
