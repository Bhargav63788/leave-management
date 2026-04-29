document.addEventListener("DOMContentLoaded", () => {
    const submitBtn = document.getElementById("submitBtn");

    submitBtn.addEventListener("click", async () => {
        const name = document.getElementById("name").value.trim();
        const usn = document.getElementById("usn").value.trim();
        const fromDate = document.getElementById("fromDate").value;
        const toDate = document.getElementById("toDate").value;
        const reason = document.getElementById("reason").value.trim();

        if (!name || !usn || !fromDate || !toDate || !reason) {
            alert("Please fill all fields");
            return;
        }

        if (fromDate > toDate) {
            alert("From Date cannot be after To Date");
            return;
        }

        const data = { name, usn, fromDate, toDate, reason };

        try {
            submitBtn.disabled = true;

            const response = await fetch("https://leave-backend1.onrender.com/submit-leave", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error("Server error");
            }

            const result = await response.text();
            alert(result);

            document.getElementById("name").value = "";
            document.getElementById("usn").value = "";
            document.getElementById("fromDate").value = "";
            document.getElementById("toDate").value = "";
            document.getElementById("reason").value = "";
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to connect to server");
        } finally {
            submitBtn.disabled = false;
        }
    });
});
