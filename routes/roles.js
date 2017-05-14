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

module.exports = router;
