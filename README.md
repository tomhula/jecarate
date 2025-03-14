# Jecarate - Canteen Food Rating Application

JeCarate is a web application designed for rating canteen meals. It allows users to provide feedback on various aspects of their dining experience, including portion size, taste, temperature, presentation, and value for money.

## Project Overview

The application enables users to:
- View the day's menu from the canteen
- Rate soups and main meals separately
- Evaluate multiple aspects of each meal
- Provide feedback on desserts when applicable
- Track their rating history

The interface is primarily in Czech, targeting Czech educational or workplace canteens.

## Technologies Used

### Frontend
- [Next.js](https://nextjs.org/) - React framework for server-rendered applications
- [React](https://reactjs.org/) - JavaScript library for building user interfaces
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript
- [TailwindCSS](https://tailwindcss.com/) - Utility-first CSS framework

### Backend
- [Next.js API Routes](https://nextjs.org/docs/api-routes/introduction) - Server-side API endpoints
- [Prisma](https://www.prisma.io/) - ORM for database access
- [MySQL](https://www.mysql.com/) - Relational database

### Authentication
- [NextAuth.js](https://next-auth.js.org/) - Authentication for Next.js
- [JWT](https://jwt.io/) - JSON Web Tokens for secure authentication

### Deployment
- [Docker](https://www.docker.com/) - Containerization
- [Docker Compose](https://docs.docker.com/compose/) - Multi-container Docker applications

## Installation

### Prerequisites
- [Docker](https://docs.docker.com/get-docker/)
- [Docker Compose](https://docs.docker.com/compose/install/)

### Setup and Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd jecarate
   ```

2. Start the application using Docker Compose:
   ```bash
   docker compose up -d
   ```

   This command will:
   - Build the application container
   - Start a MySQL database container
   - Set up the necessary environment variables
   - Expose the application on port 3002

3. Access the application:
   Open your browser and navigate to `http://localhost:3002`

### Environment Variables

The application uses the following environment variables, which are already configured in the Docker Compose setup:

- `DB_HOST`: MySQL database host
- `DB_NAME`: Database name
- `DB_USER`: Database user
- `DB_PASSWORD`: Database password
- `DB_PORT`: Database port

## Usage

1. Register or log in to your account
2. View the day's menu
3. Select a meal to rate
4. Fill out the rating form with your feedback
5. Submit your rating
6. View your rating history in the dashboard

## Development

To run the application in development mode:

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. The application will be available at `http://localhost:3000`
