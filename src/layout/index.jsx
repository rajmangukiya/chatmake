import React, { useEffect, useState } from 'react'
import Footer from './footer/Footer'
import Header from './header/Header'
import { authenticated, getHttpOptions } from '../utils/AuthHelpers'
import axios from 'axios';
import { API } from '../config/API/api.config';
import { useNavigate } from 'react-router-dom';

const Layout = ({ children, ...props }) => {

    const [isLoggedIn, setIsLoggedIn] = useState(false)
    const navigate = useNavigate()
    
    useEffect(async () => {
        const data = await authenticated()
        if(data) {
            setIsLoggedIn(true)
        }
        else {
            navigate('/')
        }
    }, [])

    return (
        <div className='d-flex w-100 vh-100'>
            {isLoggedIn ? <Header /> : <></>}
            <div className='w-100' {...props}>{children}</div>
            {/* <Footer /> */}
        </div>
    )
};

export default Layout;