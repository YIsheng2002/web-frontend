// Main utility functions
class Utils {
    // Show notification/alert messages
    static showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        `;
        
        // Add to body
        document.body.appendChild(notification);
        
        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 5000);
        
        // Manual close button
        notification.querySelector('.notification-close').addEventListener('click', () => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        });
    }
    
    // Validate email format
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
    
    // Validate password strength
    static validatePassword(password) {
        const errors = [];
        
        if (password.length < 8) {
            errors.push('Password must be at least 8 characters long');
        }
        
        if (!/[A-Z]/.test(password)) {
            errors.push('Password must contain at least one uppercase letter');
        }
        
        if (!/[a-z]/.test(password)) {
            errors.push('Password must contain at least one lowercase letter');
        }
        
        if (!/\d/.test(password)) {
            errors.push('Password must contain at least one number');
        }
        
        return {
            isValid: errors.length === 0,
            errors: errors
        };
    }
    
    // Loading state management
    static setLoading(element, isLoading) {
        if (isLoading) {
            element.disabled = true;
            element.innerHTML = '<span class="spinner"></span> Loading...';
        } else {
            element.disabled = false;
            element.innerHTML = element.getAttribute('data-original-text') || 'Submit';
        }
    }
    
    // Form validation helper
    static validateForm(formElement) {
        const inputs = formElement.querySelectorAll('input[required], select[required]');
        let isValid = true;
        
        inputs.forEach(input => {
            const value = input.value.trim();
            const errorElement = input.parentNode.querySelector('.error-message');
            
            // Remove existing error
            if (errorElement) {
                errorElement.remove();
            }
            
            // Check if required field is empty
            if (!value) {
                Utils.showFieldError(input, `${Utils.getFieldLabel(input)} is required`);
                isValid = false;
                return;
            }
            
            // Email validation
            if (input.type === 'email' && !Utils.isValidEmail(value)) {
                Utils.showFieldError(input, 'Please enter a valid email address');
                isValid = false;
                return;
            }
            
            // Password validation
            if (input.type === 'password' && input.name === 'password') {
                const validation = Utils.validatePassword(value);
                if (!validation.isValid) {
                    Utils.showFieldError(input, validation.errors[0]);
                    isValid = false;
                    return;
                }
            }
        });
        
        return isValid;
    }
    
    // Show field-specific error
    static showFieldError(input, message) {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.textContent = message;
        input.parentNode.appendChild(errorElement);
        input.classList.add('error');
    }
    
    // Get field label text
    static getFieldLabel(input) {
        const label = input.parentNode.querySelector('label');
        return label ? label.textContent.trim() : input.name;
    }
    
    // Clear form errors
    static clearFormErrors(formElement) {
        const errorElements = formElement.querySelectorAll('.error-message');
        const errorInputs = formElement.querySelectorAll('.error');
        
        errorElements.forEach(el => el.remove());
        errorInputs.forEach(input => input.classList.remove('error'));
    }
}

// API Service for handling HTTP requests
class APIService {
    static baseURL = '/api'; // Adjust based on your backend
    
    static async request(endpoint, options = {}) {
        const url = `${this.baseURL}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            },
            ...options
        };
        
        try {
            const response = await fetch(url, config);
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }
            
            return data;
        } catch (error) {
            console.error('API Request failed:', error);
            throw error;
        }
    }
    
    static async get(endpoint, headers = {}) {
        return this.request(endpoint, { method: 'GET', headers });
    }
    
    static async post(endpoint, data, headers = {}) {
        return this.request(endpoint, {
            method: 'POST',
            headers,
            body: JSON.stringify(data)
        });
    }
    
    static async put(endpoint, data, headers = {}) {
        return this.request(endpoint, {
            method: 'PUT',
            headers,
            body: JSON.stringify(data)
        });
    }
    
    static async delete(endpoint, headers = {}) {
        return this.request(endpoint, { method: 'DELETE', headers });
    }
}

// Session management
class SessionManager {
    static setToken(token) {
        // Using JavaScript variables instead of localStorage for Claude.ai compatibility
        window.authToken = token;
    }
    
    static getToken() {
        return window.authToken || null;
    }
    
    static removeToken() {
        window.authToken = null;
    }
    
    static setUser(user) {
        window.currentUser = user;
    }
    
    static getUser() {
        return window.currentUser || null;
    }
    
    static isLoggedIn() {
        return !!this.getToken();
    }
    
    static logout() {
        this.removeToken();
        window.currentUser = null;
        window.location.href = 'login.html';
    }
}

// Initialize global utilities
window.Utils = Utils;
window.APIService = APIService;
window.SessionManager = SessionManager;