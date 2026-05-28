document.getElementById('loginForm').addEventListener('submit', function(e) {
  e.preventDefault();
  const u = document.getElementById('username').value.trim();
  const p = document.getElementById('password').value;
  if (!u || !p) {
    alert('Please enter username and password');
    return;
  }
  alert('Logged in as ' + u);
  this.reset();
});

// Commit 4: add debug log\nconsole.log('Login page loaded');
// Commit 4: add debug log
console.log('Login page loaded');
