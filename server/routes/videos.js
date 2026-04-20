const express = require('express');
const router = express.Router();

// Sample video data with the requested grammar videos
const videos = [
  {
    id: 1,
    title: 'Present Tense Mastery',
    description: 'Master all forms of present tense in English with clear explanations and examples.',
    category: 'grammar',
    difficulty: 'beginner',
    duration: 720, // 12 minutes
    videoUrl: 'https://www.youtube.com/embed/FIcNG3uoqCo',
    thumbnail: 'https://img.youtube.com/vi/FIcNG3uoqCo/maxresdefault.jpg'
  },
  {
    id: 2,
    title: 'Past Tense Complete Guide',
    description: 'Learn all past tense forms including simple past, past continuous, and past perfect.',
    category: 'grammar',
    difficulty: 'intermediate',
    duration: 900, // 15 minutes
    videoUrl: 'https://www.youtube.com/embed/12vvBvr1ouc',
    thumbnail: 'https://img.youtube.com/vi/12vvBvr1ouc/maxresdefault.jpg'
  },
  {
    id: 3,
    title: 'Future Tense Explained',
    description: 'Understand all future tense forms and when to use them correctly in English.',
    category: 'grammar',
    difficulty: 'intermediate',
    duration: 840, // 14 minutes
    videoUrl: 'https://www.youtube.com/embed/qMRy0MvVZUA',
    thumbnail: 'https://img.youtube.com/vi/qMRy0MvVZUA/maxresdefault.jpg'
  },
  {
    id: 4,
    title: 'Business English Vocabulary',
    description: 'Essential vocabulary for professional communication and business meetings.',
    category: 'business',
    difficulty: 'intermediate',
    duration: 600,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg'
  },
  {
    id: 5,
    title: 'English Pronunciation Basics',
    description: 'Learn correct pronunciation of common English sounds and improve your accent.',
    category: 'pronunciation',
    difficulty: 'beginner',
    duration: 480,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg'
  },
  {
    id: 6,
    title: 'Advanced Vocabulary Building',
    description: 'Expand your vocabulary with advanced words and phrases for fluent communication.',
    category: 'vocabulary',
    difficulty: 'advanced',
    duration: 720,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg'
  },
  {
    id: 7,
    title: 'Conversational English Skills',
    description: 'Practice speaking English naturally in everyday conversations.',
    category: 'speaking',
    difficulty: 'intermediate',
    duration: 900,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg'
  },
  {
    id: 8,
    title: 'Grammar Fundamentals',
    description: 'Build a strong foundation with essential English grammar rules.',
    category: 'grammar',
    difficulty: 'beginner',
    duration: 660,
    videoUrl: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    thumbnail: 'https://img.youtube.com/vi/dQw4w9WgXcQ/maxresdefault.jpg'
  }
];

// Get all videos
router.get('/', (req, res) => {
  try {
    res.json(videos);
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get video by ID
router.get('/:id', (req, res) => {
  try {
    const video = videos.find(v => v.id === parseInt(req.params.id));
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }
    res.json(video);
  } catch (error) {
    console.error('Error fetching video:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;