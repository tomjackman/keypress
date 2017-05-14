var express = require('express');
var router = express.Router();
var Promise = require('bluebird');

/*********************************************************
-> Keycloak Admin Client Connection Settings.
*********************************************************/
const adminClient = require('keycloak-admin-client');
const adminClientConfig = require('../keycloak/admin-client.json');
const keycloakJSON = require('../keycloak.json');


/* GET groups listing. */
router.get('/', function(req, res, next) {
  getGroups().then(function(result) {
    res.render('groups', { title: 'Groups', groups: result});
  }, function(err) {
    console.log(err);
  });
});

/* DELETE group. */
router.get('/delete/:groupId', function(req, res, next) {
  deleteGroup(req.params.groupId).then(function(result) {
    res.redirect('/groups');
  });
});

/* CREATE a group. */
router.post('/create', function(req, res, next) {
  createGroup(req.body).then(function(result) {
    res.redirect('/groups');
  });
});

/**
  A function to get the list of groups for a realm.
  @returns {Promise} A promise that will resolve with an Array of role objects
**/
function getGroups() {
  return new Promise(function(resolve, reject) {
    adminClient(adminClientConfig)
    .then((client) => {
    client.groups.find(keycloakJSON.realm)
      .then((groups) => {
        resolve(groups);
      });
    })
    .catch((err) => {
      console.log('Error', err);
      reject(err);
    });
  });
}

/**
  A function to delete a group in a realm
  @param {string} groupId - The id of the group to delete
  @returns {Promise} A promise that resolves.
**/
function deleteGroup(groupId) {
  return new Promise(function(resolve, reject) {
    adminClient(adminClientConfig)
    .then((client) => {
      client.groups.remove(keycloakJSON.realm, groupId)
        .then(() => {
          resolve();
      })
    })
  });
}

/**
  A function to create a new group for a realm.
  @param {object} group - The JSON representation of a group - name must be unique
  @returns {Promise} A promise that will resolve with the group object
**/
function createGroup(group) {
  return new Promise(function(resolve, reject) {
    adminClient(adminClientConfig)
    .then((client) => {
      client.groups.create(keycloakJSON.realm, group)
        .then((createdGroup) => {
          resolve(createdGroup);
      })
    })
  });
}

module.exports = router;
