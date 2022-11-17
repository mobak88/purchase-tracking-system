/* Functions that checks if req.params is number and exists, needs res to send error msg */
exports.checkIdIsNumber = (id, res) => {
    if (isNaN(parseInt(id))) {
        // Not sure if 405 is the correct status code
        return res.status(405).json('Please use number');
    }
};

exports.checkIdExists = (item, res) => {
    // If not match id does not exist
    if (item.rows.length === 0) {
        return res.status(404).json('Card not found');
    }
};