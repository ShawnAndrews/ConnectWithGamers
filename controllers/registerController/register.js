let express = require('express');
let router = express.Router();

router.post('/', function (req, res) {
    res.send('Got registration page!');
})

module.exports = router;