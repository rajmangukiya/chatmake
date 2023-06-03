import React from 'react'
import { useNavigate } from 'react-router-dom'

const Error = () => {

  const navigate = useNavigate()

  return (
    <div className="vh-100">
      <div className="h-100 d-flex flex-column justify-content-center align-items-center">
        <h1 className="display-1">Opps!! Wrong URL</h1>
        <div onClick={() => navigate('/')} className='btn bg-primary text-white mt-5' >Go to Dashboard</div>
      </div>
    </div>
  )
}

export default Error
