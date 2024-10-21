import { Router, json, response } from "express";
import { authenticate } from "../middleware/auth.js";

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';





const adminRoute = Router();


adminRoute.use(json());

const data = new Map();
const course = new Map();
const secretkey = "dev";


adminRoute.get('/', (req, res) => {
    res.send('hello world')

});

adminRoute.post('/signup', async (req, res) => {
    try {
        const body = req.body;


        const { firstname, lastname, username, password, role } = body;

        if (data.has(username)) {
            res.status(404).json({ message: `${username} is already exit` });
            console.log(`${username} is already exit`);

        } else {
            console.log(firstname, lastname, username, password, role);
            const newpassword = await (bcrypt.hash(password, 10));
            console.log(newpassword);
            data.set(username, { firstname, lastname, newpassword, role });

            res.status(201).json({ message: 'Successfully created' })
        }


    } catch (err) {
        res.status(500).json({ message: 'Server side error' })
    }
})


adminRoute.post('/login', async (req, res) => {
    try {
        const body = req.body;
        const { username, password } = body;
        console.log(username, password);
        const result = data.get(username);
        console.log(result);

        const valid = await bcrypt.compare(password, result.newpassword);
        console.log(valid);

        if (valid) {
            const token = jwt.sign({ UserName: username, UserRole: result.role }, secretkey, { expiresIn: '1h' });
            console.log(token);
            res.cookie('authToken', token, { httpOnly: true });
            res.status(200).json({ message: 'Success' })

        } else {
            res.status(400).json({ message: 'please check your username and password' })
            console.log("please check your username and password");
        }


    } catch (err) {
        console.log(err)
    }
})





adminRoute.post('/addCourse', authenticate, (req, res) => {

    try{
        console.log('user name :', req.UserName);
        console.log('user role', req.UserRole);
    
        if (req.UserRole === 'admin') {
            const body = req.body;
            console.log(body)
            const { cid, cname, ctype, cdescription, cprice } = body;
            course.set(cid, {cname, ctype, cdescription, cprice});
            res.status(200).json({ message: "Course added!" });
            console.log(course);
    
        } else {
            console.log("you are not admin")
        }
    }catch(error){
        console.log(error)
    }


});













export { adminRoute };