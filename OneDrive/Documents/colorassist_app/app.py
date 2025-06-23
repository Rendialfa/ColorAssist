from flask import Flask, render_template, request, jsonify
import google.generativeai as genai
from PIL import Image
import io
import base64
import os

app = Flask(__name__)

gemini_api_key = os.getenv("GEMINI_API_KEY")

if not gemini_api_key:
    print("WARNING: GEMINI_API_KEY environment variable not set. Gemini features may not work.")
genai.configure(api_key=gemini_api_key)

model = None
if gemini_api_key:
    try:
        model = genai.GenerativeModel('gemini-pro-vision')
        print("Gemini model initialized successfully.")
    except Exception as e:
        print(f"Error initializing Gemini model: {e}")
        model = None

@app.route('/')
def index():
    # Halaman utama sekarang adalah deskripsi aplikasi
    return render_template('index.html')

@app.route('/color_test')
def color_test():
    return render_template('color_test.html')

@app.route('/advanced_detection')
def advanced_detection():
    # Halaman ini sekarang berisi fitur unggah dan kamera
    return render_template('advanced_detection.html')

@app.route('/color_palette')
def color_palette():
    return render_template('color_palette.html')

# (Sisa kode untuk /upload dan /stream_analysis tetap sama)
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400

    if file and model:
        try:
            image_data = file.read()
            img = Image.open(io.BytesIO(image_data))
            prompt = "Analisislah warna utama yang dominan pada gambar ini, berikan nama warna, kode hex, dan RGB. Jelaskan juga nuansa atau mood yang dihasilkan oleh warna tersebut."
            response = model.generate_content([prompt, img])
            return jsonify({'gemini_analysis': response.text})
        except Exception as e:
            print(f"Error during Gemini analysis for upload: {e}")
            return jsonify({'error': f'Failed to analyze image with Gemini: {str(e)}'}), 500
    elif not model:
        return jsonify({'error': 'Gemini model not initialized. Please check API key.'}), 500
    return jsonify({'error': 'Unknown error'}), 500


@app.route('/stream_analysis', methods=['POST'])
def stream_analysis():
    data = request.json
    if not data or 'image' not in data:
        return jsonify({'error': 'No image data provided'}), 400

    image_data_url = data['image']
    header, encoded_data = image_data_url.split(',', 1)

    if model:
        try:
            binary_data = base64.b64decode(encoded_data)
            img = Image.open(io.BytesIO(binary_data))
            prompt = "Analisislah warna utama yang dominan pada gambar ini, berikan nama warna, kode hex, dan RGB. Jelaskan juga nuansa atau mood yang dihasilkan oleh warna tersebut."
            response = model.generate_content([prompt, img])
            return jsonify({'gemini_analysis': response.text})
        except Exception as e:
            print(f"Error during Gemini analysis for stream: {e}")
            return jsonify({'error': f'Failed to analyze image stream with Gemini: {str(e)}'}), 500
    elif not model:
        return jsonify({'error': 'Gemini model not initialized. Please check API key.'}), 500
    return jsonify({'error': 'Unknown error'}), 500

if __name__ == '__main__':
    # Untuk produksi, ubah debug=False
    app.run(debug=False, host='0.0.0.0') # Pertahankan host='0.0.0.0' jika ingin diakses dari perangkat lain