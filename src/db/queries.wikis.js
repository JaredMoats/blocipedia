const Wiki = require("./models").Wiki;
const User = require("./models").User;
const Collaborator = require("./models").Collaborator;
const markdown = require("markdown").markdown;

module.exports = {
  createWiki(newWiki, callback) {
    return Wiki.create({
      title: newWiki.title,
      body: newWiki.body,
      private: newWiki.private,
      userId: newWiki.userId
    })
      .then(wiki => {
        console.log("create wiki successful");
        callback(null, wiki);
      })
      .catch(error => {
        callback(error);
      });
  },
  /* Retrives the appropriate Wiki by Id */
  getWiki(id, callback) {
    return Wiki.findById(id, {})
      .then(wiki => {
        console.log("retrieve wiki successful");
        callback(null, wiki);
      })
      .catch(error => {
        callback(error);
      });
  },
  getAllWikis(callback) {
    return Wiki.findAll({ where: {
          private: false
        } 
      })
      .then(wikis => {
        callback(null, wikis);
      })
      .catch(error => {
        callback(error);
      });
  },
  updateWiki(id, updatedWiki, updatedPrivacy, callback) {
    console.log("updateWiki triggered");
    if(updatedPrivacy === null) {
      return Wiki.update({ body: updatedWiki }, { where: { id: id } })
      .then(wiki => {
        callback(null, wiki);
      })
      .catch(err => {
        callback(err);
      });
    } else {
      Wiki.update({ private: updatedPrivacy, body: updatedWiki }, { where: { id: id } })
      .then(wiki => {
        callback(null, wiki);
      })
      .catch(err => {
        callback(err);
      });
    }
    /*return Wiki.findOne({ where: { id } }).then(wiki => {
      if (!wiki) {
        return callback("Wiki not found");
      }
    });*/
  },
  deleteWiki(req, callback) {
    return Wiki.findById(req.params.id).then(wiki => {
      wiki
        .destroy()
        .then(res => {
          callback(null, wiki);
        })
        .catch(error => {
          callback(error);
        });
    });
  },
  addCollaborator(req, callback) {
    User.findOne({
      where: {
        email: req.body.collaborator
      }
    }).then(user => {
      if(!user) {
        console.log("User not found");
        callback("Error", "User not found");
      }
      Collaborator.create({
        wikiId: req.params.id,
        userId: user.id
      })
    }).then(collaborator => {
      callback(null, collaborator);
    }).catch(err => {
      callback(err, null);
    });
  },
  removeCollaborator(req, callback) {
    User.findOne({
      where: {
        email: req.body.collaborator
      }
    }).then(user => {
      if(!user){
        console.log("User doesn't exist");
        callback("Error", "User doesn't exist");
      }
      Collaborator.destroy({
        where: {
          wikiId: req.params.id,
          userId: user.id
        }
      }).catch(error => {
        callback(error);
      })
    })
  }
};
