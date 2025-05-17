let username = "";

window.onload = function () {
    document.getElementById("username").focus(); 

    const savedUser = localStorage.getItem("user");
    if (savedUser) {
        username = savedUser;
        document.getElementById("login-section").classList.add("hidden");
        document.getElementById("dashboard").classList.remove("hidden");
        document.getElementById("displayName").innerText = savedUser;
    }
};

function login() {
    const name = document.getElementById("username").value.trim();
    if (name) {
        username = name;
        localStorage.setItem("user", name);
        fadeOutIn("login-section", "dashboard");
        document.getElementById("displayName").innerText = name;
        alert(`Welcome to Mind This Way, ${name}! 🌿`);        
    }
}

function logout() {
    localStorage.removeItem("user");
    location.reload();
}

function checkMood() {
    document.getElementById("moodPicker").classList.remove("hidden");
}

function viewMoodHistory() {
    const moodList = document.getElementById("moodList");
    moodList.innerHTML = "";
    const key = `moods_${username}`;
    const moods = JSON.parse(localStorage.getItem(key) || "[]");
    
    if (moods.length === 0) {
        moodList.innerHTML = "<li>No mood data yet. Try a check-in!</li>";
        return;
    }     

    moods.forEach(entry => {
        const li = document.createElement("li");
        li.textContent = `🕒 ${entry.date}: 😌 ${entry.mood}`;
        moodList.appendChild(li);
    });

    // Toggle mood history display
    const moodHistory = document.getElementById("moodHistory");
    moodHistory.classList.toggle("hidden");

    // Prepare data for the chart
    const labels = moods.map(m => m.date);
    const data = moods.map(m => moodToScore(m.mood));

    // Draw chart if it's visible
    if (!moodHistory.classList.contains("hidden")) {
        drawMoodChart(labels, data);
    }
}

function openJournal() {
    document.getElementById("journal").classList.toggle("hidden");
    loadJournal();
}

function saveJournal() {
    const entry = document.getElementById("journalEntry").value.trim();
    if (entry) {
        const list = document.getElementById("journalList");
        const p = document.createElement("p");
        const date = new Date().toLocaleString();
        p.innerHTML = `📔 <strong>${date}</strong>: ${entry}`;
        list.appendChild(p);
        document.getElementById("journalEntry").value = "";
    }
}

function loadJournal() {
    // Journal loading disabled (no localStorage used)
}

function openChatbot() {
    const chatbot = document.getElementById("chatbot");
    chatbot.classList.toggle("hidden");
    if (!chatbot.classList.contains("hidden")) {
        document.getElementById("chatOutput").innerHTML = ""; // clear chat on open
    }
}

function chatResponse(feeling) {
    const output = document.getElementById("chatOutput");
    let response = "";
    if (feeling === "stressed") {
        response = "🧘‍♀️ Try taking 3 deep breaths. You're doing your best.";
    } else if (feeling === "anxious") {
        response = "🪴 Let’s ground ourselves. Look around and name 5 things you can see.";
    } else {
        response = "🌟 Glad to hear that. Keep taking care of your mind!";
    }
    const p = document.createElement("p");
    p.textContent = response;
    output.appendChild(p);
    output.scrollTop = output.scrollHeight; // Scroll to latest response
}

// Fade transition helper
function fadeOutIn(hideId, showId) {
    const hide = document.getElementById(hideId);
    const show = document.getElementById(showId);
    hide.style.opacity = 1;
    const fade = setInterval(() => {
        if (hide.style.opacity > 0) {
            hide.style.opacity -= 0.1;
        } else {
            clearInterval(fade);
            hide.classList.add("hidden");
            hide.style.opacity = 1;
            show.classList.remove("hidden");
            show.style.opacity = 0;
            let fadeIn = setInterval(() => {
                if (show.style.opacity < 1) {
                    show.style.opacity = parseFloat(show.style.opacity) + 0.1;
                } else {
                    clearInterval(fadeIn);
                }
            }, 30);
        }
    }, 30);
}

function moodToScore(mood) {
    const moodLower = mood.toLowerCase(); // 👈 Make mood lowercase

    if (moodLower.includes("sad") || moodLower.includes("stressed")) return 1;
    if (moodLower.includes("anxious")) return 2;
    if (moodLower.includes("okay")) return 3;
    if (moodLower.includes("happy") || moodLower.includes("relaxed")) return 4;
    return 2.5; // default average
}

function drawMoodChart(labels, data) {
    const ctx = document.getElementById('moodChart').getContext('2d');

    // If chart already exists, destroy it to redraw
    if (window.moodChartInstance) {
        window.moodChartInstance.destroy();
    }

    window.moodChartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Mood Score Over Time',
                data: data,
                borderColor: '#6a11cb',
                backgroundColor: '#6a11cb44',
                tension: 0.3,
                fill: true,
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: context => `Score: ${context.raw}`
                    }
                }
            },
            scales: {
                y: {
                    min: 1,
                    max: 5,
                    ticks: {
                        stepSize: 1,
                        callback: value => ['😢', '😟', '😐', '😊', '😄'][value - 1]
                    }
                }
            }
        }
    });
}

function submitMood(mood) {
    const key = `moods_${username}`;
    const moods = JSON.parse(localStorage.getItem(key) || "[]");
    moods.push({ mood, date: new Date().toLocaleString() });
    localStorage.setItem(key, JSON.stringify(moods));
    alert(`📝 Mood saved: ${mood}. Keep going!`);
    closeMoodPicker();
}

function closeMoodPicker() {
    document.getElementById("moodPicker").classList.add("hidden");
}

window.addEventListener("DOMContentLoaded", () => {
    const themeToggle = document.getElementById("themeToggle");
    if (themeToggle) {
        themeToggle.addEventListener("click", () => {
            document.body.classList.toggle("dark");
            const isDark = document.body.classList.contains("dark");
            themeToggle.textContent = isDark ? "☀️ Light Mode" : "🌙 Dark Mode";
        });
    }
});

// 🌟 Rotating quote logic
const quotes = [
    "💬 Every day may not be good, but there is something good in every day.",
    "🌼 Take time to make your soul happy.",
    "🌸 Your mental health matters. You matter.",
    "🪴 Be kind to your mind. You’re doing your best.",
    "☀️ Breathe. Believe. Balance.",
    "🌈 There’s beauty in progress, not perfection."
];

let quoteIndex = 0;

function rotateQuote() {
    const quoteEl = document.getElementById("rotatingQuote");
    if (!quoteEl) return;

    quoteIndex = (quoteIndex + 1) % quotes.length;
    quoteEl.classList.remove("fade-in"); // restart animation
    void quoteEl.offsetWidth; // force reflow
    quoteEl.classList.add("fade-in");
    quoteEl.textContent = quotes[quoteIndex];
}

// Rotate every 5 seconds
setInterval(rotateQuote, 5000);
