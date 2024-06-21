const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer');
const generateOTP = require('generate-otp');
require('dotenv').config();
const jwt = require('jsonwebtoken')

const tempRegister = require('../model/tempRegister')
const userCollection = require('../model/users');


// ---------------node mailer--------------

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.PASSWORD
    },
});

// ---------------signup OTP function--------------

const sendOtpToEmail = async(email) => {
    const otp = generateOTP.generate(6, { digits: true, alphabets: false, specialChars: false });

    await tempRegister.findOneAndUpdate({email:email},{$set:{otp}})

    const mailOptions = {
        from: 'letschat8055@gmail.com',
        to: `${email}`,
        subject: 'Your OTP Code',
        text: `Your OTP code is: ${otp}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error sending email: ' + error);
        }
        else {
            console.log('Email sent: ' + info.response);
        }

        setTimeout(async () => {
            await tempRegister.findOneAndDelete({ email });
        }, 900000);
        
    });
}

// ---------------signup post data--------------

const register = async(req,res) => {

    const data = req.body
    const hashedPassword = await bcrypt.hash(data.password, 10)
    data.password = hashedPassword

    const isUserExist = await userCollection.findOne({email: data.email},{email:1})

    if(!isUserExist){
        await tempRegister.findOneAndDelete({ email: data.email });
        await tempRegister.insertMany([data])
        sendOtpToEmail(data.email)
        const token = jwt.sign({ registerEmail: data.email }, process.env.SECRET_KEY, { expiresIn: '1h' });
        res.status(402).json({message:'user not exist', token})
    }
    else{
        res.status(409).json({message:'user alredy exist'})
    }
}

// ---------------signup verify otp--------------

const verifyRegisterOtp = async(req,res) => {
    try {

        let registerEmail 

        const {enteredOtp, registerToken} = req.body

        jwt.verify(registerToken, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
              console.error('Failed to verify token:', err.message);
            } else {
              registerEmail = decoded.registerEmail
            }
        });

        const sendOtp = await tempRegister.findOne({email:registerEmail},{otp:1,_id:0})

        if(!sendOtp){
            return res.status(410).json({ message: 'errorOtp' });
        }

        if (enteredOtp == sendOtp.otp) {
            const tempRegisterData = await tempRegister.findOne({email:registerEmail})
            const data={
                firstName: tempRegisterData.firstName,
                lastName: tempRegisterData.lastName,
                email: tempRegisterData.email,
                password: tempRegisterData.password,
                createdAt: tempRegisterData.createdAt
            }
           
            await userCollection.insertMany([data])
            await tempRegister.findOneAndDelete({ email:registerEmail });
            return res.status(201).json({message: 'success' });
        }
        else {
            return res.status(400).json({message: 'errorOtp' });
        }
    } 
    catch (error) {
       console.log(error.message); 
    }
}

// ---------------signup resend otp--------------

const resendOtp = async(req,res) => {
    try {

        let registerEmail;

        const { registerToken } = req.body;

        jwt.verify(registerToken, process.env.SECRET_KEY, (err, decoded) => {
            if (err) {
                return res.status(400).json({ message: 'Invalid token' });
            } else {
                registerEmail = decoded.registerEmail;
            }
        });

        sendOtpToEmail(registerEmail);
        return res.status(200).json({ message: 'OTP resent successfully' });

    } 
    catch (error) {
        return res.status(500).json({ message: 'Internal server error' });
    }

}


module.exports = {
    register, verifyRegisterOtp, resendOtp
}