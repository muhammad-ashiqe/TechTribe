import React from 'react'
import SubscribeToPremium from './SubscribeToPremium'
import SuggestionToFollow from './SuggestionToFollow'

const RightHomeSection = () => {
  return (
    <div className="h-full overflow-y-auto no-scrollbar sticky top-16">
      <div className="space-y-2">
        <SubscribeToPremium />
        <SuggestionToFollow />
      </div>
    </div>
  )
}
export default RightHomeSection