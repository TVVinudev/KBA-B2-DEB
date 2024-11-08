import React from 'react';
import Card from './Card';
import Demo from './Demo';

const App = () => {

  return (
    <>
      <Demo />


      <div className='flex space-x-3 pl-4' >
        <Card customClasses={'bg-green-400 my-3'} />
        <Card customClasses='bg-yellow-300 my-3' />
        <Card customClasses='bg-red-200 my-3' />

      </div>


    </>
  )
}

export default App