'use strict';
module.exports = (sequelize, DataTypes) => {
  var PublicWikis = sequelize.define('PublicWikis', {
    title: DataTypes.STRING
  }, {});
  PublicWikis.associate = function(models) {
    // associations can be defined here
  };
  return PublicWikis;
};