const express = require('express');
const router = express.Router();

router.delete('/*', (req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin', `${req.protocol}://${req.hostname}`);
    res.setHeader('Access-Control-Allow-Methods', 'DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

module.exports = router;