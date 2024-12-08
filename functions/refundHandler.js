const { successMessageHandler } = require("../utils/util")


const refundHandler = async (socket,savedTransaction) => {
       successMessageHandler(socket,'Refund processed successfuly')
}

module.exports = {
    refundHandler
}