import React, { useState } from 'react'
import NewsList from './components/NewsList';
import Chat from './components/Chat';

const Home = () => {
  return (
    <main>
      <NewsList/>
      <Chat />
     
    </main>
  )
}

export default Home;