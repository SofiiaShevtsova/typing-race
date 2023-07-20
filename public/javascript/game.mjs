const username = sessionStorage.getItem('username');

if (!username) {
	window.location.replace('/login');
}

const socket = io('http://localhost:3002/all-rooms', { query: { username } });
