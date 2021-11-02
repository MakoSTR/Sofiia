const createAuditMessage = (inputArr, resMessage) => {
    const inputString = inputArr.join();

    return `${inputString} => ${resMessage}`;
}

module.exports = {
    createAuditMessage
}