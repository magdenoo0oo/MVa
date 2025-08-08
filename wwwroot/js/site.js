// Enhanced Site JavaScript with Modern Features
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    // Initialize all components
    initializeAnimations();
    initializeFormEnhancements();
    initializeImageHandling();
    initializeSearchEnhancements();
    initializeTableEnhancements();
    initializeAlerts();
    initializeTooltips();
    initializeConfirmations();
    initializeLoadingStates();
    initializeAccessibility();
}

// Animation System
function initializeAnimations() {
    // Add fade-in animation to cards
    const cards = document.querySelectorAll('.card');
    cards.forEach((card, index) => {
        card.style.animationDelay = `${index * 0.1}s`;
        card.classList.add('fade-in-up');
    });

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('slide-in-right');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.list-group-item, .table tbody tr').forEach(el => {
        observer.observe(el);
    });
}

// Enhanced Form Handling
function initializeFormEnhancements() {
    // Form validation enhancement
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const submitBtn = this.querySelector('button[type="submit"]');
            if (submitBtn && !submitBtn.disabled) {
                // Store original content
                const originalContent = submitBtn.innerHTML;
                submitBtn.dataset.originalContent = originalContent;
                
                // Show loading state
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Processing...';
                
                // Re-enable after timeout (fallback)
                setTimeout(() => {
                    if (submitBtn.disabled) {
                        submitBtn.disabled = false;
                        submitBtn.innerHTML = originalContent;
                    }
                }, 10000);
            }
        });
    });

    // Real-time validation feedback
    const inputs = document.querySelectorAll('.form-control, .form-select');
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });

        input.addEventListener('input', function() {
            if (this.classList.contains('is-invalid')) {
                validateField(this);
            }
        });
    });

    // Enhanced floating labels
    document.querySelectorAll('.form-floating input, .form-floating select').forEach(input => {
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });

        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
        });
    });
}

// Field validation
function validateField(field) {
    const isValid = field.checkValidity();
    field.classList.toggle('is-valid', isValid && field.value.trim() !== '');
    field.classList.toggle('is-invalid', !isValid);
    
    // Custom validation messages
    const feedback = field.parentElement.querySelector('.invalid-feedback');
    if (!isValid && feedback) {
        feedback.textContent = getValidationMessage(field);
    }
}

function getValidationMessage(field) {
    if (field.validity.valueMissing) {
        return `${field.labels[0]?.textContent || 'This field'} is required.`;
    }
    if (field.validity.typeMismatch) {
        return `Please enter a valid ${field.type}.`;
    }
    if (field.validity.patternMismatch) {
        return `Please match the requested format.`;
    }
    if (field.validity.rangeOverflow || field.validity.rangeUnderflow) {
        return `Value must be between ${field.min} and ${field.max}.`;
    }
    return field.validationMessage;
}

// Enhanced Image Handling
function initializeImageHandling() {
    // Image preview for file uploads
    document.querySelectorAll('input[type="file"][accept*="image"]').forEach(input => {
        input.addEventListener('change', function(e) {
            handleImagePreview(e.target);
        });
    });

    // Image lazy loading
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        imageObserver.unobserve(img);
                    }
                }
            });
        });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }
}

function handleImagePreview(input) {
    const file = input.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
        showAlert('Please select a valid image file.', 'warning');
        input.value = '';
        return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
        showAlert('Image size must be less than 5MB.', 'warning');
        input.value = '';
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
        updateImagePreview(input, e.target.result);
    };
    reader.readAsDataURL(file);
}

function updateImagePreview(input, src) {
    const previewContainer = input.closest('.col-md-4, .text-center');
    if (!previewContainer) return;

    let img = previewContainer.querySelector('img');
    const placeholder = previewContainer.querySelector('[id*="placeholder"]');

    if (img) {
        img.src = src;
        img.style.opacity = '0';
        setTimeout(() => {
            img.style.transition = 'opacity 0.3s ease';
            img.style.opacity = '1';
        }, 50);
    } else if (placeholder) {
        placeholder.innerHTML = `<img src="${src}" class="img-thumbnail rounded-circle" style="width: 200px; height: 200px; object-fit: cover; opacity: 0;" />`;
        const newImg = placeholder.querySelector('img');
        setTimeout(() => {
            newImg.style.transition = 'opacity 0.3s ease';
            newImg.style.opacity = '1';
        }, 50);
    }
}

// Enhanced Search Functionality
function initializeSearchEnhancements() {
    let searchTimeout;
    const searchInputs = document.querySelectorAll('input[name="search"], .search-input');
    
    searchInputs.forEach(input => {
        input.addEventListener('input', function() {
            clearTimeout(searchTimeout);
            const searchTerm = this.value.trim();
            
            // Show loading indicator
            showSearchLoading(this, true);
            
            searchTimeout = setTimeout(() => {
                performSearch(this, searchTerm);
            }, 300); // Debounce for 300ms
        });

        // Enhanced search with Enter key
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                clearTimeout(searchTimeout);
                performSearch(this, this.value.trim());
            }
        });
    });
}

function performSearch(input, searchTerm) {
    const form = input.closest('form');
    if (!form) return;

    // For AJAX search
    const searchUrl = form.dataset.searchUrl;
    if (searchUrl) {
        fetch(searchUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'RequestVerificationToken': document.querySelector('input[name="__RequestVerificationToken"]')?.value
            },
            body: `searchString=${encodeURIComponent(searchTerm)}`
        })
        .then(response => response.text())
        .then(html => {
            const container = document.querySelector('#studentsContainer, #departmentsContainer');
            if (container) {
                container.innerHTML = html;
                initializeTableEnhancements(); // Re-initialize for new content
            }
        })
        .catch(error => {
            console.error('Search error:', error);
            showAlert('Search failed. Please try again.', 'danger');
        })
        .finally(() => {
            showSearchLoading(input, false);
        });
    } else {
        // Regular form submission
        if (searchTerm.length >= 2 || searchTerm.length === 0) {
            form.submit();
        }
        showSearchLoading(input, false);
    }
}

function showSearchLoading(input, show) {
    const button = input.parentElement.querySelector('button');
    if (button) {
        if (show) {
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
            button.disabled = true;
        } else {
            button.innerHTML = '<i class="fas fa-search"></i>';
            button.disabled = false;
        }
    }
}

// Enhanced Table Features
function initializeTableEnhancements() {
    // Enhanced row hover effects
    document.querySelectorAll('.table tbody tr').forEach(row => {
        row.addEventListener('mouseenter', function() {
            this.style.transform = 'scale(1.01)';
            this.style.zIndex = '1';
        });

        row.addEventListener('mouseleave', function() {
            this.style.transform = 'scale(1)';
            this.style.zIndex = 'auto';
        });
    });

    // Dynamic badge colors
    document.querySelectorAll('.gpa-badge, .badge').forEach(badge => {
        const text = badge.textContent.toLowerCase();
        if (text.includes('gpa')) {
            const gpa = parseFloat(text.match(/[\d.]+/)?.[0] || '0');
            badge.classList.remove('bg-success', 'bg-warning', 'bg-danger');
            if (gpa >= 3.5) {
                badge.classList.add('bg-success');
            } else if (gpa >= 2.5) {
                badge.classList.add('bg-warning');
            } else {
                badge.classList.add('bg-danger');
            }
        }
    });

    // Table sorting enhancement
    document.querySelectorAll('th[data-sort]').forEach(header => {
        header.style.cursor = 'pointer';
        header.addEventListener('click', function() {
            const sortBy = this.dataset.sort;
            const currentUrl = new URL(window.location);
            currentUrl.searchParams.set('sortOrder', sortBy);
            window.location.href = currentUrl.toString();
        });
    });
}

// Enhanced Alert System
function initializeAlerts() {
    // Auto-hide alerts
    document.querySelectorAll('.alert').forEach(alert => {
        if (!alert.classList.contains('alert-permanent')) {
            setTimeout(() => {
                hideAlert(alert);
            }, 5000);
        }
    });

    // Close button functionality
    document.querySelectorAll('.alert .btn-close').forEach(button => {
        button.addEventListener('click', function() {
            hideAlert(this.closest('.alert'));
        });
    });
}

function hideAlert(alert) {
    alert.style.transition = 'all 0.3s ease';
    alert.style.opacity = '0';
    alert.style.transform = 'translateY(-20px)';
    setTimeout(() => {
        alert.remove();
    }, 300);
}

function showAlert(message, type = 'info', duration = 5000) {
    const alertContainer = document.querySelector('.container') || document.body;
    const alertId = 'alert-' + Date.now();
    
    const alertHTML = `
        <div id="${alertId}" class="alert alert-${type} alert-dismissible fade show" role="alert" style="opacity: 0; transform: translateY(-20px);">
            <i class="fas fa-${getAlertIcon(type)} me-2"></i>
            ${message}
            <button type="button" class="btn-close" aria-label="Close"></button>
        </div>
    `;
    
    alertContainer.insertAdjacentHTML('afterbegin', alertHTML);
    
    const alert = document.getElementById(alertId);
    
    // Animate in
    setTimeout(() => {
        alert.style.transition = 'all 0.3s ease';
        alert.style.opacity = '1';
        alert.style.transform = 'translateY(0)';
    }, 50);
    
    // Auto-hide
    if (duration > 0) {
        setTimeout(() => {
            hideAlert(alert);
        }, duration);
    }
    
    // Close button
    alert.querySelector('.btn-close').addEventListener('click', () => {
        hideAlert(alert);
    });
}

function getAlertIcon(type) {
    const icons = {
        success: 'check-circle',
        danger: 'exclamation-triangle',
        warning: 'exclamation-triangle',
        info: 'info-circle'
    };
    return icons[type] || 'info-circle';
}

// Enhanced Tooltips
function initializeTooltips() {
    // Initialize Bootstrap tooltips if available
    if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
        const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
        tooltipTriggerList.map(function(tooltipTriggerEl) {
            return new bootstrap.Tooltip(tooltipTriggerEl);
        });
    }

    // Custom tooltip system for elements with title attribute
    document.querySelectorAll('[title]').forEach(element => {
        if (!element.hasAttribute('data-bs-toggle')) {
            element.addEventListener('mouseenter', showCustomTooltip);
            element.addEventListener('mouseleave', hideCustomTooltip);
        }
    });
}

function showCustomTooltip(e) {
    const tooltip = document.createElement('div');
    tooltip.className = 'custom-tooltip';
    tooltip.textContent = e.target.title;
    tooltip.style.cssText = `
        position: absolute;
        background: rgba(0, 0, 0, 0.8);
        color: white;
        padding: 0.5rem;
        border-radius: 4px;
        font-size: 0.875rem;
        z-index: 1000;
        pointer-events: none;
        opacity: 0;
        transition: opacity 0.2s ease;
    `;
    
    document.body.appendChild(tooltip);
    
    const rect = e.target.getBoundingClientRect();
    tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
    tooltip.style.top = rect.top - tooltip.offsetHeight - 5 + 'px';
    
    setTimeout(() => tooltip.style.opacity = '1', 50);
    
    e.target.tooltipElement = tooltip;
    e.target.removeAttribute('title');
    e.target.dataset.originalTitle = e.target.title || tooltip.textContent;
}

function hideCustomTooltip(e) {
    if (e.target.tooltipElement) {
        e.target.tooltipElement.remove();
        e.target.tooltipElement = null;
        e.target.title = e.target.dataset.originalTitle || '';
    }
}

// Enhanced Confirmations
function initializeConfirmations() {
    // Delete confirmations
    document.querySelectorAll('a[href*="Delete"], button[data-action="delete"]').forEach(element => {
        element.addEventListener('click', function(e) {
            const itemName = this.dataset.itemName || 'this item';
            if (!confirm(`Are you sure you want to delete ${itemName}? This action cannot be undone.`)) {
                e.preventDefault();
            }
        });
    });

    // Form submission confirmations
    document.querySelectorAll('form[data-confirm]').forEach(form => {
        form.addEventListener('submit', function(e) {
            const message = this.dataset.confirm;
            if (!confirm(message)) {
                e.preventDefault();
            }
        });
    });
}

// Loading States
function initializeLoadingStates() {
    // Global AJAX loading indicator
    let activeRequests = 0;

    // Override fetch to show loading
    const originalFetch = window.fetch;
    window.fetch = function(...args) {
        showGlobalLoading();
        activeRequests++;
        
        return originalFetch.apply(this, args)
            .finally(() => {
                activeRequests--;
                if (activeRequests === 0) {
                    hideGlobalLoading();
                }
            });
    };

    // Form loading states
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', function() {
            showFormLoading(this);
        });
    });
}

function showGlobalLoading() {
    if (!document.querySelector('.global-loading')) {
        const loading = document.createElement('div');
        loading.className = 'global-loading loading-overlay';
        loading.innerHTML = `
            <div class="text-center">
                <div class="spinner-border" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <div class="mt-2">Loading...</div>
            </div>
        `;
        document.body.appendChild(loading);
    }
}

function hideGlobalLoading() {
    const loading = document.querySelector('.global-loading');
    if (loading) {
        loading.style.opacity = '0';
        setTimeout(() => loading.remove(), 300);
    }
}

function showFormLoading(form) {
    const submitBtn = form.querySelector('button[type="submit"]');
    if (submitBtn && !submitBtn.disabled) {
        submitBtn.disabled = true;
        const originalContent = submitBtn.innerHTML;
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Processing...';
        
        // Store original content for restoration
        submitBtn.dataset.originalContent = originalContent;
    }
}

// Accessibility Enhancements
function initializeAccessibility() {
    // Keyboard navigation for custom elements
    document.querySelectorAll('[role="button"]:not(button)').forEach(element => {
        element.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
    });

    // Focus management for modals and dropdowns
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            // Close any open dropdowns or modals
            document.querySelectorAll('.dropdown-menu.show').forEach(menu => {
                menu.classList.remove('show');
            });
        }
    });

    // Announce dynamic content changes to screen readers
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', 'polite');
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    document.body.appendChild(announcer);
    
    window.announceToScreenReader = function(message) {
        announcer.textContent = message;
        setTimeout(() => announcer.textContent = '', 1000);
    };
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// Performance monitoring
function measurePerformance(name, fn) {
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    console.log(`${name} took ${end - start} milliseconds`);
    return result;
}

// Export functions for global use
window.StudentManagement = {
    showAlert,
    hideAlert,
    showGlobalLoading,
    hideGlobalLoading,
    announceToScreenReader: window.announceToScreenReader,
    debounce,
    throttle,
    measurePerformance
};

// Service Worker registration for PWA capabilities
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registration successful');
            })
            .catch(function(err) {
                console.log('ServiceWorker registration failed');
            });
    });
}