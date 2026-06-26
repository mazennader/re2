// ==============================
// JCR ADMIN LOGIN
// ==============================

const loginForm = document.getElementById("loginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("loginBtn");
const loginMessage = document.getElementById("loginMessage");

// If already logged in, go directly to admin
checkSession();

async function checkSession() {
    const { data } = await supabaseClient.auth.getSession();

    if (data.session) {
        window.location.href = "admin.html";
    }
}

loginForm.addEventListener("submit", async (e) => {

    e.preventDefault();

    loginMessage.textContent = "";
    loginMessage.className = "";

    loginBtn.disabled = true;
    loginBtn.classList.add("loading");

    loginBtn.innerHTML = `
        <i class="fa-solid fa-spinner"></i>
        Signing In...
    `;

    const email = emailInput.value.trim();
    const password = passwordInput.value;

    const { error } = await supabaseClient.auth.signInWithPassword({
        email,
        password
    });

    if (error) {

        loginBtn.disabled = false;
        loginBtn.classList.remove("loading");

        loginBtn.innerHTML = `
            <i class="fa-solid fa-lock"></i>
            Login
        `;

        loginMessage.classList.add("error");
        loginMessage.textContent = error.message;

        return;
    }

    loginMessage.classList.add("success");
    loginMessage.textContent = "Login successful! Redirecting...";

    setTimeout(() => {
        window.location.href = "admin.html";
    }, 700);

});