import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import { API } from '../config/API/api.config';
import { getHttpOptions } from '../utils/AuthHelpers';

const ChatList = ({ user, dataList, chatUser, setChatUser }) => {

    const [searchInput, setSearchInput] = useState('')
    const [dataListState, setDataListState] = useState(dataList)

    const defaultAvatar = 'data:image/png;base64,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';

    const openChat = async (chatUserId) => {
        try {
            const { data: { data } } = await axios.post(`${API.endpoint}/room/one-to-one`, {
                id1: user?.id,
                id2: chatUserId
            }, getHttpOptions());
            setChatUser({
                id: chatUserId,
                roomId: data,
                prs: 1
            })
        } catch (error) {
            console.log(error);
        }
    }

    const filterChatList = ({target: {value}}) => {
        setSearchInput(value)
        setDataListState(dataList.filter(data => (data.first_name + data.last_name).toLowerCase().includes(value.toLowerCase())))
    }

    useEffect(() => {
        setDataListState(dataList)
    }, [dataList])
    

    return (
        <div style={{width: '30%'}} className='bg-white border-end border-1'>
            <div className='bg-white d-flex align-items-center border border-1 px-3 rounded-pill m-4'>
                <AiOutlineSearch className='fs-4' />
                <input 
                    className='w-100 rounded-pill px-2 py-2' 
                    value={searchInput}
                    onChange={filterChatList}
                    placeholder='Search' />
            </div>
            <div className='d-flex flex-column align-items-center'>
                {
                    dataListState.map((data, index) => (
                        <>
                            <div 
                                onClick={() => openChat(data.id)} 
                                style={{cursor: 'pointer'}} 
                                key={index}
                                className={`${
                                    chatUser?.id == data.id
                                    ? 'bg-dark bg-opacity-10'
                                    : ''
                                } chat-list-item w-100 d-flex py-3 align-items-center px-4`}
                            >
                                <img style={{ height: '40px', width: '40px' }} className="rounded-circle me-4 border-s" src={data?.avatar ?? defaultAvatar} alt="" />
                                <div className='w-100'>
                                    <div className='d-flex justify-content-between w-100'>
                                        <div className=''>{data.first_name} {data.last_name}</div>
                                        <div className='opacity-75'>1:10 PM</div>
                                    </div>
                                    <div className='opacity-50'>{data.message ?? "new friend"}</div>
                                </div>
                            </div>
                            <div style={{width: '85%'}} className='border-bottom border-1'></div>
                        </>
                    ))
                }
            </div>
        </div>
    )
}

export default ChatList