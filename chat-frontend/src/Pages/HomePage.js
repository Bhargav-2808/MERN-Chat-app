import React, { useState } from "react";
import { Box, Container, Tab} from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import Login from '../Components/Auth/Login';
import SignUp from '../Components/Auth/SignUp';


const HomePage = () => {
  const [value, setValue] = useState("1");

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <>
      <Container maxWidth="md">
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            padding: "3",
            background: "white",
            width: "100%",
            margin: "40px 0 15px 0",
            borderRadius: "lg",
            borderWidth: "1px",
          }}
        >
          <h2> Talk A Tive</h2>
        </Box>
        <Box sx={{ width: "100%", background:"white" ,borderRadius:"lg",borderWidth:"1px" }}>
        <TabContext value={value}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <TabList onChange={handleChange} aria-label="lab API tabs example" centered>
            <Tab label="Login" value="1" style={{textDecoration:"none"}} />
            <Tab label="Sign Up" value="2" style={{textDecoration:"none"}} />
          </TabList>
        </Box>
        <TabPanel value="1"><Login/> </TabPanel>
        <TabPanel value="2"><SignUp/></TabPanel>
      </TabContext>
        </Box>
      </Container>
    </>
  );
};

export default HomePage;
