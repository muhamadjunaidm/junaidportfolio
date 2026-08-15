import json
import os
import re
import time
import urllib.parse
from http.server import HTTPServer, SimpleHTTPRequestHandler

PORT = 8080
DATA_FILE = os.path.join(os.path.dirname(__file__), "works.json")

INITIAL_WORKS = [
    {
        "id": "work-alabaraha",
        "title": "Alabaraha Real Estate Commercial",
        "category": "Commercial",
        "videoUrl": "/uploads/ALABARAHA_REALESTATE.mp4",
        "thumbUrl": "",
        "year": "2026",
        "tools": "Premiere Pro, After Effects, DaVinci Resolve",
        "desc": "High-impact commercial promo and real estate showcase edit featuring dynamic cuts, sleek typography, and color grading."
    },
    {
        "id": "work-lokha",
        "title": "Lokha Project",
        "category": "Videography",
        "videoUrl": "/uploads/lokha.mp4",
        "thumbUrl": "",
        "year": "2026",
        "tools": "Sony FX3, Premiere Pro, Color Grading",
        "desc": "Atmospheric cinematic video edit showcasing immersive visual storytelling, rhythmic pacing, and high-energy cuts."
    }
]

def load_works():
    if not os.path.exists(DATA_FILE):
        save_works(INITIAL_WORKS)
        return INITIAL_WORKS
    try:
        with open(DATA_FILE, "r", encoding="utf-8") as f:
            return json.load(f)
    except Exception:
        return INITIAL_WORKS

def save_works(data):
    with open(DATA_FILE, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=2)

class APIHandler(SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        super().end_headers()

    def do_OPTIONS(self):
        self.send_response(200)
        self.end_headers()

    def do_GET(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == "/api/works":
            works = load_works()
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps(works).encode("utf-8"))
        else:
            super().do_GET()

    def do_POST(self):
        parsed = urllib.parse.urlparse(self.path)
        if parsed.path == "/api/upload":
            try:
                filename = self.headers.get("X-Filename", f"video_{int(time.time() * 1000)}.mp4")
                filename = re.sub(r'[^\w\.\-]', '_', filename)
                uploads_dir = os.path.join(os.path.dirname(__file__), "uploads")
                os.makedirs(uploads_dir, exist_ok=True)
                filepath = os.path.join(uploads_dir, filename)
                
                content_length = int(self.headers.get("Content-Length", 0))
                file_data = self.rfile.read(content_length)
                with open(filepath, "wb") as f:
                    f.write(file_data)
                
                rel_url = f"/uploads/{filename}"
                self.send_response(200)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps({"success": True, "url": rel_url, "filename": filename}).encode("utf-8"))
            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode("utf-8"))
        elif parsed.path == "/api/works":
            content_length = int(self.headers.get("Content-Length", 0))
            body = self.rfile.read(content_length)
            try:
                payload = json.loads(body.decode("utf-8"))
                payload["id"] = f"work-{int(time.time() * 1000)}"
                works = load_works()
                works.insert(0, payload)
                save_works(works)
                
                self.send_response(201)
                self.send_header("Content-Type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps(payload).encode("utf-8"))
            except Exception as e:
                self.send_response(400)
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode("utf-8"))
        else:
            self.send_response(404)
            self.end_headers()

    def do_DELETE(self):
        parsed = urllib.parse.urlparse(self.path)
        match = re.match(r"^/api/works/(.+)$", parsed.path)
        if match:
            work_id = match.group(1)
            works = load_works()
            updated_works = [w for w in works if str(w.get("id")) != str(work_id)]
            save_works(updated_works)
            
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(json.dumps({"success": True, "id": work_id}).encode("utf-8"))
        else:
            self.send_response(404)
            self.end_headers()

if __name__ == "__main__":
    os.chdir(os.path.dirname(__file__))
    print(f"Antigravity Agent server running on http://127.0.0.1:{PORT}")
    httpd = HTTPServer(("127.0.0.1", PORT), APIHandler)
    httpd.serve_forever()
