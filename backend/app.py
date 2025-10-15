from flask import Flask, request, jsonify, send_file
import os
import uuid
from werkzeug.utils import secure_filename

app = Flask(__name__)
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max

# Allowed file extensions
ALLOWED_EXTENSIONS = {'pdf', 'docx', 'doc', 'rtf', 'txt', 'odt', 'md'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def home():
    return jsonify({"message": "Document Converter API is running!"})

@app.route('/convert', methods=['POST'])
def convert_file():
    # Basic structure - we'll implement conversion logic later
    return jsonify({
        "status": "success", 
        "message": "Conversion endpoint ready",
        "file_id": str(uuid.uuid4())
    })

@app.route('/health')
def health_check():
    return jsonify({"status": "healthy"})

if __name__ == '__main__':
    app.run(debug=True)
