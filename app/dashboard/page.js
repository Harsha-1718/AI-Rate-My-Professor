'use client';
import { Box, Stack, TextField, Button, Grid, Divider } from '@mui/material';
import { useState, useEffect, useRef } from 'react';
import { FaArrowUp } from "react-icons/fa";
import ProfessorList from '../Professors/page';
import { motion } from 'framer-motion';

export default function Dashboard() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm the Rate My Professor support assistant. How can I help you today?",
    },
  ]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Function to validate if the input string is a URL
  function isValidURL(string) {
    const regex = /^(https?:\/\/)?([a-zA-Z0-9-_]+(\.[a-zA-Z0-9-_]+)+)([\/?].*)?$/;
    return regex.test(string);
  }

  const sendMessage = async () => {
    if (!message.trim()) return;

    const isURL = isValidURL(message);

    if (isURL) {
      console.log("The input is a valid URL:", message);
      await handleScrapeAndProcess(message); // Call the scrape function if it's a valid URL
    } else {
      console.log("The input is not a URL");
      // Handle the regular text input case
      setMessages((messages) => [
        ...messages,
        { role: 'user', content: message },
        { role: 'assistant', content: '' },
      ]);

      try {
        const pineconeResponse = await fetch('/api/queryPinecone', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ query: message }),
        });

        let pineconeData = null;

        if (pineconeResponse.ok) {
          pineconeData = await pineconeResponse.json();
          console.log('Pinecone Data:', pineconeData);
        }

        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify([
            ...messages,
            { role: 'user', content: message },
            { role: 'assistant', content: pineconeData ? `Relevant Professor Data: ${JSON.stringify(pineconeData)}` : '' },
          ]),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const text = decoder.decode(value, { stream: true });
          setMessages((messages) => {
            let lastMessage = messages[messages.length - 1];
            let otherMessages = messages.slice(0, messages.length - 1);
            return [
              ...otherMessages,
              { ...lastMessage, content: lastMessage.content + text },
            ];
          });
        }
      } catch (error) {
        console.error('Error:', error);
        setMessages((messages) => [
          ...messages,
          { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." },
        ]);
      }
    }

    setMessage(''); // Clear the input field
  };

  const handleScrapeAndProcess = async (url) => {
    try {
      const scrapeResponse = await fetch('/api/scrape', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url }), // Send the URL to the scraping API
      });

      if (!scrapeResponse.ok) {
        throw new Error('Failed to scrape the URL');
      }

      const scrapeData = await scrapeResponse.json();
      console.log('Scraped Data:', scrapeData);

      const processResponse = await fetch('/api/upsert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scrapeData),
      });

      if (!processResponse.ok) {
        throw new Error('Failed to process the scraped data');
      }

      const processData = await processResponse.json();
      console.log('Processed Data:', processData);

    } catch (error) {
      console.error('Error during scraping and processing:', error);
      setMessages((messages) => [
        ...messages,
        { role: 'assistant', content: "An error occurred while processing the URL. Please try again." },
      ]);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const chatVariants = {
    hidden: { opacity: 0, x: -50 },
    visible: { opacity: 1, x: 0, transition: { delay: 0.2, duration: 0.5 } },
  };

  const messageVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4 },
    },
  };

  const listVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { scale: 1, opacity: 1, transition: { duration: 0.6 } },
  };

  const dividerVariants = {
    hidden: { scaleY: 0 },
    visible: {
      scaleY: 1,
      transition: { duration: 0.8, ease: "easeInOut" },
    },
  };

  return (
    <Box
      width="100vw"
      height="85vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      p={2}
    >
      <Grid container sx={{ height: '100%' }}>
        <Grid item xs={12} md={4} sx={{ pr: 2 }}>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={chatVariants}
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
                    variants={messageVariants}
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
                <div ref={messagesEndRef} />
              </Stack>
              <Stack direction={'row'} spacing={2}>
                <TextField
                  label="Message"
                  fullWidth
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={isLoading}
                />
                <Button 
                  variant="contained" 
                  onClick={sendMessage}
                  disabled={isLoading}
                  sx={{
                    backgroundColor: 'black',
                    color: 'white',
                    '&:hover': {
                      backgroundColor: 'green',
                    }, 
                  }}
                >
                 <FaArrowUp/>
                </Button>
              </Stack>
            </Stack>
          </motion.div>
        </Grid>

        <Grid item>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={dividerVariants}
            style={{ originY: 0 }}
          >
            <Divider orientation="vertical" flexItem sx={{ height: '100%', backgroundColor: 'black' }} />
          </motion.div>
        </Grid>

        <Grid item xs={12} md={7.8} sx={{ pl: 2 }}>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={listVariants}
          >
            <ProfessorList />
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
}
