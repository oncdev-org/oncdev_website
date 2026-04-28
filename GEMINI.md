# OnCube Project Documentation (GEMINI.md)

## Project Overview
OnCube is a multi-page web application for a developer community and experimental project group. The site serves as a hub for various tools, visualizations, and information related to the "PolimerS" community.

### Core Technologies
- **Frontend:** Vanilla HTML5, CSS3, JavaScript (ES6+).
- **3D Graphics:** [Three.js](https://threejs.org/) (used in the "City" section).
- **Backend:** PHP (for data persistence in the "City" section).
- **Data Storage:** JSON files (`site/resources/city-data.json`).
- **APIs:** YouTube Data API v3 (for subscriber counts and video metadata).

## Architecture & Structure
The project is organized into modular directories under the `site/` folder, each representing a specific feature or page:

- **`site/main/`**: The landing page and core navigation.
- **`site/city/`**: "City of Subscribers" - A 3D interactive visualization using Three.js. It periodically fetches subscriber data and saves city growth state to a JSON file via a PHP backend.
- **`site/timer/`**: A countdown/countup timer tracking time since the last community video.
- **`site/about/`**: Information about the OnCube team members.
- **`site/channel-summary/`**: A dashboard showing channel metrics and recent activity.
- **`site/resources/`**: Shared assets including images and the `city-data.json` state file.

## Development & Deployment

### Environment Requirements
- **Web Server:** Any standard web server (Apache, Nginx).
- **PHP:** Required for the City feature's data-saving capability (`site/city/save-data.php`). PHP 7.4+ is recommended.
- **API Keys:** Requires a YouTube Data API v3 key.

### Configuration
- **API Keys:** API keys and Channel IDs are typically stored in `info_script.js` files within their respective directories (e.g., `site/city/info_script.js`).
- **Permissions:** The `site/resources/` directory and `city-data.json` file must be writable by the web server user (e.g., `chmod 755 site/resources` and `chmod 644 site/resources/city-data.json`).

### Running Locally
Since this is a static project with PHP components:
1. Use a local server like **Live Server** (VS Code extension) for frontend work.
2. Use **XAMPP**, **WAMP**, or the built-in PHP server (`php -S localhost:8000`) to test the backend functionality.

## Coding Conventions
- **Theming:** The site uses a global dark theme managed by `site/main/theme.js`.
- **Vanilla JS:** Prefer clean, modular Vanilla JavaScript over heavy frameworks.
- **3D Logic:** Three.js logic in `site/city/script.js` uses a "district" based grid system for building placement.
- **Data Updates:** The City visualization updates its state every 10 minutes (`UPDATE_INTERVAL = 600000`).

## Important Files
- `site/city/save-data.php`: Handles POST requests to update the city state.
- `site/city/script.js`: Contains the complex Three.js logic for city generation and camera movement.
- `site/city/README-BACKEND.md`: Detailed setup instructions for the PHP backend.
- `site/resources/city-data.json`: The "database" of the project, storing the positions and types of all buildings in the virtual city.

## TODOs & Future Work
- [ ] Centralize API key management (avoid hardcoding in multiple `info_script.js` files).
- [ ] Implement a more robust error handling for YouTube API quota limits.
- [ ] Consider migrating to a lightweight build tool (like Vite) if the codebase grows significantly.
