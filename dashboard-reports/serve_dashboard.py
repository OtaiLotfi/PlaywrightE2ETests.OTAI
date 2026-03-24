#!/usr/bin/env python3
"""
Serve the Playwright E2E dashboard over HTTP.
Usage: python serve_dashboard.py [port]
Default port: 8765

Then open: http://localhost:8765/dashboard-reports/index.html
"""

import http.server
import os
import sys
import webbrowser


def main():
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8765
    script_dir = os.path.dirname(os.path.abspath(__file__))
    project_root = os.path.dirname(script_dir)
    os.chdir(project_root)
    handler = http.server.SimpleHTTPRequestHandler
    server = http.server.HTTPServer(('', port), handler)
    url = f'http://localhost:{port}/dashboard-reports/index.html'
    print(f'Dashboard server running at: {url}')
    print('Press Ctrl+C to stop.')
    webbrowser.open(url)
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        print('\nStopped.')


if __name__ == '__main__':
    main()
