import React from 'react'
import SubscribeToPremium from './SubscribeToPremium'
import TendingTopics from './TendingTopics'

const RightHomeSection = () => {
  return (
    <div className="right w-[25%] ">
    {/* Subscribe to Premium */}
    <SubscribeToPremium />

    {/* trending topics */}
    <TendingTopics />
  </div>
  )
}

export default RightHomeSection
