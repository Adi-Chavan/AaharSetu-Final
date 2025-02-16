import React, { useState } from "react";

export function Recommend() {
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [foodType, setFoodType] = useState("veg");
  const [quantity, setQuantity] = useState(1);
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState("");

  const handleRecommend = async () => {
    if (!latitude || !longitude || !foodType || quantity <= 0) {
      setError("Please fill all fields correctly.");
      return;
    }

    try {
      const response = await fetch("http://127.0.0.1:5001/recommend", {
        method: "POST",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          latitude: Number(latitude),
          longitude: Number(longitude),
          foodType: foodType,
          quantity: Number(quantity),
        }),
      });

      const data = await response.json();
      if (response.ok) {
        if (data.length === 0) {
          setError("No recommendations available.");
        } else {
          setRecommendations(data);
          setError("");
        }
      } else {
        setError(data.error || "Something went wrong.");
      }
    } catch (err) {
      setError("Failed to fetch recommendations. Check backend.");
    }

    console.log("✅ Recommend component is rendering!");
  };

  return (
    <div>
      <h2>Find Nearest Donations</h2>
      <input
        type="number"
        placeholder="Latitude"
        value={latitude}
        onChange={(e) => setLatitude(e.target.value)}
      />
      <input
        type="number"
        placeholder="Longitude"
        value={longitude}
        onChange={(e) => setLongitude(e.target.value)}
      />
      <select value={foodType} onChange={(e) => setFoodType(e.target.value)}>
        <option value="veg">Veg</option>
        <option value="non-veg">Non-Veg</option>
      </select>
      <input
        type="number"
        placeholder="Min Quantity"
        value={quantity}
        onChange={(e) => setQuantity(e.target.value)}
        min="1"
      />
      <button onClick={handleRecommend}>Get Recommendations</button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {recommendations.map((donation, index) => (
          <li key={index}>
            {donation.foodType} - {donation.quantity} (Distance:{" "}
            {donation.distance_km} km)
          </li>
        ))}
      </ul>
    </div>
  );
}
