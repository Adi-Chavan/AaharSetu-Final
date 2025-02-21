// import React, { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';
// import { Button } from '@/components/ui/button';
// import { Link } from 'react-router-dom';
// import { Package, Users, Clock, CheckCircle2, AlertTriangle, ArrowRight, Plus } from 'lucide-react';
// import { ngoAPI } from '@/services/api';

// export function NgoDashboard() {
//   const [donations, setDonations] = useState([]);
//   const [ngo, setNGO] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [selectedDonation, setSelectedDonation] = useState(null);
//   const [showRequestForm, setShowRequestForm] = useState(false);
//   const [requestForm, setRequestForm] = useState({
//     title: '',
//     description: '',
//     quantity: 1,
//     requiredBy: '',
//     dietaryRequirements: []
//   });

//   // Fetch NGO and donations data
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const [ngoResponse, donationsResponse] = await Promise.all([
//           ngoAPI.getCurrentNGO(),
//           ngoAPI.getDonations()
//         ]);

//         setNGO(ngoResponse.data);
//         setDonations(donationsResponse.data);
//         setError(null);
//       } catch (err) {
//         setError('Failed to fetch data');
//         console.error('Error fetching data:', err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleApproveDonation = async (donationId) => {
//     try {
//       await ngoAPI.approveDonation(donationId);

//       // Update local state
//       setDonations(prevDonations =>
//         prevDonations.map(donation =>
//           donation._id === donationId
//             ? { ...donation, status: 'ngo_approved', ngoId: ngo ? ngo._id : null }
//             : donation
//         )
//       );
      
//       setSelectedDonation(null);
//     } catch (err) {
//       console.error('Error approving donation:', err);
//       alert('Failed to approve donation');
//     }
//   };

//   const handleRequestSubmit = async (e) => {
//     e.preventDefault();
    
//     try {
//       const response = await ngoAPI.createDonationRequest(requestForm);
//       console.log('Request submitted successfully:', response.data);
//       setShowRequestForm(false);
//       // Refresh donation requests
//       const requests = await ngoAPI.getRequestedDonations();
//       setDonations(requests.data);
//     } catch (error) {
//       console.error('Error submitting request:', error);
//       alert('Failed to submit request');
//     }
//   };

//   // Filter donations
//   const pendingDonations = donations.filter(d => d.status === 'pending');
//   const approvedDonations = donations.filter(d => d.status === 'ngo_approved' && ngo && d.ngoId === ngo._id);
//   const completedDonations = donations.filter(d => d.status === 'completed' && ngo && d.ngoId === ngo._id);

//   if (loading) {
//     return (
//       <div className="min-h-screen pt-20 px-4">
//         <div className="max-w-7xl mx-auto text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neutral-900 mx-auto"></div>
//           <p className="mt-4 text-neutral-600">Loading...</p>
//         </div>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="min-h-screen pt-20 px-4">
//         <div className="max-w-7xl mx-auto text-center">
//           <p className="text-red-600">{error}</p>
//           <Button onClick={() => window.location.reload()} className="mt-4">
//             Retry
//           </Button>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen pt-20 px-4">
//       <div className="max-w-7xl mx-auto">
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="mb-8"
//         >
//           <div className="flex justify-between items-start">
//             <div>
//               <h1 className="text-3xl font-bold">NGO Dashboard</h1>
//               <p className="text-neutral-600">Manage donations and track your impact</p>
//             </div>
//             <div className="flex gap-4">
//               <Link to="/ngo/recommendations">
//                 <Button>
//                   View Recommendations
//                   <ArrowRight className="ml-2 h-4 w-4" />
//                 </Button>
//               </Link>
//               <Button onClick={() => setShowRequestForm(true)}>
//                 <Plus className="w-4 h-4 mr-2" />
//                 Request Donation
//               </Button>
//             </div>
//           </div>
//         </motion.div>

//         {/* Stats Overview */}
//         <div className="grid md:grid-cols-4 gap-6 mb-8">
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="glass-card p-6 rounded-2xl"
//           >
//             <div className="flex items-center gap-4">
//               <div className="p-3 bg-green-100 rounded-lg">
//                 <Package className="h-6 w-6 text-green-600" />
//               </div>
//               <div>
//                 <p className="text-sm text-neutral-600">Total Donations</p>
//                 <p className="text-2xl font-bold">{approvedDonations.length + completedDonations.length}</p>
//               </div>
//             </div>
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.1 }}
//             className="glass-card p-6 rounded-2xl"
//           >
//             <div className="flex items-center gap-4">
//               <div className="p-3 bg-blue-100 rounded-lg">
//                 <Clock className="h-6 w-6 text-blue-600" />
//               </div>
//               <div>
//                 <p className="text-sm text-neutral-600">Pending Review</p>
//                 <p className="text-2xl font-bold">{pendingDonations.length}</p>
//               </div>
//             </div>
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.2 }}
//             className="glass-card p-6 rounded-2xl"
//           >
//             <div className="flex items-center gap-4">
//               <div className="p-3 bg-purple-100 rounded-lg">
//                 <CheckCircle2 className="h-6 w-6 text-purple-600" />
//               </div>
//               <div>
//                 <p className="text-sm text-neutral-600">Completed</p>
//                 <p className="text-2xl font-bold">{completedDonations.length}</p>
//               </div>
//             </div>
//           </motion.div>

//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.3 }}
//             className="glass-card p-6 rounded-2xl"
//           >
//             <div className="flex items-center gap-4">
//               <div className="p-3 bg-yellow-100 rounded-lg">
//                 <Users className="h-6 w-6 text-yellow-600" />
//               </div>
//               <div>
//                 <p className="text-sm text-neutral-600">Beneficiaries</p>
//                 <p className="text-2xl font-bold">{(ngo && ngo.beneficiariesCount) || 0}</p>
//               </div>
//             </div>
//           </motion.div>
//         </div>

//         <div className="grid md:grid-cols-2 gap-8">
//           {/* Pending Donations */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="glass-card p-6 rounded-2xl"
//           >
//             <h2 className="text-xl font-semibold mb-6">Pending Donations</h2>
//             <div className="space-y-4">
//               {pendingDonations.length > 0 ? (
//                 pendingDonations.map((donation) => (
//                   <div key={donation._id} className="bg-white/50 p-4 rounded-lg">
//                     <div className="flex justify-between items-start mb-2">
//                       <div>
//                         <h3 className="font-medium">{donation.title}</h3>
//                         <p className="text-sm text-neutral-600">{donation.description}</p>
//                       </div>
//                       <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">
//                         Pending
//                       </span>
//                     </div>
//                     <div className="grid grid-cols-2 gap-4 text-sm text-neutral-600 mb-3">
//                       <div>
//                         <p>Quantity: {donation.quantity} servings</p>
//                         <p>Pickup: {donation.pickupTime}</p>
//                       </div>
//                       <div>
//                         <p>Donor: {donation.donorName}</p>
//                         <p>Phone: {donation.donorPhone}</p>
//                       </div>
//                     </div>
//                     <Button
//                       onClick={() => handleApproveDonation(donation._id)}
//                       className="w-full"
//                     >
//                       Approve Donation
//                     </Button>
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-center py-8">
//                   <Package className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
//                   <p className="text-neutral-600">No pending donations</p>
//                 </div>
//               )}
//             </div>
//           </motion.div>

//           {/* Active Donations */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.1 }}
//             className="glass-card p-6 rounded-2xl"
//           >
//             <h2 className="text-xl font-semibold mb-6">Active Donations</h2>
//             <div className="space-y-4">
//               {approvedDonations.length > 0 ? (
//                 approvedDonations.map((donation) => (
//                   <div key={donation._id} className="bg-white/50 p-4 rounded-lg">
//                     <div className="flex justify-between items-start mb-2">
//                       <div>
//                         <h3 className="font-medium">{donation.title}</h3>
//                         <p className="text-sm text-neutral-600">{donation.description}</p>
//                       </div>
//                       {donation.claimedBy ? (
//                         <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
//                           Claimed
//                         </span>
//                       ) : (
//                         <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
//                           Approved
//                         </span>
//                       )}
//                     </div>
//                     <div className="grid grid-cols-2 gap-4 text-sm text-neutral-600">
//                       <div>
//                         <p>Quantity: {donation.quantity} servings</p>
//                         <p>Pickup: {donation.pickupTime}</p>
//                       </div>
//                       <div>
//                         <p>Donor: {donation.donorName}</p>
//                         <p>Phone: {donation.donorPhone}</p>
//                       </div>
//                     </div>
//                     {!donation.claimedBy && (
//                       <div className="mt-3 p-2 bg-yellow-50 rounded-lg flex items-center gap-2">
//                         <AlertTriangle className="w-4 h-4 text-yellow-600" />
//                         <p className="text-sm text-yellow-800">Waiting for volunteer</p>
//                       </div>
//                     )}
//                   </div>
//                 ))
//               ) : (
//                 <div className="text-center py-8">
//                   <Package className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
//                   <p className="text-neutral-600">No active donations</p>
//                 </div>
//               )}
//             </div>
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   );
// }




import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Clock, CheckCircle2, X, Plus, Package } from 'lucide-react';
import { Link } from 'react-router-dom';


export function NgoDashboard() {
  const [donationRequests, setDonationRequests] = useState([]); // Pending donations
  const [approvedDonations, setApprovedDonations] = useState([]); // Approved by NGO
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [NgoRequestedDonations, setNgoRequestedDonations] = useState([])
  const [loading, setLoading] = useState(true);
  const [showRequestForm, setShowRequestForm] = useState(false); // Corrected setter name  const [loading, setLoading] = useState(true);
  const [requestForm, setRequestForm] = React.useState({
    title: '',
    description: '',
    quantity: 1,
    requiredBy: '',
    dietaryRequirements: []
  });



  const fetchDonationRequests = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/ngos/requests", { credentials: "include" });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      console.log("Fetched Pending Donation Requests:", data);
      setDonationRequests(data);
    } catch (error) {
      console.error("Error fetching donation requests:", error);
    }
  };


  const fetchApprovedDonations = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/ngos/approved", { credentials: "include" });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      console.log("Fetched Approved Donations:", data);
      setApprovedDonations(data);
    } catch (error) {
      console.error("Error fetching approved donations:", error);
    } finally {
      setLoading(false);
    }
  };

 // NGO-REQUEST-DONATION
  const fetchNgoRequestedDonations = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/ngos/my-requests", { credentials: "include" });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      console.log("Fetched NGO Requested Donations:", data);
      setNgoRequestedDonations(data);
    } catch (error) {
      console.error("Error fetching NGO requests:", error);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Fetch pending and approved donations separately
  useEffect(() => {
    fetchNgoRequestedDonations();
    fetchDonationRequests();
    fetchApprovedDonations();
  }, []);

  // ✅ Handle approving a donation request
  const handleApproveDonation = async (donationId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/ngos/requests/${donationId}/accept`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      // ✅ Move the approved donation to the approved list
      const approvedDonation = donationRequests.find(d => d._id === donationId);
      setApprovedDonations(prev => [...prev, { ...approvedDonation, ngoApproved: true }]);
      setDonationRequests(prevRequests => prevRequests.filter(d => d._id !== donationId));
      setSelectedDonation(null);
      console.log("Donation approved:", donationId);
    } catch (error) {
      console.error("Error approving donation:", error);
    }
  };



  const handleRequestSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log(requestForm)
      const response = await fetch("http://localhost:5000/api/ngos/request-donation", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestForm),
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      const newRequest = await response.json();
      setNgoRequestedDonations(prev => [...prev, newRequest]);
      setShowRequestForm(false);
      console.log("Request submitted successfully:", newRequest);
    } catch (error) {
      console.error("Error submitting request:", error);
    }
  };

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8 flex justify-between items-center"
        >
          <div>
            <h1 className="text-3xl font-bold">NGO Dashboard</h1>
            <p className="text-neutral-600">Review donations and manage requests</p>
          </div>

          <div className='flex space-x-4'>
            <Link to="/ml">
              <Button>
                  ML Recommendations 
              </Button>
            </Link>

            <Button onClick={() => setShowRequestForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Request Donation
            </Button>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Available Donations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 rounded-2xl relative"
          >
            <div className='gradient'/>
            <h2 className="text-xl font-semibold mb-4">Available Donations</h2>
            {donationRequests.length > 0 ? (
              <div className="space-y-4">
                {donationRequests.map((donation) => (
                  <div key={donation._id} className="bg-white/50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{donation.title}</h3>
                      <span className="text-sm text-neutral-600">{donation.quantity} servings</span>
                    </div>
                    <div className="text-sm text-neutral-600 mb-3">
                      <p className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" /> {donation.pickupAddress}
                      </p>
                      <p className="flex items-center mt-1">
                        <Clock className="w-4 h-4 mr-1" /> Pickup at {donation.pickupTime}
                      </p>
                    </div>
                    <Button
                      onClick={() => setSelectedDonation(donation)}
                      className="w-full mt-3"
                    >
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-neutral-600">No pending donation requests.</p>
            )}
          </motion.div>

          {/* Approved Donations */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 rounded-2xl relative"
          >
            <div className='gradient'/>
            <h2 className="text-xl font-semibold mb-4">Approved Donations</h2>
            {approvedDonations.length > 0 ? (
              <div className="space-y-4">
                {approvedDonations.map((donation) => (
                  <div key={donation._id} className="bg-white/50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{donation.title}</h3>
                      <span className="text-sm text-neutral-600">{donation.quantity} servings</span>
                    </div>
                    <div className="text-sm text-neutral-600 mb-3">
                      <p className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" /> {donation.pickupAddress}
                      </p>
                      <p className="flex items-center mt-1">
                        <Clock className="w-4 h-4 mr-1" /> Pickup at {donation.pickupTime}
                      </p>
                    </div>
                    {/* ✅ Show Message if Volunteer is Assigned */}
                    {donation.claimedBy ? (
                      <p className="text-blue-600 font-semibold text-sm">Assigned to a Volunteer</p>
                    ) : (
                      <p className="text-yellow-600 text-sm">Awaiting Volunteer</p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-neutral-600">No approved donations</p>
            )}
          </motion.div>

          {/* My Requests */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 rounded-2xl relative"
          >
            <div className='gradient'/>
            <h2 className="text-xl font-semibold mb-4">My Requests</h2>
            {NgoRequestedDonations.length > 0 ? (
              <div className="space-y-4">
                {NgoRequestedDonations.map((request) => (
                  <div key={request._id} className="bg-white/50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{request.title}</h3>
                      <span className={`text-sm px-2 py-1 rounded-full ${
                        request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        request.status === 'accepted' ? 'bg-green-100 text-green-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </div>
                    <div className="text-sm text-neutral-600">
                      <p>{request.quantity} servings needed</p>
                      <p>Required by: {new Date(request.requiredBy).toLocaleDateString()}</p>
                      {request.dietaryRequirements.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {request.dietaryRequirements.map((req, index) => (
                            <span key={index} className="text-xs bg-neutral-100 px-2 py-1 rounded-full">
                              {req}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-neutral-600">No requests made yet</p>
            )}
          </motion.div>
        </div> 

        {/* Donation Details Modal */}
        {selectedDonation && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[101]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="sticky top-0 bg-white pb-4">
                <h3 className="text-xl font-semibold">{selectedDonation.title}</h3>
              </div>
              <div className="space-y-4 mb-6">
                <p className="text-neutral-600">{selectedDonation.description}</p>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Quantity</p>
                    <p className="text-neutral-600">{selectedDonation.quantity} servings</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Pickup Time</p>
                    <p className="text-neutral-600">{selectedDonation.pickupTime}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium">Address</p>
                  <p className="text-neutral-600">{selectedDonation.pickupAddress}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Contact</p>
                  <p className="text-neutral-600">{selectedDonation.donorName} - {selectedDonation.donorPhone}</p>
                </div>
                {selectedDonation.photo && (
                  <img
                    src={selectedDonation.photo}
                    alt="Food"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                )}
              </div>
              <div className="sticky bottom-0 bg-white pt-4 flex gap-3">
                <Button
                  onClick={() => handleApproveDonation(selectedDonation._id)}
                  className="flex-1"
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Approve Donation
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedDonation(null)}
                  className="flex-1"
                >
                  <X className="w-4 h-4 mr-2" />
                  Close
                </Button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Request Form Modal */}
        {showRequestForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[101]">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full"
            >
              <h3 className="text-xl font-semibold mb-4">Request Donation</h3>
              <form onSubmit={handleRequestSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Title*</label>
                  <input
                    type="text"
                    required
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 bg-white/50"
                    value={requestForm.title}
                    onChange={(e) => setRequestForm(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="e.g., Need food for 100 people"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Description*</label>
                  <textarea
                    required
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 bg-white/50 h-24"
                    value={requestForm.description}
                    onChange={(e) => setRequestForm(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Describe your requirements..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Quantity (servings)*</label>
                  <input
                    type="number"
                    required
                    min="1"
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 bg-white/50"
                    value={requestForm.quantity}
                    onChange={(e) => setRequestForm(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Required By*</label>
                  <input
                    type="date"
                    required
                    className="w-full px-3 py-2 rounded-lg border border-neutral-200 bg-white/50"
                    value={requestForm.requiredBy}
                    onChange={(e) => setRequestForm(prev => ({ ...prev, requiredBy: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Dietary Requirements</label>
                  <div className="space-y-2">
                    {['Vegetarian', 'Non Vegetarian'].map((type) => (
                      <label key={type} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={requestForm.dietaryRequirements.includes(type)}
                          onChange={(e) => {
                            const updatedReqs = e.target.checked
                              ? [...requestForm.dietaryRequirements, type]
                              : requestForm.dietaryRequirements.filter(t => t !== type);
                            setRequestForm(prev => ({ ...prev, dietaryRequirements: updatedReqs }));
                          }}
                          className="rounded border-neutral-300"
                        />
                        <span className="text-sm">{type}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button type="submit" className="flex-1">
                    Submit Request
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowRequestForm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </motion.div> 
          </div>
        )}
      </div>
    </div>
  );
}




// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { Button } from '@/components/ui/button';
// import { MapPin, Clock, CheckCircle2 } from 'lucide-react';

// export function NgoDashboard() {
//   const [donationRequests, setDonationRequests] = useState([]); // Pending donations
//   const [approvedDonations, setApprovedDonations] = useState([]); // Approved by NGO
//   const [loading, setLoading] = useState(true);

//   // ✅ Fetch pending and approved donations separately
//   useEffect(() => {
//     const fetchDonationRequests = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/api/ngos/requests", { credentials: "include" });
//         if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
//         const data = await response.json();
//         console.log("Fetched Pending Donation Requests:", data);
//         setDonationRequests(data);
//       } catch (error) {
//         console.error("Error fetching donation requests:", error);
//       }
//     };

//     const fetchApprovedDonations = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/api/ngos/approved", { credentials: "include" });
//         if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
//         const data = await response.json();
//         console.log("Fetched Approved Donations:", data);
//         setApprovedDonations(data);
//       } catch (error) {
//         console.error("Error fetching approved donations:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDonationRequests();
//     fetchApprovedDonations();
//   }, []);

//   // ✅ Handle approving a donation request
//   const handleApproveDonation = async (donationId) => {
//     try {
//       const response = await fetch(`http://localhost:5000/api/ngos/requests/${donationId}/accept`, {
//         method: "POST",
//         credentials: "include",
//       });

//       if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

//       // ✅ Move the approved donation to the approved list
//       const approvedDonation = donationRequests.find(d => d._id === donationId);
//       setApprovedDonations(prev => [...prev, { ...approvedDonation, ngoApproved: true }]);
//       setDonationRequests(prevRequests => prevRequests.filter(d => d._id !== donationId));

//       console.log("Donation approved:", donationId);
//     } catch (error) {
//       console.error("Error approving donation:", error);
//     }
//   };

//   return (
//     <div className="min-h-screen pt-20 px-4">
//       <div className="max-w-7xl mx-auto">
//         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
//           <h1 className="text-3xl font-bold">NGO Dashboard</h1>
//           <p className="text-neutral-600">Review donations and manage requests</p>
//         </motion.div>

//         <div className="grid md:grid-cols-2 gap-8">
//           {/* ✅ Pending Donations */}
//           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 rounded-2xl">
//             <h2 className="text-xl font-semibold mb-4">Pending Donations</h2>
//             {loading ? (
//               <p>Loading...</p>
//             ) : donationRequests.length > 0 ? (
//               <div className="space-y-4">
//                 {donationRequests.map((donation) => (
//                   <div key={donation._id} className="bg-white/50 p-4 rounded-lg">
//                     <div className="flex justify-between items-start mb-2">
//                       <h3 className="font-medium">{donation.title}</h3>
//                       <span className="text-sm text-neutral-600">{donation.quantity} servings</span>
//                     </div>
//                     <div className="text-sm text-neutral-600 mb-3">
//                       <p className="flex items-center">
//                         <MapPin className="w-4 h-4 mr-1" /> {donation.pickupAddress}
//                       </p>
//                       <p className="flex items-center mt-1">
//                         <Clock className="w-4 h-4 mr-1" /> Pickup at {donation.pickupTime}
//                       </p>
//                     </div>
//                     <Button onClick={() => handleApproveDonation(donation._id)} className="w-full mt-3">
//                       <CheckCircle2 className="w-4 h-4 mr-2" /> Approve Donation
//                     </Button>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-neutral-600">No pending donation requests.</p>
//             )}
//           </motion.div>

//           {/* ✅ Approved Donations */}
//           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 rounded-2xl">
//             <h2 className="text-xl font-semibold mb-4">Approved Donations</h2>
//             {approvedDonations.length > 0 ? (
//               <div className="space-y-4">
//                 {approvedDonations.map((donation) => (
//                   <div key={donation._id} className="bg-white/50 p-4 rounded-lg">
//                     <div className="flex justify-between items-start mb-2">
//                       <h3 className="font-medium">{donation.title}</h3>
//                       <span className="text-sm text-neutral-600">{donation.quantity} servings</span>
//                     </div>
//                     <div className="text-sm text-neutral-600 mb-3">
//                       <p className="flex items-center">
//                         <MapPin className="w-4 h-4 mr-1" /> {donation.pickupAddress}
//                       </p>
//                       <p className="flex items-center mt-1">
//                         <Clock className="w-4 h-4 mr-1" /> Pickup at {donation.pickupTime}
//                       </p>
//                     </div>
//                     <p className="text-green-600 font-semibold text-sm">Approved by NGO</p>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-neutral-600">No approved donations</p>
//             )}
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   );
// }




// import React from 'react';
// import { motion } from 'framer-motion';
// import { Button } from '@/components/ui/button';
// import { Search, MapPin, Clock, CheckCircle2, X, Plus, Package } from 'lucide-react';
// import { useStore } from '@/lib/store';

// export function NgoDashboard() {
//   const donations = useStore((state) => state.donations) ?? [];
//   const donationRequests = useStore((state) => state.donationRequests) ?? [];
//   const updateDonationStatus = useStore((state) => state.updateDonationStatus);
//   const approveNGODonation = useStore((state) => state.approveNGODonation);
//   const addDonationRequest = useStore((state) => state.addDonationRequest);
//   const [selectedDonation, setSelectedDonation] = React.useState(null);
//   const [showRequestForm, setShowRequestForm] = React.useState(false);
//   const [requestForm, setRequestForm] = React.useState({
//     title: '',
//     description: '',
//     quantity: 1,
//     requiredBy: '',
//     dietaryRequirements: []
//   });

//   const pendingDonations = donations.filter(d => d.status === 'pending');
//   const approvedDonations = donations.filter(d => d.status === 'ngo_approved' && d.ngoId === 'ngo-1');
//   const myRequests = donationRequests.filter(r => r.ngoId === 'ngo-1');

//   const handleApproveDonation = (donationId) => {
//     try {
//       approveNGODonation(donationId, 'ngo-1');
//       setSelectedDonation(null);
//     } catch (error) {
//       console.error('Error approving donation:', error);
//       alert('Failed to approve donation. Please try again.');
//     }
//   };

//   const handleRequestSubmit = (e) => {
//     e.preventDefault();
    
//     if (!requestForm.title || !requestForm.description || !requestForm.quantity || !requestForm.requiredBy) {
//       alert('Please fill in all required fields');
//       return;
//     }

//     try {
//       addDonationRequest({
//         ngoId: 'ngo-1',
//         title: requestForm.title,
//         description: requestForm.description,
//         quantity: requestForm.quantity,
//         requiredBy: requestForm.requiredBy,
//         dietaryRequirements: requestForm.dietaryRequirements
//       });

//       setShowRequestForm(false);
//       setRequestForm({
//         title: '',
//         description: '',
//         quantity: 1,
//         requiredBy: '',
//         dietaryRequirements: []
//       });
//     } catch (error) {
//       console.error('Error submitting request:', error);
//       alert('Failed to submit request. Please try again.');
//     }
//   };

//   const getDonationStatusBadge = (status) => {
//     switch (status) {
//       case 'pending':
//         return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">Pending Approval</span>;
//       case 'ngo_approved':
//         return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">Approved</span>;
//       case 'claimed':
//         return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Claimed by Volunteer</span>;
//       case 'completed':
//         return <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">Delivered</span>;
//       default:
//         return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">{status}</span>;
//     }
//   };

//   return (
//     <div className="min-h-screen pt-20 px-4">
//       <div className="max-w-7xl mx-auto">
//         <motion.div
//           initial={{ opacity: 0 }}
//           animate={{ opacity: 1 }}
//           className="mb-8 flex justify-between items-center"
//         >
//           <div>
//             <h1 className="text-3xl font-bold">NGO Dashboard</h1>
//             <p className="text-neutral-600">Review donations and manage requests</p>
//           </div>
//           <Button onClick={() => setShowRequestForm(true)}>
//             <Plus className="w-4 h-4 mr-2" />
//             Request Donation
//           </Button>
//         </motion.div>

//         <div className="grid md:grid-cols-3 gap-8">
//           {/* Available Donations */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="glass-card p-6 rounded-2xl"
//           >
//             <h2 className="text-xl font-semibold mb-4">Available Donations</h2>
//             {pendingDonations.length > 0 ? (
//               <div className="space-y-4">
//                 {pendingDonations.map((donation) => (
//                   <div key={donation.id} className="bg-white/50 p-4 rounded-lg">
//                     <div className="flex justify-between items-start mb-2">
//                       <h3 className="font-medium">{donation.title}</h3>
//                       <span className="text-sm text-neutral-600">
//                         {donation.quantity} servings
//                       </span>
//                     </div>
//                     <div className="text-sm text-neutral-600 mb-3">
//                       <p className="flex items-center">
//                         <MapPin className="w-4 h-4 mr-1" />
//                         {donation.pickupAddress}
//                       </p>
//                       <p className="flex items-center mt-1">
//                         <Clock className="w-4 h-4 mr-1" />
//                         Pickup at {donation.pickupTime}
//                       </p>
//                     </div>
//                     {getDonationStatusBadge(donation.status)}
//                     <Button
//                       onClick={() => setSelectedDonation(donation)}
//                       className="w-full mt-3"
//                     >
//                       View Details
//                     </Button>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-neutral-600">No available donations at the moment</p>
//             )}
//           </motion.div>

//           {/* Approved Donations */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.1 }}
//             className="glass-card p-6 rounded-2xl"
//           >
//             <h2 className="text-xl font-semibold mb-4">Approved Donations</h2>
//             {approvedDonations.length > 0 ? (
//               <div className="space-y-4">
//                 {approvedDonations.map((donation) => (
//                   <div key={donation.id} className="bg-white/50 p-4 rounded-lg">
//                     <div className="flex justify-between items-start mb-2">
//                       <h3 className="font-medium">{donation.title}</h3>
//                       <span className="text-sm text-neutral-600">
//                         {donation.quantity} servings
//                       </span>
//                     </div>
//                     <div className="text-sm text-neutral-600 mb-3">
//                       <p className="flex items-center">
//                         <MapPin className="w-4 h-4 mr-1" />
//                         {donation.pickupAddress}
//                       </p>
//                       <p className="flex items-center mt-1">
//                         <Clock className="w-4 h-4 mr-1" />
//                         Pickup at {donation.pickupTime}
//                       </p>
//                     </div>
//                     <div className="flex items-center justify-between mt-2">
//                       {getDonationStatusBadge(donation.status)}
//                       {donation.claimedBy ? (
//                         <span className="text-sm text-blue-600">Claimed by volunteer</span>
//                       ) : (
//                         <span className="text-sm text-neutral-600">Awaiting volunteer</span>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-neutral-600">No approved donations</p>
//             )}
//           </motion.div>

//           {/* My Requests */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.2 }}
//             className="glass-card p-6 rounded-2xl"
//           >
//             <h2 className="text-xl font-semibold mb-4">My Requests</h2>
//             {myRequests.length > 0 ? (
//               <div className="space-y-4">
//                 {myRequests.map((request) => (
//                   <div key={request.id} className="bg-white/50 p-4 rounded-lg">
//                     <div className="flex justify-between items-start mb-2">
//                       <h3 className="font-medium">{request.title}</h3>
//                       <span className={`text-sm px-2 py-1 rounded-full ${
//                         request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
//                         request.status === 'accepted' ? 'bg-green-100 text-green-800' :
//                         'bg-blue-100 text-blue-800'
//                       }`}>
//                         {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
//                       </span>
//                     </div>
//                     <div className="text-sm text-neutral-600">
//                       <p>{request.quantity} servings needed</p>
//                       <p>Required by: {new Date(request.requiredBy).toLocaleDateString()}</p>
//                       {request.dietaryRequirements.length > 0 && (
//                         <div className="flex flex-wrap gap-1 mt-2">
//                           {request.dietaryRequirements.map((req, index) => (
//                             <span key={index} className="text-xs bg-neutral-100 px-2 py-1 rounded-full">
//                               {req}
//                             </span>
//                           ))}
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <p className="text-neutral-600">No requests made yet</p>
//             )}
//           </motion.div>
//         </div>

//         {/* Donation Details Modal */}
//         {selectedDonation && (
//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95, y: 20 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               exit={{ opacity: 0, scale: 0.95, y: 20 }}
//               className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
//             >
//               <div className="sticky top-0 bg-white pb-4">
//                 <h3 className="text-xl font-semibold">{selectedDonation.title}</h3>
//               </div>
//               <div className="space-y-4 mb-6">
//                 <p className="text-neutral-600">{selectedDonation.description}</p>
//                 <div className="grid grid-cols-2 gap-4">
//                   <div>
//                     <p className="text-sm font-medium">Quantity</p>
//                     <p className="text-neutral-600">{selectedDonation.quantity} servings</p>
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium">Pickup Time</p>
//                     <p className="text-neutral-600">{selectedDonation.pickupTime}</p>
//                   </div>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium">Address</p>
//                   <p className="text-neutral-600">{selectedDonation.pickupAddress}</p>
//                 </div>
//                 <div>
//                   <p className="text-sm font-medium">Contact</p>
//                   <p className="text-neutral-600">{selectedDonation.donorName} - {selectedDonation.donorPhone}</p>
//                 </div>
//                 {selectedDonation.photo && (
//                   <img
//                     src={selectedDonation.photo}
//                     alt="Food"
//                     className="w-full h-48 object-cover rounded-lg"
//                   />
//                 )}
//               </div>
//               <div className="sticky bottom-0 bg-white pt-4 flex gap-3">
//                 <Button
//                   onClick={() => handleApproveDonation(selectedDonation.id)}
//                   className="flex-1"
//                 >
//                   <CheckCircle2 className="w-4 h-4 mr-2" />
//                   Approve Donation
//                 </Button>
//                 <Button
//                   variant="outline"
//                   onClick={() => setSelectedDonation(null)}
//                   className="flex-1"
//                 >
//                   <X className="w-4 h-4 mr-2" />
//                   Close
//                 </Button>
//               </div>
//             </motion.div>
//           </div>
//         )}

//         {/* Request Form Modal */}
//         {showRequestForm && (
//           <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
//             <motion.div
//               initial={{ opacity: 0, scale: 0.95, y: 20 }}
//               animate={{ opacity: 1, scale: 1, y: 0 }}
//               className="bg-white rounded-2xl p-6 max-w-md w-full"
//             >
//               <h3 className="text-xl font-semibold mb-4">Request Donation</h3>
//               <form onSubmit={handleRequestSubmit} className="space-y-4">
//                 <div>
//                   <label className="block text-sm font-medium mb-1">Title*</label>
//                   <input
//                     type="text"
//                     required
//                     className="w-full px-3 py-2 rounded-lg border border-neutral-200 bg-white/50"
//                     value={requestForm.title}
//                     onChange={(e) => setRequestForm(prev => ({ ...prev, title: e.target.value }))}
//                     placeholder="e.g., Need food for 100 people"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-1">Description*</label>
//                   <textarea
//                     required
//                     className="w-full px-3 py-2 rounded-lg border border-neutral-200 bg-white/50 h-24"
//                     value={requestForm.description}
//                     onChange={(e) => setRequestForm(prev => ({ ...prev, description: e.target.value }))}
//                     placeholder="Describe your requirements..."
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-1">Quantity (servings)*</label>
//                   <input
//                     type="number"
//                     required
//                     min="1"
//                     className="w-full px-3 py-2 rounded-lg border border-neutral-200 bg-white/50"
//                     value={requestForm.quantity}
//                     onChange={(e) => setRequestForm(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-1">Required By*</label>
//                   <input
//                     type="date"
//                     required
//                     className="w-full px-3 py-2 rounded-lg border border-neutral-200 bg-white/50"
//                     value={requestForm.requiredBy}
//                     onChange={(e) => setRequestForm(prev => ({ ...prev, requiredBy: e.target.value }))}
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-sm font-medium mb-2">Dietary Requirements</label>
//                   <div className="space-y-2">
//                     {['Vegetarian', 'Non Vegiterian'].map((type) => (
//                       <label key={type} className="flex items-center space-x-2">
//                         <input
//                           type="checkbox"
//                           checked={requestForm.dietaryRequirements.includes(type)}
//                           onChange={(e) => {
//                             const updatedReqs = e.target.checked
//                               ? [...requestForm.dietaryRequirements, type]
//                               : requestForm.dietaryRequirements.filter(t => t !== type);
//                             setRequestForm(prev => ({ ...prev, dietaryRequirements: updatedReqs }));
//                           }}
//                           className="rounded border-neutral-300"
//                         />
//                         <span className="text-sm">{type}</span>
//                       </label>
//                     ))}
//                   </div>
//                 </div>

//                 <div className="flex gap-3 pt-4">
//                   <Button type="submit" className="flex-1">
//                     Submit Request
//                   </Button>
//                   <Button
//                     type="button"
//                     variant="outline"
//                     onClick={() => setShowRequestForm(false)}
//                     className="flex-1"
//                   >
//                     Cancel
//                   </Button>
//                 </div>
//               </form>
//             </motion.div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }





// // import React, { useState } from "react";
// // import { motion } from "framer-motion";
// // import { Button } from "@/components/ui/button";
// // import { Search, MapPin, Clock, CheckCircle2, X, Plus, Package } from "lucide-react";
// // import { useStore } from "@/lib/store";

// //  export function DonationsList() {
// //   const [pendingDonations, setPendingDonations] = useState([]);
// //   const [loading, setLoading] = useState(false);
// //   const [error, setError] = useState(null);
// //   const [selectedDonation, setSelectedDonation] = useState(null);

// //   const [showRequestForm, setShowRequestForm] = useState(false);
// //   const [requestForm, setRequestForm] = useState({
// //     title: "",
// //     description: "",
// //     quantity: 1,
// //     requiredBy: "",
// //     dietaryRequirements: [],
// //   });


// //   const fetchRecommendations = async () => {
// //     setLoading(true);
// //     setError(null);

// //     try {
// //       const response = await fetch("http://localhost:3000/api/recommendations", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({
// //           ngo_lat: 28.6139, // Example latitude
// //           ngo_lon: 77.2090, // Example longitude
// //           food_type: "veg",
// //           min_quantity: 5,
// //         }),
// //       });

// //       const data = await response.json();
// //       setPendingDonations(data); // Store the recommendations
// //     } catch (err) {
// //       setError("Failed to fetch recommendations");
// //     } finally {
// //       setLoading(false);
// //     }
// //   };

// //   return (
// //     <div>
// //       <Button onClick={fetchRecommendations} className="mb-4">
// //         Get Recommended Donations
// //       </Button>

// //       {loading && <p>Loading...</p>}
// //       {error && <p className="text-red-500">{error}</p>}

// //       {pendingDonations.length > 0 ? (
// //         <div className="space-y-4">
// //           {pendingDonations.map((donation) => (
// //             <div key={donation._id} className="bg-white/50 p-4 rounded-lg">
// //               <div className="flex justify-between items-start mb-2">
// //                 <h3 className="font-medium">{donation.foodType}</h3>
// //                 <span className="text-sm text-neutral-600">
// //                   {donation.quantity} servings
// //                 </span>
// //               </div>
// //               <div className="text-sm text-neutral-600 mb-3">
// //                 <p className="flex items-center">
// //                   <MapPin className="w-4 h-4 mr-1" />
// //                   {donation.pickupAddress || "Unknown Location"}
// //                 </p>
// //                 <p className="flex items-center mt-1">
// //                   <Clock className="w-4 h-4 mr-1" />
// //                   Pickup at {donation.pickupTime || "N/A"}
// //                 </p>
// //                 <p className="text-sm font-semibold text-blue-600">
// //                   Distance: {donation.distance_km} km
// //                 </p>
// //               </div>
// //               <Button
// //                 onClick={() => setSelectedDonation(donation)}
// //                 className="w-full mt-3"
// //               >
// //                 View Details
// //               </Button>
// //             </div>
// //           ))}
// //         </div>
// //       ) : (
// //         <p>No available donations.</p>
// //       )}

// // {selectedDonation && (
// //           <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
// //             <motion.div
// //               initial={{ opacity: 0, scale: 0.95, y: 20 }}
// //               animate={{ opacity: 1, scale: 1, y: 0 }}
// //               exit={{ opacity: 0, scale: 0.95, y: 20 }}
// //               className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
// //             >
// //               <div className="sticky top-0 bg-white pb-4">
// //                 <h3 className="text-xl font-semibold">{selectedDonation.title}</h3>
// //               </div>
// //               <div className="space-y-4 mb-6">
// //                 <p className="text-neutral-600">{selectedDonation.description}</p>
// //                 <div className="grid grid-cols-2 gap-4">
// //                   <div>
// //                     <p className="text-sm font-medium">Quantity</p>
// //                     <p className="text-neutral-600">{selectedDonation.quantity} servings</p>
// //                   </div>
// //                   <div>
// //                     <p className="text-sm font-medium">Pickup Time</p>
// //                     <p className="text-neutral-600">{selectedDonation.pickupTime}</p>
// //                   </div>
// //                 </div>
// //                 <div>
// //                   <p className="text-sm font-medium">Address</p>
// //                   <p className="text-neutral-600">{selectedDonation.pickupAddress}</p>
// //                 </div>
// //                 <div>
// //                   <p className="text-sm font-medium">Contact</p>
// //                   <p className="text-neutral-600">{selectedDonation.donorName} - {selectedDonation.donorPhone}</p>
// //                 </div>
// //                 {selectedDonation.photo && (
// //                   <img
// //                     src={selectedDonation.photo}
// //                     alt="Food"
// //                     className="w-full h-48 object-cover rounded-lg"
// //                   />
// //                 )}
// //               </div>
// //               <div className="sticky bottom-0 bg-white pt-4 flex gap-3">
// //                 <Button
// //                   onClick={() => handleApproveDonation(selectedDonation.id)}
// //                   className="flex-1"
// //                 >
// //                   <CheckCircle2 className="w-4 h-4 mr-2" />
// //                   Approve Donation
// //                 </Button>
// //                 <Button
// //                   variant="outline"
// //                   onClick={() => setSelectedDonation(null)}
// //                   className="flex-1"
// //                 >
// //                   <X className="w-4 h-4 mr-2" />
// //                   Close
// //                 </Button>
// //               </div>
// //             </motion.div>
// //           </div>
// //         )}

// //         {/* Request Form Modal */}
// //         {showRequestForm && (
// //           <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
// //             <motion.div
// //               initial={{ opacity: 0, scale: 0.95, y: 20 }}
// //               animate={{ opacity: 1, scale: 1, y: 0 }}
// //               className="bg-white rounded-2xl p-6 max-w-md w-full"
// //             >
// //               <h3 className="text-xl font-semibold mb-4">Request Donation</h3>
// //               <form onSubmit={handleRequestSubmit} className="space-y-4">
// //                 <div>
// //                   <label className="block text-sm font-medium mb-1">Title*</label>
// //                   <input
// //                     type="text"
// //                     required
// //                     className="w-full px-3 py-2 rounded-lg border border-neutral-200 bg-white/50"
// //                     value={requestForm.title}
// //                     onChange={(e) => setRequestForm(prev => ({ ...prev, title: e.target.value }))}
// //                     placeholder="e.g., Need food for 100 people"
// //                   />
// //                 </div>

// //                 <div>
// //                   <label className="block text-sm font-medium mb-1">Description*</label>
// //                   <textarea
// //                     required
// //                     className="w-full px-3 py-2 rounded-lg border border-neutral-200 bg-white/50 h-24"
// //                     value={requestForm.description}
// //                     onChange={(e) => setRequestForm(prev => ({ ...prev, description: e.target.value }))}
// //                     placeholder="Describe your requirements..."
// //                   />
// //                 </div>

// //                 <div>
// //                   <label className="block text-sm font-medium mb-1">Quantity (servings)*</label>
// //                   <input
// //                     type="number"
// //                     required
// //                     min="1"
// //                     className="w-full px-3 py-2 rounded-lg border border-neutral-200 bg-white/50"
// //                     value={requestForm.quantity}
// //                     onChange={(e) => setRequestForm(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
// //                   />
// //                 </div>

// //                 <div>
// //                   <label className="block text-sm font-medium mb-1">Required By*</label>
// //                   <input
// //                     type="date"
// //                     required
// //                     className="w-full px-3 py-2 rounded-lg border border-neutral-200 bg-white/50"
// //                     value={requestForm.requiredBy}
// //                     onChange={(e) => setRequestForm(prev => ({ ...prev, requiredBy: e.target.value }))}
// //                   />
// //                 </div>

// //                 <div>
// //                   <label className="block text-sm font-medium mb-2">Dietary Requirements</label>
// //                   <div className="space-y-2">
// //                     {['Vegetarian', 'Vegan', 'Halal', 'Jain'].map((type) => (
// //                       <label key={type} className="flex items-center space-x-2">
// //                         <input
// //                           type="checkbox"
// //                           checked={requestForm.dietaryRequirements.includes(type)}
// //                           onChange={(e) => {
// //                             const updatedReqs = e.target.checked
// //                               ? [...requestForm.dietaryRequirements, type]
// //                               : requestForm.dietaryRequirements.filter(t => t !== type);
// //                             setRequestForm(prev => ({ ...prev, dietaryRequirements: updatedReqs }));
// //                           }}
// //                           className="rounded border-neutral-300"
// //                         />
// //                         <span className="text-sm">{type}</span>
// //                       </label>
// //                     ))}
// //                   </div>
// //                 </div>

// //                 <div className="flex gap-3 pt-4">
// //                   <Button type="submit" className="flex-1">
// //                     Submit Request
// //                   </Button>
// //                   <Button
// //                     type="button"
// //                     variant="outline"
// //                     onClick={() => setShowRequestForm(false)}
// //                     className="flex-1"
// //                   >
// //                     Cancel
// //                   </Button>
// //                 </div>
// //               </form>
// //             </motion.div>
// //           </div>
// //         )}

// //     </div>

    
// //   );
// // }



// // import React from 'react';
// // import { motion } from 'framer-motion';
// // import { Button } from '@/components/ui/button';
// // import { Search, MapPin, Clock, CheckCircle2, X, Plus, Package } from 'lucide-react';
// // import { useStore } from '@/lib/store';

// // export function NgoDashboard() {
// //   const donations = useStore((state) => state.donations) ?? [];
// //   const donationRequests = useStore((state) => state.donationRequests) ?? [];
// //   const updateDonationStatus = useStore((state) => state.updateDonationStatus);
// //   const approveNGODonation = useStore((state) => state.approveNGODonation);
// //   const addDonationRequest = useStore((state) => state.addDonationRequest);
// //   const [selectedDonation, setSelectedDonation] = React.useState(null);
// //   const [showRequestForm, setShowRequestForm] = React.useState(false);
// //   const [requestForm, setRequestForm] = React.useState({
// //     title: '',
// //     description: '',
// //     quantity: 1,
// //     requiredBy: '',
// //     dietaryRequirements: []
// //   });

// //   const pendingDonations = donations.filter(d => d.status === 'pending');
// //   const approvedDonations = donations.filter(d => d.status === 'ngo_approved' && d.ngoId === 'ngo-1');
// //   const myRequests = donationRequests.filter(r => r.ngoId === 'ngo-1');

// //   const handleApproveDonation = (donationId) => {
// //     try {
// //       approveNGODonation(donationId, 'ngo-1');
// //       setSelectedDonation(null);
// //     } catch (error) {
// //       console.error('Error approving donation:', error);
// //       alert('Failed to approve donation. Please try again.');
// //     }
// //   };

// //   const handleRequestSubmit = (e) => {
// //     e.preventDefault();
    
// //     if (!requestForm.title || !requestForm.description || !requestForm.quantity || !requestForm.requiredBy) {
// //       alert('Please fill in all required fields');
// //       return;
// //     }

// //     try {
// //       addDonationRequest({
// //         ngoId: 'ngo-1',
// //         title: requestForm.title,
// //         description: requestForm.description,
// //         quantity: requestForm.quantity,
// //         requiredBy: requestForm.requiredBy,
// //         dietaryRequirements: requestForm.dietaryRequirements
// //       });

// //       setShowRequestForm(false);
// //       setRequestForm({
// //         title: '',
// //         description: '',
// //         quantity: 1,
// //         requiredBy: '',
// //         dietaryRequirements: []
// //       });
// //     } catch (error) {
// //       console.error('Error submitting request:', error);
// //       alert('Failed to submit request. Please try again.');
// //     }
// //   };

// //   const getDonationStatusBadge = (status) => {
// //     switch (status) {
// //       case 'pending':
// //         return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">Pending Approval</span>;
// //       case 'ngo_approved':
// //         return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">Approved</span>;
// //       case 'claimed':
// //         return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Claimed by Volunteer</span>;
// //       case 'completed':
// //         return <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">Delivered</span>;
// //       default:
// //         return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">{status}</span>;
// //     }
// //   };

// //   return (
// //     <div className="min-h-screen pt-20 px-4">
// //       <div className="max-w-7xl mx-auto">
// //         <motion.div
// //           initial={{ opacity: 0 }}
// //           animate={{ opacity: 1 }}
// //           className="mb-8 flex justify-between items-center"
// //         >
// //           <div>
// //             <h1 className="text-3xl font-bold">NGO Dashboard</h1>
// //             <p className="text-neutral-600">Review donations and manage requests</p>
// //           </div>
// //           <Button onClick={() => setShowRequestForm(true)}>
// //             <Plus className="w-4 h-4 mr-2" />
// //             Request Donation
// //           </Button>
// //         </motion.div>

// //         <div className="grid md:grid-cols-3 gap-8">
// //           {/* Available Donations */}
// //           <motion.div
// //             initial={{ opacity: 0, y: 20 }}
// //             animate={{ opacity: 1, y: 0 }}
// //             className="glass-card p-6 rounded-2xl"
// //           >
// //             <h2 className="text-xl font-semibold mb-4">Available Donations</h2>
// //             {pendingDonations.length > 0 ? (
// //               <div className="space-y-4">
// //                 {pendingDonations.map((donation) => (
// //                   <div key={donation.id} className="bg-white/50 p-4 rounded-lg">
// //                     <div className="flex justify-between items-start mb-2">
// //                       <h3 className="font-medium">{donation.title}</h3>
// //                       <span className="text-sm text-neutral-600">
// //                         {donation.quantity} servings
// //                       </span>
// //                     </div>
// //                     <div className="text-sm text-neutral-600 mb-3">
// //                       <p className="flex items-center">
// //                         <MapPin className="w-4 h-4 mr-1" />
// //                         {donation.pickupAddress}
// //                       </p>
// //                       <p className="flex items-center mt-1">
// //                         <Clock className="w-4 h-4 mr-1" />
// //                         Pickup at {donation.pickupTime}
// //                       </p>
// //                     </div>
// //                     {getDonationStatusBadge(donation.status)}
// //                     <Button
// //                       onClick={() => setSelectedDonation(donation)}
// //                       className="w-full mt-3"
// //                     >
// //                       View Details
// //                     </Button>
// //                   </div>
// //                 ))}
// //               </div>
// //             ) : (
// //               <p className="text-neutral-600">No available donations at the moment</p>
// //             )}
// //           </motion.div>

// //           {/* Approved Donations */}
// //           <motion.div
// //             initial={{ opacity: 0, y: 20 }}
// //             animate={{ opacity: 1, y: 0 }}
// //             transition={{ delay: 0.1 }}
// //             className="glass-card p-6 rounded-2xl"
// //           >
// //             <h2 className="text-xl font-semibold mb-4">Approved Donations</h2>
// //             {approvedDonations.length > 0 ? (
// //               <div className="space-y-4">
// //                 {approvedDonations.map((donation) => (
// //                   <div key={donation.id} className="bg-white/50 p-4 rounded-lg">
// //                     <div className="flex justify-between items-start mb-2">
// //                       <h3 className="font-medium">{donation.title}</h3>
// //                       <span className="text-sm text-neutral-600">
// //                         {donation.quantity} servings
// //                       </span>
// //                     </div>
// //                     <div className="text-sm text-neutral-600 mb-3">
// //                       <p className="flex items-center">
// //                         <MapPin className="w-4 h-4 mr-1" />
// //                         {donation.pickupAddress}
// //                       </p>
// //                       <p className="flex items-center mt-1">
// //                         <Clock className="w-4 h-4 mr-1" />
// //                         Pickup at {donation.pickupTime}
// //                       </p>
// //                     </div>
// //                     <div className="flex items-center justify-between mt-2">
// //                       {getDonationStatusBadge(donation.status)}
// //                       {donation.claimedBy ? (
// //                         <span className="text-sm text-blue-600">Claimed by volunteer</span>
// //                       ) : (
// //                         <span className="text-sm text-neutral-600">Awaiting volunteer</span>
// //                       )}
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //             ) : (
// //               <p className="text-neutral-600">No approved donations</p>
// //             )}
// //           </motion.div>

// //           {/* My Requests */}
// //           <motion.div
// //             initial={{ opacity: 0, y: 20 }}
// //             animate={{ opacity: 1, y: 0 }}
// //             transition={{ delay: 0.2 }}
// //             className="glass-card p-6 rounded-2xl"
// //           >
// //             <h2 className="text-xl font-semibold mb-4">My Requests</h2>
// //             {myRequests.length > 0 ? (
// //               <div className="space-y-4">
// //                 {myRequests.map((request) => (
// //                   <div key={request.id} className="bg-white/50 p-4 rounded-lg">
// //                     <div className="flex justify-between items-start mb-2">
// //                       <h3 className="font-medium">{request.title}</h3>
// //                       <span className={`text-sm px-2 py-1 rounded-full ${
// //                         request.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
// //                         request.status === 'accepted' ? 'bg-green-100 text-green-800' :
// //                         'bg-blue-100 text-blue-800'
// //                       }`}>
// //                         {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
// //                       </span>
// //                     </div>
// //                     <div className="text-sm text-neutral-600">
// //                       <p>{request.quantity} servings needed</p>
// //                       <p>Required by: {new Date(request.requiredBy).toLocaleDateString()}</p>
// //                       {request.dietaryRequirements.length > 0 && (
// //                         <div className="flex flex-wrap gap-1 mt-2">
// //                           {request.dietaryRequirements.map((req, index) => (
// //                             <span key={index} className="text-xs bg-neutral-100 px-2 py-1 rounded-full">
// //                               {req}
// //                             </span>
// //                           ))}
// //                         </div>
// //                       )}
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //             ) : (
// //               <p className="text-neutral-600">No requests made yet</p>
// //             )}
// //           </motion.div>
// //         </div>

// //         {/* Donation Details Modal */}
// //         {selectedDonation && (
// //           <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
// //             <motion.div
// //               initial={{ opacity: 0, scale: 0.95, y: 20 }}
// //               animate={{ opacity: 1, scale: 1, y: 0 }}
// //               exit={{ opacity: 0, scale: 0.95, y: 20 }}
// //               className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto"
// //             >
// //               <div className="sticky top-0 bg-white pb-4">
// //                 <h3 className="text-xl font-semibold">{selectedDonation.title}</h3>
// //               </div>
// //               <div className="space-y-4 mb-6">
// //                 <p className="text-neutral-600">{selectedDonation.description}</p>
// //                 <div className="grid grid-cols-2 gap-4">
// //                   <div>
// //                     <p className="text-sm font-medium">Quantity</p>
// //                     <p className="text-neutral-600">{selectedDonation.quantity} servings</p>
// //                   </div>
// //                   <div>
// //                     <p className="text-sm font-medium">Pickup Time</p>
// //                     <p className="text-neutral-600">{selectedDonation.pickupTime}</p>
// //                   </div>
// //                 </div>
// //                 <div>
// //                   <p className="text-sm font-medium">Address</p>
// //                   <p className="text-neutral-600">{selectedDonation.pickupAddress}</p>
// //                 </div>
// //                 <div>
// //                   <p className="text-sm font-medium">Contact</p>
// //                   <p className="text-neutral-600">{selectedDonation.donorName} - {selectedDonation.donorPhone}</p>
// //                 </div>
// //                 {selectedDonation.photo && (
// //                   <img
// //                     src={selectedDonation.photo}
// //                     alt="Food"
// //                     className="w-full h-48 object-cover rounded-lg"
// //                   />
// //                 )}
// //               </div>
// //               <div className="sticky bottom-0 bg-white pt-4 flex gap-3">
// //                 <Button
// //                   onClick={() => handleApproveDonation(selectedDonation.id)}
// //                   className="flex-1"
// //                 >
// //                   <CheckCircle2 className="w-4 h-4 mr-2" />
// //                   Approve Donation
// //                 </Button>
// //                 <Button
// //                   variant="outline"
// //                   onClick={() => setSelectedDonation(null)}
// //                   className="flex-1"
// //                 >
// //                   <X className="w-4 h-4 mr-2" />
// //                   Close
// //                 </Button>
// //               </div>
// //             </motion.div>
// //           </div>
// //         )}

// //         {/* Request Form Modal */}
// //         {showRequestForm && (
// //           <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
// //             <motion.div
// //               initial={{ opacity: 0, scale: 0.95, y: 20 }}
// //               animate={{ opacity: 1, scale: 1, y: 0 }}
// //               className="bg-white rounded-2xl p-6 max-w-md w-full"
// //             >
// //               <h3 className="text-xl font-semibold mb-4">Request Donation</h3>
// //               <form onSubmit={handleRequestSubmit} className="space-y-4">
// //                 <div>
// //                   <label className="block text-sm font-medium mb-1">Title*</label>
// //                   <input
// //                     type="text"
// //                     required
// //                     className="w-full px-3 py-2 rounded-lg border border-neutral-200 bg-white/50"
// //                     value={requestForm.title}
// //                     onChange={(e) => setRequestForm(prev => ({ ...prev, title: e.target.value }))}
// //                     placeholder="e.g., Need food for 100 people"
// //                   />
// //                 </div>

// //                 <div>
// //                   <label className="block text-sm font-medium mb-1">Description*</label>
// //                   <textarea
// //                     required
// //                     className="w-full px-3 py-2 rounded-lg border border-neutral-200 bg-white/50 h-24"
// //                     value={requestForm.description}
// //                     onChange={(e) => setRequestForm(prev => ({ ...prev, description: e.target.value }))}
// //                     placeholder="Describe your requirements..."
// //                   />
// //                 </div>

// //                 <div>
// //                   <label className="block text-sm font-medium mb-1">Quantity (servings)*</label>
// //                   <input
// //                     type="number"
// //                     required
// //                     min="1"
// //                     className="w-full px-3 py-2 rounded-lg border border-neutral-200 bg-white/50"
// //                     value={requestForm.quantity}
// //                     onChange={(e) => setRequestForm(prev => ({ ...prev, quantity: parseInt(e.target.value) || 1 }))}
// //                   />
// //                 </div>

// //                 <div>
// //                   <label className="block text-sm font-medium mb-1">Required By*</label>
// //                   <input
// //                     type="date"
// //                     required
// //                     className="w-full px-3 py-2 rounded-lg border border-neutral-200 bg-white/50"
// //                     value={requestForm.requiredBy}
// //                     onChange={(e) => setRequestForm(prev => ({ ...prev, requiredBy: e.target.value }))}
// //                   />
// //                 </div>

// //                 <div>
// //                   <label className="block text-sm font-medium mb-2">Dietary Requirements</label>
// //                   <div className="space-y-2">
// //                     {['Vegetarian', 'Vegan', 'Halal', 'Jain'].map((type) => (
// //                       <label key={type} className="flex items-center space-x-2">
// //                         <input
// //                           type="checkbox"
// //                           checked={requestForm.dietaryRequirements.includes(type)}
// //                           onChange={(e) => {
// //                             const updatedReqs = e.target.checked
// //                               ? [...requestForm.dietaryRequirements, type]
// //                               : requestForm.dietaryRequirements.filter(t => t !== type);
// //                             setRequestForm(prev => ({ ...prev, dietaryRequirements: updatedReqs }));
// //                           }}
// //                           className="rounded border-neutral-300"
// //                         />
// //                         <span className="text-sm">{type}</span>
// //                       </label>
// //                     ))}
// //                   </div>
// //                 </div>

// //                 <div className="flex gap-3 pt-4">
// //                   <Button type="submit" className="flex-1">
// //                     Submit Request
// //                   </Button>
// //                   <Button
// //                     type="button"
// //                     variant="outline"
// //                     onClick={() => setShowRequestForm(false)}
// //                     className="flex-1"
// //                   >
// //                     Cancel
// //                   </Button>
// //                 </div>
// //               </form>
// //             </motion.div>
// //           </div>
// //         )}
// //       </div>
// //     </div>
// //   );
// // }
