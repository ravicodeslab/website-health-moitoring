from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import time
from urllib.parse import urlparse

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

SECURITY_HEADERS = [
    'Content-Security-Policy',
    'Strict-Transport-Security',
    'X-Frame-Options',
    'X-Content-Type-Options',
    'Referrer-Policy',
    'Permissions-Policy'
]

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({"status": "ok"})

@app.route('/analyze', methods=['POST'])
def analyze_website():
    data = request.get_json()
    if not data or 'url' not in data:
        return jsonify({"error": "Missing 'url' in request body"}), 400

    url = data['url']
    
    # Ensure URL has scheme
    if not url.startswith('http://') and not url.startswith('https://'):
        url = 'https://' + url

    parsed_url = urlparse(url)
    is_https = parsed_url.scheme == 'https'

    start_time = time.time()
    
    try:
        # Use a timeout and fake user-agent to prevent blocking
        headers_req = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36'}
        response = requests.get(url, headers=headers_req, timeout=10, allow_redirects=True)
        response_time_ms = int((time.time() - start_time) * 1000)
        
        status = "up"
        status_code = response.status_code
        
        # Check actual final URL scheme in case of redirects
        final_url = response.url
        is_https = final_url.startswith('https://')
        
        headers_dict = {}
        warnings = []
        score = 100
        
        if not is_https:
            warnings.append("Not using HTTPS")
            score -= 30
            
        # Check security headers
        for sh in SECURITY_HEADERS:
            header_val = response.headers.get(sh)
            if header_val:
                headers_dict[sh] = header_val
            else:
                warnings.append(f"Missing {sh} header")
                # Deduct points for missing security headers (adjust based on importance)
                if sh in ['Content-Security-Policy', 'Strict-Transport-Security']:
                    score -= 10
                else:
                    score -= 5

        # Ensure score is within 0-100
        security_score = max(0, min(100, score))

        return jsonify({
            "status": status,
            "status_code": status_code,
            "response_time_ms": response_time_ms,
            "is_https": is_https,
            "headers": headers_dict,
            "warnings": warnings,
            "security_score": security_score
        })

    except requests.exceptions.RequestException as e:
        return jsonify({
            "status": "down",
            "status_code": None,
            "response_time_ms": None,
            "is_https": is_https,
            "headers": {},
            "warnings": [f"Failed to reach website: {str(e)}"],
            "security_score": 0
        })

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
