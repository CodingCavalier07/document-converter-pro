def convert_document(input_path, output_path, to_format):
    """
    Placeholder function for document conversion
    In next steps, we'll implement actual conversion logic
    """
    print(f"Converting {input_path} to {output_path} as {to_format}")
    
    # For now, just create a dummy file
    with open(output_path, 'w') as f:
        f.write(f"Converted from {input_path} to {to_format}")
    
    return True

def get_supported_formats():
    """Return list of supported formats"""
    return {
        'pdf': 'Portable Document Format',
        'docx': 'Microsoft Word Open XML',
        'doc': 'Microsoft Word', 
        'rtf': 'Rich Text Format',
        'txt': 'Plain Text',
        'odt': 'OpenDocument Text',
        'md': 'Markdown'
    }
