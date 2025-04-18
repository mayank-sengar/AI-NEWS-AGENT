import React from 'react';
import NewsList from './components/NewsList';
import Chat from './components/Chat';

const Home = () => {
  return (
    <main className="flex flex-col min-h-screen bg-gray-900 text-white">
      {/* News List Section */}
      <section className="flex-1 p-4">
        <NewsList />
      </section>

      {/* Chat Section */}
      <section className="flex-1 p-4">
        <Chat />
      </section>
    </main>
  );
};

export default Home;
