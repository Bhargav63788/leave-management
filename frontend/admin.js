// check login
const token = localStorage.getItem("token");
const pageSize = 5;
let currentPage = 1;
let allData = [];

if (!token) {
    alert("Please login first!");
    window.location.href = "login.html";
}

function logout() {
    localStorage.removeItem("token");
    window.location.href = "login.html";
}

async function loadData() {
    document.getElementById("loading").style.display = "block";

    try {
        const res = await fetch("https://leave-backend1.onrender.com/get-leaves");
        const data = await res.json();

        // only pending
        allData = data.filter(item => item.status === "Pending");

        showPage();
    } catch (error) {
        console.error("Error loading leave data:", error);
    } finally {
        document.getElementById("loading").style.display = "none";
    }
}

function showPage() {
    const start = (currentPage - 1) * pageSize;
    const pageData = allData.slice(start, start + pageSize);

    renderFiltered(pageData);
}

function renderFiltered(data) {
    const container = document.getElementById("container");
    container.innerHTML = "";

    data.forEach(item => {
        const div = document.createElement("div");
        div.className = "card";

        div.innerHTML = `
            <h3>${item.name}</h3>
            <p>${item.usn}</p>
            <p>${item.fromDate} → ${item.toDate}</p>
            <p>${item.reason}</p>
            <p>Status: ${item.status}</p>

            <button onclick="updateStatus('${item._id}', 'Approved')">Approve</button>
            <button onclick="updateStatus('${item._id}', 'Rejected')">Reject</button>
        `;

        container.appendChild(div);
    });
}

function searchUSN() {
    const value = document.getElementById("searchBox").value.toLowerCase();

    if (!value) {
        showPage();
        return;
    }

    const filtered = allData.filter(item =>
        item.usn.toLowerCase().includes(value)
    );

    renderFiltered(filtered);
}

function nextPage() {
    if ((currentPage * pageSize) < allData.length) {
        currentPage++;
        showPage();
    }
}

function prevPage() {
    if (currentPage > 1) {
        currentPage--;
        showPage();
    }
}

async function updateStatus(id, status) {
    try {
        const scrollY = window.scrollY;
        document.getElementById("loading").style.display = "block";

        await fetch("https://leave-backend1.onrender.com/update-status", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ id, status })
        });

        await loadData();
        window.scrollTo(0, scrollY);
    } catch (error) {
        console.error("Error updating status:", error);
    } finally {
        document.getElementById("loading").style.display = "none";
    }
}

loadData();
