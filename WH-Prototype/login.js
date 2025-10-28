document.getElementById("google-login-btn").addEventListener("click", () => {
    const params = new URLSearchParams(window.location.search);
    const redirectURL = params.get('redirect_url');

    if (redirectURL != null) {
        sessionStorage.setItem("WORLDHUB_ID_POST_LOGIN_REDIRECT", redirectURL);
    }
    window.location.href = "https://id.worldhub.me:35525/authenticateuser?account_type=google";
});