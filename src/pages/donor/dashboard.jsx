// import React from 'react';
// import { motion } from 'framer-motion';
// import { Button } from '@/components/ui/button';
// import { Plus, Package, CheckCircle2, Clock } from 'lucide-react';
// import { Link } from 'react-router-dom';
// import { useStore } from '@/lib/store';

// export function DonorDashboard() {
//   const donations = useStore((state) => state.donations) ?? [];
//   const donationRequests = useStore((state) => state.donationRequests) ?? [];
//   const acceptDonationRequest = useStore((state) => state.acceptDonationRequest);

//   // Filter donations for the current donor (using 'Current Donor' as example)
//   const myDonations = donations.filter(d => d.donorName === 'Current Donor');
//   const pendingRequests = donationRequests.filter(r => r.status === 'pending');

//   const handleAcceptRequest = (requestId) => {
//     acceptDonationRequest(requestId, 'donor-1');
//   };

//   const getDonationStatusBadge = (status) => {
//     switch (status) {
//       case 'pending':
//         return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">Pending NGO Approval</span>;
//       case 'ngo_approved':
//         return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">Approved by NGO</span>;
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
//                   <div key={donation.id} className="p-4 bg-gray-100/50 rounded-lg">
//                     <div className="flex justify-between items-start">
//                       <div>
//                         <h3 className="font-medium">{donation.title}</h3>
//                         <p className="text-sm text-neutral-600 mt-1">
//                           {donation.quantity} servings
//                         </p>
//                       </div>
//                       {getDonationStatusBadge(donation.status)}
//                     </div>
//                     <div className="mt-3 text-sm text-neutral-600">
//                       <p>Pickup Time: {donation.pickupTime}</p>
//                       {donation.ngoApprovedAt && (
//                         <p className="mt-1">
//                           Approved at: {new Date(donation.ngoApprovedAt).toLocaleString()}
//                         </p>
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

//           {/* Donation Requests */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.1 }}
//             className="glass-card p-6 rounded-2xl"
//           >
//             <h2 className="text-xl font-semibold mb-6">Donation Requests</h2>
//             {pendingRequests.length > 0 ? (
//               <div className="space-y-4">
//                 {pendingRequests.map((request) => (
//                   <div key={request.id} className="bg-white/50 p-4 rounded-lg">
//                     <div className="flex justify-between items-start mb-2">
//                       <h3 className="font-medium">{request.title}</h3>
//                       <span className="text-sm text-neutral-600">
//                         {request.quantity} servings
//                       </span>
//                     </div>
//                     <p className="text-sm text-neutral-600 mb-3">
//                       {request.description}
//                     </p>
//                     <div className="flex flex-wrap gap-2 mb-3">
//                       {request.dietaryRequirements.map((req, index) => (
//                         <span
//                           key={index}
//                           className="text-xs bg-neutral-100 px-2 py-1 rounded-full"
//                         >
//                           {req}
//                         </span>
//                       ))}
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm text-neutral-600 flex items-center">
//                         <Clock className="w-4 h-4 mr-1" />
//                         Needed by {new Date(request.requiredBy).toLocaleDateString()}
//                       </span>
//                       <Button
//                         size="sm"
//                         onClick={() => handleAcceptRequest(request.id)}
//                       >
//                         Accept Request
//                       </Button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-8">
//                 <Clock className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
//                 <p className="text-neutral-600">No pending requests</p>
//                 <p className="text-sm text-neutral-500 mt-1">Check back later for new requests</p>
//               </div>
//             )}
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   );
// }




import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Plus, Package, CheckCircle2, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '@/lib/store';

export function DonorDashboard() {
  const donations = useStore((state) => state.donations) ?? [];
  const donationRequests = useStore((state) => state.donationRequests) ?? [];
  const acceptDonationRequest = useStore((state) => state.acceptDonationRequest);

  // Filter donations for the current donor (using 'Current Donor' as example)
  const myDonations = donations.filter(d => d.donorID === 1);
  const pendingRequests = donationRequests.filter(r => r.status === 'pending');

  const handleAcceptRequest = (requestId) => {
    acceptDonationRequest(requestId, 'donor-1');
  };

  const getDonationStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">Pending NGO Approval</span>;
      case 'ngo_approved':
        return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">Approved by NGO</span>;
      case 'claimed':
        return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Claimed by Volunteer</span>;
      case 'completed':
        return <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">Delivered</span>;
      default:
        return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">{status}</span>;
    }
  };


  

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold">Donor Dashboard</h1>
          <p className="text-neutral-600">Manage your food donations and track your impact</p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Donations Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 rounded-2xl relative"
          >
            <div className='gradient'/>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Your Donations</h2>
              <Link to="/donor/donate">
                <Button>
                  <Plus className="w-4 h-4 mr-2" />
                  Add New Donation
                </Button>
              </Link>
            </div>

            {myDonations.length > 0 ? (
              <div className="space-y-4">
                {myDonations.map((donation) => (
                  <div key={donation.id} className="p-4 bg-gray-100/50 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{donation.title}</h3>
                        <p className="text-sm text-neutral-600 mt-1">
                          {donation.quantity} servings
                        </p>
                      </div>
                      {getDonationStatusBadge(donation.status)}
                    </div>
                    <div className="mt-3 text-sm text-neutral-600">
                      <p>Pickup Time: {donation.pickupTime}</p>
                      {donation.ngoApprovedAt && (
                        <p className="mt-1">
                          Approved at: {new Date(donation.ngoApprovedAt).toLocaleString()}
                        </p>
                      )}
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

          {/* Donation Requests */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 rounded-2xl relative"
          >
            <div className='gradient'/>
            <h2 className="text-xl font-semibold mb-6">Donation Requests</h2>
            {pendingRequests.length > 0 ? (
              <div className="space-y-4">
                {pendingRequests.map((request) => (
                  <div key={request.id} className="bg-white/50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{request.title}</h3>
                      <span className="text-sm text-neutral-600">
                        {request.quantity} servings
                      </span>
                    </div>
                    <p className="text-sm text-neutral-600 mb-3">
                      {request.description}
                    </p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {request.dietaryRequirements.map((req, index) => (
                        <span
                          key={index}
                          className="text-xs bg-neutral-100 px-2 py-1 rounded-full"
                        >
                          {req}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-neutral-600 flex items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        Needed by {new Date(request.requiredBy).toLocaleDateString()}
                      </span>
                      <Button
                        size="sm"
                        onClick={() => handleAcceptRequest(request.id)}
                      >
                        Accept Request
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Clock className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
                <p className="text-neutral-600">No pending requests</p>
                <p className="text-sm text-neutral-500 mt-1">Check back later for new requests</p>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}



// import React, { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';
// import { Button } from '@/components/ui/button';
// import { Plus, Package, CheckCircle2, Clock } from 'lucide-react';
// import { Link } from 'react-router-dom';


// export function DonorDashboard() {
//   const [donations, setDonations] = useState([]);
//   const [donationRequests, setDonationRequests] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         // Fetch donations
//         const donationsResponse = await fetch('http://localhost:5000/donations');
//         if (!donationsResponse.ok) {
//           throw new Error('Failed to fetch donations');
//         }
//         const donationsData = await donationsResponse.json();
//         setDonations(donationsData);

//         // Fetch donation requests
//         const requestsResponse = await fetch('http://localhost:5000/donation-requests');
//         if (!requestsResponse.ok) {
//           throw new Error('Failed to fetch donation requests');
//         }
//         const requestsData = await requestsResponse.json();
//         setDonationRequests(requestsData);

//       } catch (err) {
//         setError(err instanceof Error ? err.message : 'An error occurred');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchData();
//   }, []);

//   const handleAcceptRequest = async (requestId) => {
//     try {
//       const response = await fetch(`http://localhost:5000/donation-requests/${requestId}/accept`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ donorId: 'donor-1' }), // Replace with actual donor ID
//       });

//       if (!response.ok) {
//         throw new Error('Failed to accept request');
//       }

//       // Update local state
//       setDonationRequests(prev =>
//         prev.map(request =>
//           request._id === requestId
//             ? { ...request, status: 'accepted' }
//             : request
//         )
//       );
//     } catch (error) {
//       console.error('Error accepting request:', error);
//     }
//   };

//   // Filter donations for the current donor (using 'Current Donor' as example)
//   const myDonations = donations.filter(d => d.donorName === 'Current Donor');
//   const pendingRequests = donationRequests.filter(r => r.status === 'pending');

//   const getDonationStatusBadge = (status) => {
//     switch (status) {
//       case 'pending':
//         return <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">Pending NGO Approval</span>;
//       case 'ngo_approved':
//         return <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">Approved by NGO</span>;
//       case 'claimed':
//         return <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">Claimed by Volunteer</span>;
//       case 'completed':
//         return <span className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-sm">Delivered</span>;
//       default:
//         return <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-sm">{status}</span>;
//     }
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
//                       {getDonationStatusBadge(donation.status)}
//                     </div>
//                     <div className="mt-3 text-sm text-neutral-600">
//                       <p>Pickup Time: {donation.pickupTime}</p>
//                       <p className="mt-1">Food Type: {donation.foodType}</p>
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

//           {/* Donation Requests */}
//           <motion.div
//             initial={{ opacity: 0, y: 20 }}
//             animate={{ opacity: 1, y: 0 }}
//             transition={{ delay: 0.1 }}
//             className="glass-card p-6 rounded-2xl"
//           >
//             <h2 className="text-xl font-semibold mb-6">Donation Requests</h2>
//             {pendingRequests.length > 0 ? (
//               <div className="space-y-4">
//                 {pendingRequests.map((request) => (
//                   <div key={request._id} className="bg-white/50 p-4 rounded-lg">
//                     <div className="flex justify-between items-start mb-2">
//                       <h3 className="font-medium">{request.title}</h3>
//                       <span className="text-sm text-neutral-600">
//                         {request.quantity} servings
//                       </span>
//                     </div>
//                     <p className="text-sm text-neutral-600 mb-3">
//                       {request.description}
//                     </p>
//                     <div className="flex flex-wrap gap-2 mb-3">
//                       {request.dietaryRequirements.map((req, index) => (
//                         <span
//                           key={index}
//                           className="text-xs bg-neutral-100 px-2 py-1 rounded-full"
//                         >
//                           {req}
//                         </span>
//                       ))}
//                     </div>
//                     <div className="flex items-center justify-between">
//                       <span className="text-sm text-neutral-600 flex items-center">
//                         <Clock className="w-4 h-4 mr-1" />
//                         Needed by {new Date(request.requiredBy).toLocaleDateString()}
//                       </span>
//                       <Button
//                         size="sm"
//                         onClick={() => handleAcceptRequest(request._id)}
//                       >
//                         Accept Request
//                       </Button>
//                     </div>
//                   </div>
//                 ))}
//               </div>
//             ) : (
//               <div className="text-center py-8">
//                 <Clock className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
//                 <p className="text-neutral-600">No pending requests</p>
//                 <p className="text-sm text-neutral-500 mt-1">Check back later for new requests</p>
//               </div>
//             )}
//           </motion.div>
//         </div>
//       </div>
//     </div>
//   );
// }

