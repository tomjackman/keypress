var express = require('express');
var router = express.Router();
var Promise = require('bluebird');

/*********************************************************
-> Keycloak Admin Client Connection Settings.
*********************************************************/
const adminClient = require('keycloak-admin-client');
const adminClientConfig = require('../keycloak/admin-client.json');
const keycloakJSON = require('../keycloak.json');


/* GET roles listing. */
router.get('/', function(req, res, next) {
  getRoles().then(function(result) {
    res.render('roles', { title: 'Roles', roles: result});
  }, function(err) {
    console.log(err);
  });
});

/* DELETE role. */
router.get('/delete/:roleId', function(req, res, next) {
  deleteRole(req.params.roleId).then(function(result) {
    res.redirect('/roles');
  });
});

/* CREATE a role. */
router.post('/create', function(req, res, next) {
  createRole(req.body).then(function(result) {
    res.redirect('/roles');
  });
});

/**
  A function to get the list of roles for a realm.
  @returns {Promise} A promise that will resolve with an Array of role objects
**/
function getRoles() {
  return new Promise(function(resolve, reject) {
    adminClient(adminClientConfig)
    .then((client) => {
    client.roles.find(keycloakJSON.realm)
      .then((roles) => {
        resolve(roles);
      });
    })
    .catch((err) => {
      console.log('Error', err);
      reject(err);
    });
  });
}

/**
  A function to delete a role in a realm
  @param {string} roleId - The id of the role to delete
  @returns {Promise} A promise that resolves.
**/
function deleteRole(roleId) {
  return new Promise(function(resolve, reject) {
    adminClient(adminClientConfig)
    .then((client) => {
      client.roles.remove(keycloakJSON.realm, roleId)
        .then(() => {
          resolve();
      })
    })
  });
}

/**
  A function to create a new role for a realm.
  @param {object} role - The JSON representation of a role - name must be unique
  @returns {Promise} A promise that will resolve with the role object
**/
function createRole(role) {
  return new Promise(function(resolve, reject) {
    adminClient(adminClientConfig)
    .then((client) => {
      client.users.create(keycloakJSON.realm, role)
        .then((createdRole) => {
          resolve(createdRole);
      })
    })
  });
}

module.exports = router;
