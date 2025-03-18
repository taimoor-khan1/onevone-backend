const User = require("../models/User");

exports.getuser= async (req, res) => {
    try {
      const users = await User.find({ _id: { $ne: req.user.userId } }).select('-password',); 
      res.status(200).json({sucess:true,data:users});
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  exports.searchUser = async (req, res) => {
    const { query } = req.query;
  
    // Validate the query parameter
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Query parameter is required and must be a string' });
    }
  
    try {
      const users = await User.find({
        $or: [
          { username: { $regex: query, $options: 'i' } }, // Case-insensitive search
          { email: { $regex: query, $options: 'i' } },
        ],
        _id: { $ne: req.user.userId }, // Exclude the logged-in user
      }).select('-password');
  
      res.status(200).json({ success: true, data: users });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };