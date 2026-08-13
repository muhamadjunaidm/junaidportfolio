/**
 * videos.js — JUNAIID CMS Data Source
 * ─────────────────────────────────────────────────────────
 * To publish a new video: add an object to the array below.
 * Fields:
 *   id        — unique string key
 *   title     — display name of the project
 *   category  — "Commercial" | "Music Video" | "Documentary" | "Short Film" | "Social"
 *   client    — client or artist name
 *   year      — 4-digit year string
 *   videoUrl  — direct MP4 URL or YouTube/Vimeo embed URL
 *   thumbUrl  — thumbnail image URL (leave "" to auto-render placeholder)
 *   featured  — true/false — shows in hero ticker
 * ─────────────────────────────────────────────────────────
 */
const VIDEOS = [
  {
    id: "v001",
    title: "Open Roads",
    category: "Commercial",
    client: "Mahindra",
    year: "2025",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
    thumbUrl: "",
    featured: true
  },
  {
    id: "v002",
    title: "Still Waters",
    category: "Documentary",
    client: "National Geographic",
    year: "2025",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
    thumbUrl: "",
    featured: false
  },
  {
    id: "v003",
    title: "City After Dark",
    category: "Music Video",
    client: "Independent",
    year: "2024",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
    thumbUrl: "",
    featured: true
  },
  {
    id: "v004",
    title: "One Last Frame",
    category: "Short Film",
    client: "Self-directed",
    year: "2024",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
    thumbUrl: "",
    featured: false
  },
  {
    id: "v005",
    title: "The Thread",
    category: "Commercial",
    client: "Cotton Council",
    year: "2025",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    thumbUrl: "",
    featured: false
  },
  {
    id: "v006",
    title: "Depth of Field",
    category: "Documentary",
    client: "Film Foundation",
    year: "2025",
    videoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutback2012.mp4",
    thumbUrl: "",
    featured: true
  }
];
