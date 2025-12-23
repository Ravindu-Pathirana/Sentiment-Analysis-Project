const samples = [
  "Loved the audio quality, bass is crisp.",
  "Battery dies faster than promised.",
  "Comfortable for long flights and calls.",
  "Packaging was damaged when it arrived.",
  "Noise cancelation exceeded expectations.",
];

function randomReview() {
  const reviewText = document.getElementById("reviewText");
  reviewText.value = samples[Math.floor(Math.random() * samples.length)];
  reviewText.focus();
}

async function analyzeSentiment() {
  const review = document.getElementById("reviewText").value;
  const resultBox = document.getElementById("resultBox");
  const sentimentText = document.getElementById("sentimentText");
  const confidenceText = document.getElementById("confidenceText");

  if (review.trim() === "") {
    alert("Please enter a review");
    return;
  }

  resultBox.classList.remove("hide", "alert-success", "alert-danger");
  sentimentText.innerText = "Analyzing...";
  confidenceText.innerText = "";

  try {
    const response = await fetch("http://127.0.0.1:5050/predict", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ review }),
    });

    const data = await response.json();

    /* -------------------------------
       Sentiment Result
    -------------------------------- */
    if (data.sentiment === "positive") {
      resultBox.classList.add("alert-success");
      sentimentText.innerText = "Positive Review 😊";
    } else {
      resultBox.classList.add("alert-danger");
      sentimentText.innerText = "Negative Review 😞";
    }

    confidenceText.innerText = `Confidence: ${(data.confidence * 100).toFixed(
      1
    )}%`;

    /* -------------------------------
       Update Pulse Bars & Counts
    -------------------------------- */
    updateCounts(data.positive, data.negative);

    /* -------------------------------
       Update Recent Reviews
    -------------------------------- */
    updateReviewsList(data.reviews);

    // Clear textarea
    document.getElementById("reviewText").value = "";
  } catch (error) {
    resultBox.classList.add("alert-danger");
    sentimentText.innerText = "Server error!";
    confidenceText.innerText = "";
    console.error(error);
  }
}

/* =====================================
   Update Counts + Pulse Bar Widths
===================================== */
function updateCounts(positive, negative) {
  // Update legend text
  const legendSpans = document.querySelectorAll(".legend span");
  if (legendSpans.length >= 2) {
    legendSpans[0].innerText = `Positive • ${positive}`;
    legendSpans[1].innerText = `Negative • ${negative}`;
  }

  // Calculate percentages
  const total = positive + negative;
  const positivePercent = total > 0 ? (positive / total) * 100 : 0;
  const negativePercent = total > 0 ? (negative / total) * 100 : 0;

  // Update pulse bar widths dynamically
  const positiveBar = document.querySelector(".pulse-bar.positive");
  const negativeBar = document.querySelector(".pulse-bar.negative");

  if (positiveBar) {
    positiveBar.style.width = `${positivePercent}%`;
  }

  if (negativeBar) {
    negativeBar.style.width = `${negativePercent}%`;
  }
}

/* =====================================
   Update Recent Reviews List
===================================== */
function updateReviewsList(reviews) {
  const reviewList = document.querySelector(".review-list");
  if (!reviewList || !Array.isArray(reviews)) return;

  // Clear existing items
  reviewList.innerHTML = "";

  // Add new reviews
  reviews.forEach((review) => {
    const li = document.createElement("li");
    li.innerHTML = `
      <span class="dot"></span>
      <span>${review}</span>
    `;
    reviewList.appendChild(li);
  });
}