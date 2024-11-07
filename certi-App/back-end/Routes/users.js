import { Router, json } from "express";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import { authenticate } from "../middleware/auth.js";
import mongoose, { Schema } from 'mongoose';

const userRoute = Router();
dotenv.config();

userRoute.use(json());

// const signupData = new Map();
const secretkey = process.env.secretKey;

// const certificate = new Map();

//schema 
const userDetails = new Schema({
    firstname: { type: String },
    lastname: { type: String },
    username: { type: String, unique: true },
    password: { type: String },
    role: { type: String }
});
const certificateDetails = new Schema({
    certificateID: { type: String, unique: true },
    certificateName: { type: String },
    studentName: { type: String },
    grade: { type: String },
    issueDate: { type: String }
})

//model creation
const user = mongoose.model('UserDetails', userDetails);
const certficate = mongoose.model('CertificateDetails', certificateDetails);

//database connection
mongoose.connect('mongodb://localhost:27017/Certi-App'); //db created


//signupu



userRoute.post('/signup', async (req, res) => {
    try {
        const body = req.body;
        const { firstname, lastName, username, password, role } = body;

        const signupData = await user.findOne({ username: username })

        if (signupData) {
            console.log(`${username} is already exist !`);
            res.status(404).json({ message: 'user already exist!' })
        } else {
            const newPassword = await bcrypt.hash(password, 10);

            const newUser = new user({
                firstname: firstname,
                lastname: lastName,
                username: username,
                password: newPassword,
                role: role
            });

            await newUser.save();
            res.status(201).json({ message: "account created" });
        }

    } catch (err) {
        console.log(err)
    }

})


userRoute.post('/login', async (req, res) => {
    try {
        const body = req.body;
        const { username, password } = body;

        const data = await user.findOne({ username: username })

        if (data) {
            const valid = await bcrypt.compare(password, data.password)
            console.log(valid)
            if (valid) {
                const token = jwt.sign({ UserName: username, UserRole: data.role }, secretkey, { expiresIn: '1hr' });
                res.cookie("userToken", token, { httpOnly: true });
                res.status(200).json({ message: " login Successfully " });
                console.log(token);

            } else {
                res.status(404).json({ message: "incorrect password" })
            }
        } else {
            res.status(404).json({ message: "user cannot found! Please check your userid " });
            console.log("404 : user cannot found!")
        }


    } catch (err) {
        console.log(err)
    }
});


// //certficate added

userRoute.post('/certificate', authenticate, async (req, res) => {
    try {
        if (req.UserRole == 'admin') {

            const body = req.body;
            const { cid, cname, student, grade, date } = body;

            const certificateData = await certficate.findOne({ certificateID: cid });

            if (certificateData) {
                console.log("Already found an id !")
            } else {
                const newCertificate = new certficate({
                    certificateID: cid,
                    certificateName: cname,
                    studentName: student,
                    grade: grade,
                    issueDate: date
                });

                await newCertificate.save();
                res.status(200).json({ message: "new certificate added" });
            }

        } else {
            res.status(404).json({ message: "user not allowed" })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "server down!" })
    }

})

// //search element

userRoute.get('/search/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const certificateData = await certficate.findOne({ certificateID: id });

        if (certificateData) {
            res.status(200).json({ message: "Certificate find", data: certificateData });
        } else {
            res.status(404).json({ message: "thsi id not found" })
        }
    } catch (error) {
        res.status(500).json({ message: "server error" })
    }
})

userRoute.get('/viewUser', authenticate, (req, res) => {
    try {
        const user = req.UserRole;
        console.log(user)
        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: "server error" })
    }
})

//view courses

userRoute.get('/viewCertificate', authenticate, async (req, res) => {
    try {

        if (req.UserRole == 'admin') {
            
            const data = await certficate.find();

            if (data) {

                res.send(Array.from(data.entries()))
            }
            else {
                res.status(404).json({ message: 'Not Found' });
            }
        }

    }
    catch {
        res.status(404).json({ message: "Internal error" })
    }
})

//logout

userRoute.get('/logout', authenticate, (req, res) => {
    try {
        if (req.UserRole) {
            res.clearCookie('userToken');
            res.status(200).json({ message: "Logout successfull" });
        } else {
            res.status(404).json({ message: "No user found!" })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" })
    }

})




export { userRoute };