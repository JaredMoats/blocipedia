"use strict";
module.exports = (sequelize, DataTypes) => {
  var User = sequelize.define(
    "User",
    {
      username: {
        allowNull: true,
        type: DataTypes.STRING
      },
      email: {
        allowNull: false,
        unique: true,
        validate: {
          isEmail: { msg: "must be a valid email" }
        },
        type: DataTypes.STRING
      },
      password: {
        allowNull: false,
        type: DataTypes.STRING
      },
      role: {
        allowNull: false,
        type: DataTypes.INTEGER,
        defaultValue: 0
      }
    },
    {}
  );
  User.associate = function(models) {
    // associations can be defined here
    User.hasMany(models.Wiki, {
      foreignKey: "userId",
      as: "wiki"
    });
  };
  User.prototype.isPremium = function() {
    return this.role === 1;
  };
  User.prototype.isAdmin = function() {
    return this.role === 2;
  };
  return User;
};
