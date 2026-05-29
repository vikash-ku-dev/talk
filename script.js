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

console.log('Login page loaded');
