from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import pandas as pd
import joblib
import os
import io

app = Flask(__name__)
CORS(app)

# Load the actual model pipeline from a repo-relative path.
try:
    model = joblib.load(open('Model/placement_model.pkl', 'rb'))
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

# Expected features based on the model's pipeline
EXPECTED_FEATURES = [
    'Age', 'CGPA', 'Internships', 'Projects', 'Coding_Skills',
    'Communication_Skills', 'Aptitude_Test_Score', 'Soft_Skills_Rating',
    'Certifications', 'Backlogs', 'Gender', 'Degree', 'Specialization'
]

@app.route('/', methods=['GET'])
def home():
    return jsonify({
        'status': 'success',
        'message': 'Student Placement Prediction API is running successfully!',
        'endpoints': ['/predict (POST)', '/predict_csv (POST)']
    })

@app.route('/predict', methods=['POST'])
def predict_single():
    if model is None:
        return jsonify({'error': 'Model is not loaded.'}), 500
        
    try:
        data = request.json
        df = pd.DataFrame([data])
        
        # Ensure all expected columns are present
        for col in EXPECTED_FEATURES:
            if col not in df.columns:
                df[col] = 'Unknown' if col in ['Gender', 'Degree', 'Specialization'] else 0

        # Reorder to match model expected features
        df = df[EXPECTED_FEATURES]

        prediction = model.predict(df)[0]
        # Check if predict_proba exists
        if hasattr(model, "predict_proba"):
            probability = model.predict_proba(df)[0][1]
        else:
            probability = 1.0 if prediction == 1 else 0.0
            
        return jsonify({
            'placement': int(prediction),
            'probability': float(probability)
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

@app.route('/predict_csv', methods=['POST'])
def predict_csv():
    if model is None:
        return jsonify({'error': 'Model is not loaded.'}), 500
        
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
        
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
        
    try:
        if file.filename.endswith('.csv'):
            df = pd.read_csv(file)
        elif file.filename.endswith(('.xls', '.xlsx')):
            df = pd.read_excel(file)
        else:
            return jsonify({'error': 'Unsupported file format. Please upload CSV or Excel.'}), 400
            
        original_df = df.copy()
        
        # Ensure all expected features exist
        for col in EXPECTED_FEATURES:
            if col not in df.columns:
                df[col] = 'Unknown' if col in ['Gender', 'Degree', 'Specialization'] else 0
                
        df_model = df[EXPECTED_FEATURES]
        
        predictions = model.predict(df_model)
        
        original_df['Prediction'] = predictions
        original_df['Placement_Status'] = original_df['Prediction'].map({1: 'Placed', 0: 'Not Placed'})
        
        placed_count = int((predictions == 1).sum())
        not_placed_count = int((predictions == 0).sum())
        
        output = io.StringIO()
        original_df.to_csv(output, index=False)
        csv_content = output.getvalue()
        
        return jsonify({
            'stats': {
                'placed': placed_count,
                'not_placed': not_placed_count
            },
            'csv_content': csv_content
        })
        
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)
