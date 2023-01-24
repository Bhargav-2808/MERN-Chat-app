import { Box, Button, FormControl, FormLabel, Input } from "@mui/material";
import React, { useState } from "react";

const SignUp = () => {
  const [show, setShow] = useState(false);
  const [profile, setProfile] = useState(null);
  const handleClick = () => setShow(!show);
  const formData = new FormData();
  const [loading, setLoading] = useState();

  const intialValue = {
    fullname: "",
    email: "",
    password: "",
    cPassword: "",
  };

  const [data, setData] = useState(intialValue);

  const updateData = (e) => {
    setData({
      ...data,
      [e.target.name]: e.target.value,
    });
  };

  const submitHandler = () => {
    formData.append("profile", profile);
    formData.append("body-data", JSON.stringify(data));
    console.log(formData.get("profile"));
  };

  return (
    <>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <FormControl>
          <FormLabel>Email Address</FormLabel>
          <Input
            type="text"
            placeholder="Enter Your Name"
            onChange={updateData}
            name="fullname"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Email Address</FormLabel>
          <Input
            type="email"
            placeholder="Enter Your Email Address"
            onChange={updateData}
            name="email"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Password</FormLabel>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter password"
            onChange={updateData}
            name="password"
          />

          <Button h="1.75rem" size="sm" onClick={handleClick}>
            {show ? "Hide" : "Show"}
          </Button>
        </FormControl>
        <FormControl>
          <FormLabel>Confirm Password</FormLabel>
          <Input
            type={show ? "text" : "password"}
            placeholder="Enter password"
            onChange={updateData}
            name="cPassword"
          />
        </FormControl>
        <FormControl>
          <FormLabel>Upload your Picture</FormLabel>
          <Input
            type="file"
            p={1.5}
            accept="image/*"
            name="profile"
            onChange={(e) => setProfile(e.target.files[0])}
          />
        </FormControl>
        <Button
          colorScheme="blue"
          width="100%"
          style={{ marginTop: 15 }}
          onClick={submitHandler}
          // isLoading={picLoading}
        >
          Sign Up
        </Button>
      </Box>
    </>
  );
};

export default SignUp;
