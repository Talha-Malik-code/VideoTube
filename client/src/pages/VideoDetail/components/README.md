# Comment System Components

This directory contains the comment system components for the VideoDetail page.

## Components

### CommentSection.jsx

The main comment section component that includes:

- Comment input field for adding new comments
- Comment list display
- Pagination support
- Mobile-responsive design with collapsible comments

**Props:**

- `videoId` (string): The ID of the video to fetch comments for

**Features:**

- Real-time comment addition
- Authentication check before commenting
- Loading states and error handling
- Responsive design for mobile and desktop

### CommentItem.jsx

Individual comment display component with:

- User avatar and information
- Comment content
- Timestamp (formatted as "time ago")
- Like/dislike functionality (UI ready, backend integration pending)
- Edit/delete options for comment owners
- Reply functionality (UI ready, backend integration pending)

**Props:**

- `comment` (object): Comment data object with owner, content, timestamps, etc.

**Features:**

- Inline editing for comment owners
- Delete confirmation
- Action menu for comment owners
- Like/dislike buttons with counts

## Redux Integration

The comment system uses Redux with the following slice:

### commentSlice.js

- `getVideoComments`: Fetch comments for a video with pagination
- `addComment`: Add a new comment
- `updateComment`: Edit existing comment
- `deleteComment`: Remove comment
- State management for loading, error, and comment data

## Backend API

The comment system integrates with these backend endpoints:

- `GET /api/v1/comment/:videoId` - Fetch video comments
- `POST /api/v1/comment/:videoId` - Add new comment
- `PATCH /api/v1/comment/c/:commentId` - Update comment
- `DELETE /api/v1/comment/c/:commentId` - Delete comment

## Styling

The components use Tailwind CSS classes and follow the design from the HTML template:

- Dark theme (`bg-[#121212]`)
- Purple accent color (`#ae7aff`)
- Responsive design with mobile-first approach
- Smooth transitions and hover effects

## Usage

```jsx
import CommentSection from "./components/CommentSection";

// In VideoDetail component
<CommentSection videoId={videoId} />;
```

## Future Enhancements

- Comment like/dislike backend integration
- Reply functionality
- Comment threading
- Comment moderation tools
- Rich text editing for comments
- Comment search and filtering
