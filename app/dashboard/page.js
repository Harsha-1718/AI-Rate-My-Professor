'use client';
import { Box, Stack, TextField, Button, Grid } from '@mui/material';
import { useState, useEffect, useRef } from 'react';
import { FaArrowUp } from "react-icons/fa";
import ProfessorList from '../Professors/page';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useAuth } from '../context/authContext';
// import Navbar from '../navbar';

export default function Dashboard() {
  const initialAssistantMessage = {
    role: 'assistant',
    content: "Hi there! I'm your RateGenius support assistant. How can I assist you today?",
  };

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [professorData, setProfessorData] = useState([]);
 
  const { user } = useAuth();
  const router = useRouter();

  // Load data from localStorage specific to the user
  useEffect(() => {
    if (typeof window !== 'undefined' && user) {
      const savedMessages = localStorage.getItem(`messages_${user.uid}`);
      const loadedMessages = savedMessages ? JSON.parse(savedMessages) : [];

      if (loadedMessages.length === 0) {
        // If no messages were loaded, set the initial assistant message
        setMessages([initialAssistantMessage]);
      } else {
        // If messages were loaded, make sure the initial assistant message is the first one
        if (loadedMessages[0].content !== initialAssistantMessage.content) {
          loadedMessages.unshift(initialAssistantMessage);
        }
        setMessages(loadedMessages);
      }

      const savedProfessorData = localStorage.getItem(`professorData_${user.uid}`);
      if (savedProfessorData) {
        setProfessorData(JSON.parse(savedProfessorData));
      }
    }
  }, [user]);

  // Save data to localStorage whenever messages or professorData changes
  useEffect(() => {
    if (typeof window !== 'undefined' && user) {
      localStorage.setItem(`messages_${user.uid}`, JSON.stringify(messages));
      localStorage.setItem(`professorData_${user.uid}`, JSON.stringify(professorData));
    }
  }, [messages, professorData, user]);

  // Load data from localStorage specific to the user
  useEffect(() => {
    if (typeof window !== 'undefined' && user) {
      const savedMessages = localStorage.getItem(`messages_${user.uid}`);
      const loadedMessages = savedMessages ? JSON.parse(savedMessages) : [];

      if (loadedMessages.length === 0) {
        // If no messages were loaded, set the initial assistant message
        setMessages([initialAssistantMessage]);
      } else {
        // If messages were loaded, make sure the initial assistant message is the first one
        if (loadedMessages[0].content !== initialAssistantMessage.content) {
          loadedMessages.unshift(initialAssistantMessage);
        }
        setMessages(loadedMessages);
      }

      const savedProfessorData = localStorage.getItem(`professorData_${user.uid}`);
      if (savedProfessorData) {
        setProfessorData(JSON.parse(savedProfessorData));
      }
    }
  }, [user]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      event.preventDefault();
      router.push('/'); // Redirect to landing page
      event.returnValue = ''; // For browsers that require a returnValue
    };

    window.addEventListener('popstate', handleBeforeUnload);

    return () => {
      window.removeEventListener('popstate', handleBeforeUnload);
    };
  }, [router]);

  // Save data to localStorage whenever messages or professorData changes
  useEffect(() => {
    if (typeof window !== 'undefined' && user) {
      localStorage.setItem(`messages_${user.uid}`, JSON.stringify(messages));
      localStorage.setItem(`professorData_${user.uid}`, JSON.stringify(professorData));
    }
  }, [messages, professorData, user]);

  // Redirect to landing page if user is not authenticated
  useEffect(() => {
    if (user === undefined || user === null) {
      router.push('/'); // Redirect to landing page if user is not authenticated
    }
  
  }, [user, router]);

  function mapScrapedToProcessed(scrapedData) {
    return {
      professor: {
        name: scrapedData.professorInfo.name || "N/A",
        university: scrapedData.professorInfo.university || "N/A",
        rating: scrapedData.professorInfo.rating || "N/A",
        department: scrapedData.professorInfo.department || "N/A",
        reviews: scrapedData.professorInfo.reviews || []
      },
      score: scrapedData.professorInfo.score || 0.0 // Assuming a score field is part of the processed data
    };
  }

  // Function to validate if the input string is a URL
  function isValidURL(string) {
    const regex = /^(https?:\/\/)?([a-zA-Z0-9-_]+(\.[a-zA-Z0-9-_]+)+)([\/?].*)?$/;
    return regex.test(string);
  }

  const sendMessage = async () => {
    if (!message.trim()) return;

    setIsLoading(true);

    // Check if the message contains a Rate My Professors URL
    const rateMyProfessorsURLPattern = /https?:\/\/www\.ratemyprofessors\.com\/professor\/\d+/g;
    const matchedURLs = message.match(rateMyProfessorsURLPattern);

    if (matchedURLs && matchedURLs.length > 0) {
      // If the message contains a Rate My Professors URL, extract and process the URL
      const url = matchedURLs[0];
      console.log("The input contains a valid Rate My Professors URL:", url);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'user', content: url },
        { role: 'assistant', content: 'Processing the link and fetching details...' },
      ]);
      await handleScrapeAndProcess(url); // Call the scrape function with the extracted URL
    } else {
      console.log("The input does not contain a valid Rate My Professors URL");

      // Update chat component with user message
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'user', content: message },
        { role: 'assistant', content: '' }, // Placeholder for the assistant's response
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
          setProfessorData(pineconeData);
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

        let assistantResponse = ''; // Collect the response in this variable

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const text = decoder.decode(value, { stream: true });
          assistantResponse += text;
          setMessages((prevMessages) => {
            let lastMessage = prevMessages[prevMessages.length - 1];
            let otherMessages = prevMessages.slice(0, prevMessages.length - 1);
            return [
              ...otherMessages,
              { ...lastMessage, content: assistantResponse }, // Update with accumulated response
            ];
          });
        }
      } catch (error) {
        console.error('Error:', error);
        setMessages((prevMessages) => [
          ...prevMessages,
          { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." },
        ]);
      }
    }

    setMessage(''); // Clear the input field
    setIsLoading(false);
  };

  const handleScrapeAndProcess = async (url) => {
    try {
      // Step 1: Scrape the professor data
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
      const processedData = mapScrapedToProcessed(scrapeData);

      // Set the professorData state
      setProfessorData([processedData]);
      console.log('Processed Data:', processedData);

      // Step 2: Upsert the scraped data into Pinecone
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

      // Step 3: Generate a summary for the scraped professor data and stream it
      const summaryResponse = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          ...messages,
          { role: 'system', content: `Generate a summary for the following professor data: ${JSON.stringify(scrapeData)}` },
        ]),
      });

      if (!summaryResponse.ok) {
        throw new Error('Failed to generate summary');
      }

      const reader = summaryResponse.body.getReader();
      const decoder = new TextDecoder();

      let summaryContent = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        summaryContent += decoder.decode(value, { stream: true });

        // Stream the summary content as it's being generated
        setMessages((prevMessages) => {
          const lastMessage = prevMessages[prevMessages.length - 1];
          const otherMessages = prevMessages.slice(0, prevMessages.length - 1);
          return [
            ...otherMessages,
            {
              ...lastMessage,
              content: `Here's what I found for the link: ${url}\n\n${summaryContent}`,
            },
          ];
        });
      }

    } catch (error) {
      console.error('Error during scraping and processing:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'assistant', content: "An error occurred while processing the URL. Please try again." },
      ]);
    } finally {
      setIsLoading(false);
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

  // Redirect or show a loading state if user is not authenticated
  if (user === undefined || user === null) return null;

  return (
    <Box
      width="100vw"
      height="85vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      p={2}
      
    >
      <Grid container sx={{ height: '100%' }} spacing={2}> {/* Added spacing between grid items */}
        {/* Adjusted grid item xs and md values */}
        <Grid item xs={12} md={6} sx={{ pr: 1 }}>
          <motion.div
            initial="hidden"
            animate="visible"
            variants={chatVariants}
            style={{ height: '100%' }}
          >
            <Stack
              direction={'column'}
              height="88%"
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
                        {message.role === 'user' && isValidURL(message.content) ? (
                          <a href={message.content} target="_blank" rel="noopener noreferrer" style={{ color: 'blue', textDecoration: 'underline' }}>
                            {message.content}
                          </a>
                        ) : (
                          message.content
                        )}
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

        <Grid item xs={12} md={6} sx={{ pl: 1 }}> {/* Set md to 6 to make it half screen */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={listVariants}
          >
            <ProfessorList professordata={professorData} />
          </motion.div>
        </Grid>
      </Grid>
    </Box>
  );
}
