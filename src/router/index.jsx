import React, { useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from '../layout'
import Error from '../page/Error'
import Home from '../page/Home'
import DashBoard from '../page/DashBoard'

const Router = () => {
    return (
        <div>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/dashboard" element={<DashBoard />} />
                    <Route path="/error" element={<Error />} />
                    <Route path="*" element={<Navigate to="/error" />} />
                </Routes>
            </Layout>
        </div>
    )
}

export default Router