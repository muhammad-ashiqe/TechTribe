import React from 'react'

const Navbar = () => {
  return (
    <div>
      <div className="left-conatiner">
        <div className="logo-container">
          <img src="https://pngimg.com/d/twitter_PNG3.png" alt="" />
        </div>
        <div className="input-container">
          <input type="text" />
        </div>
      </div>
      <div className="right-conatiner">
        <div className="home-container">
          <p>Home</p>
        </div>
      </div>
    </div>
  )
}

export default Navbar
