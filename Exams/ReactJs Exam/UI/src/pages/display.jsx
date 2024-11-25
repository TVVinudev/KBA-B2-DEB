import React, { useState } from "react";
import DispayCard from "../componets/displayCard";

const Display = () => {
    const [search, setSearch] = useState('');
    const [datas, setData] = useState([]);

    const fetchdata = async (e) => {
        e.preventDefault();
        try {
            const resp = await fetch(`http://127.0.0.1:5055/search/${search}`);
            if (resp.ok) {
                const data = await resp.json();
                console.log(data);
                setData(data);
            } else {
                console.error("Failed to fetch data");
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    return (
        <>
            <form onSubmit={fetchdata}>
                <div className="flex justify-center w-[700px] ml-96 mt-10 space-x-3">
                    <label
                        htmlFor="search"
                        className="block text-gray-700 font-bold"
                    >
                        Doctor Name
                    </label>
                    <input
                        type="text"
                        id="search"
                        name="search"
                        className="border rounded w-full py-1 px-4 mb-2"
                        placeholder="Dr.Sivan,Dr.Sreenivas,Dr.Narayanan"
                        required
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <button
                        className="bg-blue-400 hover:bg-gray-400 my-10 text-white font-bold py-2 px-4 rounded-full w-full focus:outline-none focus:shadow-outline"
                        type="submit"
                    >
                        Submit
                    </button>
                </div>
            </form>

            <div className="w-full h-auto mx-10 my-10 py-4">
                {datas.length > 0 ? (
                    datas.map((element, index) => (
                        <DispayCard key={index} data={element} />
                    ))
                ) : (
                    <p>No appointments found.</p>
                )}
            </div>




        </>
    );
};

export default Display;
