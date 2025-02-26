import os
import json
import hmac
import hashlib
import threading
import subprocess
from http.server import HTTPServer, BaseHTTPRequestHandler
import signal

# Read GitHub webhook secret from environment variable
GITHUB_SECRET = os.getenv("GITHUB_SECRET", "")

# Global variable to track the deployment process
current_process = None
lock = threading.Lock()  # Prevent race conditions when modifying current_process

class WebhookHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        """Handle incoming POST request from GitHub webhook."""
        content_length = int(self.headers['Content-Length'])
        payload = self.rfile.read(content_length)

        # Verify GitHub signature (if using a secret)
        signature = self.headers.get('X-Hub-Signature-256')
        if GITHUB_SECRET and not self.verify_signature(payload, signature):
            self.send_response(403)
            self.end_headers()
            self.wfile.write(b"Invalid signature")
            return

        data = json.loads(payload)

        # Check if this is a push to the 'dev' branch
        if data.get("ref") == "refs/heads/dev":
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b"Deployment started")

            # Start deployment in a new thread
            threading.Thread(target=self.deploy, daemon=True).start()
        else:
            self.send_response(200)
            self.end_headers()
            self.wfile.write(b"Not the target branch")

    def verify_signature(self, payload, signature):
        """Verify GitHub webhook signature using HMAC."""
        if not signature:
            return False
        sha_name, signature = signature.split('=')
        mac = hmac.new(GITHUB_SECRET.encode(), payload, hashlib.sha256).hexdigest()
        return hmac.compare_digest(mac, signature)

    def deploy(self):
        """Run deployment commands asynchronously, canceling any existing process."""
        global current_process

        with lock:  # Ensure thread safety
            if current_process and current_process.poll() is None:
                print("New commit detected, stopping previous deployment...")
                current_process.terminate()  # Send SIGTERM to the running deployment
                current_process.wait()  # Wait for it to stop

            print("Starting new deployment...")
            current_process = subprocess.Popen(
                ["sh", "-c", "git pull origin dev && docker compose up --build -d"],
                stdout=subprocess.PIPE,
                stderr=subprocess.PIPE
            )

            stdout, stderr = current_process.communicate()
            print(f"Deployment finished:\n{stdout.decode()}\n{stderr.decode()}")

if __name__ == "__main__":
    server_address = ('0.0.0.0', 2001)
    httpd = HTTPServer(server_address, WebhookHandler)
    print("Listening for GitHub webhooks on port 2001...")
    httpd.serve_forever()
