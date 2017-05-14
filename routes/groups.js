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

module.exports = router;
