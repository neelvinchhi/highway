import React, { useEffect, useState } from 'react';
import { db } from './config';
import { collection, query, limit, where, getDocs, addDoc } from 'firebase/firestore';
import { Link } from 'react-router-dom';
import { Button, Box, Heading } from '@chakra-ui/react';

const Preview = () => {
  const [communities, setCommunities] = useState([]);
  const username = localStorage.getItem("username");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const q = query(collection(db, 'users'), where('name', '==', username));
        const querySnapshot = await getDocs(q);

        let userCommunities = [];
        querySnapshot.forEach((doc) => {
          const responseData = doc.data().response || '';
          const formattedResponse = responseData.replace('[', '').replace(']', '').replace(/'/g, '');
          const communities = formattedResponse.split(',').map((community) => community.trim());
          userCommunities = [...userCommunities, ...communities];
        });

        setCommunities(userCommunities);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [username]);

  useEffect(() => {
    const addMessagesToCommunities = async () => {
      for (let community of communities) {
        try {
          community = community.toLowerCase();
          const messageQuery = query(collection(db, 'messages'), where('community', '==', community), limit(1));
          const messageSnapshot = await getDocs(messageQuery);

          if (messageSnapshot.empty) {
            await addDoc(collection(db, 'messages'), { 
              name: 'AI Bot',
              message: `Hello there! Welcome to the ${community} community. Please feel free to be open and converse with the people and me.`,
              community: community,
            });
          }
        } catch (error) {
          console.error('Error adding message:', error);
        }
      }
    };

    if (communities.length > 0) {
      addMessagesToCommunities();
    }
  }, [communities]);

  if (communities.length === 0) {
    return <div>You are not in any group at this point of time.</div>;
  }

  return (
    <Box h="100vh" bg="gray.800" color="white" display="flex" flexDirection="column" justifyContent="center" alignItems="center">
      <Heading m='5'>Join your Highway community!</Heading>
      {communities.map((community, index) => (
        <Box key={index}>
          <Link to={`/chat?room=${community}`}>
            <Button m='1'>
              {community} community
            </Button>
          </Link>
        </Box>
      ))}
    </Box>
  );
};

export default Preview;