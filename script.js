// ===== LOGIN PAGE LOGIC =====
document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const u = document.getElementById('username').value.trim();
  const p = document.getElementById('password').value;
  if (!u || !p) {
    alert('Please enter username, email, or phone and password');
    return;
  }
  alert('Logged in as ' + u);
  this.reset();
});

const forgotEmailLink = document.getElementById('forgotEmailLink');
const forgotPasswordLink = document.getElementById('forgotPasswordLink');

forgotEmailLink.addEventListener('click', function(e) {
  e.preventDefault();
  const accountInfo = window.prompt('Enter your username, email, or phone number to recover your email.');
  if (accountInfo) {
    alert('If an account matches "' + accountInfo + '", we can help recover the email address associated with it.');
  }
});

forgotPasswordLink.addEventListener('click', function(e) {
  e.preventDefault();
  const accountInfo = window.prompt('Enter your username, email, or phone number to reset your password.');
  if (accountInfo) {
    alert('If an account matches "' + accountInfo + '", password reset instructions will be sent to the associated account.');
  }
});

document.getElementById('username').focus();

// ===== SKELETON EYE-TRACKING SYSTEM =====
(function() {
  const skeleton = document.getElementById('skeleton');
  const pupilL = document.getElementById('pupilL');
  const pupilR = document.getElementById('pupilR');
  const pwd = document.getElementById('password');
  
  if (!skeleton || !pupilL || !pupilR || !pwd) {
    console.warn('Skeleton elements not found');
    return;
  }

  let typingPassword = false;
  let lastMouseX = window.innerWidth / 2;
  let lastMouseY = window.innerHeight / 2;
  let rafId = null;

  function setLookAway(state) {
    typingPassword = !!state;
    if (typingPassword) {
      skeleton.classList.add('look-away');
    } else {
      skeleton.classList.remove('look-away');
    }
  }

  function movePupil(pupil, clientX, clientY) {
    const eyeRect = pupil.getBoundingClientRect();
    const cx = eyeRect.left + eyeRect.width / 2;
    const cy = eyeRect.top + eyeRect.height / 2;
    
    let dx = clientX - cx;
    let dy = clientY - cy;
    const max = 8; // max pupil travel
    const dist = Math.sqrt(dx * dx + dy * dy) || 1;
    const scale = Math.min(max / dist, 1);
    dx *= scale;
    dy *= scale;
    pupil.style.transform = `translate(${dx}px, ${dy}px)`;
  }

  function updatePupils() {
    if (typingPassword) {
      rafId = null;
      return;
    }

    movePupil(pupilL, lastMouseX, lastMouseY);
    movePupil(pupilR, lastMouseX, lastMouseY);
    rafId = null;
  }

  function handlePointerMove(e) {
    lastMouseX = e.clientX;
    lastMouseY = e.clientY;

    if (!rafId) {
      rafId = requestAnimationFrame(updatePupils);
    }
  }

  function resetPupils() {
    pupilL.style.transform = '';
    pupilR.style.transform = '';
  }

  window.addEventListener('pointermove', handlePointerMove, { passive: true });
  window.addEventListener('pointerleave', resetPupils, { passive: true });
  window.addEventListener('pointercancel', resetPupils, { passive: true });
  window.addEventListener('mouseleave', resetPupils);

  // Look away when user starts typing password
  pwd.addEventListener('input', (e) => {
    const hasText = String(e.target.value || '').length > 0;
    setLookAway(hasText);
    
    if (!hasText) {
      // Restore pupils to neutral position when password is cleared
      pupilL.style.transform = '';
      pupilR.style.transform = '';
    }
  });

  // Handle password field focus/blur
  pwd.addEventListener('focus', () => {
    setLookAway(pwd.value && pwd.value.length > 0);
  });
  
  pwd.addEventListener('blur', () => {
    setLookAway(false);
    // Reset pupils when field loses focus and is empty
    if (!pwd.value || pwd.value.length === 0) {
      pupilL.style.transform = '';
      pupilR.style.transform = '';
    }
  });

  console.log('✓ Skeleton eye-tracking system initialized with optimized performance');
})();

// ===== REGISTER PAGE LOGIC =====
const loginPage = document.getElementById('loginPage');
const registerPage = document.getElementById('registerPage');
const registerLink = document.getElementById('registerLink');
const backToLoginLink = document.getElementById('backToLoginLink');

// Store registration data temporarily
let registrationData = {
  email: '',
  phone: '',
  emailOtpCode: '',
  phoneOtpCode: '',
  emailVerified: false,
  phoneVerified: false,
  username: '',
  name: '',
  profilePhoto: null
};

// Store all usernames (simulating database)
let allUsernames = JSON.parse(localStorage.getItem('allUsernames')) || [];

// Toggle between login and register pages
registerLink.addEventListener('click', function(e) {
  e.preventDefault();
  loginPage.style.display = 'none';
  registerPage.style.display = 'flex';
  resetRegisterForm();
});

backToLoginLink.addEventListener('click', function(e) {
  e.preventDefault();
  registerPage.style.display = 'none';
  loginPage.style.display = 'flex';
  resetRegisterForm();
});

// ===== STEP 1: Email & Phone =====
document.getElementById('step1Btn').addEventListener('click', function() {
  const email = document.getElementById('regEmail').value.trim();
  const phone = document.getElementById('regPhone').value.trim();
  
  if (!email || !phone) {
    alert('Please enter both email and phone number');
    return;
  }
  
  if (!validateEmail(email)) {
    alert('Please enter a valid email address');
    return;
  }
  
  if (!validatePhone(phone)) {
    alert('Please enter a valid phone number');
    return;
  }
  
  registrationData.email = email;
  registrationData.phone = phone;
  
  // Generate and store OTP codes
  registrationData.emailOtpCode = generateOTP();
  registrationData.phoneOtpCode = generateOTP();
  
  // Show OTP in console for testing (in real app, sent via email/SMS)
  console.log('Email OTP: ' + registrationData.emailOtpCode);
  console.log('Phone OTP: ' + registrationData.phoneOtpCode);
  alert('OTP codes generated! Check console for testing codes.');
  
  goToStep(2);
});

// ===== STEP 2: Email OTP Verification =====
document.getElementById('emailDisplay').textContent = registrationData.email;

document.getElementById('step2Btn').addEventListener('click', function() {
  const enteredOtp = document.getElementById('emailOtp').value.trim();
  
  if (!enteredOtp || enteredOtp.length !== 6) {
    alert('Please enter a valid 6-digit code');
    return;
  }
  
  if (enteredOtp === registrationData.emailOtpCode) {
    registrationData.emailVerified = true;
    alert('Email verified successfully!');
    goToStep(3);
  } else {
    alert('Incorrect OTP. Please try again.');
    document.getElementById('emailOtp').classList.add('error');
  }
});

document.getElementById('resendEmailBtn').addEventListener('click', function(e) {
  e.preventDefault();
  registrationData.emailOtpCode = generateOTP();
  console.log('New Email OTP: ' + registrationData.emailOtpCode);
  alert('New OTP sent! Check console for testing code.');
});

document.getElementById('backFrom2').addEventListener('click', function() {
  goToStep(1);
});

// ===== STEP 3: Phone OTP Verification =====
document.getElementById('phoneDisplay').textContent = registrationData.phone;

document.getElementById('step3Btn').addEventListener('click', function() {
  const enteredOtp = document.getElementById('phoneOtp').value.trim();
  
  if (!enteredOtp || enteredOtp.length !== 6) {
    alert('Please enter a valid 6-digit code');
    return;
  }
  
  if (enteredOtp === registrationData.phoneOtpCode) {
    registrationData.phoneVerified = true;
    alert('Phone verified successfully!');
    goToStep(4);
  } else {
    alert('Incorrect OTP. Please try again.');
    document.getElementById('phoneOtp').classList.add('error');
  }
});

document.getElementById('resendPhoneBtn').addEventListener('click', function(e) {
  e.preventDefault();
  registrationData.phoneOtpCode = generateOTP();
  console.log('New Phone OTP: ' + registrationData.phoneOtpCode);
  alert('New OTP sent! Check console for testing code.');
});

document.getElementById('backFrom3').addEventListener('click', function() {
  goToStep(2);
});

// ===== STEP 4: Username =====
const usernameInput = document.getElementById('regUsername');
const usernameStatus = document.getElementById('usernameStatus');

usernameInput.addEventListener('input', function() {
  let username = this.value.trim().toLowerCase();
  this.value = username; // Force lowercase
  
  usernameStatus.textContent = '';
  usernameStatus.classList.remove('success', 'error');
  
  if (!username) {
    return;
  }
  
  if (!validateUsername(username)) {
    usernameStatus.textContent = '❌ Username must be 3-20 characters, lowercase, no spaces';
    usernameStatus.classList.add('error');
    return;
  }
  
  if (allUsernames.includes(username)) {
    usernameStatus.textContent = '❌ Username already taken';
    usernameStatus.classList.add('error');
  } else {
    usernameStatus.textContent = '✓ Username available';
    usernameStatus.classList.add('success');
  }
});

document.getElementById('step4Btn').addEventListener('click', function() {
  const username = usernameInput.value.trim().toLowerCase();
  
  if (!username) {
    alert('Please enter a username');
    return;
  }
  
  if (!validateUsername(username)) {
    alert('Username must be 3-20 characters, lowercase, no spaces');
    return;
  }
  
  if (allUsernames.includes(username)) {
    alert('Username already taken. Please choose another.');
    return;
  }
  
  registrationData.username = username;
  goToStep(5);
});

document.getElementById('backFrom4').addEventListener('click', function() {
  goToStep(3);
});

// ===== STEP 5: Full Name =====
document.getElementById('step5Btn').addEventListener('click', function() {
  const name = document.getElementById('regName').value.trim();
  
  if (!name) {
    alert('Please enter your full name');
    return;
  }
  
  registrationData.name = name;
  goToStep(6);
});

document.getElementById('backFrom5').addEventListener('click', function() {
  goToStep(4);
});

// ===== STEP 6: Profile Photo =====
const photoUploadArea = document.getElementById('photoUploadArea');
const profilePhotoInput = document.getElementById('profilePhoto');
const photoPlaceholder = document.getElementById('photoPlaceholder');
const photoPreview = document.getElementById('photoPreview');
const changePhotoBtn = document.getElementById('changePhotoBtn');

photoUploadArea.addEventListener('click', function() {
  profilePhotoInput.click();
});

profilePhotoInput.addEventListener('change', function(e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function(event) {
      registrationData.profilePhoto = event.target.result;
      photoPreview.src = event.target.result;
      photoPlaceholder.style.display = 'none';
      photoPreview.style.display = 'block';
      changePhotoBtn.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }
});

changePhotoBtn.addEventListener('click', function(e) {
  e.preventDefault();
  profilePhotoInput.click();
});

document.getElementById('step6Btn').addEventListener('click', function() {
  // Save user data (in real app, send to backend)
  console.log('Registration Complete:', registrationData);
  
  // Add username to the list
  allUsernames.push(registrationData.username);
  localStorage.setItem('allUsernames', JSON.stringify(allUsernames));
  
  // Save user profile
  const userProfile = {
    email: registrationData.email,
    phone: registrationData.phone,
    username: registrationData.username,
    name: registrationData.name,
    profilePhoto: registrationData.profilePhoto,
    createdAt: new Date().toISOString()
  };
  
  // Store in localStorage (in real app, save to backend database)
  let users = JSON.parse(localStorage.getItem('users')) || [];
  users.push(userProfile);
  localStorage.setItem('users', JSON.stringify(users));
  
  alert('Registration successful! Welcome ' + registrationData.name + '');
  registerPage.style.display = 'none';
  loginPage.style.display = 'flex';
  resetRegisterForm();
});

document.getElementById('backFrom6').addEventListener('click', function() {
  goToStep(5);
});

// ===== HELPER FUNCTIONS =====
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function validateEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

function validatePhone(phone) {
  // Accept various phone formats
  const phoneRegex = /^[\d\s\+\-\(\)]{10,}$/;
  return phoneRegex.test(phone.replace(/\s/g, ''));
}

function validateUsername(username) {
  // 3-20 characters, lowercase, letters/numbers/underscore
  const usernameRegex = /^[a-z0-9_]{3,20}$/;
  return usernameRegex.test(username);
}

function goToStep(stepNumber) {
  // Hide all steps
  document.querySelectorAll('.register-step').forEach(step => {
    step.classList.remove('active');
  });
  
  // Show the target step
  document.getElementById('step' + stepNumber).classList.add('active');
  
  // Update progress bar
  document.getElementById('progressFill').style.width = (stepNumber / 6 * 100) + '%';
  document.getElementById('currentStep').textContent = stepNumber;
  
  // Update email and phone display for steps 2 and 3
  if (stepNumber >= 2) {
    document.getElementById('emailDisplay').textContent = registrationData.email;
  }
  if (stepNumber >= 3) {
    document.getElementById('phoneDisplay').textContent = registrationData.phone;
  }
  
  // Scroll to top of form
  window.scrollTo(0, 0);
}

function resetRegisterForm() {
  registrationData = {
    email: '',
    phone: '',
    emailOtpCode: '',
    phoneOtpCode: '',
    emailVerified: false,
    phoneVerified: false,
    username: '',
    name: '',
    profilePhoto: null
  };
  
  // Clear all form fields
  document.getElementById('regEmail').value = '';
  document.getElementById('regPhone').value = '';
  document.getElementById('emailOtp').value = '';
  document.getElementById('phoneOtp').value = '';
  document.getElementById('regUsername').value = '';
  document.getElementById('regName').value = '';
  document.getElementById('profilePhoto').value = '';
  photoPlaceholder.style.display = 'flex';
  photoPreview.style.display = 'none';
  changePhotoBtn.style.display = 'none';
  usernameStatus.textContent = '';
  usernameStatus.classList.remove('success', 'error');
  
  // Go back to step 1
  goToStep(1);
}

console.log('Talk app loaded');
