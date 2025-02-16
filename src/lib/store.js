import { create } from 'zustand';

/**
 * @typedef {Object} Volunteer
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} phone
 * @property {number} [age]
 * @property {string} [gender]
 * @property {string} [address]
 * @property {string} [city]
 * @property {string} [pincode]
 * @property {string[]} availability
 * @property {string[]} [volunteeringTypes]
 * @property {string} vehicle
 * @property {string} experience
 * @property {string[]} areas
 * @property {string} [foodPreference]
 * @property {string} [idProof]
 * @property {number} [completedDeliveries]
 * @property {number} [rating]
 * @property {string} joinedAt
 */

/**
 * @typedef {Object} FoodDonation
 * @property {string} id
 * @property {string} title
 * @property {string} description
 * @property {number} quantity
 * @property {string} expiryDate
 * @property {string} pickupAddress
 * @property {string} pickupTime
 * @property {string} photo
 * @property {string} donorName
 * @property {string} donorPhone
 * @property {'pending' | 'ngo_approved' | 'claimed' | 'completed' | 'requested' | 'accepted'} status
 * @property {string | null} claimedBy
 * @property {string | null} claimedAt
 * @property {string | null} ngoId
 * @property {string | null} ngoApprovedAt
 * @property {{ ngoId: string, ngoName: string, requestedAt: string } | undefined} [requestedBy]
 */

/**
 * @typedef {Object} NGO
 * @property {string} id
 * @property {string} name
 * @property {string} registrationNumber
 * @property {string} contactPersonName
 * @property {string} email
 * @property {string} phone
 * @property {string} address
 * @property {string[]} areasServed
 * @property {number} beneficiariesCount
 * @property {string} storageCapacity
 * @property {string[]} dietaryPreferences
 * @property {string} registrationCertificate
 * @property {string} fssaiCompliance
 * @property {string[]} pickupTiming
 * @property {'pending' | 'approved' | 'rejected'} status
 * @property {string} createdAt
 * @property {number} [approvedDonations]
 * @property {number} [rating]
 */

/**
 * @typedef {Object} Donor
 * @property {string} id
 * @property {string} name
 * @property {string} email
 * @property {string} phone
 * @property {string} address
 * @property {'restaurant' | 'hotel' | 'catering' | 'individual' | 'other'} type
 * @property {string} [registrationNumber]
 * @property {string} [fssaiLicense]
 * @property {string} [contactPerson]
 * @property {number} totalDonations
 * @property {number} [rating]
 * @property {string} joinedAt
 */

/**
 * @typedef {Object} DonationRequest
 * @property {string} id
 * @property {string} ngoId
 * @property {string} title
 * @property {string} description
 * @property {number} quantity
 * @property {string} requiredBy
 * @property {string[]} dietaryRequirements
 * @property {'pending' | 'accepted' | 'fulfilled'} status
 * @property {string} createdAt
 */

/**
 * @typedef {Object} AppState
 * @property {Volunteer[]} volunteers
 * @property {FoodDonation[]} donations
 * @property {NGO[]} ngos
 * @property {Donor[]} donors
 * @property {DonationRequest[]} donationRequests
 * @property {{ id: string, type: 'volunteer' | 'ngo' | 'donor' } | null} currentUser
 * @property {(volunteer: Omit<Volunteer, 'id' | 'completedDeliveries' | 'rating' | 'joinedAt'>) => void} addVolunteer
 * @property {(donation: Omit<FoodDonation, 'id' | 'status' | 'claimedBy' | 'claimedAt' | 'ngoId' | 'ngoApprovedAt'>) => void} addDonation
 * @property {(donationId: string, status: FoodDonation['status'], volunteerId?: string | null) => void} updateDonationStatus
 * @property {(ngo: Omit<NGO, 'id' | 'status' | 'createdAt' | 'approvedDonations' | 'rating'>) => void} addNGO
 * @property {(donationId: string, ngoId: string) => void} approveNGODonation
 * @property {(donor: Omit<Donor, 'id' | 'totalDonations' | 'rating' | 'joinedAt'>) => void} addDonor
 * @property {(user: { id: string, type: 'volunteer' | 'ngo' | 'donor' } | null) => void} setCurrentUser
 * @property {(request: Omit<DonationRequest, 'id' | 'status' | 'createdAt'>) => void} addDonationRequest
 * @property {(requestId: string, donorId: string) => void} acceptDonationRequest
 */

export const useStore = create((set) => ({
    volunteers: [],
    donations: [],
    ngos: [],
    donors: [],
    donationRequests: [],
    currentUser: null,
    addVolunteer: (volunteer) =>
        set((state) => ({
            volunteers: [
                ...state.volunteers,
                {
                    ...volunteer,
                    id: crypto.randomUUID(),
                    completedDeliveries: 0,
                    rating: 0,
                    joinedAt: new Date().toISOString()
                }
            ]
        })),
    addDonation: (donation) =>
        set((state) => ({
            donations: [
                ...state.donations,
                {
                    ...donation,
                    id: crypto.randomUUID(),
                    status: 'pending',
                    claimedBy: null,
                    claimedAt: null,
                    ngoId: null,
                    ngoApprovedAt: null
                }
            ]
        })),
    updateDonationStatus: (donationId, status, volunteerId = null) =>
        set((state) => ({
            donations: state.donations.map((donation) =>
                donation.id === donationId
                    ? {
                          ...donation,
                          status,
                          claimedBy: volunteerId,
                          claimedAt: status === 'claimed' ? new Date().toISOString() : donation.claimedAt
                      }
                    : donation
            )
        })),
    addNGO: (ngo) =>
        set((state) => ({
            ngos: [
                ...state.ngos,
                {
                    ...ngo,
                    id: crypto.randomUUID(),
                    status: 'pending',
                    createdAt: new Date().toISOString(),
                    approvedDonations: 0,
                    rating: 0
                }
            ]
        })),
    approveNGODonation: (donationId, ngoId) =>
        set((state) => ({
            donations: state.donations.map((donation) =>
                donation.id === donationId
                    ? {
                          ...donation,
                          status: 'ngo_approved',
                          ngoId,
                          ngoApprovedAt: new Date().toISOString()
                      }
                    : donation
            ),
            ngos: state.ngos.map((ngo) =>
                ngo.id === ngoId ? { ...ngo, approvedDonations: (ngo.approvedDonations || 0) + 1 } : ngo
            )
        })),
    addDonor: (donor) =>
        set((state) => ({
            donors: [
                ...state.donors,
                {
                    ...donor,
                    id: crypto.randomUUID(),
                    totalDonations: 0,
                    rating: 0,
                    joinedAt: new Date().toISOString()
                }
            ]
        })),
    setCurrentUser: (user) =>
        set(() => ({
            currentUser: user
        })),
    addDonationRequest: (request) =>
        set((state) => ({
            donationRequests: [
                ...state.donationRequests,
                {
                    ...request,
                    id: crypto.randomUUID(),
                    status: 'pending',
                    createdAt: new Date().toISOString()
                }
            ]
        })),
    acceptDonationRequest: (requestId, donorId) =>
        set((state) => ({
            donationRequests: state.donationRequests.map((request) =>
                request.id === requestId ? { ...request, status: 'accepted' } : request
            )
        }))
}));
