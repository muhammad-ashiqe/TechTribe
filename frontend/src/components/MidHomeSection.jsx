import React from 'react'
import Feed from './Feed'

const MidHomeSection = () => {
  return (
    <div className="w-full h-full overflow-y-auto no-scrollbar">
      <div className="max-w-2xl mx-auto w-full h-full px-1">
        <Feed />
      </div>
    </div>
  )
}
export default MidHomeSection