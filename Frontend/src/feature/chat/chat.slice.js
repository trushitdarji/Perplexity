import { createSlice, current } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name:"chat",
    initialState:{
        chats:{},
        isLoading:false,
        currentChatId:null,
        error:null
    },
    reducers:{
        setChats:(state,action)=>{
            state.chats = action.payload
        },
        setLoading:(state,action)=>{
            state.isLoading = action.payload 
        },
        setCrrentChatId:(state,action)=>{
            state.currentChatId = action.payload
        },
        setError:(state,action)=>{
            state.error = action.payload
        }
    }
})

export const {setChats,setCrrentChatId,setError,setLoading} = chatSlice.action
export default chatSlice.reducer