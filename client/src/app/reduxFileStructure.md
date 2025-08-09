redux/
├── app/
│   └── store.js           # The main Redux store configuration
│
├── features/
│   ├── videos/
│   │   └── videosSlice.js # All Redux logic for the "videos" feature
│   │
│   ├── user/
│   │   └── userSlice.js   # All Redux logic for the "user" feature (auth, profile)
│   │
│   ├── comments/
│   │   └── commentsSlice.js # All Redux logic for the "comments" feature
│   │
│   └── ...                 # Other features as the app grows