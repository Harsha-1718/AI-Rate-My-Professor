'use client'
import { Box, Button, Stack, TextField, Typography } from '@mui/material'
import { useState, useEffect, useRef } from 'react'
import { FaArrowUp } from "react-icons/fa";
// import { auth } from '../firebase/config';
// import { useRouter } from 'next/navigation';



export default function Dashboard() {
  // const { user } = useAuth(); 
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hello! I'm the Rate My Proffesor support assistant. How can I help you today?",
    },
  ])
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  // const router = useRouter();

  // const handleSignOut = async () => {
  //   try {
  //     await signOut(auth);
  //     router.push('/'); 
  //   } catch (error) {
  //     console.error('Error signing out:', error);
  //   }
  // };

  const sendMessage = async () => {
    if (!message.trim()) return;  // Don't send empty messages

    setMessage('')
    setMessages((messages) => [
      ...messages,
      { role: 'user', content: message },
      { role: 'assistant', content: '' },
    ])

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([...messages, { role: 'user', content: message }]),
      })

      if (!response.ok) {
        throw new Error('Network response was not ok')
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const text = decoder.decode(value, { stream: true })
        setMessages((messages) => {
          let lastMessage = messages[messages.length - 1]
          let otherMessages = messages.slice(0, messages.length - 1)
          return [
            ...otherMessages,
            { ...lastMessage, content: lastMessage.content + text },
          ]
        })
      }
    } catch (error) {
      console.error('Error:', error)
      setMessages((messages) => [
        ...messages,
        { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." },
      ])
    }
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      sendMessage()
    }
  }

  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  return (
    <Box
      width="100vw"
      height="85vh"
      display="flex"
      justifyContent="center"
      alignItems="center"
      p={2}
    >
      {/* <Box width="80vw" maxWidth="600px" display="flex" justifyContent="flex-end" mb={2}>
        <Button
          variant="contained"
          // onClick={handleSignOut}
          sx={{
            backgroundColor: 'red',
            color: 'white',
            '&:hover': {
              backgroundColor: 'darkred',
            },
          }}
        >
          Sign Out
        </Button>
      </Box> */}
      <Stack
        direction={'column'}
        width="80vw"
        maxWidth="600px"
        height="80vh"
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
          maxHeight="100%"  
          pr={1} // Add padding-right for a scrollbar
        >
          {messages.map((message, index) => (
            <Box
              key={index}
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
            {/* {isLoading ? 'Sending...' : 'Send'} */}
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}
