import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Plus, Package, Clock, Users2 } from "lucide-react";
import { Link } from "react-router-dom";

export function DonorDashboard() {
  const [donations, setDonations] = useState([]); // Store donations
  const [ngoRequests, setNgoRequests] = useState([]); // Store NGO donation requests
  const [loading, setLoading] = useState(true); // Track loading state
  const [openMoney, setOpenMoney] = useState(false);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [customAmount, setCustomAmount] = useState("");
  const [error, setError] = useState("");

  const handleSelectAmount = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount("");
    setError("");
  };

  const handleCustomAmountChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value)) {
      setCustomAmount(value);
      setSelectedAmount(null);
      setError(value === "" ? "Please enter a valid amount" : "");
    }
  };

  // ✅ Fetch donations from MongoDB
  useEffect(() => {
    const fetchDonations = async () => {
      try {
        const response = await fetch("http://localhost:5000/donations", {
          credentials: "include", // Ensure authentication if using sessions
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        console.log("Fetched Donations:", data);
        setDonations(data);
      } catch (error) {
        console.error("Error fetching donations:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDonations();
  }, []);

  // ✅ Fetch NGO donation requests
  useEffect(() => {
    const fetchNgoRequests = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/donations/requests", {
          credentials: "include",
        });
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const data = await response.json();
        console.log("Fetched NGO Requests:", data);
        setNgoRequests(data);
      } catch (error) {
        console.error("Error fetching NGO requests:", error);
      }
    };

    fetchNgoRequests();
  }, []);

  // ✅ Handle accepting an NGO request
  const handleAcceptRequest = async (requestId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/donations/requests/${requestId}/accept`, {
        method: "POST",
        credentials: "include",
      });

      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

      // ✅ Remove request from the list and move it to "Your Donations"
      const acceptedRequest = ngoRequests.find((req) => req._id === requestId);
      setDonations((prev) => [...prev, { ...acceptedRequest, status: "pending" }]);
      setNgoRequests((prevRequests) => prevRequests.filter((req) => req._id !== requestId));

      console.log("Request accepted:", requestId);
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  // ✅ Function to get the correct status badge
  const getDonationStatusBadge = (status) => {
    const statusMap = {
      pending: { text: "Pending NGO Approval", color: "bg-yellow-100 text-yellow-800" },
      ngo_approved: { text: "Approved by NGO", color: "bg-green-100 text-green-800" },
      claimed: { text: "Claimed by Volunteer", color: "bg-blue-100 text-blue-800" },
      completed: { text: "Delivered", color: "bg-purple-100 text-purple-800" },
    };

    return (
      <span className={`px-2 py-1 rounded-full text-sm ${statusMap[status]?.color || "bg-gray-100 text-gray-800"}`}>
        {statusMap[status]?.text || "Unknown Status"}
      </span>
    );
  };




  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Donor Dashboard</h1>
            <p className="text-neutral-600">Manage your food donations and track your impact</p>
          </div>
          <div className='flex space-x-4'>
            <Link >
              <Button onClick={() => { setOpenMoney(true) }}>
                Donate Money 🫶
              </Button>
            </Link>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Donations Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 rounded-2xl relative"
          >
            <div className='gradient' />
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Your Donations</h2>
              <Link to="/donor/donate">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Donation
                </Button>
              </Link>
            </div>

            {loading ? (
              <p>Loading...</p>
            ) : donations.length > 0 ? (
              <div className="space-y-4">
                {[...donations].reverse().map((donation) => (
                  <div key={donation._id} className="p-4 bg-gray-100/50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{donation.title}</h3>
                        <p className="text-sm text-neutral-600 mt-1">{donation.quantity} servings</p>
                      </div>
                      {/* ✅ Display correct status badge */}
                      {getDonationStatusBadge(donation.status)}
                    </div>
                    <div className="mt-3 text-sm text-neutral-600">
                      <p>Pickup Time: {donation.pickupTime}</p>
                      {donation.ngoApprovedAt && <p className="mt-1">Approved at: {new Date(donation.ngoApprovedAt).toLocaleString()}</p>}
                      {donation.claimedAt && <p className="mt-1">Claimed at: {new Date(donation.claimedAt).toLocaleString()}</p>}
                      {donation.deliveredAt && <p className="mt-1">Delivered at: {new Date(donation.deliveredAt).toLocaleString()}</p>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Package className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                <p className="text-neutral-600">No donations yet</p>
                <p className="text-sm text-neutral-500 mt-1">Start by adding your first donation</p>
              </div>
            )}
          </motion.div>

          {/* ✅ NGO Requests Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="glass-card p-6 rounded-2xl relative"
          > 
            <div className="gradient" />
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Users2 className="w-5 h-5 mr-2 text-blue-500" />
              NGO Requests
            </h2>

            {ngoRequests.length > 0 ? (
              <div className="space-y-4">
                {ngoRequests.map((request) => (
                  <div key={request._id} className="bg-white/50 p-4 rounded-lg">
                    <h3 className="font-medium">{request.title}</h3>
                    <p className="text-sm text-neutral-600 mt-1">{request.quantity} servings</p>
                    <p className="text-sm text-neutral-600">Requested by: {request.ngoName}</p>
                    <Button onClick={() => handleAcceptRequest(request._id)} className="w-full mt-3">
                      Accept Request
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-neutral-600">No requests from NGOs at the moment</p>
            )}
          </motion.div>
        </div>


        {openMoney && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-[101] ">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl p-6 max-w-md w-full max-h-[90vh] overflow-y-auto "
            >
              <div className="gradiant"/>
              <h2 className="text-lg font-semibold mb-4">Select Donation Amount</h2>
              <div className="grid grid-cols-2 gap-4">
                {[{ amount: 750 }, { amount: 1500 }, { amount: 3000 }, { amount: 5000 }].map((option) => (
                  <button
                    key={option.amount}
                    className={`p-3 border rounded-lg ${selectedAmount === option.amount ? "bg-blue-500 text-white" : "bg-gray-100"}`}
                    onClick={() => handleSelectAmount(option.amount)}
                  >
                    <div>₹ {option.amount}</div>
                  </button>
                ))}
                <div className="col-span-2 flex flex-col items-center">
                  <button
                    className={`p-3 border rounded-lg w-full ${selectedAmount === "custom" ? "bg-blue-500 text-white" : "bg-gray-100"}`}
                    onClick={() => handleSelectAmount("custom")}
                  >
                    Custom
                  </button>
                  {selectedAmount === "custom" && (
                    <div className="mt-2 relative w-full">
                      <input
                        type="text"
                        placeholder="Amount"
                        className="p-2 border rounded-lg w-full"
                        value={customAmount}
                        onChange={handleCustomAmountChange}
                      />
                      <span className="absolute right-3 top-3">₹</span>
                      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
                    </div>
                  )}
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-4">
                To address malnutrition in India, we would need to serve 250 nutritious meals to each child every academic year.
              </p>
              <button
                className="mt-4 p-3 bg-blue-500 text-white w-full rounded-lg disabled:bg-gray-300"
                disabled={!selectedAmount && !customAmount}
                onClick={() => { setOpenMoney(false) }}
              >
                Pledge your contribution here
              </button>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}




// import React, { useState, useEffect } from "react";
// import { motion } from "framer-motion";
// import { Button } from "@/components/ui/button";
// import { Plus, Package, Clock } from "lucide-react";
// import { Link } from "react-router-dom";

// export function DonorDashboard() {
//   const [donations, setDonations] = useState([]); // Store donations
//   const [loading, setLoading] = useState(true); // Track loading state

//   // ✅ Fetch donations from MongoDB
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/donations", {
//           credentials: "include", // Ensure authentication if using sessions
//         });
//         if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

//         const data = await response.json();
//         console.log("Fetched Donations:", data);
//         setDonations(data);
//       } catch (error) {
//         console.error("Error fetching donations:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   // ✅ Function to get the correct status badge
//   const getDonationStatusBadge = (status) => {
//     const statusMap = {
//       pending: { text: "Pending NGO Approval", color: "bg-yellow-100 text-yellow-800" },
//       ngo_approved: { text: "Approved by NGO", color: "bg-green-100 text-green-800" },
//       claimed: { text: "Claimed by Volunteer", color: "bg-blue-100 text-blue-800" },
//       completed: { text: "Delivered", color: "bg-purple-100 text-purple-800" },
//     };

//     return (
//       <span className={`px-2 py-1 rounded-full text-sm ${statusMap[status]?.color || "bg-gray-100 text-gray-800"}`}>
//         {statusMap[status]?.text || "Unknown Status"}
//       </span>
//     );
//   };

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
//           <h1 className="text-3xl font-bold">Donor Dashboard</h1>
//           <p className="text-neutral-600">Manage your food donations and track your impact</p>
//         </motion.div>

//         <div className="grid md:grid-cols-2 gap-8">
//           {/* Donations Section */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             className="glass-card p-6 rounded-2xl"
//           >
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="text-xl font-semibold">Your Donations</h2>
//               <Link to="/donor/donate">
//                 <Button>
//                   <Plus className="w-4 h-4 mr-2" />
//                   Add New Donation
//                 </Button>
//               </Link>
//             </div>

//             {myDonations.length > 0 ? (
//               <div className="space-y-4">
//                 {myDonations.map((donation) => (
//                   <div key={donation._id} className="p-4 bg-white/50 rounded-lg">
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <h3 className="font-medium">{donation.title}</h3>
//                         <p className="text-sm text-neutral-600 mt-1">
//                           {donation.quantity} servings
//                         </p>
//                       </div>
//                       {/* ✅ Display correct status badge */}
//                       {getDonationStatusBadge(donation.status)}
//                     </div>
//                     <div className="mt-3 text-sm text-neutral-600">
//                       <p>Pickup Time: {donation.pickupTime}</p>
//                       {donation.ngoApprovedAt && (
//                         <p className="mt-1">Approved at: {new Date(donation.ngoApprovedAt).toLocaleString()}</p>
//                       )}
//                       {donation.claimedAt && (
//                         <p className="mt-1">Claimed at: {new Date(donation.claimedAt).toLocaleString()}</p>
//                       )}
//                       {donation.deliveredAt && (
//                         <p className="mt-1">Delivered at: {new Date(donation.deliveredAt).toLocaleString()}</p>
//                       )}
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-8">
//                 <Package className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
//                 <p className="text-neutral-600">No donations yet</p>
//                 <p className="text-sm text-neutral-500 mt-1">Start by adding your first donation</p>
//               </div>
//             )}
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   );
// }





// // import React, { useState, useEffect } from 'react';
// // import { motion } from 'framer-motion';
// // import { Button } from '@/components/ui/button';
// // import { Plus, Package, Clock } from 'lucide-react';
// // import { Link } from 'react-router-dom';

// // export function DonorDashboard() {
// //   const [donations, setDonations] = useState([]); // Store donations
// //   // const [donationRequests, setDonationRequests] = useState([]); // Store donation requests
// //   const [loading, setLoading] = useState(true); // Track loading state

// //   // Fetch donations from MongoDB
// //   useEffect(() => {
// //     const fetchDonations = async () => {
// //       try {
// //         const response = await fetch('http://localhost:5000/donations', {
// //           credentials: 'include', // Ensure authentication if using sessions
// //         });
// //         const data = await response.json();
// //         setDonations(data);
// //       } catch (error) {
// //         console.error('Error fetching donations:', error);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchDonations();
// //   }, []);

// //   // Fetch pending donation requests (if applicable)
// //   // useEffect(() => {
// //   //   const fetchDonationRequests = async () => {
// //   //     try {
// //   //       const response = await fetch("http://localhost:5000/donations", { 
// //   //         method: "GET",
// //   //         credentials: "include"
// //   //       });
  
// //   //       if (!response.ok) {
// //   //         throw new Error(`HTTP error! Status: ${response.status}`);
// //   //       }
  
// //   //       const data = await response.json();
// //   //       console.log("Donation Requests:", data);
// //   //       setDonationRequests(data);
// //   //     } catch (error) {
// //   //       console.error('Error fetching donation requests:', error);
// //   //     }
// //   //   };
  
// //   //   fetchDonationRequests();
// //   // }, []);
  

// //   // // useEffect(() => {
// //   // //   const fetchDonationRequests = async () => {
// //   // //     try {
// //   // //       // const response = await fetch('http://localhost:5000/donations');
// //   // //       fetch("http://localhost:5000/donations", { 
// //   // //         method: "GET",
// //   // //         credentials: "include" // Ensures cookies (session) are sent
// //   // //     })
// //   // //     .then(response => response.json())
// //   // //     .then(data => console.log(data))
// //   // //     .catch(error => console.error("Error fetching donations:", error));
      
// //   // //     const data = await response.json();
// //   // //     setDonationRequests(data);
// //   // //     } catch (error) {
// //   // //       console.error('Error fetching donation requests:', error);
// //   // //     }
// //   // //   };

// //   // //   fetchDonationRequests();
// //   // // }, []);

// //   // const handleAcceptRequest = async (requestId) => {
// //   //   try {
// //   //     const response = await fetch(`http://localhost:500/donations/${requestId}/accept`, {
// //   //       method: 'POST',
// //   //       credentials: 'include',
// //   //     });

// //   //     if (response.ok) {
// //   //       setDonationRequests((prevRequests) =>
// //   //         prevRequests.map((req) =>
// //   //           req.id === requestId ? { ...req, status: 'accepted' } : req
// //   //         )
// //   //       );
// //   //     }
// //   //   } catch (error) {
// //   //     console.error('Error accepting request:', error);
// //   //   }
// //   // };

// //   const getDonationStatusBadge = (status) => {
// //     const statusMap = {
// //       pending: { text: 'Pending NGO Approval', color: 'yellow' },
// //       ngo_approved: { text: 'Approved by NGO', color: 'green' },
// //       claimed: { text: 'Claimed by Volunteer', color: 'blue' },
// //       completed: { text: 'Delivered', color: 'purple' },
// //     };
// //     return (
// //       <span className={`px-2 py-1 bg-${statusMap[status]?.color}-100 text-${statusMap[status]?.color}-800 rounded-full text-sm`}>
// //         {statusMap[status]?.text || status}
// //       </span>
// //     );
// //   };

// //   return (
// //     <div className="min-h-screen pt-20 px-4">
// //       <div className="max-w-7xl mx-auto">
// //         <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8">
// //           <h1 className="text-3xl font-bold">Donor Dashboard</h1>
// //           <p className="text-neutral-600">Manage your food donations and track your impact</p>
// //         </motion.div>

// //         <div className="grid md:grid-cols-2 gap-8">
// //           {/* Donations Section */}
// //           <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card p-6 rounded-2xl">
// //             <div className="flex justify-between items-center mb-6">
// //               <h2 className="text-xl font-semibold">Your Donations</h2>
// //               <Link to="/donor/donate">
// //                 <Button>
// //                   <Plus className="w-4 h-4 mr-2" />
// //                   Add New Donation
// //                 </Button>
// //               </Link>
// //             </div>

// //             {loading ? (
// //               <p>Loading...</p>
// //             ) : donations.length > 0 ? (
// //               <div className="space-y-4">
// //                 {donations.map((donation) => (
// //                   <div key={donation._id} className="p-4 bg-gray-100/50 rounded-lg">
// //                     <div className="flex justify-between items-start">
// //                       <div>
// //                         <h3 className="font-medium">{donation.title}</h3>
// //                         <p className="text-sm text-neutral-600 mt-1">{donation.quantity} servings</p>
// //                       </div>
// //                       {getDonationStatusBadge(donation.status)}
// //                     </div>
// //                     <div className="mt-3 text-sm text-neutral-600">
// //                       <p>Pickup Time: {donation.pickupTime}</p>
// //                       {donation.ngoApprovedAt && (
// //                         <p className="mt-1">Approved at: {new Date(donation.ngoApprovedAt).toLocaleString()}</p>
// //                       )}
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //             ) : (
// //               <div className="text-center py-8">
// //                 <Package className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
// //                 <p className="text-neutral-600">No donations yet</p>
// //                 <p className="text-sm text-neutral-500 mt-1">Start by adding your first donation</p>
// //               </div>
// //             )}
// //           </motion.div>

// //           {/* Donation Requests */}
// //           {/* <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="glass-card p-6 rounded-2xl">
// //             <h2 className="text-xl font-semibold mb-6">Donation Requests</h2>
// //             {donationRequests.length > 0 ? (      //> change to >=
// //               <div className="space-y-4">
// //                 {donationRequests.map((request) => (
// //                   <div key={request._id} className="bg-white/50 p-4 rounded-lg">
// //                     <div className="flex justify-between items-start mb-2">
// //                       <h3 className="font-medium">{request.title}</h3>
// //                       <span className="text-sm text-neutral-600">{request.quantity} servings</span>
// //                     </div>
// //                     <p className="text-sm text-neutral-600 mb-3">{request.description}</p>
// //                     <div className="flex flex-wrap gap-2 mb-3">
// //                       {request.dietaryRequirements?.map((req, index) => (
// //                         <span key={index} className="text-xs bg-neutral-100 px-2 py-1 rounded-full">
// //                           {req}
// //                         </span>
// //                       ))}
// //                     </div>
// //                     <div className="flex items-center justify-between">
// //                       <span className="text-sm text-neutral-600 flex items-center">
// //                         <Clock className="w-4 h-4 mr-1" />
// //                         Needed by {new Date(request.requiredBy).toLocaleDateString()}
// //                       </span>
// //                       <Button size="sm" onClick={() => handleAcceptRequest(request._id)}>
// //                         Accept Request
// //                       </Button>
// //                     </div>
// //                   </div>
// //                 ))}
// //               </div>
// //             ) : (
// //               <div className="text-center py-8">
// //                 <Clock className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
// //                 <p className="text-neutral-600">No pending requests</p>
// //                 <p className="text-sm text-neutral-500 mt-1">Check back later for new requests</p>
// //               </div>
// //             )}
// //           </motion.div> */}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }




// // // import React from 'react';
// // // import { motion } from 'framer-motion';
// // // import { Button } from '@/components/ui/button';
// // // import { Plus, Package, CheckCircle2, Clock } from 'lucide-react';
// // // import { Link } from 'react-router-dom';
// // // import { useStore } from '@/lib/store';

// // // export function DonorDashboard() {
// // //   const donations = useStore((state) => state.donations) ?? [];
// // //   const donationRequests = useStore((state) => state.donationRequests) ?? [];
// // //   const acceptDonationRequest = useStore((state) => state.acceptDonationRequest);

// // //   // Filter donations for the current donor (using 'Current Donor' as example)
// // //   const myDonations = donations.filter(d => d.donorName === 'Current Donor');
// // //   const pendingRequests = donationRequests.filter(r => r.status === 'pending');

// // //   const handleAcceptRequest = (requestId) => {
// // //     acceptDonationRequest(requestId, 'donor-1');
// // //   };

// // //   const getDonationStatusBadge = (status) => {
// // //     switch (status) {
// // //       case 'pending':
// // //         return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">Pending NGO Approval</span>;
// // //       case 'ngo_approved':
// // //         return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">Approved by NGO</span>;
// // //       case 'claimed':
// // //         return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Claimed by Volunteer</span>;
// // //       case 'completed':
// // //         return <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">Delivered</span>;
// // //       default:
// // //         return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">{status}</span>;
// // //     }
// // //   };

// // //   return (
// // //     <div className="min-h-screen pt-20 px-4">
// // //       <div className="max-w-7xl mx-auto">
// // //         <motion.div
// // //           initial={{ opacity: 0 }}
// // //           animate={{ opacity: 1 }}
// // //           className="mb-8"
// // //         >
// // //           <h1 className="text-3xl font-bold">Donor Dashboard</h1>
// // //           <p className="text-neutral-600">Manage your food donations and track your impact</p>
// // //         </motion.div>

// // //         <div className="grid md:grid-cols-2 gap-8">
// // //           {/* Donations Section */}
// // //           <motion.div
// // //             initial={{ opacity: 0, y: 20 }}
// // //             animate={{ opacity: 1, y: 0 }}
// // //             className="glass-card p-6 rounded-2xl"
// // //           >
// // //             <div className="flex justify-between items-center mb-6">
// // //               <h2 className="text-xl font-semibold">Your Donations</h2>
// // //               <Link to="/donor/donate">
// // //                 <Button>
// // //                   <Plus className="w-4 h-4 mr-2" />
// // //                   Add New Donation
// // //                 </Button>
// // //               </Link>
// // //             </div>

// // //             {myDonations.length > 0 ? (
// // //               <div className="space-y-4">
// // //                 {myDonations.map((donation) => (
// // //                   <div key={donation.id} className="p-4 bg-gray-100/50 rounded-lg">
// // //                     <div className="flex justify-between items-start">
// // //                       <div>
// // //                         <h3 className="font-medium">{donation.title}</h3>
// // //                         <p className="text-sm text-neutral-600 mt-1">
// // //                           {donation.quantity} servings
// // //                         </p>
// // //                       </div>
// // //                       {getDonationStatusBadge(donation.status)}
// // //                     </div>
// // //                     <div className="mt-3 text-sm text-neutral-600">
// // //                       <p>Pickup Time: {donation.pickupTime}</p>
// // //                       {donation.ngoApprovedAt && (
// // //                         <p className="mt-1">
// // //                           Approved at: {new Date(donation.ngoApprovedAt).toLocaleString()}
// // //                         </p>
// // //                       )}
// // //                     </div>
// // //                   </div>
// // //                 ))}
// // //               </div>
// // //             ) : (
// // //               <div className="text-center py-8">
// // //                 <Package className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
// // //                 <p className="text-neutral-600">No donations yet</p>
// // //                 <p className="text-sm text-neutral-500 mt-1">Start by adding your first donation</p>
// // //               </div>
// // //             )}
// // //           </motion.div>

// // //           {/* Donation Requests */}
// // //           <motion.div
// // //             initial={{ opacity: 0, y: 20 }}
// // //             animate={{ opacity: 1, y: 0 }}
// // //             transition={{ delay: 0.1 }}
// // //             className="glass-card p-6 rounded-2xl"
// // //           >
// // //             <h2 className="text-xl font-semibold mb-6">Donation Requests</h2>
// // //             {pendingRequests.length > 0 ? (
// // //               <div className="space-y-4">
// // //                 {pendingRequests.map((request) => (
// // //                   <div key={request.id} className="bg-white/50 p-4 rounded-lg">
// // //                     <div className="flex justify-between items-start mb-2">
// // //                       <h3 className="font-medium">{request.title}</h3>
// // //                       <span className="text-sm text-neutral-600">
// // //                         {request.quantity} servings
// // //                       </span>
// // //                     </div>
// // //                     <p className="text-sm text-neutral-600 mb-3">
// // //                       {request.description}
// // //                     </p>
// // //                     <div className="flex flex-wrap gap-2 mb-3">
// // //                       {request.dietaryRequirements.map((req, index) => (
// // //                         <span
// // //                           key={index}
// // //                           className="text-xs bg-neutral-100 px-2 py-1 rounded-full"
// // //                         >
// // //                           {req}
// // //                         </span>
// // //                       ))}
// // //                     </div>
// // //                     <div className="flex items-center justify-between">
// // //                       <span className="text-sm text-neutral-600 flex items-center">
// // //                         <Clock className="w-4 h-4 mr-1" />
// // //                         Needed by {new Date(request.requiredBy).toLocaleDateString()}
// // //                       </span>
// // //                       <Button
// // //                         size="sm"
// // //                         onClick={() => handleAcceptRequest(request.id)}
// // //                       >
// // //                         Accept Request
// // //                       </Button>
// // //                     </div>
// // //                   </div>
// // //                 ))}
// // //               </div>
// // //             ) : (
// // //               <div className="text-center py-8">
// // //                 <Clock className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
// // //                 <p className="text-neutral-600">No pending requests</p>
// // //                 <p className="text-sm text-neutral-500 mt-1">Check back later for new requests</p>
// // //               </div>
// // //             )}
// // //           </motion.div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // }
