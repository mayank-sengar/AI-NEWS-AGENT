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
Install dependencies:
cd ai-news-assistant
npm install

bash
Copy
Edit
cd ai-news-assistant
npm install

Create a .env.local file in the root directory and add the following environment variables:
NEXT_PUBLIC_GROQ_API_KEY=your-groq-api-key
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
CLERK_SECRET_KEY=your-clerk-secret-key

Start the development server:

bash
Copy
Edit
npm run dev
Open http://localhost:3000 in your browser to view the application.

Code Overview
Chat Component
The Chat component is the core of the interactive chat functionality. It allows users to send messages, receive AI-generated responses, and view real-time updates.

Key Features:
Real-Time Messaging: Messages are fetched and updated in real-time using Supabase.

AI Responses: User messages are sent to the /api/chat endpoint, and AI-generated responses are displayed.

Authentication: Users must sign in using Clerk to access the chat functionality.

Deployment
Deploy on Vercel
Push your code to a GitHub repository.

Go to Vercel and import your repository.

Add the environment variables in the Vercel Dashboard under Settings > Environment Variables.

Deploy the application.

Environment Variables

Name	Description
NEXT_PUBLIC_GROQ_API_KEY	API key for Groq SDK
NEXT_PUBLIC_SUPABASE_URL	Supabase project URL
NEXT_PUBLIC_SUPABASE_ANON_KEY	Supabase public API key
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY	Clerk publishable API key
CLERK_SECRET_KEY	Clerk secret API key
Usage
News Summaries
Open the homepage to view the latest news summaries.

Click on a news title to read the full article.

Chat with AI
Sign in using Clerk authentication.

Use the chat interface to:

Ask questions.

Summarize articles by pasting their URLs.

Request the latest news.

Project Structure
vbnet
Copy
Edit
ai-news-assistant/
├── pages/
│   ├── api/
│   ├── chat.tsx
│   └── ...
├── components/
│   └── Chat.tsx
├── lib/
│   └── supabase.ts
└── public/
    └── ...
Contributing
Contributions are welcome! To contribute:

Fork the repository.

Create a new branch:

bash
Copy
Edit
git checkout -b your-branch-name
Make your changes and commit them:

bash
Copy
Edit
git commit -m "Your commit message"
Push to your branch:

bash
Copy
Edit
git push origin your-branch-name
Open a pull request.

License
This project is licensed under the MIT License.

Contact
For any inquiries or support, please contact:

Email: your-email@example.com

GitHub: your-username

css
Copy
Edit
