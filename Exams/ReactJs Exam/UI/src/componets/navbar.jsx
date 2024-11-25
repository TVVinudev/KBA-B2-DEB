import React from 'react'
import {Link} from 'react-router-dom'

const Navbar = () => {

  return (
    <div className='bg-blue-400  text-white grid grid-cols-1 md:grid-cols-2 p-3 shadow-md'>

        <div className='flex justify-center md:justify-end items-center mt-2 md:mt-0 space-x-5 md:space-x-10'>
            <Link to="/" className='ml-20'>Form</Link>
            <Link to="/display" className='ml-20'>Appoiment List</Link>
        </div>
    </div>

  )
}

export default Navbar