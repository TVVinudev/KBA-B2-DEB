import React from 'react';

const Demo = () => {

    const name = 'john'
    const x = 10
    const y = 4
    const names = ['Bread', 'Apple', 'Milk', 'Rice']
    const loggedIn = false
  
    return (
    <> 
    {/* //fragment */}
        <div className='text-5xl text-center underline'>APP</div>
        <p className='text-center mt-5'>hello {name} </p>
        <p>{x} + {y} = {x + y}</p>
        <ul>
          {
            names.map((name, index) => (
              <li key={index}>{name}</li>
            ))
          }
        </ul>
  
        {loggedIn ? <h1>Hello Member</h1> : <h1>hello guest</h1>}  
  
      </>
    )
  }
  
  export default Demo