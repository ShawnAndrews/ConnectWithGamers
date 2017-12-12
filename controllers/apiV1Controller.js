var express = require('express')
var router = express.Router()

// log middleware
router.use((req, res, next) => {
    console.log('Request at ', Date.now());
    next();
});

router.get('/customer', (req, res) => {
    res.send({Name: 'John'});
});

module.exports = router;