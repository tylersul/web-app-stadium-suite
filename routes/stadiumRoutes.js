const express              = require('express'),
      router               = express.Router(),
      catchAsync           = require('../utils/catchAsync'),
      { isLoggedIn, isAuthor, validateStadium }       = require('../middleware');

const Stadium  = require('../models/stadium');
const Review   = require('../models/review');

const stadiums = require('../controllers/stadiums');


/***  Stadium Routes ***/
// Homepage - GET
router.get('/', stadiums.index);

// Create New Stadium - GET
router.get('/new', isLoggedIn, stadiums.renderNewForm);

// Create New Stadium - POST
router.post('/', validateStadium, catchAsync(stadiums.createStadium));

// Show Stadium - GET
router.get("/:id", catchAsync(stadiums.showStadium));

// Edit Stadium - GET
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(stadiums.renderEditForm));

// Edit Stadium - PUT
router.put('/:id', isLoggedIn, isAuthor, validateStadium, catchAsync(stadiums.updateStadium));

// Delete Stadium - DELETE
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(stadiums.deleteStadium));

// Export
module.exports = router;