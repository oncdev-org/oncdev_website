import http.server
import socketserver
import os

PORT = 8000
SITE_DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'site')

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=SITE_DIR, **kwargs)

    def do_GET(self):
        if self.path in ('/', ''):
            self.send_response(302)
            self.send_header('Location', '/main/')
            self.end_headers()
            return
        try:
            return super().do_GET()
        except (ConnectionAbortedError, ConnectionResetError, BrokenPipeError):
            pass

class RobustServer(socketserver.ThreadingTCPServer):
    allow_reuse_address = True
    def handle_error(self, request, client_address):
        # Suppress client disconnect tracebacks cleanly
        pass

if __name__ == '__main__':
    with RobustServer(("", PORT), CustomHandler) as httpd:
        print(f"Local server running at: http://localhost:{PORT}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("Server stopped.")
