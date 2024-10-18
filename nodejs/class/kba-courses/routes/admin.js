import { Router, json, response } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';



const adminRoute = Router();

adminRoute.use(json());

const data = new Map();
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
         const token = jwt.sign({ UserName:username, UserRole:result.role },secretkey,{expiresIn:'1h'});
         console.log(token);
        res.cookie('authToken', token, { httpOnly:true });
        res.status(200).json({message:'Success'})

        } else {
            res.status(400).json({ message: 'please check your username and password' })
            console.log("please check your username and password");
        }


    } catch (err) {
        console.log(err)
    }
})





export { adminRoute };