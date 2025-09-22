// Student Registration Form JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('studentForm');
    const registrationSlip = document.getElementById('registrationSlip');
    
    // Initialize form event listeners
    initializeForm();
    updateProgress();
    
    // Form submission handler
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            showLoadingState();
            setTimeout(() => {
                generateRegistrationSlip();
                hideLoadingState();
            }, 2000); // Simulate processing time
        }
    });
    
    // Add progress tracking on input change
    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('input', updateProgress);
        input.addEventListener('change', updateProgress);
    });
});

function initializeForm() {
    // Date of birth to age calculation
    const dobInput = document.getElementById('dateOfBirth');
    const ageInput = document.getElementById('age');
    
    dobInput.addEventListener('change', function() {
        const dob = new Date(this.value);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
            age--;
        }
        
        ageInput.value = age;
    });
    
    // Mobile number validation
    const mobileInput = document.getElementById('mobileNo');
    const alternateMobileInput = document.getElementById('alternateNo');
    
    mobileInput.addEventListener('input', function() {
        validateMobileNumber(this);
    });
    
    alternateMobileInput.addEventListener('input', function() {
        if (this.value) {
            validateMobileNumber(this);
        }
    });
    
    // No Aadhaar validation needed anymore
    
    // PAN number validation
    const panInput = document.getElementById('panNo');
    panInput.addEventListener('input', function() {
        if (this.value) {
            validatePANNumber(this);
        }
    });
    
    // Pin code validation
    const pinCodeInput = document.getElementById('pinCode');
    pinCodeInput.addEventListener('input', function() {
        validatePinCode(this);
    });
}

function validateMobileNumber(input) {
    const mobileRegex = /^[6-9]\d{9}$/;
    const value = input.value.replace(/\D/g, ''); // Remove non-digits
    
    input.value = value; // Update input value
    
    if (value.length === 10 && mobileRegex.test(value)) {
        showValidationMessage(input, 'Valid mobile number', 'success');
        return true;
    } else if (value.length === 10) {
        showValidationMessage(input, 'Mobile number should start with 6, 7, 8, or 9', 'error');
        return false;
    } else if (value.length > 0) {
        showValidationMessage(input, 'Mobile number must be 10 digits', 'error');
        return false;
    }
    
    clearValidationMessage(input);
    return false;
}

// Aadhaar validation removed - no longer needed

function validatePANNumber(input) {
    const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
    const value = input.value.toUpperCase();
    
    input.value = value; // Update input value
    
    if (panRegex.test(value)) {
        showValidationMessage(input, 'Valid PAN number', 'success');
        return true;
    } else if (value.length > 0) {
        showValidationMessage(input, 'PAN format: AAAAA9999A', 'error');
        return false;
    }
    
    clearValidationMessage(input);
    return false;
}

function validatePinCode(input) {
    const pinRegex = /^\d{6}$/;
    const value = input.value.replace(/\D/g, ''); // Remove non-digits
    
    input.value = value; // Update input value
    
    if (pinRegex.test(value)) {
        showValidationMessage(input, 'Valid PIN code', 'success');
        return true;
    } else if (value.length > 0) {
        showValidationMessage(input, 'PIN code must be 6 digits', 'error');
        return false;
    }
    
    clearValidationMessage(input);
    return false;
}

// Aadhaar functions removed completely

function showValidationMessage(input, message, type) {
    clearValidationMessage(input);
    
    const messageElement = document.createElement('div');
    messageElement.className = `validation-message ${type}-message`;
    messageElement.textContent = message;
    messageElement.style.fontSize = '0.8em';
    messageElement.style.marginTop = '8px';
    messageElement.style.padding = '8px 12px';
    messageElement.style.borderRadius = '8px';
    messageElement.style.fontWeight = '500';
    messageElement.style.animation = 'slideInDown 0.3s ease-out';
    
    if (type === 'success') {
        messageElement.style.background = '#ecfdf5';
        messageElement.style.color = '#065f46';
        messageElement.style.border = '1px solid #a7f3d0';
        messageElement.innerHTML = '✅ ' + message;
        
        // Add success sound effect (optional)
        playSuccessSound();
    } else {
        messageElement.style.background = '#fef2f2';
        messageElement.style.color = '#991b1b';
        messageElement.style.border = '1px solid #fecaca';
        messageElement.innerHTML = '❌ ' + message;
        
        // Add shake animation to input
        input.style.animation = 'shake 0.5s ease-in-out';
        setTimeout(() => {
            input.style.animation = '';
        }, 500);
    }
    
    input.parentNode.appendChild(messageElement);
    
    // Update progress when validation changes
    setTimeout(updateProgress, 100);
}

// Add CSS animations via JavaScript
if (!document.querySelector('#validation-animations')) {
    const style = document.createElement('style');
    style.id = 'validation-animations';
    style.textContent = `
        @keyframes slideInDown {
            from {
                opacity: 0;
                transform: translateY(-10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
        
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-5px); }
            75% { transform: translateX(5px); }
        }
    `;
    document.head.appendChild(style);
}

function playSuccessSound() {
    // Create a simple success sound using Web Audio API
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0, audioContext.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.1, audioContext.currentTime + 0.01);
        gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.3);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.3);
    } catch (e) {
        // Fallback: no sound if Web Audio API is not supported
    }
}

function clearValidationMessage(input) {
    const existingMessage = input.parentNode.querySelector('.validation-message');
    if (existingMessage) {
        existingMessage.remove();
    }
}

function validateForm() {
    let isValid = true;
    const requiredFields = form.querySelectorAll('[required]');
    
    // Clear previous error messages
    document.querySelectorAll('.error-message').forEach(msg => msg.remove());
    
    // Validate required fields
    requiredFields.forEach(field => {
        if (!field.value.trim()) {
            showFieldError(field, 'This field is required');
            isValid = false;
        }
    });
    
    // Validate mobile number
    const mobileNo = document.getElementById('mobileNo');
    if (mobileNo.value && !validateMobileNumber(mobileNo)) {
        isValid = false;
    }
    
    // Aadhaar validation removed
    
    // Validate PAN number (if provided)
    const panNo = document.getElementById('panNo');
    if (panNo.value && !validatePANNumber(panNo)) {
        isValid = false;
    }
    
    // Validate PIN code
    const pinCode = document.getElementById('pinCode');
    if (pinCode.value && !validatePinCode(pinCode)) {
        isValid = false;
    }
    
    // Validate photo upload
    const photo = document.getElementById('photo');
    if (!photo.files || photo.files.length === 0) {
        showFieldError(photo, 'Please upload a photo');
        isValid = false;
    }
    
    if (!isValid) {
        showGeneralError('Please correct the errors above before submitting.');
    }
    
    return isValid;
}

function showFieldError(field, message) {
    field.style.borderColor = '#e74c3c';
    showValidationMessage(field, message, 'error');
}

function showGeneralError(message) {
    const existingError = document.querySelector('.general-error');
    if (existingError) existingError.remove();
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'general-error error-message';
    errorDiv.textContent = message;
    
    form.insertBefore(errorDiv, form.querySelector('.form-actions'));
}

function generateRegistrationSlip() {
    // Generate unique registration ID
    const regId = 'REG' + Date.now().toString().slice(-8);
    const currentDate = new Date().toLocaleDateString('en-IN');
    
    // Fill registration slip data
    document.getElementById('slipRegId').textContent = regId;
    document.getElementById('slipDate').textContent = currentDate;
    
    // Personal Information
    document.getElementById('slipName').textContent = 
        `${document.getElementById('firstName').value} ${document.getElementById('lastName').value}`;
    document.getElementById('slipFatherName').textContent = document.getElementById('fatherName').value;
    document.getElementById('slipMotherName').textContent = document.getElementById('motherName').value;
    document.getElementById('slipDob').textContent = formatDate(document.getElementById('dateOfBirth').value);
    document.getElementById('slipAge').textContent = document.getElementById('age').value + ' years';
    document.getElementById('slipGender').textContent = document.getElementById('gender').value;
    document.getElementById('slipNationality').textContent = document.getElementById('nationality').value;
    document.getElementById('slipReligion').textContent = document.getElementById('religion').value || 'Not specified';
    document.getElementById('slipCategory').textContent = document.getElementById('category').value || 'Not specified';
    
    // Contact Information
    document.getElementById('slipMobile').textContent = document.getElementById('mobileNo').value;
    document.getElementById('slipEmail').textContent = document.getElementById('email').value;
    
    const address = `${document.getElementById('address').value}, ${document.getElementById('city').value}, ${document.getElementById('district').value}, ${document.getElementById('state').value} - ${document.getElementById('pinCode').value}`;
    document.getElementById('slipAddress').textContent = address;
    
    // Identity Details
    document.getElementById('slipPan').textContent = document.getElementById('panNo').value || 'Not provided';
    document.getElementById('slipIdentity').textContent = document.getElementById('identityNo').value || 'Not provided';
    
    // Educational Details
    document.getElementById('slipCourse').textContent = document.getElementById('course').value;
    document.getElementById('slipBranch').textContent = document.getElementById('branch').value || 'Not specified';
    document.getElementById('slipAcademicYear').textContent = document.getElementById('academicYear').value;
    document.getElementById('slipSemester').textContent = document.getElementById('semester').value ? 
        document.getElementById('semester').value + getSuffix(document.getElementById('semester').value) + ' Semester' : 'Not specified';
    
    // Handle photo upload
    const photoFile = document.getElementById('photo').files[0];
    if (photoFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('slipPhoto').src = e.target.result;
        };
        reader.readAsDataURL(photoFile);
    }
    
    // Handle signature upload
    const signatureFile = document.getElementById('signature').files[0];
    if (signatureFile) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.getElementById('slipSignature').src = e.target.result;
            document.getElementById('slipSignature').style.display = 'block';
        };
        reader.readAsDataURL(signatureFile);
    } else {
        document.getElementById('slipSignature').style.display = 'none';
    }
    
    // Show registration slip and hide form
    document.querySelector('.registration-form').style.display = 'none';
    registrationSlip.style.display = 'block';
    
    // Scroll to slip
    registrationSlip.scrollIntoView({ behavior: 'smooth' });
    
    // Show success message
    showSuccessMessage('Registration completed successfully! Your registration slip is ready.');
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// maskAadhaar function removed - no longer needed

function getSuffix(number) {
    const suffixes = ['th', 'st', 'nd', 'rd'];
    const v = number % 100;
    return suffixes[(v - 20) % 10] || suffixes[v] || suffixes[0];
}

function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'success-message';
    successDiv.textContent = message;
    
    document.querySelector('.container').insertBefore(successDiv, registrationSlip);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        successDiv.remove();
    }, 5000);
}

function downloadSlip() {
    // Hide action buttons for printing/PDF
    const actionButtons = document.querySelector('.slip-actions');
    actionButtons.style.display = 'none';
    
    // Use browser's print functionality to save as PDF
    window.print();
    
    // Show action buttons again after a brief delay
    setTimeout(() => {
        actionButtons.style.display = 'block';
    }, 1000);
}

function printSlip() {
    // Hide action buttons for printing
    const actionButtons = document.querySelector('.slip-actions');
    actionButtons.style.display = 'none';
    
    // Print the slip
    window.print();
    
    // Show action buttons again after a brief delay
    setTimeout(() => {
        actionButtons.style.display = 'block';
    }, 1000);
}

function updateProgress() {
    const form = document.getElementById('studentForm');
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let filledFields = 0;
    
    inputs.forEach(input => {
        if (input.type === 'file') {
            if (input.files && input.files.length > 0) {
                filledFields++;
            }
        } else if (input.value.trim() !== '') {
            filledFields++;
        }
    });
    
    const progressPercentage = (filledFields / inputs.length) * 100;
    const progressFill = document.getElementById('progressFill');
    const progressText = document.getElementById('progressText');
    
    progressFill.style.width = progressPercentage + '%';
    
    if (progressPercentage === 0) {
        progressText.textContent = 'Complete the form to register';
    } else if (progressPercentage < 25) {
        progressText.textContent = 'Getting started... 🚀';
    } else if (progressPercentage < 50) {
        progressText.textContent = 'Making good progress! 📝';
    } else if (progressPercentage < 75) {
        progressText.textContent = 'Almost there! 📋';
    } else if (progressPercentage < 100) {
        progressText.textContent = 'Final steps remaining! ✨';
    } else {
        progressText.textContent = 'Ready to submit! 🎉';
    }
}

function showLoadingState() {
    const submitBtn = document.getElementById('submitBtn');
    const submitText = document.getElementById('submitText');
    const loadingSpinner = document.getElementById('loadingSpinner');
    
    submitBtn.disabled = true;
    submitText.textContent = 'Processing...';
    loadingSpinner.style.display = 'inline-block';
    submitBtn.style.opacity = '0.7';
}

function hideLoadingState() {
    const submitBtn = document.getElementById('submitBtn');
    const submitText = document.getElementById('submitText');
    const loadingSpinner = document.getElementById('loadingSpinner');
    
    submitBtn.disabled = false;
    submitText.textContent = 'Register & Generate Slip';
    loadingSpinner.style.display = 'none';
    submitBtn.style.opacity = '1';
}

function addFloatingAnimation(element) {
    element.classList.add('floating');
}

function addBounceAnimation(element) {
    element.classList.add('bounce-in');
}

function newRegistration() {
    // Reset form
    document.getElementById('studentForm').reset();
    
    // Clear validation messages
    document.querySelectorAll('.validation-message').forEach(msg => msg.remove());
    document.querySelectorAll('.general-error').forEach(msg => msg.remove());
    document.querySelectorAll('.success-message').forEach(msg => msg.remove());
    
    // Reset progress
    updateProgress();
    
    // Show form and hide slip
    document.querySelector('.registration-form').style.display = 'block';
    registrationSlip.style.display = 'none';
    
    // Scroll to top with animation
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    // Re-trigger form animations
    const formSections = document.querySelectorAll('.form-section');
    formSections.forEach((section, index) => {
        section.style.animation = 'none';
        setTimeout(() => {
            section.style.animation = `fadeInLeft 0.6s ease-out forwards`;
            section.style.animationDelay = `${index * 0.1}s`;
        }, 50);
    });
}

// Utility function to restrict input to numbers only
function numbersOnly(input) {
    input.value = input.value.replace(/[^0-9]/g, '');
}

// Add event listeners for number-only fields
document.addEventListener('DOMContentLoaded', function() {
    const numberOnlyFields = ['mobileNo', 'alternateNo', 'pinCode'];
    
    // Handle regular number-only fields
    numberOnlyFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) {
            field.addEventListener('input', function() {
                numbersOnly(this);
            });
        }
    });
    
    // Aadhaar field removed - no special handling needed
    
    // Prevent form submission on Enter key in input fields
    const inputs = document.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        input.addEventListener('keypress', function(e) {
            if (e.key === 'Enter' && this.type !== 'submit') {
                e.preventDefault();
                const nextInput = Array.from(inputs).find(i => 
                    i.tabIndex > this.tabIndex || (this.tabIndex === 0 && i.tabIndex === 0 && 
                    Array.from(inputs).indexOf(i) > Array.from(inputs).indexOf(this))
                );
                if (nextInput) {
                    nextInput.focus();
                }
            }
        });
    });
});

// Add print styles dynamically
const printStyles = `
    @media print {
        .registration-form { display: none !important; }
        .slip-actions { display: none !important; }
        body { background: white !important; }
        .registration-slip { 
            box-shadow: none !important; 
            border: 2px solid #000 !important;
            margin: 0 !important;
        }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = printStyles;
document.head.appendChild(styleSheet);
