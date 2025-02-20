import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { MapPin, Trophy, Clock, CheckCircle2, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '@/lib/store';

export function VolunteerDashboard() {
  const donations = useStore((state) => state.donations);
  const [selectedDonation, setSelectedDonation] = React.useState(null);

  // Only show NGO-approved donations to volunteers
  const availableDonations = donations.filter(d => d.status === 'ngo_approved');
  const acceptedDonations = donations.filter(d => d.status === 'claimed' && d.claimedBy === 'volunteer-1');
  const completedDonations = donations.filter(d => d.status === 'completed' && d.claimedBy === 'volunteer-1');

  const handleAcceptDelivery = (donationId) => {
    useStore.getState().updateDonationStatus(donationId, 'claimed', 'volunteer-1');
    setSelectedDonation(null);
  };

  const handleCompleteDelivery = (donationId) => {
    useStore.getState().updateDonationStatus(donationId, 'completed', 'volunteer-1');
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
            <h1 className="text-3xl font-bold">Volunteer Dashboard</h1>
            <p className="text-neutral-600">Find nearby pickup requests and track your impact</p>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {/* Available Pickups */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-6 rounded-2xl relative"
          >
            <div className='gradient'/>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Clock className="w-5 h-5 mr-2 text-blue-500" />
              Available Pickups
            </h2>
            {availableDonations.length > 0 ? (
              <div className="space-y-4">
                {availableDonations.map((donation) => (
                  <div key={donation.id} className="bg-white/50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{donation.title}</h3>
                      <span className="text-sm text-neutral-600">
                        {donation.quantity} servings
                      </span>
                    </div>
                    <div className="text-sm text-neutral-600 mb-3">
                      <p className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {donation.pickupAddress}
                      </p>
                      <p className="flex items-center mt-1">
                        <Clock className="w-4 h-4 mr-1" />
                        Pickup at {donation.pickupTime}
                      </p>
                    </div>
                    <Button
                      onClick={() => setSelectedDonation(donation)}
                      className="w-full"
                    >
                      View Details
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-neutral-600">No available pickups at the moment</p>
            )}
          </motion.div>

          {/* Active Deliveries */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-6 rounded-2xl relative"
          >
            <div className='gradient'/>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Truck className="w-5 h-5 mr-2 text-green-500" />
              Active Deliveries
            </h2>
            {acceptedDonations.length > 0 ? (
              <div className="space-y-4">
                {acceptedDonations.map((donation) => (
                  <div key={donation.id} className="bg-white/50 p-4 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-medium">{donation.title}</h3>
                      <span className="text-sm text-neutral-600">
                        {donation.quantity} servings
                      </span>
                    </div>
                    <div className="text-sm text-neutral-600 mb-3">
                      <p className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        {donation.pickupAddress}
                      </p>
                      <p className="flex items-center mt-1">
                        <Clock className="w-4 h-4 mr-1" />
                        Pickup at {donation.pickupTime}
                      </p>
                    </div>
                    <Button
                      onClick={() => handleCompleteDelivery(donation.id)}
                      className="w-full"
                      variant="outline"
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      Mark as Delivered
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-neutral-600">No active deliveries</p>
            )}
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="glass-card p-6 rounded-2xl relative"
          >
            <div className='gradient'/>
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Trophy className="w-5 h-5 mr-2 text-yellow-500" />
              Your Stats
            </h2>
            <div className="space-y-4">
              <div className="bg-white/50 p-4 rounded-lg">
                <p className="text-neutral-600 flex justify-between">
                  <span>Deliveries Completed:</span>
                  <span className="font-medium">{completedDonations.length}</span>
                </p>
              </div>
              <div className="bg-white/50 p-4 rounded-lg">
                <p className="text-neutral-600 flex justify-between">
                  <span>Points Earned:</span>
                  <span className="font-medium">{completedDonations.length * 100}</span>
                </p>
              </div>
              <div className="bg-white/50 p-4 rounded-lg">
                <p className="text-neutral-600 flex justify-between">
                  <span>Current Rank:</span>
                  <span className="font-medium">{
                    completedDonations.length >= 10 ? 'Expert' :
                    completedDonations.length >= 5 ? 'Intermediate' :
                    'Rookie'
                  }</span>
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Donation Details Modal */}
        {selectedDonation && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4" style={{ zIndex: 1000 }}>
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
                  onClick={() => handleAcceptDelivery(selectedDonation.id)}
                  className="flex-1"
                >
                  Accept Delivery
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedDonation(null)}
                  className="flex-1"
                >
                  Close
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}