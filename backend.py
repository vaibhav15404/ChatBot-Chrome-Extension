from flask import Flask, request, jsonify
import requests
from flask_cors import CORS
import google.generativeai as genai
import httpx
import base64

app = Flask(__name__)
CORS(app)

genai.configure(api_key='AIzaSyCVoiLYgPGEzpirs3WY4seushcRu0YOroA')

model = genai.GenerativeModel(
    model_name="gemini-1.5-flash",
    generation_config={
        "temperature": 1,
        "top_p": 0.95,
        "top_k": 64,
        "max_output_tokens": 8192,
        "response_mime_type": "text/plain",
    }
)

@app.route('/chat', methods=['POST'])
def chat():
    data = request.json
    message = data.get('message', '')
    chat_session = model.start_chat(history=[])
    response = chat_session.send_message(message).text
    return jsonify({"response": response})

@app.route('/image-to-text', methods=['POST'])
def image_to_text():
    image_file = request.files['image']
    api_url = 'https://api.api-ninjas.com/v1/imagetotext'
    with httpx.Client() as client:
        files = {'image': image_file.stream}
        r = client.post(api_url, files=files)
    if r.status_code == 200:
        data = r.json()
        combined_text = " ".join(item['text'] for item in data)
        return jsonify({'text': combined_text})
    else:
        return jsonify({'error': 'Image processing failed'}), 500

@app.route('/generate-image', methods=['POST'])
def generate_image():
    prompt = request.json.get('prompt')
    url = "https://api.freepik.com/v1/ai/text-to-image"
    payload = {
        "prompt": prompt,
        "negative_prompt": "b&w, earth, cartoon, ugly",
        "num_inference_steps": 8,
        "guidance_scale": 2,
        "seed": 42,
        "num_images": 1,
        "image": {"size": "square"},
        "styling": {
            "style": "photo",
            "color": "pastel",
            "lightning": "warm",
            "framing": "portrait"
        }
    }
    headers = {
        "x-freepik-api-key": "FPSX8062fd46f3724d92a1f4562b8acbc846",
        "Content-Type": "application/json",
        "Accept": "application/json"
    }
    response = requests.post(url, json=payload, headers=headers)
    if response.status_code == 200:
        data = response.json()
        b64_encoded_string = data['data'][0]['base64']
        image_url = "data:image/png;base64," + b64_encoded_string
        return jsonify({'image_url': image_url})
    else:
        return jsonify({'error': 'Image generation failed'}), 500

if __name__ == '__main__':
    app.run(debug=True)
