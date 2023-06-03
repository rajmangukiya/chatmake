import React, { useEffect } from 'react'
import { Route, Routes } from 'react-router-dom'
import Layout from '../layout'
import Error from '../page/Error'
import Home from '../page/Home'
import DashBoard from '../page/DashBoard'
import Chat from '../page/Chat'

const Router = () => {
    return (
        <div>
            <Layout>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/dashboard" element={<DashBoard />} />
                    <Route path="/chat" element={<Chat />} />
                    <Route path="/error" element={<Error />} />
                </Routes>
            </Layout>
        </div>
    )
}

export default Router