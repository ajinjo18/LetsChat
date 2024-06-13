const userCollection = require('../model/users')

const isBlocked = async(req,res,next) => {
    // const email = req.user.userEmail
    const userId = req.user.id
    try {     
        const user = await userCollection.findOne({_id: userId},{isBlocked:1})
        if(!user){
            return res.status(404).json({ message: 'Invalid User' })
        }

        if(user.isBlocked){
            return res.status(404).json({ message: 'Account Blocked' })
        }

        next()
    } 
    catch (error) {
        console.log(error.message);
    }

}


module.exports = isBlocked