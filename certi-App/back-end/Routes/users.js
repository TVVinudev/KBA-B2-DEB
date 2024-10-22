import { Router, json } from "express";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import dotenv from "dotenv";
import { authenticate } from "../middleware/auth.js";

const userRoute = Router();
dotenv.config();

userRoute.use(json());

const signupData = new Map();
const secretkey = process.env.secretKey;

const certificate = new Map();

userRoute.post('/signup', async (req, res) => {
    try {
        const body = req.body;
        const { firstname, lastName, username, password, role } = body;
        if (signupData.has(username)) {
            console.log(`${username} is already exist !`);
            res.status(404).json({ message: 'user already exist!' })
        } else {
            const newPassword = await bcrypt.hash(password, 10);
            signupData.set(username, { firstname, lastName, password: newPassword, role });
            console.log("signupData : ", signupData);
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

        if (signupData.has(username)) {

            const data = signupData.get(username);

            const valid = await bcrypt.compare(password, data.password)
            console.log(valid)
            if (valid) {
                const token = jwt.sign({ UserName: username, UserRole: data.role }, secretkey, { expiresIn: '1hr' });
                res.cookie("userToken", token, { httpOnly: true });
                res.status(200).json({ message: " login Successfully " });
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


//certficate added

userRoute.post('/certificate', authenticate, (req, res) => {
    try {
        if (req.UserRole == 'admin') {

            const body = req.body;
            const { studentid, student, course, date } = body;

            if (certificate.has(studentid)) {
                console.log("Already found an id !")
            } else {
                certificate.set(studentid, { student, course, date });
                res.status(200).json({ message: "successfully added" });
                console.log(certificate)
            }

        } else {
            res.status(404).json({ message: "user not allowed" })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({ message: "server down!" })
    }

})

//search element

userRoute.get('/search/:id', (req, res) => {
    try {
        const body = req.params.id;
        const id = body;

        if (certificate.has(id)) {
            const data = certificate.get(id);
            res.status(200).json({ message: "Certificate find" });
            console.log(data)
        } else {
            res.status(404).json({ message: "thsi id not found" })
        }
    }catch(error){
        res.status(500).json({message:"server error"})
    }
   
})





export { userRoute };