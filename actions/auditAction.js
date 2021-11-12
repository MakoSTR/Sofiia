const command = require("../resources/input_files/commandConfiguration.json");
const audit = require("../servises/audit");
const {disabler} = require("../helpers/helpers");

const auditAction = (i) => {
    if (command[i[0].toLowerCase()] === 'yes') {
        audit.writeAudit(command["daily tax"]);
    } else {
        disabler(i)
    }
};

module.exports = { auditAction };

