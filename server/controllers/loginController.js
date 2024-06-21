const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userCollection = require('../model/users');

// Function to generate access token
const generateAccessToken = (userData) => {
    return jwt.sign(userData, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '15m' }); // Adjust expiry time as needed
};

// Function to generate refresh token with expiry time (1 day)
const generateRefreshToken = (userData) => {
    return jwt.sign(userData, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '1d' });
};

// ---------------login post data--------------
const login = async(req,res) => {
    const {email, password} = req.body
    try {

        const user = await userCollection.findOne({email})

        if(!user){
            return res.status(404).json({ message: 'Invalid User' });
        }


        bcrypt.compare(password, user.password, (err, result) => {
            if (result === false) {
                return res.status(401).json({ message: 'Invalid Password' });
            }

            if(user.isBlocked){
                return res.status(403).json({ message: 'Blocked User' });
            }

            // Generate access token with expiry time (15 minutes)
            const accessToken = generateAccessToken({ id: user._id });

            // Generate refresh token with expiry time (1 day)
            const refreshToken = generateRefreshToken({ id: user._id });

            user.password = ''

            return res.status(200).json({ message: 'Login Verified', accessToken, refreshToken, user });
    
        })
    } 
    catch (error) {
        console.log(error.message);
    }
}

// ---------------google login post data--------------
const googleLogin = async (req, res) => {
    const { email, firstName, lastName } = req.body;
    
    try {
        const user = await userCollection.findOne({ email });

        if (!user) {
            const hashedPassword = await bcrypt.hash(email, 10);

            const newUser = new userCollection({
                firstName: firstName,
                lastName: lastName,
                email: email,
                password: hashedPassword,
            });

            const savedUser = await newUser.save();
              // Generate access token with expiry time (15 minutes)
              const accessToken = generateAccessToken({ id: savedUser._id });

              // Generate refresh token with expiry time (1 day)
              const refreshToken = generateRefreshToken({ id: savedUser._id });
  
              savedUser.password = ''
  
              return res.status(200).json({ message: 'Login Verified', accessToken, refreshToken, user: savedUser });
        } else {
            if(user.isBlocked){
                return res.status(403).json({ message: 'Blocked User' });
            }

            // Generate access token with expiry time (15 minutes)
            const accessToken = generateAccessToken({ id: user._id });

            // Generate refresh token with expiry time (1 day)
            const refreshToken = generateRefreshToken({ id: user._id });

            user.password = ''

            return res.status(200).json({ message: 'Login Verified', accessToken, refreshToken, user });
        }
    } 
    catch (error) {
        console.log(error.message);
        res.status(500).json({ message: 'Server error' });
    }
}

module.exports = {
    login, googleLogin
}