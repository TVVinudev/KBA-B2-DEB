import mongoose, { Schema } from 'mongoose';


const userdetails = new Schema({
    firstName: { type: String },
    lastName: { type: String },
    userName: { type: String, unique: true },
    password: { type: String },
    role: {
        type: String,
        enum: ['admin', 'user'],
        default: 'user'
    }
});

const bookDetails = new Schema({
    bookId: { type: Number, unique: true },
    bookName: { type: String },
    author: { type: String },
    description: { type: String },
    image: { type: String }
});



const UserData = mongoose.model('UserDetails', userdetails);
const BookData = mongoose.model('BookDetails', bookDetails);

mongoose.connect('mongodb://localhost:27017/Library');


export { UserData, BookData };