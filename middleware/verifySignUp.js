const db = require("../models");


const User = db.user

const verifySignUp = (req, res, next) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(user => {
        if (user) {
            res.status(409).send({
                message: "Failed! Email is already in use!"
            });
            return;
        }
        next();
    });
};

module.exports = verifySignUp;