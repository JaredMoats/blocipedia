const ApplicationPolicy = require("./application");

module.exports = class WikiPolicy extends ApplicationPolicy {
  delete() {
    return this._isAdmin() || this._isOwner();
  }
};
