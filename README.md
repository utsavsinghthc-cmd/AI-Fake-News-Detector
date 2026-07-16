
# 🧠 AI Fake News Detector

<div align="center">

### Premium Fake News Detection using Machine Learning & Flask

![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)
![Flask](https://img.shields.io/badge/Flask-3.x-000000?style=for-the-badge&logo=flask&logoColor=white)
![Scikit-learn](https://img.shields.io/badge/Scikit--learn-ML-F7931E?style=for-the-badge&logo=scikitlearn&logoColor=white)
![IBM PBEL](https://img.shields.io/badge/IBM-PBEL-0F62FE?style=for-the-badge&logo=ibm&logoColor=white)

A Machine Learning based web application that classifies news articles as **REAL** or **FAKE** using **TF-IDF Vectorization** and a **Passive Aggressive Classifier**.

</div>

---

## ✨ Features

- 📰 Fake / Real News Detection
- 📊 Confidence Score
- 🤖 AI-style Explanation
- 🌐 Flask Web Application
- ⚡ Fast Prediction
- 📱 Responsive UI
- 🔗 Fact Check Links
- 📈 Model Accuracy: **99.31%**

---

## 🛠 Tech Stack

- Python
- Flask
- Pandas
- NumPy
- Scikit-learn
- Joblib
- HTML
- CSS
- JavaScript

---

## 📁 Project Structure

```text
AI-Fake-News-Detector/
├── app.py
├── train_model.py
├── requirements.txt
├── README.md
├── model.pkl
├── vectorizer.pkl
├── templates/
│   └── index.html
├── static/
│   ├── style.css
│   ├── script.js
│   └── images/
└── dataset/
```

---

## ⚙️ Installation

```bash
git clone https://github.com/utsavsinghthc-cmd/AI-Fake-News-Detector.git
cd AI-Fake-News-Detector

python -m venv .venv
```

### Windows

```powershell
.venv\Scripts\Activate.ps1
```

### Install Dependencies

```bash
pip install -r requirements.txt
```

### Run

```bash
python app.py
```

Open:

```
http://127.0.0.1:5000
```

---

## 🧠 Machine Learning Pipeline

1. Load Dataset
2. Clean Text
3. TF-IDF Vectorization
4. Train Passive Aggressive Classifier
5. Save `model.pkl` and `vectorizer.pkl`
6. Flask loads the trained model
7. User prediction

---

## 📊 Model Performance

| Metric | Value |
|--------|------:|
| Accuracy | **99.31%** |
| Vectorizer | TF-IDF |
| Classifier | Passive Aggressive Classifier |

---

## 🗂 Dataset

Dataset: **Fake and Real News Dataset**

Place:

```text
dataset/
├── Fake.csv
└── True.csv
```

---

## 🚀 Future Scope

- IBM Granite Integration
- AI-generated Explanations
- News Summarization
- REST API
- Docker Support
- Cloud Deployment
- Database Integration

---

## 🤝 Contributing

Pull Requests are welcome.

1. Fork Repository
2. Create Branch
3. Commit Changes
4. Open Pull Request

---

## 📄 License

MIT License

---

## 👨‍💻 Author

**Utsav Singh**

GitHub:
https://github.com/utsavsinghthc-cmd

Repository:
https://github.com/utsavsinghthc-cmd/AI-Fake-News-Detector

Project:
IBM PBEL Virtual Internship

---

## ⭐ Support

If you like this project, please ⭐ the repository.
