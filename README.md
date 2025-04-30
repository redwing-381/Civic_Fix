# Civic Fix

A modern web application for reporting and tracking civic issues in your community. Civic Fix helps citizens report issues, track their progress, and engage with local authorities to get problems resolved efficiently.


## Features

- **Issue Reporting**: Easily report civic issues with detailed descriptions, locations, and images
- **Status Tracking**: Monitor the progress of reported issues with real-time updates
- **Interactive Map**: Visualize issues on an interactive map interface
- **User Ratings**: Rate and provide feedback on issue resolution
- **Cost Estimation**: View estimated costs for issue resolution
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Real-time Updates**: Get instant notifications about issue status changes

## Tech Stack

- **Frontend**: Next.js, React, TypeScript
- **Styling**: Tailwind CSS, Framer Motion
- **UI Components**: Shadcn UI
- **State Management**: React Context API
- **API**: RESTful API with Next.js API routes
- **Database**: MongoDB
- **Authentication**: NextAuth.js

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn
- MongoDB instance

### Installation

1. Clone the repository:
```bash
git clone https://github.com/redwing-381/Civic_Fix.git
cd Civic_Fix
```

2. Install dependencies:
```bash
bun install
# or
yarn install
```

3. Create a `.env.local` file in the root directory and add the following environment variables:
```env
MONGODB_URI=your_mongodb_connection_string
```

4. Start the development server:
```bash
bun run dev
# or
yarn dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Project Structure

```
civic-fix/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── (auth)/           # Authentication routes
│   └── (main)/           # Main application routes
├── components/            # React components
│   ├── ui/               # UI components
│   ├── issue-card.tsx    # Issue card component
│   └── rating-system.tsx # Rating system component
├── lib/                   # Utility functions and constants
├── public/                # Static assets
├── types/                 # TypeScript type definitions
└── styles/                # Global styles
```

## Key Components

### Issue Card Component
The `IssueCard` component displays information about a civic issue, including:
- Title and description
- Location
- Status (urgent, pending, in-progress, bidding, completed)
- Progress tracking
- Cost estimates
- User ratings

### Rating System
The `RatingSystem` component allows users to:
- Rate issues on a 5-star scale
- Add comments to their ratings
- View average ratings from other users

## API Endpoints

- `GET /api/reports` - Fetch all reports
- `POST /api/reports` - Create a new report
- `GET /api/reports/[id]` - Get a specific report
- `PUT /api/reports/[id]` - Update a report
- `POST /api/ratings` - Submit a rating for a report

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Shadcn UI](https://ui.shadcn.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [MongoDB](https://www.mongodb.com/)
