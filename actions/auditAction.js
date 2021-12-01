const command = require("../resources/input_files/commandConfiguration.json");
const audit = require("../servises/audit");
const helpers = require("../helpers/helpers");

const auditAction = (i) => {
    if (command[i[0].toLowerCase()] === 'yes') { //якщо команда дозволена
        audit.writeAudit(command["daily tax"]);
    } else {
        helpers.disabler(i) //якщо команда не дозволена
    }
};

module.exports = { auditAction };

