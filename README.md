# Promptforge — Text to Image Generator

A full-stack AI app that converts text prompts into images using Stable Diffusion.

## Live Demo

Frontend: https://your-vercel-url
Backend: https://your-render-url

## Tech Stack

Frontend

* React
* Vite
* Tailwind CSS

Backend

* Node.js
* Express

API

* Hugging Face Inference API

HTTP

* Axios

## Project Structure

```
text-to-image/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   ├── .env.example
│   └── gallery.json
│
├── frontend/
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── package.json
│   │
│   └── src/
│       ├── App.jsx
│       ├── main.jsx
│       ├── index.css
│       │
│       ├── pages/
│       │   └── Home.jsx
│       │
│       ├── components/
│       │   ├── Header.jsx
│       │   ├── PromptInput.jsx
│       │   ├── ResultCard.jsx
│       │   ├── LoadingSkeleton.jsx
│       │   ├── Gallery.jsx
│       │   └── ErrorBanner.jsx
│       │
│       ├── hooks/
│       │   └── useGenerator.js
│       │
│       └── services/
│           └── api.js
```


## Setup

### 1. Optional Prompt Enhancement Key

Create a Google AI Studio key only if you want prompt rewriting before image generation.

### 2. Backend

cd backend
copy .env.example .env

Add:
GOOGLE_API_KEY=your_google_key_here

Install and run:
npm install
node server.js

Server runs on:
http://localhost:3001

### 3. Frontend

cd frontend
npm install
npm run dev

App runs on:
http://localhost:5173

## Features

* Generate images from text prompts
* Loading state with skeleton UI
* Image gallery with recent outputs
* Copy prompt and download image
* Keyboard shortcut for fast generation
* Error handling with clear messages
* Responsive layout
* Dark theme UI

## API Endpoints

POST /generate
Input:
{
"prompt": "your text"
}

GET /gallery
Returns saved images

## Environment Variables

backend/.env

GOOGLE_API_KEY=your_google_key_here

## Deployment

Backend

* Deploy on Render
* Add GOOGLE_API_KEY only if you want prompt enhancement

Frontend

* Deploy on Vercel
* Update API URL to deployed backend

## Future Improvements

* Multiple image generation
* User authentication
* Cloud image storage
* Prompt history with search

## Author

Naga Shiva Chaitanya
