import { Router, json } from "express";
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { authenticate } from "../middleware/auth.js";
import { BookData, UserData } from "../models/db.js";
import multer from 'multer';
import fs from 'fs';
import path from 'path';


// Ensure dotenv loads environment variables
dotenv.config();

const adminRouter = Router();
adminRouter.use(json());

// Secret key for JWT
const secretKey = process.env.secretKey;


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = 'uploads/';

        // Check if the directory exists, if not, create it
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true }); // Create the directory recursively
        }

        cb(null, uploadPath); // Ensure the path is set correctly
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname); // Keep original filename or customize it as needed
    }
});

const upload = multer({ storage });


// User signup route
adminRouter.post('/signup', async (req, res) => {
    try {
        const { firstname, lastname, username, password } = req.body;

        const hashedPassword = await bcrypt.hash(password, 10);

        // Determine role based on the first registered user
        let role = await UserData.countDocuments() === 0 ? 'admin' : 'user';

        const existingUser = await UserData.findOne({ userName: username });
        
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        const newUser = new UserData({
            firstName: firstname,
            lastName: lastname,
            userName: username,
            password: hashedPassword,
            role: role
        });

        await newUser.save();
        res.status(201).json({ message: "User registered successfully" });
        
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// User login route
adminRouter.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        const user = await UserData.findOne({ userName: username });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: "Incorrect password" });
        }

        const token = jwt.sign({ UserName: username, UserRole: user.role }, secretKey, { expiresIn: '1h' });
        res.cookie("LibraryToken", token, { httpOnly: true });
        res.status(200).json({ message: "Login successful" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// Add book route (only for admin)
adminRouter.post('/addBook', upload.single('image'), authenticate, async (req, res) => {
    try {
        if (req.UserRole !== 'admin') {
            return res.status(403).json({ message: "Unauthorized user" });
        }

        const { bookId, bookname, author, description } = req.body;
        const file = req.file;

        if (!file) {
            return res.status(400).json({ message: "Image is required" });
        }

        const existingBook = await BookData.findOne({ bookId });

        if (existingBook) {
            return res.status(400).json({ message: "Book already exists" });
        }

        const newBook = new BookData({
            bookId,
            bookName: bookname,
            author,
            description,
            image: file.path
        });

        await newBook.save();
        res.status(201).json({ message: "Book added successfully" });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

adminRouter.get('/search/:id', async (req, res) => {
    try {
        const search = req.params.id;

        // Use MongoDB query with $or to directly search in the database
        const searchResult = await BookData.find({
            $or: [
                { bookName: search },
                { author: search }
            ]
        });

        console.log(searchResult);
        
        // Check if any result is found
        if (searchResult.length > 0) {
                res.send(Array.from(searchResult.entries()))
    
            console.log(searchResult);
        } else {
            console.log('No matching data found');
            res.status(404).json({ message: 'Search element not found' });
        }

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
        console.error(error);
    }
});


//delete

adminRouter.delete('/delete/:id', authenticate, async (req, res) => {
    try {
        const id = req.params.id

        if (req.UserRole === 'admin') {
            const result = await BookData.findOne({ bookId: id });
            if (result) {
                await BookData.deleteOne({ bookId: id });
                res.status(200).json({ message: "Delete Successfully" })
            } else {
                res.json({ message: "no search element Found!" })
            }

        } else {
            res.status(404).json({ message: "not a valid user" })
        }

    } catch (error) {
        res.status(500).json({ message: 'server error' })
        console.error(error);
    }

});

//update

adminRouter.put('/update/:id', authenticate, async (req, res) => {
    try {
        if (req.UserName) {
            const id = req.params.id;
            const body = req.body
            const { bookname, author, description, image } = body;
            console.log(id, bookname, author, description, image);

            const available = await BookData.findOne({ bookId: id });
            if (!available) {
                return res.status(404).json({ message: 'Course not found!' });
            }


            const result = await BookData.updateOne(
                { bookId: id },
                {
                    $set: {
                        bookName: bookname,
                        author: author,
                        description: description,
                        image: image
                    }
                }
            );

            if (result.matchedCount === 0) {
                return res.status(400).json({ message: 'Course could not be updated' });
            } else {
                return res.status(200).json({ message: 'Course updated successfully', result });
            }


        } else {
            res.status(404).json({ message: "not a valid user" })
        }



    } catch (error) {
        res.status(500).json({ message: 'server error' })
        console.error(error);
    }
})

adminRouter.get('/viewBooks', async (req, res) => {
    try {

        const result = await BookData.find()

        if (result) {

            res.send(Array.from(result.entries()))

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

adminRouter.get('/logout', authenticate, (req, res) => {
    try {
        if (req.UserRole) {
            res.clearCookie('LibraryToken');
            res.status(200).json({ message: "Logout successfull" });
        } else {
            res.status(404).json({ message: "No user found!" })
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" })
    }

})


adminRouter.get('/viewUser', authenticate, (req, res) => {
    try {
        const user = req.UserRole;
        console.log(user)
        res.json({ user });
    } catch (error) {
        res.status(500).json({ message: "server error" })
    }
})



export { adminRouter };