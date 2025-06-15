# Push to GitHub script
# This script initializes a Git repository, adds all files, commits, and pushes to GitHub

# Check if git is installed
if (!(Get-Command git -ErrorAction SilentlyContinue)) {
    Write-Error "Git is not installed. Please install Git and try again."
    exit 1
}

# Ask for GitHub username and repository name
$githubUsername = Read-Host -Prompt "Enter your GitHub username"
$repoName = Read-Host -Prompt "Enter the name for your GitHub repository (e.g., kinetic-ai)"

# Initialize git repository if not already initialized
if (!(Test-Path -Path ".git")) {
    Write-Host "Initializing Git repository..."
    git init
}

# Check if remote origin exists, if so remove it
$remotes = git remote
if ($remotes -contains "origin") {
    git remote remove origin
}

# Add the new remote origin
$repoUrl = "https://github.com/$githubUsername/$repoName.git"
Write-Host "Adding remote origin: $repoUrl"
git remote add origin $repoUrl

# Stage all files
Write-Host "Staging all files..."
git add .

# Commit changes
$commitMessage = Read-Host -Prompt "Enter commit message (default: 'Initial commit with Supabase integration')"
if ([string]::IsNullOrWhiteSpace($commitMessage)) {
    $commitMessage = "Initial commit with Supabase integration"
}

Write-Host "Committing changes..."
git commit -m $commitMessage

# Push to GitHub
Write-Host "Pushing to GitHub... (You'll need to authenticate with your GitHub credentials)"
git push -u origin master

Write-Host "Done! Your code has been pushed to: $repoUrl"