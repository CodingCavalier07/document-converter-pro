class DocumentConverter {
    constructor() {
        this.initializeElements();
        this.setupEventListeners();
        this.currentFile = null;
    }

    initializeElements() {
        // Upload elements
        this.uploadArea = document.getElementById('uploadArea');
        this.fileInput = document.getElementById('fileInput');
        this.fileInfo = document.getElementById('fileInfo');
        this.fileName = document.getElementById('fileName');
        this.removeFile = document.getElementById('removeFile');

        // Format selection
        this.fromFormat = document.getElementById('fromFormat');
        this.toFormat = document.getElementById('toFormat');

        // Action buttons
        this.convertBtn = document.getElementById('convertBtn');
        this.downloadBtn = document.getElementById('downloadBtn');

        // Progress and result sections
        this.progressSection = document.getElementById('progressSection');
        this.progressFill = document.getElementById('progressFill');
        this.progressText = document.getElementById('progressText');
        this.resultSection = document.getElementById('resultSection');
    }

    setupEventListeners() {
        // File upload
        this.uploadArea.addEventListener('click', () => this.fileInput.click());
        this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
        this.removeFile.addEventListener('click', () => this.removeCurrentFile());

        // Drag and drop
        this.uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
        this.uploadArea.addEventListener('dragleave', () => this.handleDragLeave());
        this.uploadArea.addEventListener('drop', (e) => this.handleFileDrop(e));

        // Conversion
        this.convertBtn.addEventListener('click', () => this.startConversion());
        this.downloadBtn.addEventListener('click', () => this.downloadFile());

        // Format changes
        this.toFormat.addEventListener('change', () => this.updateConvertButton());
    }

    handleFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            this.processFile(file);
        }
    }

    handleDragOver(event) {
        event.preventDefault();
        this.uploadArea.style.borderColor = 'var(--primary)';
        this.uploadArea.style.background = 'rgba(67, 97, 238, 0.05)';
    }

    handleDragLeave() {
        this.uploadArea.style.borderColor = '#c3cfe2';
        this.uploadArea.style.background = 'white';
    }

    handleFileDrop(event) {
        event.preventDefault();
        this.handleDragLeave();
        
        const file = event.dataTransfer.files[0];
        if (file) {
            this.processFile(file);
        }
    }

    processFile(file) {
        // Validate file type
        const allowedTypes = ['.pdf', '.docx', '.doc', '.rtf', '.txt', '.odt', '.md'];
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        
        if (!allowedTypes.includes(fileExtension)) {
            alert('Please select a supported file type: PDF, DOCX, DOC, RTF, TXT, ODT, MD');
            return;
        }

        // Store file and update UI
        this.currentFile = file;
        this.fileName.textContent = file.name;
        this.fileInfo.style.display = 'flex';
        
        // Auto-detect format
        const format = fileExtension.substring(1); // Remove the dot
        this.fromFormat.value = format;
        
        this.updateConvertButton();
    }

    removeCurrentFile() {
        this.currentFile = null;
        this.fileInput.value = '';
        this.fileInfo.style.display = 'none';
        this.fromFormat.value = '';
        this.updateConvertButton();
        this.hideResults();
    }

    updateConvertButton() {
        const hasFile = this.currentFile !== null;
        const hasTargetFormat = this.toFormat.value !== '';
        
        this.convertBtn.disabled = !(hasFile && hasTargetFormat);
    }

    async startConversion() {
        if (!this.currentFile || !this.toFormat.value) return;

        // Show progress
        this.showProgress();
        
        try {
            // Simulate conversion process
            await this.simulateConversion();
            
            // Show success
            this.showResult();
            
        } catch (error) {
            alert('Conversion failed: ' + error.message);
            this.hideProgress();
        }
    }

    showProgress() {
        this.progressSection.style.display = 'block';
        this.resultSection.style.display = 'none';
        
        let progress = 0;
        const interval = setInterval(() => {
            progress += Math.random() * 15;
            if (progress >= 100) {
                progress = 100;
                clearInterval(interval);
            }
            this.updateProgress(progress);
        }, 300);
    }

    updateProgress(percentage) {
        this.progressFill.style.width = percentage + '%';
        
        if (percentage < 30) {
            this.progressText.textContent = 'Reading document...';
        } else if (percentage < 60) {
            this.progressText.textContent = 'Converting format...';
        } else if (percentage < 90) {
            this.progressText.textContent = 'Finalizing conversion...';
        } else {
            this.progressText.textContent = 'Almost done...';
        }
    }

    simulateConversion() {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve();
            }, 2500);
        });
    }

    showResult() {
        this.progressSection.style.display = 'none';
        this.resultSection.style.display = 'block';
    }

    hideProgress() {
        this.progressSection.style.display = 'none';
    }

    hideResults() {
        this.resultSection.style.display = 'none';
    }

    downloadFile() {
        if (!this.currentFile) return;

        // In a real implementation, this would download the actual converted file
        // For now, we'll create a dummy file for demonstration
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
        
        // Track conversion (for analytics)
        this.trackConversion();
    }

    trackConversion() {
        console.log('Conversion tracked:', {
            from: this.fromFormat.value,
            to: this.toFormat.value,
            filename: this.currentFile.name
        });
        // In production, send this to your analytics service
    }
}

// Initialize the converter when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new DocumentConverter();
});
