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
    title: "Alabaraha Real Estate Commercial",
    category: "Commercial",
    client: "Alabaraha Real Estate",
    year: "2026",
    videoUrl: "/uploads/ALABARAHA_REALESTATE.mp4",
    thumbUrl: "",
    featured: true
  },
  {
    id: "v002",
    title: "Lokha Project",
    category: "Videography",
    client: "Lokha",
    year: "2026",
    videoUrl: "/uploads/lokha.mp4",
    thumbUrl: "",
    featured: true
  }
];
