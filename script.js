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

const registerLink = document.getElementById('registerLink');
registerLink.addEventListener('click', function(e) {
  e.preventDefault();
  const email = window.prompt('Enter your email to start registration.');
  if (email) {
    alert('Registration started for ' + email + '. Follow the next steps to create your account.');
  }
});

document.getElementById('username').focus();

console.log('Login page loaded');

// Skeleton eye-tracking and password look-away behavior
(function() {
  const skeleton = document.getElementById('skeleton');
  const pupilL = document.getElementById('pupilL');
  const pupilR = document.getElementById('pupilR');
  const pwd = document.getElementById('password');
  if (!skeleton || !pupilL || !pupilR || !pwd) return;

  let typingPassword = false;

  function setLookAway(state) {
    typingPassword = !!state;
    if (typingPassword) skeleton.classList.add('look-away');
    else skeleton.classList.remove('look-away');
  }

  function movePupil(pupil, clientX, clientY) {
    const eyeRect = pupil.getBoundingClientRect();
    // center of the eye
    const cx = eyeRect.left + eyeRect.width / 2;
    const cy = eyeRect.top + eyeRect.height / 2;
    let dx = clientX - cx;
    let dy = clientY - cy;
    const max = 8; // max pupil travel
    const dist = Math.sqrt(dx*dx + dy*dy) || 1;
    const scale = Math.min(max / dist, 1);
    dx = dx * scale;
    dy = dy * scale;
    pupil.style.transform = `translate(${dx}px, ${dy}px)`;
  }

  window.addEventListener('mousemove', (e) => {
    if (typingPassword) return;
    movePupil(pupilL, e.clientX, e.clientY);
    movePupil(pupilR, e.clientX, e.clientY);
  }, { passive: true });

  // Start looking away when user begins typing a password
  pwd.addEventListener('input', (e) => {
    const hasText = String(e.target.value || '').length > 0;
    setLookAway(hasText);
    if (!hasText) {
      // restore pupils to neutral
      pupilL.style.transform = '';
      pupilR.style.transform = '';
    }
  });

  // If user focuses and hasn't typed yet, don't look away yet
  pwd.addEventListener('focus', () => setLookAway(pwd.value && pwd.value.length > 0));
  pwd.addEventListener('blur', () => setLookAway(false));
})();
