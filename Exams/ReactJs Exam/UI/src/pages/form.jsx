import React, { useState } from 'react'

const FormData = () => {

  const [doctorName, setDoctor] = useState('');
  const [patientName, setPatient] = useState('');
  const [tokenId, setTokenId] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');



  const submitForm = async (e) => {
    e.preventDefault();

    const newData = {
      tokenId,
      patientName,
      doctorName,
      date,
      time
    }
    console.log(newData);

    try {
      const res = await fetch('http://127.0.0.1:5055/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newData),
      });

      console.log(res);


      if (res.ok) {

        alert('Appoiment Booked!')
      } else {
        alert('Something Went wrong')
      }

    } catch (error) {
      console.log('Internal error', error);
    }
  }


    return (
      <div>

        <section className="bg-white mb-20">
          <div className="container m-auto max-w-2xl py-2">
            <div className="bg-blue-100 px-6 py-8 mb-4 shadow-md rounded-md border m-4 md:m-0">

              <form onSubmit={submitForm}>
                <h2 className="text-3xl text-blue-800 text-center font-semibold mb-6">
                  Appoiment
                </h2>

                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">
                    Token ID
                  </label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    className="border rounded w-full py-2 px-3 mb-2"
                    required
                    value={tokenId}
                    onChange={(e) => setTokenId(e.target.value)}

                  />
                </div>

                <div className="mb-4">
                  <label className="block text-gray-700 font-bold mb-2">
                    Patient Name
                  </label>
                  <input
                    type="text"
                    id="courseId"
                    name="courseId"
                    className="border rounded w-full py-2 px-3 mb-2"
                    required
                    value={patientName}
                    onChange={(e) => setPatient(e.target.value)}

                  />
                </div>

                <div className="mb-4">
                  <label
                    htmlFor="type"
                    className="block text-gray-700 font-bold mb-2"
                  >
                    Doctor Name
                  </label>
                  <select
                    id="type"
                    name="type"
                    className="border rounded w-full py-2 px-3"
                    required
                    value={doctorName}
                    onChange={(e) => setDoctor(e.target.value)}

                  >
                    <option value="" disabled>
                      Select Doctor
                    </option>
                    <option value="Dr.Sivan">Dr.Sivan</option>
                    <option value="Dr.Sreenivas">Dr.Sreenivas</option>
                    <option value="Dr.Narayanan">Dr.Narayanan</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label htmlFor="type" className="block text-gray-700 font-bold mb-2">
                    Date
                  </label>

                  <input
                    type="Date"
                    id="date"
                    name="date"
                    className="border rounded w-full py-2 px-3 mb-2"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                  />

                </div>

                <div className="mb-4">
                  <label
                    htmlFor="type"
                    className="block text-gray-700 font-bold mb-2"
                  >
                    Time
                  </label>
                  <select
                    id="time"
                    name="time"
                    className="border rounded w-full py-2 px-3"
                    required
                    value={time}
                    onChange={(e) => setTime(e.target.value)}

                  >
                    <option value="" disabled>
                      Select Time
                    </option>
                    <option value="10:30am">10:30am</option>
                    <option value="11:00am">11:00am</option>
                    <option value="11:30am">11:30am</option>
                    <option value="12:00am">12:00am</option>
                  </select>
                </div>

                <div>
                  <button
                    className="bg-blue-400 hover:bg-gray-400 my-10  text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline"
                    type="submit"
                  >
                    Submit
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

      </div>
    )
  }

  export default FormData