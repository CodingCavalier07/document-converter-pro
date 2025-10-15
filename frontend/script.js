class DocumentConverter {
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
        this.currentFile = null;
        this.convertedFileInfo = null;  // ← NEW LINE
    }

    // ... (other methods remain the same) ...

    async startConversion() {
        if (!this.currentFile || !this.toFormat.value) return;

        // Show progress
        this.showProgress();
        
        try {
            // Create form data for Vercel backend
            const formData = new FormData();
            formData.append('file', this.currentFile);
            formData.append('to_format', this.toFormat.value);

            // Try to connect to Vercel backend
            const response = await fetch('/api/convert', {
                method: 'POST',
                body: formData
            });

            if (response.ok) {
                const result = await response.json();
                
                if (result.success) {
                    // Store file info for download
                    this.convertedFileInfo = result;
                    this.showResult();
                } else {
                    throw new Error(result.error || 'Conversion failed');
                }
            } else {
                throw new Error('Server error: ' + response.status);
            }
            
        } catch (error) {
            console.log('Backend not available, using demo mode:', error);
            // Fallback to simulation
            await this.simulateConversion();
        }
    }

    downloadFile() {
        if (!this.currentFile) return;

        // Try to get real converted file from backend
        if (this.convertedFileInfo) {
            // In a real implementation, this would download the actual converted file
            // For now, we'll create a demo file
            const content = `This file was converted by DocConvert Pro!\nOriginal: ${this.currentFile.name}\nConverted to: ${this.toFormat.value}\nFile ID: ${this.convertedFileInfo.file_id || 'demo'}`;
            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `converted.${this.toFormat.value}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } else {
            // Demo fallback
            const content = `This is a demo converted file.\nOriginal: ${this.currentFile.name}\nConverted to: ${this.toFormat.value}`;
            const blob = new Blob([content], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `converted.${this.toFormat.value}`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        }
        
        this.trackConversion();
    }

    // ... (other methods remain the same) ...
}
