const moment = require('moment');

module.exports = {
  createMessage: (user, message) => {
    let newMessage = {
      user_name: user,
      user_message: message,
      time_stamp: moment().format('h:mm a'),
      date: moment().format('MMM Do YYYY')
    }
    return newMessage;
  },
}