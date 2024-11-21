import mongoose from "mongoose";


const booking = new mongoose.Schema({
    tokenId: { type: Number, required: true },
    patientName: { type: String, required: true },
    doctorName: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String }
});

const Booking = mongoose.model('Appoiment', booking);


mongoose.connect('mongodb://localhost:27017/Doctor_Appoiment');


export { Booking } 