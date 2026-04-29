async function login() {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const res = await fetch("https://leave-backend1.onrender.com/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (data.success) {
        // save token
        localStorage.setItem("token", data.token);

        alert("Login successful ✅");
        window.location.href = "admin.html";
    } else {
        alert("Invalid login ❌");
    }
}
