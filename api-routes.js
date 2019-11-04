// Initialize express router
let router = require('express').Router();

// Set default API response
router.get('/', function(req, res) {
  res.json({
    status: 'API Its Working',
    message: 'Welcome to node-crud!'
  });
});

module.exports = router;