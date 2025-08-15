# Social Network Demo Project

A modern social networking application built with React and Node.js, featuring user authentication, friend connections, and dynamic content sharing.

## Project Overview

This is a full-stack social networking platform that allows users to:
- Register and authenticate accounts
- Connect with friends through follow/unfollow functionality
- Share posts and updates
- Browse and interact with content from other users
- Manage user profiles and settings

## Tech Stack

### Frontend
- **React 19.1.0** 
- **TypeScript 5.8.3** 
- **Vite 7.0.4** 
- **Redux Toolkit 2.8.2** 
- **React Router 7.8.0** 
- **Bootstrap 5.3.7** 
- **React Bootstrap 2.10.10**
- **Axios 1.11.0** 
- **React Icons 5.5.0** 

### Backend
- **Node.js** 
- **Express.js** 
- **MongoDB** 
- **Nodemon** 

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
├── package.json              # Frontend dependencies
├── vite.config.ts            # Vite configuration
└── tsconfig.json             # TypeScript configuration
```

## Installation and Setup

### Frontend Setup

1. **Clone the repository**
   ```bash
   git clone <frontend-repo-url>
   cd Social-Network-Demo-Project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone <backend-repo-url>
   cd Social-Network-Demo-Remote-Server
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   nodemon index.js
   ```

## Development Commands

### Frontend
```bash
npm run dev      
npm run build    
npm run preview  
npm run lint     
```

### Backend
```bash
nodemon index.js  
node index.js    
```

## Deployment

### Frontend Deployment

The frontend can be deployed to various platforms:

1. **Vercel** 
   ```bash
   npm install -g vercel
   vercel
   ```

2. **Netlify**
   - Connect your GitHub repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`

3. **GitHub Pages**
   ```bash
   npm run build
   # Deploy dist folder to GitHub Pages
   ```

### Backend Deployment

1. **Heroku**
   ```bash
   heroku create your-app-name
   git push heroku main
   ```

2. **Railway**
   - Connect your GitHub repository
   - Set start command: `node index.js`

3. **DigitalOcean App Platform**
   - Connect your repository
   - Configure environment variables

## Environment Variables

Create a `.env` file in the backend directory:

```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
PORT=3000
NODE_ENV=development
```

## API Endpoints

The backend provides the following main API endpoints:

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `POST /api/posts` - Create new post
- `GET /api/posts` - Get all posts
- `POST /api/follow/:userId` - Follow a user
- `DELETE /api/follow/:userId` - Unfollow a user

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Authors

**CS5610 Web Development Team**
- **Junyao HAN** - Frontend: Search and Movie Details pages with React and API integration
- **Qiuzi WU** - Frontend: Home, Login, and Profile components
- **Runyuan FENG** - Backend: User system, data models, and core APIs
- **Jiaming PEI** - Backend: External API integration


**Course Information**
- Course: Web Development (CS5610)
- Project: Social Network Demo Application

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- React team for the amazing framework
- Vite team for the fast build tool
- Bootstrap team for the UI components
- MongoDB team for the database solution
