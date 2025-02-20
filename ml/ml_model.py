# from flask import Flask, request, jsonify
# from pymongo import MongoClient
# from flask_cors import CORS, cross_origin
# from sklearn.neighbors import NearestNeighbors
# import numpy as np

# app = Flask(__name__)
# CORS(app)  # ✅ Allow all origins for all routes

# # ✅ MongoDB Connection Debugging
# try:
#     client = MongoClient("mongodb://localhost:27017/")
#     db = client["AaharSetu"]
#     donations_collection = db["donations"]
#     ngos_collection = db["ngos"]
#     print("✅ Connected to MongoDB successfully!")
# except Exception as e:
#     print("❌ MongoDB Connection Failed:", str(e))

# def get_nearest_donations(latitude, longitude, foodType, quantity, n_neighbors=10):
#     try:
#         print("\n🔍 Fetching Donations from MongoDB...")
#         donations = list(donations_collection.find({
#             "foodType": foodType,
#             "quantity": {"$gte": quantity}
#         }))
#         print(f"✅ Donations Found: {len(donations)}")

#         print("\n🔍 Fetching NGOs from MongoDB...")
#         ngos = list(ngos_collection.find())  
#         print(f"✅ NGOs Found: {len(ngos)}")

#         if not donations and not ngos:
#             print("❌ No matching donations or NGOs found!")
#             return []

#         donor_locations = []
#         valid_donations = []

#         # ✅ Process donations
#         for donation in donations:
#             lat, lon = donation.get("latitude"), donation.get("longitude")
#             if lat is not None and lon is not None:
#                 donor_locations.append((lat, lon))
#                 donation["_id"] = str(donation["_id"])
#                 valid_donations.append(donation)

#         # ✅ Process NGOs
#         for ngo in ngos:
#             lat, lon = ngo.get("latitude"), ngo.get("longitude")
#             if lat is not None and lon is not None:
#                 donor_locations.append((lat, lon))
#                 valid_donations.append({"ngo": True, "latitude": lat, "longitude": lon})

#         print(f"📌 Total Valid Locations: {len(donor_locations)}")

#         if not donor_locations:
#             return []

#         # ✅ Convert coordinates to radians for KNN
#         donor_array = np.radians(donor_locations)
#         ngo_point = np.radians([[latitude, longitude]])

#         # ✅ Find nearest neighbors
#         knn = NearestNeighbors(n_neighbors=min(n_neighbors, len(donor_locations)), metric="haversine")
#         knn.fit(donor_array)

#         distances, indices = knn.kneighbors(ngo_point)

#         recommendations = []
#         for i, idx in enumerate(indices[0]):
#             donation = valid_donations[idx]
#             donation["distance_km"] = round(distances[0][i] * 6371, 2)  # Convert to km
#             recommendations.append(donation)

#         print(f"✅ Recommendations Generated: {len(recommendations)}")
#         return sorted(recommendations, key=lambda x: x["distance_km"])

#     except Exception as e:
#         print("❌ Error in get_nearest_donations:", str(e))
#         return {"error": str(e)}

# @app.route("/", methods=["GET"])
# def home():
#     return jsonify({"message": "✅ Flask API is running!"})

# @app.route("/recommend", methods=['POST', 'OPTIONS','GET'])
# @cross_origin()  # ✅ Enable CORS for this route
# def recommend_donations():
#     try:
#         print("\n🔍 Incoming Request:")
#         print("Headers:", request.headers)
#         print("Raw Data:", request.data)

#         if request.method == "GET":
#             return jsonify({"message": "Use POST request to /recommend"}), 400 

#         if request.method == "OPTIONS":  # ✅ Handle preflight requests
#             print("✅ OPTIONS Preflight Request Allowed!")
#             return jsonify({"message": "Preflight request OK"}), 200

#         if not request.is_json:
#             print("❌ Error: Unsupported Media Type!")
#             return jsonify({"error": "Use application/json"}), 415

#         data = request.get_json()
#         print("📌 Received JSON Data:", data)

#         latitude = data.get("latitude")
#         longitude = data.get("longitude")
#         foodType = data.get("foodType")
#         quantity = data.get("quantity")

#         if not all([latitude, longitude, foodType, quantity]):
#             print("❌ Error: Missing required fields!")
#             return jsonify({"error": "Missing required fields"}), 400

#         recommendations = get_nearest_donations(latitude, longitude, foodType, quantity)
#         return jsonify(recommendations)

#     except Exception as e:
#         print("❌ Server Error:", str(e))
#         return jsonify({"error": str(e)}), 500

# if __name__ == "__main__":
#     app.run(debug=True, port=5001)




# from flask import Flask, request, jsonify
# from pymongo import MongoClient
# from flask_cors import CORS
# from sklearn.neighbors import NearestNeighbors
# import numpy as np

# app = Flask(__name__)
# CORS(app)  # Allow frontend requests

# # MongoDB Connection
# client = MongoClient("mongodb://localhost:27017/")
# db = client["AaharSetu"]
# donations_collection = db["donations"]
# ngos_collection = db["ngos"]  # ✅ Include NGO collection

# def get_nearest_donations(latitude, longitude, foodType, quantity, n_neighbors=10):
#     try:
#         # Fetch both donations and NGO requests
#         donations = list(donations_collection.find({
#             "foodType": foodType,
#             "quantity": {"$gte": quantity}
#         }))
#         ngos = list(ngos_collection.find())  # ✅ Fetch NGO data
        
#         if not donations and not ngos:
#             return []

#         donor_locations = []
#         valid_donations = []
        
#         for donation in donations:
#             lat, lon = donation.get("latitude"), donation.get("longitude")
#             if lat is not None and lon is not None:
#                 donation["_id"] = str(donation["_id"])
#                 donor_locations.append((lat, lon))
#                 valid_donations.append(donation)

#         for ngo in ngos:  # ✅ Include NGO locations in the dataset
#             lat, lon = ngo.get("latitude"), ngo.get("longitude")
#             if lat is not None and lon is not None:
#                 donor_locations.append((lat, lon))
#                 valid_donations.append({"ngo": True, "latitude": lat, "longitude": lon})

#         if not donor_locations:
#             return []

#         # Convert coordinates to radians for Haversine distance calculation
#         donor_array = np.radians(donor_locations)
#         ngo_point = np.radians([[latitude, longitude]])

#         # KNN Model for nearest neighbors
#         knn = NearestNeighbors(n_neighbors=min(n_neighbors, len(donor_locations)), metric="haversine")
#         knn.fit(donor_array)

#         distances, indices = knn.kneighbors(ngo_point)

#         recommendations = []
#         for i, idx in enumerate(indices[0]):
#             donation = valid_donations[idx]
#             donation["distance_km"] = round(distances[0][i] * 6371, 2)  # Convert to kilometers
#             recommendations.append(donation)

#         return sorted(recommendations, key=lambda x: x["distance_km"])
    
#     except Exception as e:
#         return {"error": str(e)}
    
# @app.route("/", methods=["GET"])
# def home():
#     return jsonify({"message": "Flask API is running!"})


# @app.route("/recommend", methods=['POST','OPTION'])
# def recommend_donations():
#     try:
#         print("Request Headers:", request.headers)  # ✅ Debugging headers
#         print("Raw Data:", request.data)  # ✅ Debugging raw request body

#         if not request.is_json:  # ✅ Fix: Proper JSON check
#             return jsonify({"error": "Unsupported Media Type: Use application/json"}), 415

#         data = request.get_json()  # ✅ Correct way to get JSON
#         print("Received JSON Data:", data)  # ✅ Debugging received JSON

#         latitude = data.get("latitude")
#         longitude = data.get("longitude")
#         foodType = data.get("foodType")
#         quantity = data.get("quantity")

#         if not all([latitude, longitude, foodType, quantity]):
#             return jsonify({"error": "Missing required fields"}), 400

#         recommendations = get_nearest_donations(latitude, longitude, foodType, quantity)
#         return jsonify(recommendations)

#     except Exception as e:
#         return jsonify({"error": str(e)}), 500


# if __name__ == "__main__":
#     app.run(debug=True, port=5001)





from flask import Flask, request, jsonify
from pymongo import MongoClient
from flask_cors import CORS
from sklearn.neighbors import NearestNeighbors
import numpy as np

app = Flask(__name__)
CORS(app, resources={r"/recommend": {"origins": "*"}})  # Allow frontend requests

# MongoDB Connection
client = MongoClient("mongodb://localhost:27017/")
db = client["AaharSetu"]
donations_collection = db["donations"]

def get_nearest_donations(latitude, longitude, foodType, quantity, n_neighbors=10):
    try:
        # Fetch donations matching food type and minimum quantity
        donations = list(donations_collection.find({
            "foodType": foodType,  
            "quantity": {"$gte": quantity}  
        }))

        if not donations:
            return []

        donor_locations = []
        valid_donations = []
        
        for donation in donations:
            lat, lon = donation.get("latitude"), donation.get("longitude")
            if lat is not None and lon is not None:
                donation["_id"] = str(donation["_id"])  # Convert ObjectId to string
                donor_locations.append((lat, lon))
                valid_donations.append(donation)

        if not donor_locations:
            return []

        # Convert coordinates to radians for Haversine distance calculation
        donor_array = np.radians(donor_locations)
        ngo_point = np.radians([[latitude, longitude]])

        # KNN Model for nearest neighbors
        knn = NearestNeighbors(n_neighbors=min(n_neighbors, len(donor_locations)), metric="haversine")
        knn.fit(donor_array)

        distances, indices = knn.kneighbors(ngo_point)

        recommendations = []
        for i, idx in enumerate(indices[0]):
            donation = valid_donations[idx]
            donation["distance_km"] = round(distances[0][i] * 6371, 2)  # Convert to kilometers
            recommendations.append(donation)

        return sorted(recommendations, key=lambda x: x["distance_km"])
    except Exception as e:
        return {"error": str(e)}

@app.route("/recommend", methods=["POST"])
def recommend_donations():
    try:
        if request.content_type != "application/json":
            return jsonify({"error": "Unsupported Media Type: Use application/json"}), 415
        
        data = request.json
        latitude = data.get("latitude")
        longitude = data.get("longitude")
        foodType = data.get("foodType")  
        quantity = data.get("quantity")

        if not all([latitude, longitude, foodType, quantity]):
            return jsonify({"error": "Missing required fields"}), 400

        recommendations = get_nearest_donations(latitude, longitude, foodType, quantity)
        return jsonify(recommendations)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(debug=True, port=5001)




# # from flask import Flask, request, jsonify
# # from pymongo import MongoClient
# # from flask_cors import CORS
# # from sklearn.neighbors import NearestNeighbors
# # import numpy as np

# # app = Flask(__name__)
# # CORS(app, resources={r"/recommend": {"origins": "*"}})  # Allow requests to /recommend # Allow frontend requests

# # # MongoDB Connection
# # client = MongoClient("mongodb://localhost:27017/")
# # db = client["AaharSetu"]
# # donations_collection = db["donations"]

# # def get_nearest_donations(ngo_lat, ngo_lon, n_neighbors=10):
# #     try:
# #         donations = list(donations_collection.find())

# #         if not donations:
# #             return []

# #         donor_locations = []
# #         valid_donations = []
        
# #         for donation in donations:
# #             lat, lon = donation.get("latitude"), donation.get("longitude")
# #             if lat is not None and lon is not None:
# #                 donation["_id"] = str(donation["_id"])  # Convert ObjectId to string
# #                 donor_locations.append((lat, lon))
# #                 valid_donations.append(donation)

# #         if not donor_locations:
# #             return []

# #         donor_array = np.radians(donor_locations)
# #         ngo_point = np.radians([[ngo_lat, ngo_lon]])

# #         knn = NearestNeighbors(n_neighbors=min(n_neighbors, len(donor_locations)), metric="haversine")
# #         knn.fit(donor_array)

# #         distances, indices = knn.kneighbors(ngo_point)

# #         recommendations = []
# #         for i, idx in enumerate(indices[0]):
# #             donation = valid_donations[idx]
# #             donation["distance_km"] = round(distances[0][i] * 6371, 2)
# #             recommendations.append(donation)

# #         return sorted(recommendations, key=lambda x: x["distance_km"])
# #     except Exception as e:
# #         return {"error": str(e)}

# # @app.route("/recommend", methods=["POST"])
# # def recommend_donations():
# #     try:
# #         if request.content_type != "application/json":
# #             return jsonify({"error": "Unsupported Media Type: Use application/json"}), 415
        
# #         data = request.json
# #         ngo_lat, ngo_lon = data.get("latitude"), data.get("longitude")

# #         if not all([ngo_lat, ngo_lon]):
# #             return jsonify({"error": "Missing required fields"}), 400

# #         recommendations = get_nearest_donations(ngo_lat, ngo_lon)
# #         return jsonify(recommendations)
# #     except Exception as e:
# #         return jsonify({"error": str(e)}), 500

# # if __name__ == "__main__":
# #     app.run(debug=True, port=5001)





# # from flask import Flask, request, jsonify
# # from pymongo import MongoClient
# # from flask_cors import CORS
# # from sklearn.neighbors import NearestNeighbors
# # import numpy as np

# # app = Flask(__name__)
# # CORS(app, resources={r"/*": {"origins": "*"}})  # Allow frontend requests

# # # MongoDB Connection
# # client = MongoClient("mongodb://localhost:27017/")
# # db = client["AaharSetu"]
# # donations_collection = db["donations"]

# # def get_nearest_donations(ngo_lat, ngo_lon, food_type, min_quantity, n_neighbors=10):
# #     try:
# #         donations = list(donations_collection.find({
# #             "foodType": food_type,
# #             "quantity": {"$gte": min_quantity}
# #         }))

# #         if not donations:
# #             return []

# #         donor_locations = []
# #         valid_donations = []
        
# #         for donation in donations:
# #             # donation["_id"] = str(donation["_id"])
# #             lat, lon = donation.get("latitude"), donation.get("longitude")
# #             if lat is not None and lon is not None:
# #                 donor_locations.append((lat, lon))
# #                 valid_donations.append(donation)

# #         if not donor_locations:
# #             return []

# #         donor_array = np.radians(donor_locations)
# #         ngo_point = np.radians([[ngo_lat, ngo_lon]])

# #         knn = NearestNeighbors(n_neighbors=min(n_neighbors, len(donor_locations)), metric="haversine")
# #         knn.fit(donor_array)

# #         distances, indices = knn.kneighbors(ngo_point)

# #         recommendations = []
# #         for i, idx in enumerate(indices[0]):
# #             donation = valid_donations[idx]
# #             donation["distance_km"] = round(distances[0][i] * 6371, 2)
# #             recommendations.append(donation)

# #         return sorted(recommendations, key=lambda x: x["distance_km"])
# #     except Exception as e:
# #         return {"error": str(e)}

# # @app.route("/recommend", methods=["POST"])
# # def recommend_donations():
# #     try:
# #         if request.content_type != "application/json":
# #             return jsonify({"error": "Unsupported Media Type: Use application/json"}), 415
        
# #         data = request.json
# #         ngo_lat, ngo_lon = data.get("latitude"), data.get("longitude")
# #         food_type = data.get("dietaryPreferences")
# #         min_quantity = data.get("storageCapacity")

# #         if not all([ngo_lat, ngo_lon, food_type]):
# #             return jsonify({"error": "Missing required fields"}), 400

# #         recommendations = get_nearest_donations(ngo_lat, ngo_lon, food_type, min_quantity)
# #         return jsonify(recommendations)
# #     except Exception as e:
# #         return jsonify({"error": str(e)}), 500

# # if __name__ == "__main__":
# #     app.run(debug=True, port=5001)




# # # from flask import Flask, request, jsonify
# # # from pymongo import MongoClient
# # # from geopy.distance import geodesic
# # # from geopy.geocoders import Nominatim
# # # from sklearn.neighbors import NearestNeighbors
# # # import numpy as np

# # # app = Flask(__name__)

# # # # Connect to MongoDB
# # # client = MongoClient("mongodb://localhost:27017/")
# # # db = client["AaharSetu"]
# # # donations_collection = db["donations"]

# # # # Geolocator setup
# # # geolocator = Nominatim(user_agent="food_donation")

# # # def get_nearest_donations(ngo_lat, ngo_lon, food_type, min_quantity, n_neighbors=10):
# # #     """
# # #     Find the nearest food donations based on location, food type, and quantity.
# # #     Uses K-Nearest Neighbors (KNN) for efficient lookup.
# # #     """
# # #     # Fetch all donations from MongoDB
# # #     donations = list(donations_collection.find({"food_type": food_type, "quantity": {"$gte": min_quantity}}))

# # #     if not donations:
# # #         return []

# # #     # Extract coordinates for KNN
# # #     donor_locations = [(donation["donor_location"]["lat"], donation["donor_location"]["lon"]) for donation in donations]
    
# # #     # Convert lat/lon to radians for Haversine distance calculation
# # #     donor_array = np.radians(donor_locations)
# # #     ngo_point = np.radians([[ngo_lat, ngo_lon]])

# # #     # Apply KNN model
# # #     knn = NearestNeighbors(n_neighbors=min(n_neighbors, len(donor_locations)), metric="haversine")
# # #     knn.fit(donor_array)

# # #     # Find nearest donors
# # #     distances, indices = knn.kneighbors(ngo_point)

# # #     # Retrieve nearest donations
# # #     recommendations = []
# # #     for i, idx in enumerate(indices[0]):
# # #         donation = donations[idx]
# # #         donation["distance_km"] = round(distances[0][i] * 6371, 2)  # Convert to kilometers
# # #         recommendations.append(donation)

# # #     # Sort by distance (though KNN already sorts, we ensure correct sorting)
# # #     recommendations.sort(key=lambda x: x["distance_km"])

# # #     return recommendations

# # # @app.route("/recommend", methods=["POST"])
# # # def recommend_donations():
# # #     """
# # #     API Endpoint: Accepts NGO location, food type, and min quantity.
# # #     Returns nearest matching donations.
# # #     """
# # #     data = request.json
# # #     ngo_lat, ngo_lon = data.get("ngo_lat"), data.get("ngo_lon")
# # #     food_type = data.get("food_type")
# # #     min_quantity = data.get("min_quantity", 1)

# # #     if not all([ngo_lat, ngo_lon, food_type]):
# # #         return jsonify({"error": "Missing required fields"}), 400

# # #     recommendations = get_nearest_donations(ngo_lat, ngo_lon, food_type, min_quantity)
# # #     return jsonify(recommendations)

# # # if __name__ == "__main__":
# # #     app.run(debug=True)
