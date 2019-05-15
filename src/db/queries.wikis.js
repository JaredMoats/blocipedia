const Wiki = require("./models").Wiki;

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
    return Wiki.all()
      .then(wikis => {
        callback(null, wikis);
      })
      .catch(error => {
        callback(error);
      });
  },
  updateWiki(id, updatedWiki, callback) {
    return Wiki.findOne({ where: { id } }).then(wiki => {
      if (!wiki) {
        return callback("Wiki not found");
      }

      wiki
        .update(updatedWiki, {
          fields: Object.keys(updatedWiki)
        })
        .then(() => {
          console.log("updatedWiki: " + updatedWiki);
          console.log("wiki.body: " + wiki.body);
          callback(null, wiki);
        })
        .catch(error => {
          callback(error);
        });
    });
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
  }
};
