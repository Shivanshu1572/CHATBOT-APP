const moment = require('moment');

function formatMessage(username, text, message) {
    return {
        username,
        text,
        time: moment().format('h:mm a')
    };
}

module.exports = formatMessage;