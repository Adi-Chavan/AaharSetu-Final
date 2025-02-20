// import React, { useState, useEffect } from 'react';
// import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
// import 'leaflet/dist/leaflet.css';
// import L from 'leaflet';
// import { motion } from 'framer-motion';
// import { Button } from '@/components/ui/button';
// import { useStore } from '@/lib/store';
// import { useNavigate } from 'react-router-dom';
// import { Camera } from 'lucide-react';

// const markerIcon = new L.Icon({
//   iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
//   iconSize: [25, 41],
//   iconAnchor: [12, 41],
// });


// export function DonateForm() {
//   const navigate = useNavigate();
//   const addDonation = useStore((state) => state.addDonation);
//   const [formData, setFormData] = useState({
//     title: '',
//     description: '',
//     quantity: 1,
//     expiryDate: '',
//     pickupAddress: '',
//     pickupTime: '',
//     photo: '',
//     donorID: 1,
//     donorName: '',
//     donorPhone: '',
//     latitude: null,
//     longitude: null,
//     foodType: 'veg',
//   });

//   function LocationMarker() {
//     useMapEvents({
//       click(e) {
//         const { lat, lng } = e.latlng;
//         setFormData((prev) => ({ ...prev, latitude: lat, longitude: lng }));

//         fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
//           .then((res) => res.json())
//           .then((data) => {
//             if (data.display_name) {
//               setFormData((prev) => ({ ...prev, pickupAddress: data.display_name }));
//             }
//           })
//           .catch((err) => console.error('Error fetching address:', err));
//       },
//     });

//     return formData.latitude && formData.longitude ? (
//       <Marker position={[formData.latitude, formData.longitude]} icon={markerIcon} />
//     ) : null;
//   }

//   const handlePhotoChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setFormData((prev) => ({ ...prev, photo: reader.result }));
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!formData.title || !formData.description || !formData.quantity ||
//         !formData.pickupAddress || !formData.pickupTime ||
//         !formData.donorName || !formData.donorPhone ||
//         formData.latitude === null || formData.longitude === null) {
//       alert('Please fill in all required fields and select a pickup location on the map.');
//       return;
//     }

//     // try {
//     //   const response = await fetch('http://localhost:5000/donations/add', {
//     //     method: 'POST',
//     //     headers: { 'Content-Type': 'application/json' },
//     //     body: JSON.stringify(formData),
//     //   });

//     //   const data = await response.json();
//     //   if (response.ok) {
//     //     addDonation(formData);
//     //     alert(data.message);
//     //     navigate('/donor');
//     //   } else {
//     //     alert('Error: ' + data.error);
//     //   }
//     // } catch (error) {
//     //   console.error('Error submitting donation:', error);
//     //   alert('There was an error submitting your donation. Please try again.');
//     // }


//     try {
//       // Add the donation to the store
//       addDonation({
//         donorID: formData.donorID,
//         title: formData.title,
//         description: formData.description,
//         quantity: Number(formData.quantity),
//         expiryDate: formData.expiryDate,
//         pickupAddress: formData.pickupAddress,
//         pickupTime: formData.pickupTime,
//         photo: formData.photo,
//         donorName: formData.donorName,
//         donorPhone: formData.donorPhone
//       });

//       // Navigate to the donor dashboard
//       navigate('/donor');
//     } catch (error) {
//       console.error('Error submitting donation:', error);
//       alert('There was an error submitting your donation. Please try again.');
//     }



//   };

//   return (
//     <div className="min-h-screen pt-20 px-4">
//       <div className="max-w-2xl mx-auto">
//         <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}  className="glass-card p-6 rounded-2xl relative">
//         <div className='gradient'/>
//           <h1 className="text-2xl font-bold mb-6">List Food Donation</h1>
//           <form onSubmit={handleSubmit} className="space-y-6">
//             <div>
//               <label className="block text-sm font-medium mb-1">Title*</label>
//               <input
//                 type="text"
//                 required
//                 className="w-full px-3 py-2 rounded-lg border bg-white/50"
//                 value={formData.title}
//                 onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
//                 placeholder="e.g., Fresh Vegetables from Restaurant"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">Description*</label>
//               <textarea
//                 required
//                 className="w-full px-3 py-2 rounded-lg border bg-white/50 h-24"
//                 value={formData.description}
//                 onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
//                 placeholder="Describe the food items, quantity, and any special handling requirements..."
//               />
//             </div>
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                <div>
//                  <label className="block text-sm font-medium mb-1">Quantity (servings)</label>
//                  <input
//                   type="number"
//                   required
//                   min="1"
//                   className="w-full px-3 py-2 rounded-lg border bg-white/50"
//                   value={formData.quantity}
//                   onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
//                 />
//               </div>
//             <div>
//               <label className="block text-sm font-medium mb-1">Food Type*</label>
//               <select
//                 className="w-full px-3 py-2 rounded-lg border bg-white/50"
//                 value={formData.foodType}
//                 onChange={(e) => setFormData((prev) => ({ ...prev, foodType: e.target.value }))}
//               >
//                 <option value="veg">Veg</option>
//                 <option value="non-veg">Non-Veg</option>
//               </select>
//             </div>

//               <div>
//                 <label className="block text-sm font-medium mb-1">Expiry Date</label>
//                 <input
//                   type="datetime-local"
//                   required
//                   className="w-full px-3 py-2 rounded-lg border bg-white/50"
//                   value={formData.expiryDate}
//                   onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
//                 />
//               </div>
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">Pickup Address*</label>
//               <input
//                 type="text"
//                 required
//                 className="w-full px-3 py-2 rounded-lg border bg-white/50"
//                 value={formData.pickupAddress}
//                 onChange={(e) => setFormData((prev) => ({ ...prev, pickupAddress: e.target.value }))}
//                 placeholder="Select location on the map or enter manually"
//               />
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">Select Pickup Location</label>
//               <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: '300px', width: '100%' }}>
//                 <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
//                 <LocationMarker />
//               </MapContainer>
//             </div>

//             <div>
//               <label className="block text-sm font-medium mb-1">Pickup Time*</label>
//               <input
//                 type="time"
//                 required
//                 className="w-full px-3 py-2 rounded-lg border bg-white/50"
//                 value={formData.pickupTime}
//                 onChange={(e) => setFormData((prev) => ({ ...prev, pickupTime: e.target.value }))}
//               />
//             </div>
//             <div>
//                <label className="block text-sm font-medium mb-1">Photo</label>
//                <div className="mt-1 flex items-center">
//                  {formData.photo ? (
//                   <div className="relative w-32 h-32">
//                     <img
//                       src={formData.photo}
//                       alt="Food preview"
//                       className="w-full h-full object-cover rounded-lg"
//                     />
//                     <button
//                       type="button"
//                       onClick={() => setFormData(prev => ({ ...prev, photo: '' }))}
//                       className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1"
//                     >
//                       ×
//                     </button>
//                   </div>
//                 ) : (
//                   <label className="w-32 h-32 flex flex-col items-center justify-center border-2 border-dashed rounded-lg hover:bg-neutral-50 cursor-pointer">
//                     <Camera className="w-8 h-8 text-neutral-400" />
//                     <span className="mt-2 text-sm text-neutral-500">Add Photo</span>
//                     <input
//                       type="file"
//                       accept="image/*"
//                       className="hidden"
//                       onChange={handlePhotoChange}
//                     />
//                   </label>
//                 )}
//               </div>
//             </div>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <label className="block text-sm font-medium mb-1">Contact Name</label>
//                 <input
//                   type="text"
//                   required
//                   className="w-full px-3 py-2 rounded-lg border bg-white/50"
//                   value={formData.donorName}
//                   onChange={(e) => setFormData(prev => ({ ...prev, donorName: e.target.value }))}
//                   placeholder="Your name"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-1">Contact Phone</label>
//                 <input
//                   type="tel"
//                   required
//                   className="w-full px-3 py-2 rounded-lg border bg-white/50"
//                   value={formData.donorPhone}
//                   onChange={(e) => setFormData(prev => ({ ...prev, donorPhone: e.target.value }))}
//                   placeholder="Your phone number"
//                 />
//               </div>
//             </div>

//             <Button type="submit" className="w-full">Submit Donation</Button>
//           </form>
//         </motion.div>
//       </div>
//     </div>
//   );
// }




import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { Camera } from 'lucide-react';
import { MapPicker } from '@/components/ui/map-picker';

export function DonateForm() {
  const navigate = useNavigate();
  const [formData, setFormData] = React.useState({
    title: '',
    description: '',
    quantity: 1,
    expiryDate: '',
    pickupAddress: '',
    latitude: 0,
    longitude: 0,
    pickupTime: '',
    photo: '',
    donorName: 'Current Donor', // Set a fixed donor name for demo
    donorPhone: '',
    foodType: 'veg' // Added foodType field
  });

  const handleLocationSelect = (lat, lng, address) => {
    setFormData(prev => ({
      ...prev,
      latitude: lat,
      longitude: lng,
      pickupAddress: address
    }));
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, photo: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.quantity || 
        !formData.pickupAddress || !formData.pickupTime || 
        !formData.donorName || !formData.donorPhone) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/donations/add', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description,
          quantity: Number(formData.quantity),
          expiryDate: formData.expiryDate,
          pickupAddress: formData.pickupAddress,
          latitude: formData.latitude,
          longitude: formData.longitude,
          pickupTime: formData.pickupTime,
          photo: formData.photo,
          donorName: formData.donorName,
          donorPhone: formData.donorPhone,
          foodType: formData.foodType,
          status: 'pending'
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit donation');
      }

      const result = await response.json();
      console.log('Donation submitted successfully:', result);
      navigate('/donor');
    } catch (error) {
      console.error('Error submitting donation:', error);
      alert('There was an error submitting your donation. Please try again.');
    }
  };

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-2xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 rounded-2xl"
        >
          <h1 className="text-2xl font-bold mb-6">List Food Donation</h1>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">Title*</label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 rounded-lg border bg-white/50"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="e.g., Fresh Vegetables from Restaurant"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Description*</label>
              <textarea
                required
                className="w-full px-3 py-2 rounded-lg border bg-white/50 h-24"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the food items, quantity, and any special handling requirements..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Quantity (servings)*</label>
                <input
                  type="number"
                  required
                  min="1"
                  className="w-full px-3 py-2 rounded-lg border bg-white/50"
                  value={formData.quantity}
                  onChange={(e) => setFormData(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Food Type*</label>
                <select
                  required
                  className="w-full px-3 py-2 rounded-lg border bg-white/50"
                  value={formData.foodType}
                  onChange={(e) => setFormData(prev => ({ ...prev, foodType: e.target.value }))}
                >
                  <option value="veg">Vegetarian</option>
                  <option value="non-veg">Non-Vegetarian</option>
                  <option value="halal">Halal</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Expiry Date</label>
              <input
                type="datetime-local"
                className="w-full px-3 py-2 rounded-lg border bg-white/50"
                value={formData.expiryDate}
                onChange={(e) => setFormData(prev => ({ ...prev, expiryDate: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Pickup Location*</label>
              <MapPicker
                onLocationSelect={handleLocationSelect}
                initialLocation={
                  formData.latitude && formData.longitude
                    ? { lat: formData.latitude, lng: formData.longitude }
                    : undefined
                }
              />
              <input
                type="text"
                required
                className="w-full px-3 py-2 rounded-lg border bg-white/50 mt-2"
                value={formData.pickupAddress}
                onChange={(e) => setFormData(prev => ({ ...prev, pickupAddress: e.target.value }))}
                placeholder="Address will be automatically filled, but you can edit it"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Preferred Pickup Time*</label>
              <input
                type="time"
                required
                className="w-full px-3 py-2 rounded-lg border bg-white/50"
                value={formData.pickupTime}
                onChange={(e) => setFormData(prev => ({ ...prev, pickupTime: e.target.value }))}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Photo</label>
              <div className="mt-1 flex items-center">
                {formData.photo ? (
                  <div className="relative w-32 h-32">
                    <img
                      src={formData.photo}
                      alt="Food preview"
                      className="w-full h-full object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, photo: '' }))}
                      className="absolute top-0 right-0 -mt-2 -mr-2 bg-red-500 text-white rounded-full p-1"
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <label className="w-32 h-32 flex flex-col items-center justify-center border-2 border-dashed rounded-lg hover:bg-neutral-50 cursor-pointer">
                    <Camera className="w-8 h-8 text-neutral-400" />
                    <span className="mt-2 text-sm text-neutral-500">Add Photo</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhotoChange}
                    />
                  </label>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">Contact Phone*</label>
                <input
                  type="tel"
                  required
                  className="w-full px-3 py-2 rounded-lg border bg-white/50"
                  value={formData.donorPhone}
                  onChange={(e) => setFormData(prev => ({ ...prev, donorPhone: e.target.value }))}
                  placeholder="Your phone number"
                />
              </div>
            </div>

            <Button type="submit" className="w-full">Submit Donation</Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
