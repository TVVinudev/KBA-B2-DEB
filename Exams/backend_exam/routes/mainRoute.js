import { Router } from "express";
import { Booking } from "../models/db.js";


const routes = Router();


routes.post('/add', async (req, res) => {
    const body = req.body;

    const { tokenId, patientName, doctorName, date, time } = body;
    console.log(tokenId, patientName, doctorName, date, time);

    try {
        const result = await Booking.find({ tokenId: tokenId })

        if (result.length > 0) {
            res.status(404).json({ message: "Token already takend!" })
        } else {


            try {
                const newData = new Booking({
                    tokenId: tokenId,
                    patientName: patientName,
                    doctorName: doctorName,
                    date: date,
                    time: time
                });

                await newData.save();
                res.status(200).json({ message: "Your Token Id is Created!" })


            } catch (error) {
                console.error(error);

            }

        }


    } catch (error) {
        console.error(error);

    }


});


routes.get('/getAll', async (req, res) => {

    try {
        const result = await Booking.find();
        if (result) {
            res.status(200).json(result)
        } else {
            res.status(400).json({ message: "something went wrong!" })
        }

    } catch (error) {
        console.error(error);

    }


})


routes.get('/search/:id', async (req, res) => {

    const id = req.params.id

    const result = await Booking.find({ doctorName: id });
    if (result) {
        res.status(200).json(result)
    } else {
        res.status(400).json({ message: "id is not exist!" })
    }

})

routes.delete('/delete/:id', async (req, res) => {

    const id = req.params.id

    const result = await Booking.deleteOne({ tokenId: id });
    if (result) {
        res.status(200).json({ message: "Delete Successfully!" })
    } else {
        res.status(400).json({ message: "Token is not exist " })
    }

})

routes.patch('/update/:id', async (req, res) => {

    const id = req.params.id
    const body = req.body

    const { patientName, doctorName, data, time } = body

    try {
        const result = await Booking.updateOne(
            { tokenId: id },
            {
                $set: {
                    patientName: patientName,
                    doctorName: doctorName,
                    date: data,
                    time: time,
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

    }




})



export { routes }