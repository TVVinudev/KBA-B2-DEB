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
                res.cookie('authToken', token, { httpOnly: true });
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

//search
adminRoute.post('/getcourse', authenticate, (req, res) => {

    try {

        if (req.UserName) {
            const body = req.body;
            const search = body.search;

            if (search) {
                const result = [];
                if (course.size > 0) {
                    for (const [id, item] of course) {
                        if (id.includes(search) || item.cname.includes(search) || item.ctype.includes(search)) {
                            result.push(id, item.cname, item.ctype, item.cdescription, item.cprice);
                            console.log(result);
                            res.status(200).json({ message: "data availabe :", result })
                            break;
                        } else {
                            console.log("search element not found!");

                        }
                    }
                } else {
                    console.log('Storage is empty!')
                }
            }

        } else {
            console.log("not a valid user")
        }

    } catch (err) {
        console.log(err)
    }
})


//update:

adminRoute.post('/update', authenticate, (req, res) => {
    try {
        if (req.UserName) {

            const body = req.body;
            console.log(body);
            const { cid, cname, ctype, cdescription, cprice } = body;
            console.log(cid, cname, ctype, cdescription, cprice);

            if (cid) {
                const oldData = course.get(cid)
                console.log(oldData);

                oldData.cname = cname || oldData.cname;
                oldData.ctype = ctype || oldData.ctype;
                oldData.cdescription = cdescription || oldData.cdescription;
                oldData.cprice = cprice || oldData.cprice;

                console.log(oldData);
                course.set(cid, oldData);

                res.status(200).json({ message: "successfully Updated" })
                console.log(course);

            } else {
                console.log('id is not found!');
                return res.status(404).json({ message: "Course not found" });
            }
        } else {
            console.log('user not loggined')
            return res.status(401).json({ message: "User not authenticated" });
        }

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal Server Error" });

    }
});


//put using update 

adminRoute.put('/update/:id', authenticate, (req, res) => {
    try {
        if (req.UserName) {
            const cid = req.params.id;
            const body = req.body
            const { cname, ctype, cdescription, cprice } = body;
            console.log(cname, ctype, cdescription, cprice);

            if (cid) {
                const oldData = course.get(cid)
                console.log(oldData);

                oldData.cname = cname || oldData.cname;
                oldData.ctype = ctype || oldData.ctype;
                oldData.cdescription = cdescription || oldData.cdescription;
                oldData.cprice = cprice || oldData.cprice;

                console.log(oldData);
                course.set(cid, oldData);

                res.status(200).json({ message: "successfully Updated" })
                console.log(course);

            } else {
                console.log('id is not found!');
                return res.status(404).json({ message: "Course not found" });
            }
        }


    } catch (error) {
        console.log(error)
    }
})

//patch using update

adminRoute.patch('/update/:id', authenticate, (req, res) => {
    try {
        if (req.UserName) {
            const cid = req.params.id;
            const body = req.body
            const { cname, ctype, cdescription, cprice } = body;
            console.log(cname, ctype, cdescription, cprice);

            if (cid) {
                const oldData = course.get(cid)
                console.log(oldData);

                oldData.cname = cname || oldData.cname;
                oldData.ctype = ctype || oldData.ctype;
                oldData.cdescription = cdescription || oldData.cdescription;
                oldData.cprice = cprice || oldData.cprice;

                console.log(oldData);
                course.set(cid, oldData);

                res.status(200).json({ message: "successfully Updated" })
                console.log(course);

            } else {
                console.log('id is not found!');
                return res.status(404).json({ message: "Course not found" });
            }
        }


    } catch (error) {
        console.log(error)
    }
})





///get method using params

adminRoute.get('/search/:search', (req, res) => {

    try {

        const body = req.params.search;
        const search = body;

        if (search) {
            const result = [];
            for (const [id, item] of course) {
                if (id.includes(search) || item.cname.includes(search) || item.ctype.includes(search)) {
                    result.push(id, item.cname, item.ctype, item.cdescription, item.cprice);
                    console.log(result);
                    res.status(200).json({ message: "data availabe :", result })
                    break;
                }
            }

        } else {
            console.log('dont find any earch element')
        }
    } catch (err) {
        console.log(err);

    }
})


///get method using query

adminRoute.get('/search', (req, res) => {
    try {
        const body = req.query.element;
        const search = body;
        if (search) {
            const result = [];
            for (const [id, item] of course) {
                if (id.includes(search) || item.cname.includes(search) || item.ctype.includes(search)) {
                    result.push(id, item.cname, item.ctype, item.cdescription, item.cprice);
                    console.log(result);
                    res.status(200).json({ message: "data availabe :", result })
                    break;
                }
            }

        } else {
            console.log('dont find any earch element')
        }
    } catch (err) {
        console.log(err);

    }
})


//delete


adminRoute.delete('/delete/:id', authenticate, (req, res) => {
    try {

        const cid = req.params.id

        if (req.UserRole === 'admin') {
            if (course.has(cid)) {
                course.delete(cid);
                res.status(200).json({ message: "course deleted" })
                console.log(course)
            } else {
                console.log('This id is not existed!');

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
        console.log(course.size);

        if (course.size != 0) {

            res.send(Array.from(course.entries()))
        }
        else {
            res.status(404).json({ message: 'Not Found' });
        }
    }
    catch {
        res.status(404).json({ message: "Internal error" })
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