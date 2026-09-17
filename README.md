# DecoupledWP

A headless WordPress application that uses WordPress as a content management system and React.js as the frontend dashboard.

## Overview

DecoupledWP was developed for a content-driven website where the client needed an easier way to manage blog content without relying on a developer for routine updates.

The project separates the content management layer from the frontend application, allowing WordPress to handle content while a React.js dashboard communicates with WordPress through the REST API.

## Features

- Headless WordPress architecture
- React.js content management dashboard
- WordPress REST API integration
- Create, read, edit, and delete blog posts
- Publish blog posts
- View existing posts
- Responsive dashboard interface
- Tailwind CSS styling
- Custom WordPress functionality

## My Role

**Full-Stack Developer**

I designed and developed the application architecture and implemented the frontend dashboard and WordPress integration.

Key responsibilities included:

- Building the React.js dashboard
- Connecting the dashboard to WordPress through the REST API
- Implementing blog post CRUD operations
- Implementing post publishing functionality
- Working with WordPress and PHP
- Working with SQL/database-driven content
- Building the dashboard interface with Tailwind CSS
- Handling communication between the frontend and WordPress backend

## Technologies

- WordPress
- PHP
- React.js
- JavaScript
- Tailwind CSS
- SQL
- WordPress REST API

## Architecture

The application follows a decoupled architecture:

```text
React.js Dashboard
        │
        │ REST API
        ▼
WordPress
        │
        ▼
Database
