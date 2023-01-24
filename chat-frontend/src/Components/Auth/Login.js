import { Box, Button, FormControl, FormLabel, Input } from '@mui/material'
import React, { useState } from 'react'

const Login = () => {
  const [show, setShow] = useState(false);

  const handleClick = () => setShow(!show);
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [loading, setLoading] = useState(false);

  return (
    <>
      <Box sx={{
        display:"flex",
        justifyContent:"center",
        flexDirection:"column"
      }}>
       
      <FormControl id="email" >
        <FormLabel>Email Address</FormLabel>
        <Input
          value={email}
          type="email"
          placeholder="Enter Your Email Address"
          onChange={(e) => setEmail(e.target.value)}
        />
      </FormControl>
      <FormControl id="password">
        <FormLabel>Password</FormLabel>
          <Input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={show ? "text" : "password"}
            placeholder="Enter password"
          />
         
            <Button h="1.75rem" size="sm" onClick={handleClick}>
              {show ? "Hide" : "Show"}
            </Button>

      </FormControl>
      </Box> 
    </>
  )
}

export default Login