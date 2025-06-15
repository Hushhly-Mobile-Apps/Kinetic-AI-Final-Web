#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

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

class IntegrationManager {
  constructor() {
    this.processes = {};
    this.progress = {
      backend: 0,
      frontend: 0,
      total: 0
    };
    this.startTime = Date.now();
    this.isRunning = false;
  }

  log(message, color = 'reset') {
    const timestamp = new Date().toLocaleTimeString();
    console.log(`${colors[color]}[${timestamp}] ${message}${colors.reset}`);
  }

  updateProgress(service, percentage) {
    this.progress[service] = percentage;
    this.progress.total = Math.round((this.progress.backend + this.progress.frontend) / 2);
    this.displayProgress();
  }

  displayProgress() {
    const { backend, frontend, total } = this.progress;
    const elapsed = Math.round((Date.now() - this.startTime) / 1000);
    
    // Clear previous lines
    process.stdout.write('\x1b[2K\r'); // Clear current line
    process.stdout.write('\x1b[1A\x1b[2K\r'); // Move up and clear
    process.stdout.write('\x1b[1A\x1b[2K\r'); // Move up and clear
    process.stdout.write('\x1b[1A\x1b[2K\r'); // Move up and clear
    
    console.log(`${colors.cyan}╔══════════════════════════════════════════════════════════════╗${colors.reset}`);
    console.log(`${colors.cyan}║${colors.bright} KINETIC AI - FRONTEND & BACKEND INTEGRATION STATUS          ${colors.cyan}║${colors.reset}`);
    console.log(`${colors.cyan}╠══════════════════════════════════════════════════════════════╣${colors.reset}`);
    console.log(`${colors.cyan}║${colors.reset} Backend (FastAPI):  ${this.getProgressBar(backend, 'green')} ${backend.toString().padStart(3)}% ${colors.cyan}║${colors.reset}`);
    console.log(`${colors.cyan}║${colors.reset} Frontend (Next.js): ${this.getProgressBar(frontend, 'blue')} ${frontend.toString().padStart(3)}% ${colors.cyan}║${colors.reset}`);
    console.log(`${colors.cyan}║${colors.reset} Total Progress:     ${this.getProgressBar(total, 'magenta')} ${total.toString().padStart(3)}% ${colors.cyan}║${colors.reset}`);
    console.log(`${colors.cyan}╚══════════════════════════════════════════════════════════════╝${colors.reset}`);
    
    if (total === 100 && !this.isRunning) {
      this.log('🎉 Integration completed successfully! Both services are running.', 'green');
      this.log('📱 Frontend: http://localhost:3000', 'cyan');
      this.log('🔧 Backend API: http://localhost:8000', 'cyan');
      this.log('📚 API Docs: http://localhost:8000/docs', 'cyan');
      this.isRunning = true;
    }
  }

  getProgressBar(percentage, color) {
    const width = 20;
    const filled = Math.round((percentage / 100) * width);
    const empty = width - filled;
    return `${colors[color]}${'█'.repeat(filled)}${colors.reset}${'░'.repeat(empty)}`;
  }

  async startBackend() {
    return new Promise((resolve, reject) => {
      this.log('🚀 Starting Backend (FastAPI)...', 'yellow');
      
      const backendProcess = spawn('python', ['-m', 'uvicorn', 'main:app', '--reload', '--host', '0.0.0.0', '--port', '8000'], {
        cwd: path.join(__dirname, 'backend'),
        stdio: ['pipe', 'pipe', 'pipe']
      });

      this.processes.backend = backendProcess;
      let backendReady = false;

      // Simulate backend startup progress
      let progress = 0;
      const progressInterval = setInterval(() => {
        if (!backendReady && progress < 90) {
          progress += Math.random() * 5;
          this.updateProgress('backend', Math.min(90, Math.round(progress)));
        }
      }, 1000);

      backendProcess.stdout.on('data', (data) => {
        const output = data.toString();
        if (output.includes('Uvicorn running on') || output.includes('Application startup complete')) {
          clearInterval(progressInterval);
          this.updateProgress('backend', 100);
          this.log('✅ Backend started successfully on http://localhost:8000', 'green');
          backendReady = true;
          resolve();
        }
      });

      backendProcess.stderr.on('data', (data) => {
        const error = data.toString();
        // Filter out common TensorFlow/ML library warnings that are not actual errors
        if (!error.includes('WARNING') && 
            !error.includes('INFO') && 
            !error.includes('oneDNN') && 
            !error.includes('tensorflow') &&
            !error.includes('TF_ENABLE_ONEDNN_OPTS') &&
            !error.includes('floating-point round-off')) {
          this.log(`❌ Backend Error: ${error}`, 'red');
        }
      });

      backendProcess.on('error', (error) => {
        clearInterval(progressInterval);
        this.log(`❌ Failed to start backend: ${error.message}`, 'red');
        reject(error);
      });

      // Timeout after 60 seconds (longer for ML dependencies)
      setTimeout(() => {
        if (!backendReady) {
          clearInterval(progressInterval);
          this.log('⏰ Backend startup timeout (ML dependencies loading...)', 'red');
          this.log('💡 Try running backend manually: cd backend && python -m uvicorn main:app --reload', 'yellow');
          reject(new Error('Backend startup timeout'));
        }
      }, 60000);
    });
  }

  async startFrontend() {
    return new Promise((resolve, reject) => {
      this.log('🚀 Starting Frontend (Next.js)...', 'yellow');
      
      const frontendProcess = spawn('npm', ['run', 'dev'], {
        cwd: __dirname,
        stdio: ['pipe', 'pipe', 'pipe'],
        shell: true
      });

      this.processes.frontend = frontendProcess;
      let frontendReady = false;

      // Simulate frontend startup progress
      let progress = 0;
      const progressInterval = setInterval(() => {
        if (!frontendReady && progress < 90) {
          progress += Math.random() * 12;
          this.updateProgress('frontend', Math.min(90, Math.round(progress)));
        }
      }, 400);

      frontendProcess.stdout.on('data', (data) => {
        const output = data.toString();
        if (output.includes('Ready in') || output.includes('Local:') || output.includes('localhost:3000')) {
          clearInterval(progressInterval);
          this.updateProgress('frontend', 100);
          this.log('✅ Frontend started successfully on http://localhost:3000', 'green');
          frontendReady = true;
          resolve();
        }
      });

      frontendProcess.stderr.on('data', (data) => {
        const error = data.toString();
        if (!error.includes('WARNING') && !error.includes('warn')) {
          this.log(`❌ Frontend Error: ${error}`, 'red');
        }
      });

      frontendProcess.on('error', (error) => {
        clearInterval(progressInterval);
        this.log(`❌ Failed to start frontend: ${error.message}`, 'red');
        reject(error);
      });

      // Timeout after 90 seconds (longer for initial build)
      setTimeout(() => {
        if (!frontendReady) {
          clearInterval(progressInterval);
          this.log('⏰ Frontend startup timeout', 'red');
          this.log('💡 Try running frontend manually: npm run dev', 'yellow');
          reject(new Error('Frontend startup timeout'));
        }
      }, 90000);
    });
  }

  async start() {
    console.clear();
    this.log('🔄 Initializing Kinetic AI Integration...', 'cyan');
    
    // Initialize progress display
    console.log('\n'.repeat(8)); // Reserve space for progress display
    this.displayProgress();

    try {
      // Start both services concurrently
      await Promise.all([
        this.startBackend(),
        this.startFrontend()
      ]);

      this.log('\n🎯 Integration Status: ACTIVE', 'green');
      this.log('💡 Press Ctrl+C to stop both services', 'yellow');
      
      // Keep the process alive
      process.stdin.resume();
      
    } catch (error) {
      this.log(`💥 Integration failed: ${error.message}`, 'red');
      this.cleanup();
      process.exit(1);
    }
  }

  cleanup() {
    this.log('🛑 Stopping services...', 'yellow');
    
    Object.values(this.processes).forEach(process => {
      if (process && !process.killed) {
        process.kill('SIGTERM');
      }
    });
    
    setTimeout(() => {
      Object.values(this.processes).forEach(process => {
        if (process && !process.killed) {
          process.kill('SIGKILL');
        }
      });
    }, 5000);
  }
}

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n');
  manager.log('🛑 Received shutdown signal...', 'yellow');
  manager.cleanup();
  setTimeout(() => {
    manager.log('👋 Integration stopped. Goodbye!', 'cyan');
    process.exit(0);
  }, 2000);
});

process.on('SIGTERM', () => {
  manager.cleanup();
  process.exit(0);
});

// Start the integration
const manager = new IntegrationManager();
manager.start().catch(console.error);