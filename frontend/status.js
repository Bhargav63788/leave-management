async function checkStatus() {
    const resultDiv = document.getElementById("result");
    const usn = document.getElementById("usnInput").value.trim();

    resultDiv.innerHTML = "";

    if (!usn) {
        resultDiv.innerHTML = "<p>Please enter your USN.</p>";
        return;
    }

    try {
        const res = await fetch("https://leave-backend1.onrender.com/get-leaves");

        if (!res.ok) {
            throw new Error("Server error");
        }

        const data = await res.json();
        const filtered = data.filter((item) => item.usn === usn);

        if (filtered.length === 0) {
            resultDiv.innerHTML = "<p>No leave request found.</p>";
            return;
        }

        filtered.forEach((item) => {
            const div = document.createElement("div");
            div.className = "card";
            div.innerHTML = `
                <p><b>Name:</b> ${item.name}</p>
                <p><b>From:</b> ${item.fromDate}</p>
                <p><b>To:</b> ${item.toDate}</p>
                <p><b>Status:</b> ${item.status || "Pending"}</p>
            `;
            resultDiv.appendChild(div);
        });
    } catch (error) {
        console.error("Error checking status:", error);
        resultDiv.innerHTML = "<p>Unable to fetch leave status right now.</p>";
    }
}
