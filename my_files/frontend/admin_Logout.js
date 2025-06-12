function logout() {
    localStorage.removeItem('loggedIn');

    // Redirect to the home page
    window.location.href = 'admin_Login.html';
}