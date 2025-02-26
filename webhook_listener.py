import os
import json
import hmac
import hashlib
from http.server import HTTPServer, BaseHTTPRequestHandler

# Read GitHub webhook secret from environment variable
GITHUB_SECRET = os.getenv("GITHUB_SECRET", "")

class WebhookHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        # Read and parse the incoming payload
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
            self.deploy()

        self.send_response(200)
        self.end_headers()
        self.wfile.write(b"OK")

    def verify_signature(self, payload, signature):
        """Verify GitHub webhook signature"""
        if not signature:
            return False
        sha_name, signature = signature.split('=')
        mac = hmac.new(GITHUB_SECRET.encode(), payload, hashlib.sha256).hexdigest()
        return hmac.compare_digest(mac, signature)

    def deploy(self):
        """Run deployment commands"""
        os.system("git pull origin dev")
        os.system("docker compose up --build -d")

if __name__ == "__main__":
    server_address = ('0.0.0.0', 2001)
    httpd = HTTPServer(server_address, WebhookHandler)
    print("Listening for GitHub webhooks on port 2001...")
    httpd.serve_forever()
