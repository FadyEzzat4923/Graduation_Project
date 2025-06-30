import os
import numpy as np
import librosa
import joblib
from flask import Flask, request, jsonify
from pydub import AudioSegment
from tensorflow.keras.models import load_model  # type: ignore
import random

app = Flask(__name__)

# Paths
MODEL_PATH = r"D:\app\Python\baby_cry_model.h5"
SCALER_PATH = r"D:\app\Python\scaler.pkl"
ENCODER_PATH = r"D:\app\Python\label_encoder.pkl"
UPLOAD_FOLDER = "uploads"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Load resources
model = load_model(MODEL_PATH)
scaler = joblib.load(SCALER_PATH)
encoder = joblib.load(ENCODER_PATH)

prediction_map = {
     "0": [
        "it may be belly bain.The baby seems to have belly pain. Gentle tummy rubs may help.",
        "it may be belly bain.Colic or gas might be causing the pain. Consider bicycle leg movements.",
        "it may be belly bain.Belly pain detected. Holding the baby upright can sometimes ease the pain.",
        "it may be belly bain.Gently rubbing the baby's tummy in circular motions can relieve discomfort.",
        "it may be belly bain.If the baby seems gassy, try moving their legs in a cycling motion.",
        "it may be belly bain.Swallowed air during feeding can lead to belly pain. Burping might help.",
        "it may be belly bain.Crying with clenched fists and drawn-up legs may indicate gas pain.",
        "it may be belly bain.Warm baths can sometimes help relax the baby’s tummy muscles.",
        "it may be belly bain.If colic is suspected, try using white noise or gentle rocking.",
        "it may be belly bain.Keep the baby upright after feeding to reduce the chance of gas build-up."
    ],
    "1": [
        "it may be burbing.The baby might need to burp. Hold them upright and pat their back gently.",
        "it may be burbing.Trapped air could be causing discomfort. Try burping the baby.",
        "it may be burbing.Help the baby release trapped air by burping them gently.",
        "it may be burbing.If the baby is fussy after feeding, they might need to burp.",
        "it may be burbing.Burping can help ease stomach discomfort caused by swallowed air.",
        "it may be burbing.Hold the baby against your shoulder and gently pat their back.",
        "it may be burbing.Some babies need extra time to burp after feeding. Try again gently.",
        "it may be burbing.If the baby pulls their legs up or arches their back, try burping them.",
        "it may be burbing.Air bubbles from feeding might cause fussiness. Burping can help.",
        "it may be burbing.Frequent burping during feeding can prevent discomfort caused by gas."
    ],
    "2": [
        "it may be uncomfortable.The baby feels uncomfortable. Check their diaper or adjust their clothing.",
        "it may be uncomfortable.Something might be causing irritation. Look for tight clothes or dirty diapers.",
        "it may be uncomfortable.The baby might need a diaper change or more comfortable clothing.",
        "it may be uncomfortable.Overheating or feeling too cold could cause discomfort. Check their temperature.",
        "it may be uncomfortable.Ensure the baby’s clothing isn’t too tight or rough on their skin.",
        "it may be uncomfortable.A wet or soiled diaper can make babies uncomfortable. Check and change if needed.",
        "it may be uncomfortable.Sometimes a small irritation like a clothing tag can bother the baby.",
        "it may be uncomfortable.The baby might be overstimulated. Try moving them to a quieter space.",
        "it may be uncomfortable.Repositioning the baby or changing their environment might help ease discomfort.",
        "it may be uncomfortable.Babies are sensitive to their surroundings. Adjust lighting or noise if needed."
    ],
    "3": [
        "it may be hungry.The baby is crying because they are hungry. Consider feeding them.",
        "it may be hungry. It seems the baby needs food. Try offering milk or formula.",
        "it may be hungry. Hunger might be the reason for the crying. Check their feeding schedule.",
        "it may be hungry.The baby could be feeling hungry. Offering a small snack might help.",
        "it may be hungry.Feeding the baby could ease their discomfort if they haven’t eaten recently.",
        "it may be hungry.If it’s been a while since their last meal, hunger could be the cause.",
        "it may be hungry.Babies often cry when they’re hungry. Try giving them some milk or formula.",
        "it may be hungry.The baby’s fussiness might be due to hunger. Check their feeding routine.",
        "it may be hungry.Crying can be a sign of hunger. Try feeding them to see if it helps.",
        "it may be hungry.Sometimes babies cry simply because they need more food. Offer a bottle or breastfeed."
    ],
    "4": [
        "it may be tired.The baby looks tired. Try creating a calm environment for sleep.",
        "it may be tired.It's likely the baby needs rest. Rock them gently or dim the lights.",
        "it may be tired.Overstimulation can make babies fussy. Help them wind down for sleep.",
        "it may be tired.Yawning, rubbing eyes, or fussiness are signs the baby needs sleep.",
        "it may be tired.Creating a quiet, dark space can help the baby fall asleep easier.",
        "it may be tired.Babies sometimes cry when they’re overtired. Try soothing them gently.",
        "it may be tired.Establishing a bedtime routine can help the baby recognize sleep time.",
        "it may be tired.White noise or soft lullabies can help calm a tired baby.",
        "it may be tired.Swaddling the baby might provide a sense of security and help them sleep.",
        "it may be tired.If the baby is overstimulated, moving to a calm environment can help them relax."
    ]
}

# Route: Home
@app.route('/')
def index():
    return '🎧 Baby Cry Prediction API is running! Use POST /predict with an audio file.'


# Helper: Predict audio
def predict_audio(file_path):
    y, sr = librosa.load(file_path, sr=None)

    mfccs = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=30)
    spectral_centroid = librosa.feature.spectral_centroid(y=y, sr=sr).mean()
    spectral_bandwidth = librosa.feature.spectral_bandwidth(y=y, sr=sr).mean()
    spectral_rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr).mean()
    zero_crossing_rate = librosa.feature.zero_crossing_rate(y).mean()
    rms = librosa.feature.rms(y=y).mean()
    chroma_stft = librosa.feature.chroma_stft(y=y, sr=sr).mean()

    mfccs_mean = np.mean(mfccs, axis=1)
    mfccs_std = np.std(mfccs, axis=1)

    features = np.array(list(mfccs_mean) + list(mfccs_std) + [
        spectral_centroid, spectral_bandwidth, spectral_rolloff,
        zero_crossing_rate, rms, chroma_stft]).reshape(1, -1)

    features_scaled = scaler.transform(features)
    features_scaled = features_scaled.reshape((features_scaled.shape[0], features_scaled.shape[1], 1))

    prediction = model.predict(features_scaled)
    predicted_index = np.argmax(prediction)
    response = random.choice(prediction_map[str(predicted_index)])

    return response, str(predicted_index)


# Route: Predict
@app.route('/predict', methods=['POST'])
def predict_route():
    try:
        file = request.files.get('file')

        if not file:
            return jsonify({"error": "No audio file provided."}), 400

        file_ext = os.path.splitext(file.filename)[1].lower()
        temp_path = os.path.join(UPLOAD_FOLDER, file.filename)
        file.save(temp_path)

        supported_formats = ['.wav', '.webm', '.mp4', '.mp3', '.m4a', '.ogg', '.aac', '.flac']
        if file_ext not in supported_formats:
            return jsonify({"error": f"Unsupported file format: {file_ext}"}), 400

        # Convert to WAV if needed
        if file_ext != ".wav":
            try:
                sound = AudioSegment.from_file(temp_path)
                wav_path = temp_path.replace(file_ext, ".wav")
                sound.export(wav_path, format="wav")
                os.remove(temp_path)
                temp_path = wav_path
            except Exception as e:
                return jsonify({"error": f"Conversion error: {str(e)}"}), 500

        prediction_text, prediction_label = predict_audio(temp_path)

        return jsonify({
            "prediction": prediction_text,
            "class": prediction_label
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# Run the app
if __name__ == '__main__':
    app.run(debug=True, port=5000)  