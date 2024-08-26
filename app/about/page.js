'use client';
import { Box, Stack, TextField, Button, Grid, Typography } from '@mui/material';
import { useState } from 'react';
import { FaArrowUp } from "react-icons/fa";
import { motion } from 'framer-motion';
import { useAuth } from '../context/authContext';

export default function About() {
  const [developers, setDevelopers] = useState([]);
  const [message, setMessage] = useState(''); // This state controls the input value
  const [isLoading, setIsLoading] = useState(false);
  const [hasClicked, setHasClicked] = useState(false); 
  const { user } = useAuth();

  const handleFetchDevelopers = async () => {
    if (!hasClicked) {
      setHasClicked(true); 
    }
    setIsLoading(true); 
    try {
      const fetchedDevelopers = await fetchDevelopers();
      setDevelopers(fetchedDevelopers);

      // Add a message to the chat after fetching developers
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'assistant', content: "Here you see the developers." },
      ]);
      
    } catch (error) {
      console.error("Error fetching developers:", error);
    } finally {
      setIsLoading(false); 
    }
  };

  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Want to know who developed RateGenius? Just type 'Developers'.",
    },
  ]);

  const handleMessageSubmit = () => {
    const normalizedMessage = message.trim().toLowerCase();
    const expectedMessage = "developers";
    
    if (normalizedMessage === expectedMessage) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'user', content: message },
        { role: 'assistant', content: "Fetching developers' information..." },
      ]);
      handleFetchDevelopers();
    } else {
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'user', content: message },
        { role: 'assistant', content: "Please type 'Developers' to get more information." },
      ]);
    }
    setMessage(''); // Clear the input field after submission
  };

  return (
    <Box
      width="100vw"
      height="85vh"
      display="flex"
      flexDirection="column"
      p={5}
      overflow="hidden" 
    >
      <Typography
        variant="h5"
        sx={{
          textAlign: 'center',
          color: 'black',
          fontWeight: 'bold',
          textTransform: 'uppercase',
          
        }}
      >
        About Us
      </Typography>
      <Grid container sx={{ height: '100%', width: '100%' }} spacing={2}>
        <Grid item xs={12} md={6} sx={{ pr: 1 }}>
          <motion.div
            initial="hidden"
            animate="visible"
            style={{ height: '100%' }}
          >
            <Stack
              direction={'column'}
              height="100%"
              border="5px solid black"
              borderRadius={5}
              p={2}
              spacing={2}
              bgcolor="white"
              sx={{ overflow: 'hidden' }} // Prevents overflow within Stack
            >
              <Stack
                direction={'column'}
                spacing={2}
                flexGrow={1}
                overflow="auto"
                sx={{
                  maxHeight: '70vh',
                  overflowY: 'auto',
                  '&::-webkit-scrollbar': {
                    width: '6px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#888',
                    borderRadius: '3px',
                  },
                  '&::-webkit-scrollbar-thumb:hover': {
                    backgroundColor: '#555',
                  },
                }}
                pr={1}
              >
                {messages.map((message, index) => (
                  <motion.div
                    key={index}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.1 }}
                  >
                    <Box
                      display="flex"
                      justifyContent={
                        message.role === 'assistant' ? 'flex-start' : 'flex-end'
                      }
                    >
                      <Box
                        bgcolor={
                          message.role === 'assistant'
                            ? 'black'
                            : 'white'
                        }
                        color={
                          message.role === 'assistant'
                            ? 'white'
                            : 'black'
                        }
                        borderRadius={5}
                        border="3px solid black"
                        p={2}
                      >
                        {message.content}
                      </Box>
                    </Box>
                  </motion.div>
                ))}
                <div />
              </Stack>
              <Stack direction={'row'} spacing={2}>
                <TextField
                  label="Type 'Developers'"
                  fullWidth
                  value={message}  // Bind value to message state
                  onChange={(e) => setMessage(e.target.value)}  // Update state on change
                />
                <Button 
                  variant="contained" 
                  onClick={handleMessageSubmit}  // Handle submission
                  disabled={isLoading}
                  sx={{
                    backgroundColor: 'black',
                    color: 'white',
                    cursor: hasClicked ? 'not-allowed' : 'pointer', // Change cursor style based on click state
                    '&:hover': {
                      backgroundColor: 'green',
                    },
                  }}
                >
                  <FaArrowUp />
                </Button>
              </Stack>
            </Stack>
          </motion.div>
        </Grid>

        <Grid item xs={12} md={6} sx={{ pl: 1 }}>
          <motion.div
            initial="hidden"
            animate="visible"
          >
            <Grid container spacing={2} sx={{ mt: 2 }}>
              {developers.map((dev, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Box
                    display="flex"
                    flexDirection="column"
                    alignItems="center"
                    p={2}
                    border="3px solid black"
                    borderRadius={5}
                    bgcolor="black"
                    color={"white"}
                  >
                    <img
                      src={dev.image}
                      alt={dev.name}
                      style={{ borderRadius: '50%', width: '80px', height: '80px' }}
                    />
                    <Box mt={1} textAlign="center">
                      <strong>{dev.name}</strong>
                      <p>{dev.bio}</p>
                    </Box>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
}

async function fetchDevelopers() {
  const developers = [
    {
      username: 'pravallikabollavaram',
      name: 'Pravallika Bollavaram',
      bio: 'Webscraping Expert and Sentiment Analyst',
    },
    {
      username: 'sairamsreejith0',
      name: 'Venkata Sairam Nagilla',
      bio: 'Pinecone Specialist and Rag Model Implementer',
    },
    {
      username: 'harsha-1718',
      name: 'Harshavardhan Yarmareddy',
      bio: 'UI DesignerUser Authentication Specialist',
    },
  ];

  const promises = developers.map(async (dev) => {
    const res = await fetch(`https://api.github.com/users/${dev.username}`);
    const data = await res.json();
    return {
      ...dev,
      image: data.avatar_url,
    };
  });

  return await Promise.all(promises);
}
