from flask import Flask, render_template, jsonify, request
from helper import preprocessing, vectorizer, get_prediction
from logger import logging

app = Flask(__name__)

logging.info("Flask server started.")

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

    logging.info('=====Open Home Page=====')

    return render_template('index.html', data=data)

@app.route("/predict", methods=["POST"])
def predict():
    global positive, negative
    
    data = request.json
    review = data.get("review", "")

    logging.info(f'Text received for prediction: {review}')

    preprocessed_txt = preprocessing(review)
    logging.info(f'Preprocessed text: {preprocessed_txt}')

    vectorized_txt = vectorizer(preprocessed_txt)
    logging.info(f'Vectorized text: {vectorized_txt}')

    result = get_prediction(vectorized_txt)
    logging.info(f'Prediction result: {result}')

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
