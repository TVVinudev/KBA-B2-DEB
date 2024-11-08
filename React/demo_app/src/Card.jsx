import { useState } from "react";

const Card = ({ customClasses }) => {

    const [likes, setLikes] = useState(0);
    const [titlecolor, setTitleColor] = useState('text-black');

    const toggleTitleColor = () => {
        setTitleColor((prevColor) =>
            prevColor === 'text-black' ? 'text-red-600' : 'text-black'
        );
    };

    return (
        <div className={`max-w-sm rounded overflow-hidden shadow-2xl p-6 bg-gray-100 ${customClasses}`}>

            <h2 className={`font-bold text-xl mb-2 ${titlecolor}`}>
                Card Title
            </h2>
            <p className=" text-gray-500 text-base"> this is  example text in the card  </p>

            <button className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-300" onClick={() => setLikes(likes + 1)}>
                Like : {likes}
            </button>

            <button className="mt-4 mx-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-300" onClick={toggleTitleColor}>
                Toggle Title Color
            </button>

        </div>
    
    )

}

export default Card;