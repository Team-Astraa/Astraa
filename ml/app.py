# app.py
from flask import Flask, request, jsonify
import pandas as pd
import numpy as np
from sklearn.ensemble import IsolationForest
from sklearn.cluster import DBSCAN
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'uploads'

# Allowed file extensions
ALLOWED_EXTENSIONS = {'csv', 'xlsx', 'xls', 'jpg', 'png'}

# Helper function to check allowed file types
def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Endpoint for data file upload
@app.route('/upload', methods=['POST'])
def upload_file():
    file = request.files['file']
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        
        # Parse and validate data
        if filename.endswith(('.csv', '.xlsx', '.xls')):
            response = process_data_file(file_path)
        else:
            response = process_image_file(file_path)  # Image processing if required

        return jsonify(response), 200
    else:
        return jsonify({'error': 'Invalid file type'}), 400

# Data Parsing and Validation
def process_data_file(file_path):
    # Load the file
    if file_path.endswith('.csv'):
        data = pd.read_csv(file_path)
    else:
        data = pd.read_excel(file_path)
    
    # Step 1: Data Quality Checks
    issues = data_quality_checks(data)

    # Step 2: Anomaly Detection
    anomalies = anomaly_detection(data)

    return {
        "issues": issues,
        "anomalies": anomalies
    }

# Data Quality Checks
def data_quality_checks(data):
    issues = {}
    
    # Field Completeness Check
    required_fields = ['Date', 'Latitude', 'Longitude', 'Species']
    for field in required_fields:
        if field not in data.columns:
            issues[f'Missing Column: {field}'] = "This column is required."

    # Format Validation and Range Check
    if 'Date' in data.columns:
        try:
            pd.to_datetime(data['Date'], errors='raise')
        except:
            issues['Date'] = "Date format should be YYYY-MM-DD or DD-MM-YYYY."

    if 'Latitude' in data.columns and not data['Latitude'].between(-90, 90).all():
        issues['Latitude'] = "Latitude values must be between -90 and 90."
    
    if 'Longitude' in data.columns and not data['Longitude'].between(-180, 180).all():
        issues['Longitude'] = "Longitude values must be between -180 and 180."
    
    if 'Catch Weight' in data.columns and (data['Catch Weight'] < 0).any():
        issues['Catch Weight'] = "Catch weight must be non-negative."
    
    # Duplicate Detection
    duplicates = data.duplicated(subset=['Date', 'Latitude', 'Longitude', 'Species']).sum()
    if duplicates > 0:
        issues['duplicates'] = f"{duplicates} duplicate records found."

    return issues

# Anomaly Detection using Isolation Forest for numeric anomalies
def anomaly_detection(data):
    anomalies = {}
    
    # Catch Weight Outliers
    if 'Catch Weight' in data.columns:
        isolation_forest = IsolationForest(contamination=0.05)
        data['Outlier'] = isolation_forest.fit_predict(data[['Catch Weight']])
        outlier_indices = data[data['Outlier'] == -1].index.tolist()
        if outlier_indices:
            anomalies['Catch Weight'] = f"Outliers detected in rows: {outlier_indices}"
    
    # Latitude/Longitude Anomalies (using clustering as an example)
    if 'Latitude' in data.columns and 'Longitude' in data.columns:
        clustering = DBSCAN(eps=0.5, min_samples=5).fit(data[['Latitude', 'Longitude']])
        data['Cluster'] = clustering.labels_
        if (data['Cluster'] == -1).any():
            anomalies['Geolocation'] = "Some data points are considered anomalies in spatial clustering."

    return anomalies

# Optional Image Recognition for fish species classification
def process_image_file(file_path):
    from tensorflow.keras.preprocessing import image
    from tensorflow.keras.models import load_model

    model = load_model('fish_species_model.h5')  # Load your pretrained model
    img = image.load_img(file_path, target_size=(224, 224))
    img_array = image.img_to_array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)
    
    # Prediction
    predictions = model.predict(img_array)
    species = "Species A"  # Use the predicted class
    return {"species": species, "file": file_path}

if __name__ == '__main__':
    app.run(debug=True)
