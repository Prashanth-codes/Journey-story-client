import React,{useState} from 'react'
import {FaRegEye,FaRegEyeSlash} from 'react-icons/fa6';

const PasswordInput = ({value,onChange,placeholder}) => {

    const [isShowPassword,setIsShowPassword] = useState(false);
    const toggleShowPassword = ()=>{
        setIsShowPassword(!isShowPassword);
    }

  return (
    <div className='flex items-center bg-cyan-600/5 px-5 mb-3'>
      <input 
        value={value}
        onChange={onChange}
        placeholder={placeholder || 'password'}
        type={isShowPassword ? 'text': 'password'}
        className='w-full text-sm bg-transport py-3 mr-3 rounded outline-none'
      />
      {isShowPassword ? (
        <FaRegEye size={20} className='text-primary cursor-pointer'
      onClick={()=>toggleShowPassword()}
      />) : (
        <FaRegEyeSlash 
        size={20}
        className='text-primary cursor-pointer'
        onClick={()=>toggleShowPassword()}
        />
      )
    }
    </div>
  )
}

export default PasswordInput
