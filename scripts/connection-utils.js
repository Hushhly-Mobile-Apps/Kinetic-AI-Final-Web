// Simple and reliable loading animation
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function showLoading() {
    const frames = ['-', '\\', '|', '/'];
    let frameIndex = 0;
    let progress = 0;
    const width = 40;
    
    // Initial message
    console.log('🔍 Initializing system...\n');
    
    while (progress <= 100) {
        // Calculate filled and empty portions
        const filled = Math.min(Math.floor((progress / 100) * width), width);
        const empty = width - filled;
        
        // Create progress bar
        const bar = '='.repeat(filled) + '>'.repeat(filled < width ? 1 : 0) + ' '.repeat(empty);
        const spinner = frames[frameIndex % frames.length];
        
        // Update progress line
        process.stdout.write(`\r[${bar}] ${progress}% ${progress >= 50 && progress < 70 ? spinner + ' Processing...' : ''}`);
        
        // Pause at 50-70%
        if (progress === 50) {
            await sleep(2000); // Pause for 2 seconds
        }
        
        // Update counters
        progress++;
        frameIndex++;
        
        // Adjust speed (slower at the end)
        await sleep(progress < 50 ? 50 : progress < 80 ? 30 : 20);
    }
    
    // Completion message
    console.log('\n\n✅ System ready!');
}

// Run the loading animation
showLoading().catch(console.error);
