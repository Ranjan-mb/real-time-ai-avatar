
const mouth = document.getElementById("mouth");
const sendBtn = document.getElementById("sendBtn");
const micBtn = document.getElementById("micBtn");


async function getAIResponse(userText) {
  try {
    const response = await fetch("http://localhost:3000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: userText })
    });

    const data = await response.json();

    
    console.log("Frontend received:", data);

    
    if (!data.candidates || !data.candidates[0]) {
      return "Backend responded, but no AI text found.";
    }

    return data.candidates[0].content.parts[0].text;

  } catch (err) {
    console.error("Frontend error:", err);
    return "Frontend could not reach backend.";
  }
}


sendBtn.addEventListener("click", async () => {
  const input = document.getElementById("userInput").value.trim();
  if (!input) return;

  speak("Let me think...");
  const reply = await getAIResponse(input);
  speak(reply);
});


function speak(text) {
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = "en-US";

  let mouthInterval;

  utterance.onstart = () => {
    mouthInterval = setInterval(() => {
      mouth.textContent = mouth.textContent === "—" ? "O" : "—";
    }, 150);
  };

  utterance.onend = () => {
    clearInterval(mouthInterval);
    mouth.textContent = "—";
  };

  speechSynthesis.speak(utterance);
}


if ("webkitSpeechRecognition" in window) {
  const recognition = new webkitSpeechRecognition();
  recognition.lang = "en-US";

  micBtn.addEventListener("click", () => {
    recognition.start();
  });

  recognition.onresult = async (event) => {
    const spokenText = event.results[0][0].transcript;
    speak("Let me think...");
    const reply = await getAIResponse(spokenText);
    speak(reply);
  };
} else {
  micBtn.disabled = true;
  micBtn.innerText = "Mic not supported";
}
