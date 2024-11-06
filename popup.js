// document
//   .getElementById("user-input")
//   .addEventListener("keypress", function (e) {
//     if (e.key === "Enter") {
//       const userMessage = document.getElementById("user-input").value;
//       const chatBox = document.getElementById("chat-box");
//       // Display the user message in the chat box
//       chatBox.innerHTML += `<p><strong>You:</strong> ${userMessage}</p>`;
//       // Send the message to the Flask server
//       fetch("http://localhost:5000/chat", {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         body: JSON.stringify({ message: userMessage }),
//       })
//         .then((response) => response.json())
//         .then((data) => {
//           // Display the AI response in the chat box
//           chatBox.innerHTML += `<p><strong>AI:</strong> ${data.response}</p>`;
//           e.target.value = ""; // Clear the input field
//         });
//     }
//   });

// document
//   .getElementById("send")
//   .addEventListener("click", async (e) => {
//     const chatBox = document.getElementById("chat-box");
//     const imageInput = document.getElementById("image-upload");
//     const imageFile = imageInput.files[0];

//     if (!imageFile) {
//       alert("Please select an image.");
//       return;
//     }

//     // Create a URL for the selected image file
//     const imageUrl = URL.createObjectURL(imageFile);

//     // Display the image in the chat box
//     chatBox.innerHTML += `<p><strong>You:</strong></p><img src="${imageUrl}" alt="User Image" style="max-width: 300px; max-height: 300px;">`;

//     const formData = new FormData();
//     formData.append("image", imageFile);

//     const response = await fetch("http://127.0.0.1:5000/image-to-text", {
//       method: "POST",
//       body: formData,
//     });

//     const result = await response.json();
//     const textResponse =
//       result.text || result.error || "Failed to get text from image.";

//     chatBox.innerHTML += `<p><strong>AI:</strong> ${textResponse}</p>`;
//     imageInput.value = "";
//   });




document.getElementById('user-input').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') {
    const userMessage = document.getElementById('user-input').value;
    const chatBox = document.getElementById('chat-box');

    // Display the user message in the chat box
    chatBox.innerHTML += `<p><strong>You:</strong> ${userMessage}</p>`;

    // Show the typing indicator
    chatBox.innerHTML += `<p><span id="typing-indicator">AI is typing...</span></p>`;

    // Send the message to the Flask server
    fetch('http://localhost:5000/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message: userMessage })
    })
    .then(response => response.json())
    .then(data => {
      // Hide the typing indicator
      document.getElementById('typing-indicator').remove();

      // Display the AI response in the chat box
      chatBox.innerHTML += `<p><strong>AI:</strong> ${data.response}</p>`;
      e.target.value = ''; // Clear the input field
    });
  }
});

document.getElementById('send').addEventListener('click', async () => {
  const chatBox = document.getElementById('chat-box');
  const imageInput = document.getElementById('image-upload');
  const imageFile = imageInput.files[0];

  if (!imageFile) {
    alert("Please select an image.");
    return;
  }

  // Create a URL for the selected image file
  const imageUrl = URL.createObjectURL(imageFile);

  // Display the image in the chat box
  chatBox.innerHTML += `<p><strong>You:</strong></p><img src="${imageUrl}" alt="User Image" style="max-width: 300px; max-height: 300px;">`;

  const formData = new FormData();
  formData.append('image', imageFile);

  // Show the typing indicator
  chatBox.innerHTML += `<p><span id="typing-indicator">AI is typing...</span></p>`;

  try {
    const response = await fetch('http://127.0.0.1:5000/image-to-text', {
      method: 'POST',
      body: formData
    });

    const result = await response.json();
    const textResponse = result.text || result.error || "Failed to get text from image.";

    // Hide the typing indicator
    document.getElementById('typing-indicator').remove();

    chatBox.innerHTML += `<p><strong>AI:</strong> ${textResponse}</p>`;
  } catch (error) {
    // Hide the typing indicator in case of error
    document.getElementById('typing-indicator').remove();

    chatBox.innerHTML += `<p><strong>AI:</strong> Failed to process the image.</p>`;
  } finally {
    // Clear the file input
    imageInput.value = '';
  }
});


document.getElementById('generate-image').addEventListener('click', async function (e) {
  // if(e.key==='Enter'){
      
  const chatBox = document.getElementById('chat-box');
  const promptInput = document.getElementById('image-prompt');
  const prompt = promptInput.value;

  if (!prompt) {
    alert("Please enter a prompt for the image.");
    return;
  }

  chatBox.innerHTML += `<p><strong>You:</strong> ${prompt}</p>`;

  // Show the typing indicator
  chatBox.innerHTML += `<p><span id="typing-indicator">AI is typing...</span></p>`;

  try {
    const response = await fetch('http://127.0.0.1:5000/generate-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ prompt: prompt })
    });

    const result = await response.json();
    const imageUrl = result.image_url || result.error || "Failed to generate image.";

    // Hide the typing indicator
    document.getElementById('typing-indicator').remove();

    if (imageUrl.startsWith('data:image/png')) {
      // Display the image in the chat box
      chatBox.innerHTML += `<p><strong>AI:</strong></p><img src="${imageUrl}" alt="Generated Image" style="max-width: 300px; max-height: 300px;">`;
    } else {
      chatBox.innerHTML += `<p><strong>AI:</strong> ${imageUrl}</p>`;
    }
  } catch (error) {
    // Hide the typing indicator in case of error
    document.getElementById('typing-indicator').remove();

    chatBox.innerHTML += `<p><strong>AI:</strong> Failed to generate image.</p>`;
    // e.target.value=''
   
  }
   promptInput.value=''
  // }
});


