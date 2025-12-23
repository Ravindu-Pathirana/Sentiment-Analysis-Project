from flask import Flask, render_template, jsonify, request
from helper import preprocessing, vectorizer, get_prediction

app = Flask(__name__)

reviews = [
    
]

positive = 0
negative = 0

@app.route('/')
def index():
    # Build the template payload for readability
    data = {
        'reviews': reviews,
        'positive': positive,
        'negative': negative,
    }
    return render_template('index.html', data=data)

@app.route("/predict", methods=["POST"])
def predict():
    global positive, negative
    
    data = request.json
    review = data.get("review", "")

    preprocessed_txt = preprocessing(review)
    vectorized_txt = vectorizer(preprocessed_txt)
    result = get_prediction(vectorized_txt)

    if result == 'positive':
        positive += 1
    else:
        negative += 1

    reviews.insert(0, review)

    # Return JSON response with sentiment, confidence, and updated counts
    confidence = 0.85  # Default confidence
    
    return jsonify({
        "sentiment": result,
        "confidence": confidence,
        "positive": positive,
        "negative": negative,
        "reviews": reviews[:10]  # Return last 10 reviews
    })

@app.route('/health')
def health():
    return jsonify(message="Welcome to the Flask App!")


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5050, debug=True)
