const jwt = require('jsonwebtoken');

const refreshToken = (req, res) => {
    const { refresh } = req.body;
    // Check if refresh token is valid (e.g., verify signature and expiration)
    try {
        const decoded = jwt.verify(refresh, process.env.REFRESH_TOKEN_SECRET);
        // If refresh token is valid, generate a new access token
        const accessToken = jwt.sign({ id: decoded.id }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "15m" });
        // Return the new access token
        res.status(200).json({ accessToken: accessToken });
    } catch (err) {
        // If refresh token is invalid, return an error response
        res.status(401).json({ message: "Invalid refresh token" });
    }
}

module.exports = {
    refreshToken
}
