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

console.log('Login page loaded');
