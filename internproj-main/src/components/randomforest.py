# model.py

import pandas as pd
import joblib
from sklearn.ensemble import RandomForestClassifier
import os

# File to store/load trained model
MODEL_FILE = "random_forest_model.pkl"

# If model doesn't exist, train and save it using synthetic data
def train_model():
    import numpy as np
    from sklearn.model_selection import train_test_split

    np.random.seed(42)
    n_samples = 1000

    data = pd.DataFrame({
        "Fat_Content": np.random.uniform(3.0, 5.5, n_samples),
        "SNF": np.random.uniform(8.0, 9.5, n_samples),
        "Microbial_Load": np.random.uniform(1000, 500000, n_samples),
        "Processing_Temperature": np.random.uniform(70.0, 95.0, n_samples),
        "pH_Level": np.random.uniform(6.5, 6.9, n_samples),
    })

    data["Adulterants_Detected"] = (
        (data["Microbial_Load"] > 300000) |
        (data["pH_Level"] < 6.6) |
        (data["Fat_Content"] < 3.5)
    ).astype(int)

    X = data.drop("Adulterants_Detected", axis=1)
    y = data["Adulterants_Detected"]

    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X, y)

    joblib.dump(model, MODEL_FILE)
    return model

# Load model (or train if not found)
def load_model():
    if os.path.exists(MODEL_FILE):
        return joblib.load(MODEL_FILE)
    else:
        return train_model()

# Prediction function
def predict_adulteration(fat, snf, microbial_load, temp, ph):
    model = load_model()
    input_df = pd.DataFrame([{
        "Fat_Content": fat,
        "SNF": snf,
        "Microbial_Load": microbial_load,
        "Processing_Temperature": temp,
        "pH_Level": ph,
    }])
    prediction = model.predict(input_df)[0]
    return int(prediction)  # 1 = Adulterants Detected, 0 = Not Detected

# Optional: for quick test
if __name__ == "__main__":
    result = predict_adulteration(4.2, 8.8, 15000, 78.5, 6.7)
    print("Prediction:", "Adulterants Detected" if result else "No Adulterants Detected")
