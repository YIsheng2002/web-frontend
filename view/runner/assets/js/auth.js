// Authentication handling
class AuthHandler {
    constructor() {
        this.initializeEventListeners();
    }
    
    initializeEventListeners() {
        // Login form
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.addEventListener('submit', this.handleLogin.bind(this));
        }
        
        // Signup form
        const signupForm = document.getElementById('signupForm');
        if (signupForm) {
            signupForm.addEventListener('submit', this.handleSignup.bind(this));
        }
        
        // Password confirmation validation
        const confirmPassword = document.getElementById('confirmPassword');
        if (confirmPassword) {
            confirmPassword.addEventListener('blur', this.validatePasswordMatch.bind(this));
        }
        
        // Real-time email validation
        const emailInputs = document.querySelectorAll('input[type="email"]');
        emailInputs.forEach(input => {
            input.addEventListener('blur', this.validateEmailField.bind(this));
        });
        
        // Remember me functionality
        this.handleRememberMe();
    }
    
    async handleLogin(event) {
        event.preventDefault();
        
        const form = event.target;
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        // Clear previous errors
        Utils.clearFormErrors(form);
        
        // //Validate form
        // if (!Utils.validateForm(form)) {
        //     return;
        // }
        
        const formData = new FormData(form);
        const loginData = {
            email: formData.get('email'),
            password: formData.get('password'),
            remember: formData.get('remember') === 'on'
        };
        
        try {
            // Set loading state
            submitButton.setAttribute('data-original-text', originalText);
            Utils.setLoading(submitButton, true);
            
            // Simulate API call - replace with actual endpoint
            const response = await this.simulateLogin(loginData);
            
            if (response.success) {
                // Store authentication data
                SessionManager.setToken(response.token);
                SessionManager.setUser(response.user);
                
                // Handle remember me
                if (loginData.remember) {
                    this.saveRememberMe(loginData.email);
                }
                
                Utils.showNotification('Login successful! Redirecting...', 'success');
                
                // Redirect to dashboard
                setTimeout(() => {
                    window.location.href = response.redirect || 'dashboard.html';
                }, 1500);
                
            } else {
                throw new Error(response.message || 'Login failed');
            }
            
        } catch (error) {
            Utils.showNotification(error.message, 'error');
        } finally {
            Utils.setLoading(submitButton, false);
            submitButton.textContent = originalText;
        }
    }

    
    async handleSignup(event) {
        event.preventDefault();
        
        const form = event.target;
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.textContent;
        
        // Clear previous errors
        Utils.clearFormErrors(form);
        
        // Validate form
        if (!Utils.validateForm(form)) {
            return;
        }
        
        // Check password match
        if (!this.validatePasswordMatch()) {
            return;
        }
        
        const formData = new FormData(form);
        const signupData = {
            username: formData.get('username'),
            email: formData.get('email'),
            password: formData.get('password'),
            password_confirmation: formData.get('password_confirmation'),
            company: formData.get('runner-type'),
            terms: formData.get('terms') === 'on'
        };
        
        // Check terms acceptance
        if (!signupData.terms) {
            Utils.showNotification('Please accept the Terms & Conditions', 'error');
            return;
        }
        
        try {
            // Set loading state
            submitButton.setAttribute('data-original-text', originalText);
            Utils.setLoading(submitButton, true);
            
            // Simulate API call - replace with actual endpoint
            const response = await this.simulateSignup(signupData);
            
            if (response.success) {
                Utils.showNotification('Account created successfully! Please check your email for verification.', 'success');
                
                // Redirect to login page
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
                
            } else {
                throw new Error(response.message || 'Registration failed');
            }
            
        } catch (error) {
            Utils.showNotification(error.message, 'error');
        } finally {
            Utils.setLoading(submitButton, false);
            submitButton.textContent = originalText;
        }
    }
    
    validatePasswordMatch() {
        const password = document.getElementById('signupPassword');
        const confirmPassword = document.getElementById('confirmPassword');
        
        if (!password || !confirmPassword) return true;
        
        const errorElement = confirmPassword.parentNode.querySelector('.error-message');
        if (errorElement) {
            errorElement.remove();
        }
        
        if (password.value !== confirmPassword.value) {
            Utils.showFieldError(confirmPassword, 'Passwords do not match');
            return false;
        }
        
        confirmPassword.classList.remove('error');
        return true;
    }
    
    validateEmailField(event) {
        const input = event.target;
        const email = input.value.trim();
        
        if (email && !Utils.isValidEmail(email)) {
            Utils.showFieldError(input, 'Please enter a valid email address');
        } else {
            const errorElement = input.parentNode.querySelector('.error-message');
            if (errorElement) {
                errorElement.remove();
            }
            input.classList.remove('error');
        }
    }
    
    handleRememberMe() {
        const rememberedEmail = this.getRememberedEmail();
        if (rememberedEmail) {
            const emailInput = document.getElementById('email');
            const rememberCheckbox = document.querySelector('input[name="remember"]');
            
            if (emailInput) {
                emailInput.value = rememberedEmail;
            }
            if (rememberCheckbox) {
                rememberCheckbox.checked = true;
            }
        }
    }
    
    saveRememberMe(email) {
        window.rememberedEmail = email;
    }
    
    getRememberedEmail() {
        return window.rememberedEmail || null;
    }
    
    // Simulate API calls
    async simulateLogin(loginData) {
        try {
            const response = await fetch('http://127.0.0.1:8000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    email: loginData.email,
                    password: loginData.password
                })
            });

            if (!response.ok) {
                const error = await response.json();
                return {
                    success: false,
                    message: error.message || 'Login failed'
                };
            }

            const data = await response.json();

            console.log('API Response Data:', data);

            // ✅ Check if role is 'runner'
            if (data.user.role !== 'runner') {
                return {
                    success: false,
                    message: 'Access denied: Only runners can log in.'
                };
            }

            // Optional: Save token if needed
            localStorage.setItem('authToken', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            SessionManager.setToken(data.token);
            SessionManager.setUser(data.user);

            return {
                success: true,
                token: data.token,
                user: {
                    id: data.user.id,
                    email: data.user.email,
                    username: data.user.name,
                    role: data.user.role,
                    company: data.user.runner_type  // mapped to runner_type
                },
                redirect: 'dashboard.html'
            };

        } catch (err) {
            return {
                success: false,
                message: 'An error occurred while connecting to the server.'
            };
        }
    }

    
    async simulateSignup(signupData) {
    try {
        const response = await fetch('http://127.0.0.1:8000/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify({
                email: signupData.email,
                password: signupData.password,
                name: signupData.username,
                role: 'runner',
                runner_type: signupData.company  // mapped to runner_type
            })
        });

        const data = await response.json();

        if (!response.ok) {
            return {
                success: false,
                message: data.message || 'Registration failed'
            };
        }

        return {
            success: true,
            message: 'Account created successfully',
            user: {
                id: data.user.id,
                email: data.user.email,
                username: data.user.name,
                company: data.user.runner_type
            }
        };

    } catch (error) {
        return {
            success: false,
            message: 'Network or server error'
        };
    }
}
}

// Forgot password handler
class ForgotPasswordHandler {
    static init() {
        const forgotLinks = document.querySelectorAll('.forgot-link');
        forgotLinks.forEach(link => {
            link.addEventListener('click', this.handleForgotPassword.bind(this));
        });
    }
    
    static handleForgotPassword(event) {
        event.preventDefault();
        
        const email = prompt('Please enter your email address:');
        if (email && Utils.isValidEmail(email)) {
            // Simulate sending reset email
            Utils.showNotification('Password reset instructions sent to your email!', 'success');
        } else if (email) {
            Utils.showNotification('Please enter a valid email address', 'error');
        }
    }
}

// Initialize authentication when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is already logged in and redirect if necessary
    if (SessionManager.isLoggedIn()) {
        const currentPage = window.location.pathname.split('/').pop();
        if (currentPage === 'login.html' || currentPage === 'signup.html') {
            window.location.href = 'dashboard.html';
            return;
        }
    }
    
    // Initialize auth handler
    new AuthHandler();
    
    // Initialize forgot password handler
    ForgotPasswordHandler.init();
    
    // Add some basic styling for notifications and errors
    if (!document.querySelector('#auth-styles')) {
        const styles = document.createElement('style');
        styles.id = 'auth-styles';
        styles.textContent = `
            .notification {
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 15px 20px;
                border-radius: 5px;
                color: white;
                font-weight: 500;
                z-index: 1000;
                max-width: 400px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .notification-success {
                background-color: #10b981;
            }
            
            .notification-error {
                background-color: #ef4444;
            }
            
            .notification-info {
                background-color: #3b82f6;
            }
            
            .notification-close {
                background: none;
                border: none;
                color: white;
                font-size: 18px;
                cursor: pointer;
                margin-left: 10px;
            }
            
            .error-message {
                color: #ef4444;
                font-size: 14px;
                margin-top: 5px;
            }
            
            .form-group input.error,
            .form-group select.error {
                border-color: #ef4444 !important;
                box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.1) !important;
            }
            
            .spinner {
                display: inline-block;
                width: 12px;
                height: 12px;
                border: 2px solid #ffffff;
                border-radius: 50%;
                border-top-color: transparent;
                animation: spin 1s ease-in-out infinite;
            }
            
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        `;
        document.head.appendChild(styles);
    }
});