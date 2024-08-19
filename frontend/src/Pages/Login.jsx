import React, { useEffect, useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setAuthUser } from '@/slices/authSlice';



const Login = () => {
    const [input,setInput]=useState({
        email:"",
        password:""
    })
    const {user}=useSelector((state)=>state.auth)
    const navigate=useNavigate()
    const dispatch=useDispatch()
    const [loading, setLoading] = useState(false);

    const changeEventHandler=(e)=>{
        setInput({...input,[e.target.name]:e.target.value})
    }

    const loginHandler=async(e)=>{
        e.preventDefault()
        console.log(input)
        setLoading(true)
        try{
            const response = await axios.post('http://localhost:8000/api/v1/user/login', input, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true // Ensure this is set if your backend requires credentials
            });
            console.log("response",response)
           if(response?.data?.success){
            dispatch(setAuthUser(response.data.user))
            toast.success(response.data.message)
            navigate("/")
           }
        }
        catch(err){
            console.log(err.message);
            toast.error(err.response.data.message)
            
        }
        finally{
            setLoading(false)
            setInput({
                email:"",
                password:""
            })
        }
    }
  return (
    <div className='flex items-center w-screen h-screen justify-center'>
        {
            loading?
            <span className="loader"></span>
            :
            <form onSubmit={loginHandler} className='shadow-lg flex flex-col gap-5 p-8'>
                <div className='my-4'>
                    <h1 className='text-center font-bold text-xl'>LOGO</h1>
                    <p className='text-sm text-center'>Login to see photos & videos from your friends</p>
                </div>
                <div>
                    <span className='font-medium'>Email</span>
                    <Input
                        type="email"
                        name="email"
                        value={input.email}
                        onChange={changeEventHandler}
                        className="focus-visible:ring-transparent my-2"
                    />
                </div>
                <div>
                    <span className='font-medium'>Password</span>
                    <Input
                        type="password"
                        name="password"
                        value={input.password}
                        onChange={changeEventHandler}
                        className="focus-visible:ring-transparent my-2"
                    />
                </div>
                {
                    loading ? (
                        <Button>
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                            Please wait
                        </Button>
                    ) : (
                        <Button type='submit'>Login</Button>
                    )
                }
                <span className='text-center'>Don't have an account? <Link to="/signup" className='text-blue-600'>Signup</Link></span>
            </form>
        }
            
        </div>
  );
};

export default Login;
