// src/components/NotFound.js
import React from 'react';
import { Box, Heading, Image } from '@chakra-ui/react';
import errorImg from '@/assets/error404.png'
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <Box display="flex" alignItems="center" justifyContent="center" height="100vh" flexDirection="column">
      <Image width="50%" src={errorImg}></Image>
      <Heading>Whoops page not found uh oh...</Heading>
      <Link to='/'><Heading color="teal" size="md">Go back to homepage</Heading></Link>
    </Box>
  );
};

export default NotFound;