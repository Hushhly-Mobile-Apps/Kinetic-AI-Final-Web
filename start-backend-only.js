#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

class BackendStarter {
  constructor() {
    this.startTime = Date.now();
    this.progress = 0;
  }

  log(message, color = 'reset') {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`${colors[color]}[${timestamp}] ${message}${colors.reset}`);
  }

  updateProgress(percentage) {
    this.progress = percentage;
    this.displayProgress();
  }

  displayProgress() {
    const elapsed = Math.round((Date.now() - this.startTime) / 1000);
    
    // Clear previous lines
    process.stdout.write('\x1b[2K\r');
    process.stdout.write('\x1b[1A\x1b[2K\r');
    process.stdout.write('\x1b[1A\x1b[2K\r');
    process.stdout.write('\x1b[1A\x1b[2K\r');
    
    console.log(`${colors.cyan}╔══════════════════════════════════════════════════════════════╗${colors.reset}`);
    console.log(`${colors.cyan}║${colors.bright} KINETIC AI - BACKEND (FastAPI) STARTUP                      ${colors.cyan}║${colors.reset}`);
    console.log(`${colors.cyan}╠══════════════════════════════════════════════════════════════╣${colors.reset}`);
    console.log(`${colors.cyan}║${colors.reset} Progress: ${this.getProgressBar(this.progress, 'green')} ${this.progress.toString().padStart(3)}% ${colors.cyan}║${colors.reset}`);
    console.log(`${colors.cyan}╚══════════════════════════════════════════════════════════════╝${colors.reset}`);
    
    if (this.progress === 100) {
      this.log('🎉 Backend started successfully!', 'green');
      this.log('🔧 Backend API: http://localhost:8000', 'cyan');
      this.log('📚 API Docs: http://localhost:8000/docs', 'cyan');
      this.log('🔍 Health Check: http://localhost:8000/health', 'cyan');
    }
  }

  getProgressBar(percentage, color) {
    const width = 20;
    const filled = Math.round((percentage / 100) * width);
    const empty = width - filled;
    return `${colors[color]}${'█'.repeat(filled)}${colors.reset}${'░'.repeat(empty)}`;
  }

  async start() {
    console.clear();
    this.log('🚀 Starting Kinetic AI Backend...', 'cyan');
    
    // Initialize progress display
    console.log('\n'.repeat(5));
    this.displayProgress();

    return new Promise((resolve, reject) => {
      const backendProcess = spawn('python', ['-m', 'uvicorn', 'main:app', '--reload', '--host', '0.0.0.0', '--port', '8000'], {
        cwd: path.join(__dirname, 'backend'),
        stdio: ['pipe', 'pipe', 'pipe']
      });

      let backendReady = false;
      let progress = 0;

      // Simulate progress
      const progressInterval = setInterval(() => {
        if (!backendReady && progress < 90) {
          progress += Math.random() * 3;
          this.updateProgress(Math.min(90, Math.round(progress)));
        }
      }, 1500);

      backendProcess.stdout.on('data', (data) => {
        const output = data.toString();
        this.log(`📝 ${output.trim()}`, 'blue');
        
        if (output.includes('Uvicorn running on') || output.includes('Application startup complete')) {
          clearInterval(progressInterval);
          this.updateProgress(100);
          backendReady = true;
          
          this.log('\n✅ Backend is ready for connections!', 'green');
          this.log('💡 You can now start the frontend with: npm run dev', 'yellow');
          this.log('🔄 Or use full integration: npm run integration', 'yellow');
          this.log('\n🛑 Press Ctrl+C to stop the backend', 'cyan');
          
          resolve();
        }
      });

      backendProcess.stderr.on('data', (data) => {
        const error = data.toString();
        // Filter out ML library warnings
        if (!error.includes('WARNING') && 
            !error.includes('INFO') && 
            !error.includes('oneDNN') && 
            !error.includes('tensorflow') &&
            !error.includes('TF_ENABLE_ONEDNN_OPTS') &&
            !error.includes('floating-point round-off')) {
          this.log(`⚠️ ${error.trim()}`, 'yellow');
        }
      });

      backendProcess.on('error', (error) => {
        clearInterval(progressInterval);
        this.log(`❌ Failed to start backend: ${error.message}`, 'red');
        reject(error);
      });

      backendProcess.on('exit', (code) => {
        clearInterval(progressInterval);
        if (code !== 0) {
          this.log(`❌ Backend exited with code ${code}`, 'red');
        } else {
          this.log('👋 Backend stopped gracefully', 'cyan');
        }
      });

      // Handle graceful shutdown
      process.on('SIGINT', () => {
        console.log('\n');
        this.log('🛑 Stopping backend...', 'yellow');
        backendProcess.kill('SIGTERM');
        
        setTimeout(() => {
          if (!backendProcess.killed) {
            backendProcess.kill('SIGKILL');
          }
          this.log('👋 Backend stopped. Goodbye!', 'cyan');
          process.exit(0);
        }, 3000);
      });

      // Longer timeout for ML dependencies
      setTimeout(() => {
        if (!backendReady) {
          clearInterval(progressInterval);
          this.log('⏰ Backend startup timeout (ML dependencies may take longer)', 'red');
          this.log('💡 Check if Python dependencies are installed:', 'yellow');
          this.log('   cd backend && pip install -r requirements.txt', 'yellow');
          reject(new Error('Backend startup timeout'));
        }
      }, 120000); // 2 minutes timeout
    });
  }
}

// Start the backend
const starter = new BackendStarter();
starter.start().catch((error) => {
  console.error('Failed to start backend:', error.message);
  process.exit(1);
});