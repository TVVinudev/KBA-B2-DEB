import { Router, json, response } from "express";
import { authenticate } from "../middleware/auth.js";
import dotenv from 'dotenv';
import bcrypt, { compareSync } from 'bcrypt';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';




dotenv.config();
const adminRoute = Router();


adminRoute.use(json());

// const data = new Map();
// const course = new Map();
const secretkey = process.env.secretKey;

//Define User Schema
const userSchema = new mongoose.Schema({
    firstname: String,
    lastname: String,
    username: { type: String, unique: true },
    password: String,
    role: String
});
const courseSchema = new mongoose.Schema({
    courseid: { type: String, unique: true },
    coursename: String,
    coursetype: String,
    coursedescription: String,
    courseprice: Number
});
const user = mongoose.model('Userdetails', userSchema);
const course = mongoose.model('coursedetails', courseSchema);
mongoose.connect('mongodb://localhost:27017/KBA-Courses'); // create database


adminRoute.get('/', (req, res) => {
    res.send('hello world')

});

adminRoute.post('/signup', async (req, res) => {
    try {
        const body = req.body;


        const { firstname, lastname, username, password, role } = body;
        const newpassword = await (bcrypt.hash(password, 10));
        console.log(newpassword);

        // if (data.has(username)) {
        //     res.status(409).json({ message: `${username} is already exit` });
        //     console.log(`${username} is already exit`);

        // } else {

        //     const newpassword = await (bcrypt.hash(password, 10));
        //     console.log(newpassword);
        //     data.set(username, { firstname, lastname, newpassword, role });
        //     console.log(data);
        //     res.status(201).json({ message: 'Successfully created' })
        // }
        const existingUser = await user.findOne({ username: username })
        console.log(existingUser);


        if (existingUser) {
            res.status(409).json({ message: `${username} is already exit` });
            console.log(`${username} is already exit`);
        } else {
            const newUser = new user({
                firstname: firstname,
                lastname: lastname,
                username: username,
                password: newpassword,
                role: role
            });

            console.log(newUser);


            //use insertMany() or save() or create() to store the data in the db.

            await newUser.save();
            res.status(201).json({ message: "User register successfully" })
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

        const result = await user.findOne({ username: username });

        if (!result) {
            res.status(404).json({ message: "usernot found" })
        } else {
            const valid = await bcrypt.compare(password, result.password);
            console.log(valid);

            if (valid) {
                const token = jwt.sign({ UserName: username, UserRole: result.role }, secretkey, { expiresIn: '1h' });
                console.log(token);
                res.cookie('KBAToken', token, { httpOnly: true });
                res.status(200).json({ message: 'Success' })

            } else {
                res.status(400).json({ message: 'please check your username and password' })
                console.log("please check your username and password");
            }
        }

    } catch (err) {
        console.log(err)
    }
})





adminRoute.post('/addCourse', authenticate, async (req, res) => {

    try {
        console.log('user name :', req.UserName);
        console.log('user role', req.UserRole);

        if (req.UserRole === 'admin') {



            const body = req.body;
            console.log(body)
            const { cid, cname, ctype, cdescription, cprice } = body;
            // console.log('evide ethi')

            const courseFound = await course.findOne({ courseid: cid, })

            if (courseFound) {
                res.status(404).json({ message: "Course already found" })
            } else {
                const newCourse = new course({
                    courseid: cid,
                    coursename: cname,
                    coursetype: ctype,
                    coursedescription: cdescription,
                    courseprice: parseInt(cprice)
                });

                await newCourse.save();
                res.status(200).json({ message: "Course added!" });
                // console.log(course);
            }
        } else {
            res.status(404).json({ message: "Not a valid user" })
            console.log("you are not admin")
        }
    } catch (error) {
        res.status(500).json({ message: "server error" })
        console.error(error)
    }


});



//update:

adminRoute.patch('/update', authenticate, async (req, res) => {
    const body = req.body
    const { cid, cname, ctype, cdescription, cprice } = body;

    if (!cid || !cname || !ctype || !cdescription || !cprice) {
        return res.status(400).json({ message: 'All fields are required: cid, cname, ctype, cdescription, cprice' });
    }

    try {

        if (req.UserRole !== 'admin') {
            console.log('user not authenticated');
            return res.status(401).json({ message: "User not authenticated" });
        }


        const available = await course.findOne({ courseid: cid });
        if (!available) {
            return res.status(404).json({ message: 'Course not found!' });
        }


        const result = await course.updateOne(
            { courseid: cid },
            {
                $set: {
                    coursename: cname,
                    coursetype: ctype,
                    coursedescription: cdescription,
                    courseprice: cprice
                }
            }
        );

        if (result.matchedCount === 0) {
            return res.status(400).json({ message: 'Course could not be updated' });
        } else {
            return res.status(200).json({ message: 'Course updated successfully', result });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
});



//put using update 

adminRoute.put('/update/:id', authenticate, async (req, res) => {
    const cid = req.params.id;
    const body = req.body
    const { cname, ctype, cdescription, cprice } = body;

    if (!cid || !cname || !ctype || !cdescription || !cprice) {
        return res.status(400).json({ message: 'All fields are required: cid, cname, ctype, cdescription, cprice' });
    }

    try {

        if (req.UserRole !== 'admin') {
            console.log('user not authenticated');
            return res.status(401).json({ message: "User not authenticated" });
        }


        const available = await course.findOne({ courseid: cid });
        if (!available) {
            return res.status(404).json({ message: 'Course not found!' });
        }


        const result = await course.updateOne(
            { courseid: cid },
            {
                $set: {
                    coursename: cname,
                    coursetype: ctype,
                    coursedescription: cdescription,
                    courseprice: cprice
                }
            }
        );

        if (result.matchedCount === 0) {
            return res.status(400).json({ message: 'Course could not be updated' });
        } else {
            return res.status(200).json({ message: 'Course updated successfully', result });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
})

//patch using update

adminRoute.post('/update/:id', authenticate, async (req, res) => {
    const cid = req.params.id;
    const body = req.body
    const { cname, ctype, cdescription, cprice } = body;

    if (!cid || !cname || !ctype || !cdescription || !cprice) {
        return res.status(400).json({ message: 'All fields are required: cid, cname, ctype, cdescription, cprice' });
    }

    try {

        if (req.UserRole !== 'admin') {
            console.log('user not authenticated');
            return res.status(401).json({ message: "User not authenticated" });
        }


        const available = await course.findOne({ courseid: cid });
        if (!available) {
            return res.status(404).json({ message: 'Course not found!' });
        }


        const result = await course.updateOne(
            { courseid: cid },
            {
                $set: {
                    coursename: cname,
                    coursetype: ctype,
                    coursedescription: cdescription,
                    courseprice: cprice
                }
            }
        );

        if (result.matchedCount === 0) {
            return res.status(400).json({ message: 'Course could not be updated' });
        } else {
            return res.status(200).json({ message: 'Course updated successfully', result });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });
    }
})





///get method using params

adminRoute.get('/search/:search', async (req, res) => {

    try {

        const body = req.params.search;

        const result = await course.findOne({ courseid: search })
        if (result) {
            res.status(200).json({ data: result })
        }

    } catch (err) {
        console.log(err);

    }
})

//search using query

adminRoute.get('/search', async (req, res) => {
    try {
        const body = req.query.element;
        const search = body;
        if (search) {
            const result = await course.findOne({ courseid: search });

            if (result) {
                // res.send(result);
                res.status(200).json({ result })
            } else {
                res.status(404).json({ message: 'data not found!' })
            }

        } else {
            console.log('dont find any earch element')
        }
    } catch (err) {
        console.log(err);

    }
})



//delete


adminRoute.delete('/delete/:id', authenticate,async (req, res) => {
    try {
        const cid = req.params.id

        if (req.UserRole === 'admin') {
            const result = await course.findOne({ courseid: cid })
            if (result) {
                const result = await collection.deleteOne({courseid:cid});
                console.log(`${result.deletedCount} document(s) was/were deleted.`);
                res.status(200).json({message:"Delete Successfully"})
            }
        }

    } catch (error) {
        console.log(error)
    }
})

//view user

adminRoute.get('/viewUser', authenticate, (req, res) => {
    try {
        const user = req.UserRole;
        console.log(user)
        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: "server error" })
    }
})

//view courses

adminRoute.get('/viewCourse', async (req, res) => {
    try {
        
        const result = await course.find()

        if (result) {

            res.send(Array.from(result.entries()))
            res.status(200).json({message:"view all data"})
        }
        else {
            res.status(404).json({ message: 'Not Found' });
        }
    }
    catch {
        res.status(500).json({ message: "Internal error" })
    }
})

//logout

adminRoute.get('/logout', authenticate, (req, res) => {
    try {
        if (req.UserRole) {
            res.clearCookie('authToken');
            res.status(200).json({ message: "Logout successfull" });
        } else {
            res.status(404).json({ message: "No user found!" })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" })
    }

})



export { adminRoute };