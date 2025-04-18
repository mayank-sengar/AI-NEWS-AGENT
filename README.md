# AI News Assistant

AI News Assistant is a modern web application that combines AI-powered news summaries with an interactive chat interface. Users can fetch the latest news, get concise summaries, and interact with an AI assistant for further insights or questions.

## Features
- **AI-Powered News Summaries**: Fetches the latest news from RSS feeds and summarizes them into concise bullet points.
- **Interactive Chat**: Chat with an AI assistant to ask questions or summarize articles.
- **User Authentication**: Secure user authentication using Clerk.
- **Real-Time Updates**: Real-time chat updates powered by Supabase.
- **Responsive Design**: Fully responsive UI for desktop and mobile devices.

## Tech Stack
- **Frontend**: Next.js, React, Tailwind CSS
- **Backend**: Supabase, Groq SDK
- **Authentication**: Clerk
- **AI Model**: Llama3-8b-8192 for generating summaries and responses
- **RSS Parsing**: rss-parser

## Getting Started

### Prerequisites
- Node.js (v16 or later)
- npm or yarn package manager
- Supabase account
- Clerk account

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/ai-news-assistant.git
2. Install dependencies::
   ```bash
    cd ai-news-assistant
    npm install

3. Create a .env.local file in the root directory and add the following environment variables:
   ```bash
   NEXT_PUBLIC_GROQ_API_KEY=your-groq-api-key
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
   CLERK_SECRET_KEY=your-clerk-secret-key

4. Start the development server:

   ```bash
     npm run dev
5. Open http://localhost:3000 in your browser to view the application.

Code Overview
Chat Component
The Chat component is the core of the interactive chat functionality. It allows users to send messages, receive AI-generated responses, and view real-time updates.
## Key Features

- **Real-Time Messaging**: Messages are fetched and updated in real-time using Supabase.
- **AI Responses**: User messages are sent to the `/api/chat` endpoint, and AI-generated responses are displayed.
- **Authentication**: Users must sign in using Clerk to access the chat functionality.

## News Summaries

- Open the homepage to view the latest news summaries.
- Click on a news title to read the full article.

## Chat with AI

- Sign in using Clerk authentication.
- Use the chat interface to:
  - Ask questions.
  - Summarize articles by pasting their URLs.
  - Request the latest news.

## License

This project is licensed under the MIT License.

### Contact
For any inquiries or support, please contact:

Email: mayanksengar1008@gmail.com

GitHub: https://github.com/mayank-sengar

