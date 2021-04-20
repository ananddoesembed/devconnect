import axios from 'axios';
import React,{Fragment,useState} from 'react'
import { Link } from 'react-router-dom';

export default function Login(){
    const [formData,setFormData] = useState({
        email:"",
        password:"",
    });
    const {email,password} = formData
    const onSubmit=async (e) =>{
        e.preventDefault();
        console.log(formData)
            const newUser={
                email,
                password
            }
            try {
                const config = {
                    headers:{
                        'Content-Type':'application/json',


                    },
                }
               const body = JSON.stringify(newUser)
                const res = await axios.post('/api/users',body,config)
                console.log(res)
            } catch (error) {
                console.log(error)
            }
    }
    const onChange=(e)=>{
        setFormData({...formData,[ e.target.name ]:e.target.value})
        console.log(formData)
    }
    return (
        <Fragment>
            <h1 className="large text-primary">Sign Up</h1>
      <p className="lead"><i className="fas fa-user"></i> Create Your Account</p>
      <form className="form" onSubmit={(e)=>onSubmit(e)}>
        <div className="form-group">
          
        </div>
        <div className="form-group">
          <input type="email" 
          placeholder="Email Address" 
          name="email"
          value={email}
          onChange={e=>onChange(e)} 
          required/>
          <small className="form-text"
            >This site uses Gravatar so if you want a profile image, use a
            Gravatar email</small
          >
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            name="password"
            value={password}
            minLength="6"
            onChange={e=>onChange(e)} 
            required
          />
        </div>
        <div className="form-group">
          
        </div>
        <input type="submit" className="btn btn-primary" value="Login" />
      </form>
      <p className="my-1">
        Already have an account? <Link to="/register">Sign Up</Link>
      </p>
      </Fragment>
    )
}
