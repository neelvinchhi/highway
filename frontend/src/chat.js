import React, { useEffect, useState, useRef } from "react";
import { db } from "./config";
import {
  collection,
  query,
  where,
  getDocs,
  setDoc,
  doc,
  limit,
  serverTimestamp,
  onSnapshot,
  orderBy,
} from "firebase/firestore";

import { Box, Input, Button, VStack, HStack, IconButton, Text, ChakraProvider } from '@chakra-ui/react';
import { FaPaperPlane } from 'react-icons/fa';
import OpenAI from "openai";


const Chat = () => {
  const [room, setRoom] = useState('');
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesRef = collection(db, "messages");
  const name = localStorage.getItem("username");
  const messagesEndRef = useRef(null);
  const openai = new OpenAI({apiKey : process.env.OPENAI_API_KEY , dangerouslyAllowBrowser:true});
  const [result, setResult] = useState('');

  async function main(newMessage) {
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: "Your name is RAJU and are now a convener of an online chatroom that is a support group of people suffering from"+ {room} + ". Reply in an empathetic manner in no more than 20 words to the following message."+ newMessage }],
      stream: false,
    });
  
    try {
      const generatedText = completion['choices'][0]['message']['content'];
      console.log(generatedText);
      const newDoc = doc(messagesRef);
      await setDoc(newDoc, {
      community: room,
      message: generatedText,
      name: "RAJU",
      time: serverTimestamp()});


    } catch (error) {
      console.error('Error:', error);
      console.log(completion)
    }
  }
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const roomParam = urlParams.get("room");
    if (roomParam) {
      setRoom(roomParam);
    }
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      query(
        messagesRef,
        where("community", "==", room),
        orderBy("time", "asc")
      ),
      (snapshot) => {
        const messages = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setMessages(messages);
      },
      (error) => {
        console.error("Error fetching messages:", error);
      }
    );
  
    return () => unsubscribe();
  }, [room]);

  
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!newMessage.trim()) return;

    try {

       const fetchData = async () => {
       const url = 'https://6b44-34-16-144-130.ngrok-free.app/feeling_pred';
       const input_data_for_model = {
      'StringInput': newMessage
       };
        try {
          const response = await fetch(url, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(input_data_for_model)
          });
          const data = await response.text();
          setResult(data);
        } catch (error) {
          console.error('Error:', error);
        }
      };
      var words = newMessage.split(" ")
      if (words.length > 0 && words[0].toUpperCase() === 'RAJU') {
        main(newMessage.trim());
        const newDoc = doc(messagesRef);
        await setDoc(newDoc, {
        community: room,
        message: newMessage,
        name: name,
        time: serverTimestamp()
        });
        setNewMessage("");
      } else {
        const newDoc = doc(messagesRef);
        await setDoc(newDoc, {
        community: room,
        message: newMessage,
        name: name,
        time: serverTimestamp()
        });
        setNewMessage("");
      }
    } catch (error) {
      console.error("Error adding message:", error);
    }
  };

 return (
    <Box className="chat-app" h="100vh" bg="gray.800" color="white" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <Box p={4} w="1400px" h='93.5vh' borderWidth="1px" borderRadius="lg">
        <VStack align="stretch" flex="1">
          <Box h='85vh' overflowY="scroll">
            {messages.map((message, index) => (
              <Box key={index} bg="gray.700" p={2} borderRadius="md" margin={1}>
                <Text fontSize="xs" fontWeight="bold">{message.name}</Text>
                <Text fontSize="xl  ">{message.message}</Text>
              </Box>
            ))}
            <div ref={messagesEndRef}/>
          </Box>
          <HStack spacing='0.01'>
            <Input
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
            <IconButton  
              icon={<FaPaperPlane />}
              onClick={handleSubmit}
              colorScheme="blue"
              aria-label="Send"
              ml={2} 
            />
          </HStack>
        </VStack>
      </Box>
    </Box>
  );
};

export default Chat;
