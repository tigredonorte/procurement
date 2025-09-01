#!/bin/bash

# ================================================================
# Doppler Setup Script for Procurement Platform
# ================================================================
# This script helps developers set up Doppler for secrets management
# Usage: ./scripts/doppler-setup.sh [environment]
# Environments: development, staging, production

set -e

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
PROJECT_NAME="procurement"
DEFAULT_ENV="development"

# Function to print colored messages
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Function to install Doppler CLI
install_doppler() {
    print_info "Installing Doppler CLI..."
    
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        # Linux installation
        (curl -Ls --tlsv1.2 --proto "=https" --retry 3 https://cli.doppler.com/install.sh || wget -t 3 -qO- https://cli.doppler.com/install.sh) | sudo sh
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        # macOS installation
        if command_exists brew; then
            brew install dopplerhq/cli/doppler
        else
            print_error "Homebrew not found. Please install Homebrew first or install Doppler manually."
            print_info "Visit: https://docs.doppler.com/docs/install-cli"
            exit 1
        fi
    else
        print_error "Unsupported operating system: $OSTYPE"
        print_info "Please install Doppler manually: https://docs.doppler.com/docs/install-cli"
        exit 1
    fi
    
    print_success "Doppler CLI installed successfully"
}

# Function to verify Doppler installation
verify_doppler() {
    if command_exists doppler; then
        local version=$(doppler --version 2>/dev/null | head -n1)
        print_success "Doppler CLI is installed: $version"
        return 0
    else
        return 1
    fi
}

# Function to login to Doppler
doppler_login() {
    print_info "Logging into Doppler..."
    print_warning "You will be redirected to your browser to authenticate"
    
    if doppler login; then
        print_success "Successfully logged into Doppler"
    else
        print_error "Failed to login to Doppler"
        exit 1
    fi
}

# Function to setup Doppler project
setup_project() {
    local environment="${1:-$DEFAULT_ENV}"
    
    print_info "Setting up Doppler project for environment: $environment"
    
    # Check if we're in the project root
    if [ ! -f "package.json" ] || [ ! -f "pnpm-workspace.yaml" ]; then
        print_error "This script must be run from the project root directory"
        exit 1
    fi
    
    # Setup Doppler project
    print_info "Configuring Doppler project..."
    doppler setup --project "$PROJECT_NAME" --config "$environment" --no-interactive
    
    if [ $? -eq 0 ]; then
        print_success "Doppler project configured for $environment environment"
    else
        print_warning "Project might not exist or you don't have access"
        print_info "Please ask your admin to:"
        print_info "  1. Create the '$PROJECT_NAME' project in Doppler"
        print_info "  2. Add environments: development, staging, production"
        print_info "  3. Grant you access to the project"
    fi
}

# Function to create local .env from Doppler
create_env_file() {
    print_info "Creating .env file from Doppler secrets..."
    
    if [ -f ".env" ]; then
        print_warning ".env file already exists"
        read -p "Do you want to overwrite it? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            print_info "Skipping .env creation"
            return
        fi
    fi
    
    # Download secrets to .env file
    if doppler secrets download --no-file --format env > .env; then
        print_success ".env file created successfully"
        print_warning "Remember: Never commit .env file to version control!"
    else
        print_error "Failed to create .env file"
        print_info "You can manually download secrets using: doppler secrets download --no-file --format env > .env"
    fi
}

# Function to verify setup
verify_setup() {
    print_info "Verifying Doppler setup..."
    
    # Check if doppler.yaml exists
    if [ -f "doppler.yaml" ]; then
        print_success "doppler.yaml configuration found"
        cat doppler.yaml
    else
        print_warning "doppler.yaml not found (this is okay for local development)"
    fi
    
    # Test secret access
    print_info "Testing secret access..."
    if doppler secrets get DOPPLER_PROJECT --plain >/dev/null 2>&1; then
        print_success "Successfully accessed Doppler secrets"
    else
        print_warning "Could not access secrets. You might need to configure them first."
    fi
}

# Function to show usage information
show_usage() {
    echo "Doppler Setup Script for Procurement Platform"
    echo ""
    echo "Usage: $0 [command] [environment]"
    echo ""
    echo "Commands:"
    echo "  install     - Install Doppler CLI"
    echo "  setup       - Setup Doppler project (default)"
    echo "  login       - Login to Doppler"
    echo "  env         - Create .env file from Doppler"
    echo "  verify      - Verify Doppler setup"
    echo "  help        - Show this help message"
    echo ""
    echo "Environments:"
    echo "  development - Development environment (default)"
    echo "  staging     - Staging environment"
    echo "  production  - Production environment"
    echo ""
    echo "Examples:"
    echo "  $0                    # Full setup for development"
    echo "  $0 setup staging      # Setup for staging environment"
    echo "  $0 env                # Create .env from Doppler"
    echo "  $0 install            # Install Doppler CLI only"
}

# Function to run Docker services with Doppler
run_with_doppler() {
    print_info "Starting services with Doppler..."
    
    if command_exists docker-compose; then
        doppler run -- docker-compose up
    elif command_exists docker && docker compose version >/dev/null 2>&1; then
        doppler run -- docker compose up
    else
        print_error "Docker Compose not found"
        exit 1
    fi
}

# Main execution
main() {
    local command="${1:-setup}"
    local environment="${2:-$DEFAULT_ENV}"
    
    case "$command" in
        install)
            if verify_doppler; then
                print_info "Doppler is already installed"
            else
                install_doppler
            fi
            ;;
        
        login)
            doppler_login
            ;;
        
        setup)
            # Full setup flow
            print_info "Starting Doppler setup for Procurement Platform"
            echo "=================================================="
            
            # Check and install Doppler
            if ! verify_doppler; then
                install_doppler
            fi
            
            # Check if logged in
            if ! doppler me >/dev/null 2>&1; then
                doppler_login
            else
                print_success "Already logged into Doppler"
            fi
            
            # Setup project
            setup_project "$environment"
            
            # Verify setup
            verify_setup
            
            # Offer to create .env file
            echo ""
            read -p "Would you like to create a .env file from Doppler? (y/N): " -n 1 -r
            echo
            if [[ $REPLY =~ ^[Yy]$ ]]; then
                create_env_file
            fi
            
            echo "=================================================="
            print_success "Doppler setup complete!"
            print_info "You can now run services with: doppler run -- docker-compose up"
            print_info "Or use: doppler run -- [any command] to inject secrets"
            ;;
        
        env)
            create_env_file
            ;;
        
        verify)
            verify_setup
            ;;
        
        run)
            run_with_doppler
            ;;
        
        help|--help|-h)
            show_usage
            ;;
        
        *)
            print_error "Unknown command: $command"
            echo ""
            show_usage
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"