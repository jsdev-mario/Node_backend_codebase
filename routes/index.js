const express = require('express');
const router = express.Router();
const auth = require('./auth');
const user = require('./user');

router.use('/users', user);
router.use('/', auth);

router.use((error, req, res, next) => {

    if (error.error && error.error.details.length > 0) {

        const message = error.error.details[0].message
        return res.status(400).json({ 
            message: message 
        });

    } else {

        if (error.code) {
            return res.status(error.code).json({ message: error.message })
        }else {
            return res.status(500).json({ message: error.message || "Server Internal Error" });
        }
    }
});

module.exports = router;