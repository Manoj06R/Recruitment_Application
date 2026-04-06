const express = require('express');
const router = express.Router();
const User = require('../models/User');

// PUT /api/users/:id
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // We shouldn't allow password updates via this generic endpoint
    delete updates.password;
    delete updates.contactEmail; // Usually email updates req verification

    const user = await User.findByIdAndUpdate(
      id,
      { $set: updates },
      { new: true, runValidators: false } // return updated docs
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.toJSON());
  } catch (error) {
    console.error('Update user profile error:', error);
    res.status(500).json({ message: 'Server error during profile update.' });
  }
});

module.exports = router;
