from flask import Flask, request, jsonify, send_file
import uuid
import os
import tempfile
from conversion_utils import convert_document

app = Flask(__name__)

# Configure
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max

ALLOWED_EXTENSIONS = {'pdf', 'docx', 'doc', 'rtf', 'txt', 'odt', 'md'}

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/')
def home():
    return jsonify({"message": "Document Converter API - Vercel Ready!"})

@app.route('/api/convert', methods=['POST'])
def convert_file():
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        to_format = request.form.get('to_format')
        
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        if not allowed_file(file.filename):
            return jsonify({'error': 'File type not allowed'}), 400
        
        if not to_format or to_format not in ALLOWED_EXTENSIONS:
            return jsonify({'error': 'Invalid target format'}), 400

        # Generate unique file names
        file_id = str(uuid.uuid4())
        original_ext = file.filename.rsplit('.', 1)[1].lower()
        converted_filename = f"{file_id}.{to_format}"
        
        # Use temp directory (Vercel compatible)
        with tempfile.NamedTemporaryFile(delete=False, suffix=f'.{original_ext}') as temp_input:
            file.save(temp_input.name)
            
            # Convert the document
            with tempfile.NamedTemporaryFile(delete=False, suffix=f'.{to_format}') as temp_output:
                success = convert_document(temp_input.name, temp_output.name, to_format)
                
                if success:
                    return jsonify({
                        'success': True,
                        'converted_file': converted_filename,
                        'file_size': os.path.getsize(temp_output.name)
                    })
                else:
                    return jsonify({'error': 'Conversion failed'}), 500
                    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/download/<filename>', methods=['GET'])
def download_file(filename):
    try:
        # In Vercel, we'd need to store files temporarily
        # For now, return a demo file
        demo_content = f"This is a demo converted file: {filename}"
        return jsonify({
            'content': demo_content,
            'filename': f"converted_{filename}"
        })
    except Exception as e:
        return jsonify({'error': 'File not found'}), 404

@app.route('/api/health')
def health_check():
    return jsonify({"status": "healthy", "platform": "Vercel"})

@app.route('/api/formats')
def get_formats():
    from conversion_utils import get_supported_formats
    return jsonify(get_supported_formats())

# Vercel serverless compatibility
if __name__ == '__main__':
    app.run(debug=True)
else:
    # This makes it work with Vercel serverless functions
    def handler(request, context):
        return app(request, context)
