// ===== PROFILE DATA =====
const profileData = {
  name: 'John Doe',
  userId: '#USER123456',
  email: 'john.doe@example.com',
  bio: 'Welcome to my profile! I\'m here to connect and share experiences with friends.',
  profilePicture: 'https://via.placeholder.com/150/0078d4/ffffff?text=User',
  memberSince: 'January 2024',
  friends: []
};

// Sample friend data for suggestions
const suggestedFriendsList = [
  { id: '#FRIEND001', name: 'Alice Johnson', status: 'Online' },
  { id: '#FRIEND002', name: 'Bob Smith', status: 'Offline' },
  { id: '#FRIEND003', name: 'Carol White', status: 'Online' },
  { id: '#FRIEND004', name: 'David Brown', status: 'Online' },
  { id: '#FRIEND005', name: 'Emma Davis', status: 'Away' }
];

// ===== INITIALIZE PROFILE =====
document.addEventListener('DOMContentLoaded', function() {
  loadProfile();
  setupEventListeners();
});

function loadProfile() {
  document.getElementById('userName').textContent = profileData.name;
  document.getElementById('userId').textContent = profileData.userId;
  document.getElementById('userBio').textContent = profileData.bio;
  document.getElementById('userEmail').textContent = profileData.email;
  document.getElementById('memberSince').textContent = profileData.memberSince;
  document.getElementById('profilePicture').src = profileData.profilePicture;
  
  renderFriends();
}

// ===== EVENT LISTENERS SETUP =====
function setupEventListeners() {
  // Edit Name
  document.querySelectorAll('[data-field="name"]').forEach(btn => {
    btn.addEventListener('click', openEditNameModal);
  });
  
  // Edit Bio
  document.querySelectorAll('[data-field="bio"]').forEach(btn => {
    btn.addEventListener('click', openEditBioModal);
  });

  // Modal controls
  document.getElementById('closeNameModal').addEventListener('click', closeEditNameModal);
  document.getElementById('closeBioModal').addEventListener('click', closeEditBioModal);
  document.getElementById('closeAddFriendModal').addEventListener('click', closeAddFriendModal);

  document.getElementById('cancelNameBtn').addEventListener('click', closeEditNameModal);
  document.getElementById('cancelBioBtn').addEventListener('click', closeEditBioModal);
  document.getElementById('cancelAddFriendBtn').addEventListener('click', closeAddFriendModal);

  document.getElementById('saveNameBtn').addEventListener('click', saveName);
  document.getElementById('saveBioBtn').addEventListener('click', saveBio);

  // Add Friend
  document.getElementById('addFriendBtn').addEventListener('click', openAddFriendModal);
  document.getElementById('addFriendSaveBtn').addEventListener('click', addFriend);
  document.getElementById('friendInput').addEventListener('input', suggestFriends);

  // Change Profile Picture
  document.getElementById('editPictureBtn').addEventListener('click', changeProfilePicture);

  // Bio character counter
  document.getElementById('bioInput').addEventListener('input', function() {
    document.getElementById('charCount').textContent = this.value.length;
  });
}

// ===== EDIT NAME MODAL =====
function openEditNameModal() {
  document.getElementById('nameInput').value = profileData.name;
  document.getElementById('editNameModal').classList.add('active');
}

function closeEditNameModal() {
  document.getElementById('editNameModal').classList.remove('active');
}

function saveName() {
  const newName = document.getElementById('nameInput').value.trim();
  if (newName.length === 0) {
    alert('Name cannot be empty');
    return;
  }
  if (newName.length > 50) {
    alert('Name must be 50 characters or less');
    return;
  }
  profileData.name = newName;
  document.getElementById('userName').textContent = profileData.name;
  closeEditNameModal();
  alert('Name updated successfully!');
}

// ===== EDIT BIO MODAL =====
function openEditBioModal() {
  document.getElementById('bioInput').value = profileData.bio;
  document.getElementById('charCount').textContent = profileData.bio.length;
  document.getElementById('editBioModal').classList.add('active');
}

function closeEditBioModal() {
  document.getElementById('editBioModal').classList.remove('active');
}

function saveBio() {
  const newBio = document.getElementById('bioInput').value.trim();
  if (newBio.length > 150) {
    alert('Bio must be 150 characters or less');
    return;
  }
  profileData.bio = newBio;
  document.getElementById('userBio').textContent = profileData.bio;
  closeEditBioModal();
  alert('Bio updated successfully!');
}

// ===== FRIENDS MANAGEMENT =====
function renderFriends() {
  const friendsList = document.getElementById('friendsList');
  const friendCount = document.getElementById('friendCount');

  friendCount.textContent = `(${profileData.friends.length})`;

  if (profileData.friends.length === 0) {
    friendsList.innerHTML = '<p class="empty-state">No friends yet. Start connecting!</p>';
    return;
  }

  friendsList.innerHTML = profileData.friends.map(friend => `
    <div class="friend-card">
      <div class="friend-info">
        <div class="friend-avatar">
          <img src="https://via.placeholder.com/50/0078d4/ffffff?text=${friend.name.charAt(0)}" alt="${friend.name}">
        </div>
        <div class="friend-details">
          <h4>${friend.name}</h4>
          <p class="friend-id">${friend.id}</p>
          <p class="friend-status ${friend.status.toLowerCase()}">${friend.status}</p>
        </div>
      </div>
      <button class="remove-friend-btn" data-id="${friend.id}">Remove</button>
    </div>
  `).join('');

  // Add remove friend event listeners
  document.querySelectorAll('.remove-friend-btn').forEach(btn => {
    btn.addEventListener('click', function() {
      removeFriend(this.getAttribute('data-id'));
    });
  });
}

// ===== ADD FRIEND MODAL =====
function openAddFriendModal() {
  document.getElementById('friendInput').value = '';
  document.getElementById('suggestedFriends').innerHTML = '';
  document.getElementById('addFriendModal').classList.add('active');
}

function closeAddFriendModal() {
  document.getElementById('addFriendModal').classList.remove('active');
}

function suggestFriends() {
  const input = document.getElementById('friendInput').value.trim().toLowerCase();
  const suggestionsContainer = document.getElementById('suggestedFriends');

  if (input.length === 0) {
    suggestionsContainer.innerHTML = '';
    return;
  }

  const suggestions = suggestedFriendsList
    .filter(friend => 
      (friend.name.toLowerCase().includes(input) || friend.id.toLowerCase().includes(input)) &&
      !profileData.friends.some(f => f.id === friend.id)
    )
    .slice(0, 5);

  suggestionsContainer.innerHTML = suggestions.map(friend => `
    <div class="suggestion-item" data-id="${friend.id}" data-name="${friend.name}" data-status="${friend.status}">
      <span>${friend.name} (${friend.id})</span>
    </div>
  `).join('');

  document.querySelectorAll('.suggestion-item').forEach(item => {
    item.addEventListener('click', function() {
      document.getElementById('friendInput').value = this.getAttribute('data-name');
      suggestionsContainer.innerHTML = '';
    });
  });
}

function addFriend() {
  const friendInput = document.getElementById('friendInput').value.trim();
  if (!friendInput) {
    alert('Please enter a friend\'s name or ID');
    return;
  }

  const friend = suggestedFriendsList.find(f =>
    f.name.toLowerCase() === friendInput.toLowerCase() || f.id === friendInput
  );

  if (!friend) {
    alert('Friend not found');
    return;
  }

  if (profileData.friends.some(f => f.id === friend.id)) {
    alert('This person is already your friend!');
    return;
  }

  profileData.friends.push(friend);
  renderFriends();
  closeAddFriendModal();
  alert(`${friend.name} added as a friend!`);
}

function removeFriend(friendId) {
  if (confirm('Are you sure you want to remove this friend?')) {
    profileData.friends = profileData.friends.filter(f => f.id !== friendId);
    renderFriends();
    alert('Friend removed successfully!');
  }
}

// ===== PROFILE PICTURE =====
function changeProfilePicture() {
  const newPictureUrl = prompt('Enter image URL:', profileData.profilePicture);
  if (newPictureUrl) {
    profileData.profilePicture = newPictureUrl;
    document.getElementById('profilePicture').src = profileData.profilePicture;
    alert('Profile picture updated successfully!');
  }
}

// ===== MODAL CLOSE ON ESCAPE KEY =====
document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    closeEditNameModal();
    closeEditBioModal();
    closeAddFriendModal();
  }
});

// ===== MODAL CLOSE ON OUTSIDE CLICK =====
document.querySelectorAll('.modal').forEach(modal => {
  modal.addEventListener('click', function(e) {
    if (e.target === this) {
      this.classList.remove('active');
    }
  });
});
