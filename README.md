# 🌍 WanderLust - Explore The World

A full-stack travel destination platform built with Node.js, Express, MongoDB, and EJS templating, featuring user authentication, image uploads, and comprehensive destination management.

🔗 **Live Demo**: [https://my-wanderlust-app.onrender.com](https://my-wanderlust-app.onrender.com)

[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/yourusername/wanderlust)

---

## 📋 Table of Contents

- [About](#about)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation](#installation)
- [Environment Variables](#environment-variables)

---

## 🎯 About

WanderLust is a comprehensive travel platform that allows users to discover, share, and review travel destinations worldwide. Built with modern web technologies, it features user authentication, image uploads via Cloudinary, and a responsive design optimized for all devices.

---

## ✨ Features

- 🔐 **User Authentication**: Complete registration/login system with session management
- 🌍 **Destination Management**: Full CRUD operations for travel destinations
- ⭐ **Review System**: Users can add and manage reviews for destinations
- 📸 **Image Upload**: Cloudinary integration for seamless image management
- 🎨 **Responsive Design**: Mobile-first approach with Bootstrap styling
- 🔍 **Search & Filter**: Advanced filtering by location, price, and category
- 🛡️ **Security**: Input validation, authentication middleware, and error handling
- 📱 **Progressive Enhancement**: Works across all devices and browsers

---

## 🛠️ Tech Stack

**Backend Framework:**
- Node.js with Express.js
- EJS templating engine
- Express sessions for authentication

**Database:**
- MongoDB with Mongoose ODM
- MongoDB Atlas for cloud hosting

**Frontend:**
- HTML5, CSS3, JavaScript
- Bootstrap for responsive design
- EJS for server-side rendering

**Cloud Services:**
- Cloudinary for image storage and optimization
- Render for application deployment

**Development Tools:**
- Express async error handling
- Custom middleware for authentication
- Geocoding for location services

---

## 🚀 Installation

1. **Clone the repository:**
   ```
   git clone https://github.com/yourusername/wanderlust.git
   cd wanderlust
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```
   MONGODB_URI=your_mongodb_atlas_connection_string
   CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
   CLOUDINARY_API_KEY=your_cloudinary_api_key
   CLOUDINARY_API_SECRET=your_cloudinary_api_secret
   SESSION_SECRET=your_session_secret
   MAPBOX_TOKEN=your_mapbox_access_token
   PORT=3000
   ```

4. **Initialize the database (optional):**
   ```
   node init/index.js
   ```

5. **Start the application:**
   ```
   npm start
   ```

6. **Visit the application:**
   Open `http://localhost:3000` in your browser

---

## 🔧 Environment Variables

Required environment variables for your `.env` file:

```
# Database Configuration
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/wanderlust

# Cloudinary Configuration (Image Upload)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Session Configuration
SESSION_SECRET=your_super_secret_session_key

# Map Services (if using maps)
MAPBOX_TOKEN=your_mapbox_access_token

# Server Configuration
PORT=3000
NODE_ENV=development
```
---

## 🌟 Key Features Implemented

- **MVC Architecture**: Clean separation of concerns with controllers, models, and views
- **Authentication System**: Complete user registration, login, and session management
- **Authorization**: Route protection and ownership verification
- **Image Upload**: Cloudinary integration with file upload handling
- **Data Validation**: Server-side validation using Joi schemas
- **Error Handling**: Comprehensive error handling with custom error classes
- **Responsive Design**: Mobile-first approach with Bootstrap integration
- **Security**: Input sanitization, authentication middleware, and secure sessions

---

## 🙏 Acknowledgments

- Express.js community for excellent documentation
- MongoDB Atlas for reliable database hosting
- Cloudinary for seamless image management
- Bootstrap for responsive design components
- Render for smooth deployment experience

---

⭐ **Star this repository if you found it helpful!**

*Explore the world with WanderLust - Your gateway to amazing destinations!* 🌍✈️
```
