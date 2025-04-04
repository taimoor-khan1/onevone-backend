const bcrypt = require( "bcryptjs" );
const jwt = require( "jsonwebtoken" );
const User = require( "../models/User" );
const { sendEmail } = require( "../utils/email" );
const path = require( "path" );
const fs = require( "fs" );
const axios = require( 'axios' );
// Register user
exports.register = async ( req, res ) => {
  const { username, password, email } = req.body;

  try {
    // Validation
    if ( !username || !password || !email ) {
      return res.status( 400 ).json( { error: 'Please provide all fields' } );
    }

    // Step 1: Check if the username exists on Chess.com
    const chessComUrl = `https://api.chess.com/pub/player/${username}`;
    let chessComData;

    try {
      const response = await axios.get( chessComUrl );
      chessComData = response.data;
    } catch ( err ) {
      if ( err.response && err.response.status === 404 ) {
        return res.status( 400 ).json( { error: 'Username does not exist on Chess.com' } );
      } else {
        console.error( 'Error checking Chess.com username:', err.message );
        return res.status( 500 ).json( { error: 'Failed to verify Chess.com username' } );
      }
    }

    // Step 2: Check if the username or email already exists in the database
    const existingUser = await User.findOne( { $or: [{ username }, { email }] } );
    if ( existingUser ) {
      return res.status( 400 ).json( { error: 'Username or email already exists' } );
    }

    // Step 3: Handle profile picture upload (if provided)
    let profilePicture = '/uploads/default-avatar.png'; // Local default avatar
    if ( req.files && req.files.profilePicture ) {
      const file = req.files.profilePicture;
      const uploadDir = path.join( __dirname, '../uploads' );

      // Create uploads directory if it doesn't exist
      if ( !fs.existsSync( uploadDir ) ) {
        fs.mkdirSync( uploadDir, { recursive: true } );
      }

      // Generate a unique filename
      const fileName = `${Date.now()}-${file.name}`;
      const filePath = path.join( uploadDir, fileName );

      // Save the file
      await file.mv( filePath );

      // Set the profile picture URL
      profilePicture = `/uploads/${fileName}`;
    }

    // Step 4: Create user
    const user = new User( {
      username,
      password,
      email,
      profilePicture: chessComData.avatar,
      verificationCode: Math.floor( 100000 + Math.random() * 900000 ).toString(), // Generate verification code
      player_id: chessComData.player_id || 0, // Save Chess.com player ID
      url: chessComData.url || '', // Save Chess.com profile URL
      country: chessComData.country || '', // Save Chess.com country
    } );

    await user.save();

    // Step 5: Send verification email (mock implementation)
    // await sendEmail(email, 'Verify Your Email', `Your verification code is: ${user.verificationCode}`);

    res.status( 201 ).json( {
      message: 'User registered successfully. Check your email for verification.',
      user: {
        username: user.username,
        email: user.email,
        profilePicture: user.profilePicture,
        player_id: user.player_id,
        url: user.url,
        country: user.country,
      },
    } );
  } catch ( err ) {
    res.status( 500 ).json( { error: err.message } );
  }
};

// Login user
exports.login = async ( req, res ) => {
  const { email, password } = req.body;
  try {
    // Validation
    if ( !email || !password ) {
      return res
        .status( 400 )
        .json( { error: "Please provide username and password" } );
    }

    const user = await User.findOne( { email } );
    if ( !user || !( await bcrypt.compare( password, user.password ) ) ) {
      return res.status( 401 ).json( { error: "Invalid credentials" } );
    }

    // Check if email is verified
    if ( user.verificationCode ) {
      return res.status( 401 ).json( { error: "Email not verified" } );
    }

    const token = jwt.sign( { userId: user._id }, process.env.JWT_SECRET );
    res.json( {
      success: true,
      data: {
        id: user.id,
        username: user.username,
        email: user.email,
        image: user.profilePicture,
        balance: user.balance,
      },
      token: token,
    } );
  } catch ( err ) {
    res.status( 500 ).json( { error: err.message } );
  }
};

// Verify email
exports.verifyEmail = async ( req, res ) => {
  const { email, code } = req.body;
  try {
    // Validation
    if ( !email || !code ) {
      return res
        .status( 400 )
        .json( { error: "Please provide email and verification code" } );
    }

    const user = await User.findOne( { email } );
    if ( !user ) {
      return res.status( 404 ).json( { error: "User not found" } );
    }

    if ( user.verificationCode !== code ) {
      return res.status( 400 ).json( { error: "Invalid verification code" } );
    }

    // Clear verification code
    user.verificationCode = "";
    await user.save();

    res.json( { message: "Email verified successfully" } );
  } catch ( err ) {
    res.status( 500 ).json( { error: err.message } );
  }
};

// Reset password
exports.resetPassword = async ( req, res ) => {
  const { email } = req.body;
  try {
    // Validation
    if ( !email ) {
      return res.status( 400 ).json( { error: "Please provide email" } );
    }

    const user = await User.findOne( { email } );
    if ( !user ) {
      return res.status( 404 ).json( { error: "User not found" } );
    }

    // Generate reset token
    const resetToken = jwt.sign( { userId: user._id }, process.env.JWT_SECRET );
    user.resetPasswordToken = resetToken;
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();
    user.verificationCode = verificationCode;
    await user.save();

    // Send reset email

    await sendEmail( email, 'Reset Your Password', `Here is your verification code: ${verificationCode}` );

    res.json( { message: "Verification code send to your email please Check your email for verification" } );
  } catch ( err ) {
    res.status( 500 ).json( { error: err.message } );
  }
};

// Update password
exports.updatePassword = async ( req, res ) => {
  const { email, newPassword } = req.body;
  try {
    // Validation
    if ( !email || !newPassword ) {
      return res
        .status( 400 )
        .json( { error: "Please provide email and new password" } );
    }

    const user = await User.findOne( { email } );


    if ( !user ) {
      return res.status( 400 ).json( { error: "Invalid or expired token" } );
    }

    // Update password
    user.password = newPassword;
    user.resetPasswordToken = "";
    await user.save();

    res.json( { message: "Password updated successfully" } );
  } catch ( err ) {
    res.status( 500 ).json( { error: err.message } );
  }
};

// Upload profile picture
exports.uploadProfilePicture = async ( req, res ) => {
  try {
    if ( !req.files || !req.files.profilePicture ) {
      return res.status( 400 ).json( { error: "No file uploaded" } );
    }

    const user = await User.findById( req.user.userId );
    if ( !user ) {
      return res.status( 404 ).json( { error: "User not found" } );
    }

    const file = req.files.profilePicture;
    const uploadDir = path.join( __dirname, "../uploads" );

    // Create uploads directory if it doesn't exist
    if ( !fs.existsSync( uploadDir ) ) {
      fs.mkdirSync( uploadDir, { recursive: true } );
    }

    // Generate a unique filename
    const fileName = `${Date.now()}-${file.name}`;
    const filePath = path.join( uploadDir, fileName );

    // Save the file
    await file.mv( filePath );

    // Save the file path to the user's profilePicture field
    user.profilePicture = `/uploads/${fileName}`;
    await user.save();

    res.json( {
      message: "Profile picture uploaded successfully",
      profilePicture: user.profilePicture,
    } );
  } catch ( err ) {
    res.status( 500 ).json( { error: err.message } );
  }
};
