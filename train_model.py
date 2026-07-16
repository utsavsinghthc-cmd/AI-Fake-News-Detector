# ==========================================
# AI Fake News Detector
# Step 3 - ML Model Training
# IBM PBEL Virtual Internship
# ==========================================

import pandas as pd
import re
import string
import joblib

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import PassiveAggressiveClassifier
from sklearn.metrics import accuracy_score, classification_report

# ==========================================
# Load Dataset
# ==========================================

fake_news = pd.read_csv("dataset/Fake.csv")
true_news = pd.read_csv("dataset/True.csv")

print("✅ Dataset Loaded Successfully")

# ==========================================
# Add Labels
# ==========================================

fake_news["label"] = 0
true_news["label"] = 1

# ==========================================
# Merge Dataset
# ==========================================

data = pd.concat([fake_news, true_news])

# Shuffle

data = data.sample(frac=1, random_state=42)

# Reset Index

data.reset_index(drop=True, inplace=True)

# ==========================================
# Clean Text
# ==========================================

def clean_text(text):

    text = str(text)

    text = text.lower()

    text = re.sub(r"\[.*?\]", "", text)

    text = re.sub(r"https?://\S+|www\.\S+", "", text)

    text = re.sub(r"<.*?>", "", text)

    text = re.sub(r"[%s]" % re.escape(string.punctuation), "", text)

    text = re.sub(r"\n", " ", text)

    text = re.sub(r"\w*\d\w*", "", text)

    return text

data["text"] = data["text"].apply(clean_text)

print("✅ Text Cleaning Completed")

# ==========================================
# Input and Output
# ==========================================

X = data["text"]

y = data["label"]

# ==========================================
# TF-IDF Vectorizer
# ==========================================

vectorizer = TfidfVectorizer(stop_words="english", max_df=0.7)

X = vectorizer.fit_transform(X)

print("✅ TF-IDF Completed")

# ==========================================
# Train Test Split
# ==========================================

X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.25,
    random_state=42
)

print("✅ Train/Test Split Completed")

# ==========================================
# Train Model
# ==========================================

model = PassiveAggressiveClassifier(max_iter=100)

model.fit(X_train, y_train)

print("✅ Model Training Completed")

# ==========================================
# Prediction
# ==========================================

prediction = model.predict(X_test)

accuracy = accuracy_score(y_test, prediction)

print("\n===============================")
print("MODEL ACCURACY")
print("===============================")

print(f"Accuracy : {accuracy*100:.2f}%")

print("\nClassification Report\n")

print(classification_report(y_test, prediction))

# ==========================================
# Save Model
# ==========================================

joblib.dump(model, "model.pkl")

joblib.dump(vectorizer, "vectorizer.pkl")

print("\n✅ model.pkl Saved")

print("✅ vectorizer.pkl Saved")