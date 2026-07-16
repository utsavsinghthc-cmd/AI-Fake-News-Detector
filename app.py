from flask import Flask, render_template, request
import joblib

# Load trained model and vectorizer
model = joblib.load("model.pkl")
vectorizer = joblib.load("vectorizer.pkl")

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("index.html")


@app.route("/predict", methods=["POST"])
def predict():

    news = request.form["news"]

    news_vector = vectorizer.transform([news])

    prediction = model.predict(news_vector)[0]

    # Confidence Score
    score = abs(model.decision_function(news_vector)[0])
    confidence = min(score * 25, 99)
    confidence = round(confidence, 2)

    if prediction == 0:
        result = "❌ FAKE NEWS"

        explanation = """
This article contains characteristics commonly found in fake news.

• Sensational or exaggerated language
• Unverified claims
• Similar writing style to fake news articles

Please verify this news before sharing.
"""

    else:
        result = "✅ REAL NEWS"

        explanation = """
This article follows patterns commonly found in reliable news.

• Neutral language
• Structured reporting
• Similarity with trusted news articles

Always verify information from trusted news organizations.
"""

    return render_template(
        "index.html",
        prediction=result,
        confidence=confidence,
        explanation=explanation,
        news=news,
    )


if __name__ == "__main__":
    app.run(debug=True)