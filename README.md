# Social Network Demo Project (Movify)

**Authors:** Junyao HAN, Qiuzi WU, Runyuan FENG, Jiaming PEI

## Description

A social networking front-end application built with React and Node.js, featuring user authentication, friend connections, and dynamic movie content provided by TMDB API.

## Key Features
- Register and authenticate accounts
- Connect with friends through follow/unfollow functionality
- Post reviews, like, and rate on movie-related content
- Browse and interact with content from other users
- Manage user profiles and settings

## Project Structure

```
Social-Network-Demo-Project/
├── public/                    # Static assets
│   ├── avatar/               # User avatar images
│   ├── Movify_logo/          # Application logos
│   └── TMDB_logo/            # Third-party logos
├── src/
│   ├── MovieNetwork/         # Main application components
│   │   ├── Account/          # User authentication & profile
│   │   ├── Admin/            # Administrative features
│   │   ├── Home/             # Home page components
│   │   ├── MovieDetails/     # Movie detail pages
│   │   ├── Search/           # Search functionality
│   │   └── store.ts          # Redux store configuration
│   ├── App.tsx               # Main application component
│   ├── main.tsx              # Application entry point
│   └── index.css             # Global styles
├── package.json              # Dependencies
├── vite.config.ts            # Vite configuration
└── tsconfig.json             # TypeScript configuration
```

## Setup Guide

### 1. Clone the repository
   ```bash
   git clone https://github.com/NEU-CS5610-Final-Project/Social-Network-Demo-Project.git
   cd Social-Network-Demo-Project
   ```

### 2. Install dependencies
   ```bash
   npm install
   ```

### 3. Start development server
   ```bash
   npm run dev
   ```

### 4. Setup backend
   This project requires a backend API to function.
   Follow the instructions in the [backend README](https://github.com/NEU-CS5610-Final-Project/Social-Network-Demo-Remote-Server/blob/main/README.md) to set up the backend server.

### 5. Configure environment variables
   Use `.env.development` file in the root of the project to set the necessary environment variables for development. You should create another `.env` file for production settings.

## Live Demo

Check out the live demo at: [Live Demo](https://movify-app.netlify.app/)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
