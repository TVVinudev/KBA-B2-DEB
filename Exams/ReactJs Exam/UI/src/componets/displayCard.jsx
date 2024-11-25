import React from 'react'

const DispayCard = ({ data }) => {
    return (
        <div className="border p-4 my-2">
            <p>Appointment Date: {data.date}</p>
            <p>Patient Name : {data.patientName}</p>
            <p>Time: {data.time}</p>
            <p>Token Id : {data.tokenId}</p>
        </div>
    )
}

export default DispayCard