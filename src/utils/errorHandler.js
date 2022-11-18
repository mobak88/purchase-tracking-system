/* Functions that checks if req.params is number and exists, needs res to send error msg */
exports.checkIdIsNumber = (id, res) => {
    if (isNaN(parseInt(id))) {
        // Was not sure wich status code to use, whent with the accepted answer here: https://stackoverflow.com/questions/7939137/what-http-status-code-should-be-used-for-wrong-input
        return res.status(422).json('Please use number');
    }
};

/* Checks if query.rows returns anything, if not send error msg */
exports.checkIdExists = (item, res) => {
    // If not match id does not exist
    if (item.rows.length === 0) {
        return res.status(404).json('Card not found');
    }
};