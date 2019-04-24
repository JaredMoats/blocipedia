const sendGrid = require("@sendgrid/mail");

module.exports = {
  /* Set the Send Grid API key in the environment */
  initialize() {
    sendGrid.setApiKey(process.env.SENDGRID_API_KEY);
    console.log(
      `Your sendGrid API key (from sendGrid.js): ${
        process.env.SENDGRID_API_KEY
      }`
    );
  },
  /* Sends the new user an email upon registration */
  newUserEmail(email) {
    const message = {
      to: email,
      from: "jared@blocipedia.org",
      subject: "Thanks for joining Blocipedia!",
      text:
        "Thanks for joining my Blocipedia, a Node project for my web development portfolio!"
    };

    sendGrid.send(message);
  }
};
