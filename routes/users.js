var express = require('express');
var router = express.Router();
var Promise = require('bluebird');

/*********************************************************
-> Keycloak Admin Client Connection Settings.
*********************************************************/
const adminClient = require('keycloak-admin-client');
const adminClientConfig = require('../keycloak/admin-client.json');
const keycloakJSON = require('../keycloak.json');


/* GET users listing. */
router.get('/', function(req, res, next) {
  getUsers().then(function(result) {
    res.render('users', { title: 'Users', users: result});
  }, function(err) {
    console.log(err);
  });
});

/* DELETE user. */
router.get('/delete/:userId', function(req, res, next) {
  deleteUser(req.params.userId).then(function(result) {
    res.redirect('/users');
  });
});

/* CREATE a user. */
router.post('/create', function(req, res, next) {
  createUser(req.body).then(function(result) {
    res.redirect('/users');
  });
});

/**
  A function to get the list of users or a user for a realm.
  @returns {Promise} A promise that will resolve with an Array of user objects
**/
function getUsers() {
  return new Promise(function(resolve, reject) {
    adminClient(adminClientConfig)
    .then((client) => {
    client.users.find(keycloakJSON.realm, {max: 100})
      .then((users) => {
        resolve(users);
      });
    })
    .catch((err) => {
      console.log('Error', err);
      reject(err);
    });
  });
}

/**
  A function to delete a user in a realm
  @param {string} userId - The id of the user to delete
  @returns {Promise} A promise that resolves.
**/
function deleteUser(userId) {
  return new Promise(function(resolve, reject) {
    adminClient(adminClientConfig)
    .then((client) => {
      client.users.remove(keycloakJSON.realm, userId)
        .then(() => {
          resolve();
      })
    })
  });
}

/**
  A function to create a new user for a realm.
  @param {object} user - The JSON representation of a user - username must be unique
  @returns {Promise} A promise that will resolve with the user object
**/
function createUser(user) {
  return new Promise(function(resolve, reject) {
    adminClient(adminClientConfig)
    .then((client) => {
      client.users.create(keycloakJSON.realm, user)
        .then((createdUser) => {
          resolve(createdUser);
      })
    })
  });
}


module.exports = router;
