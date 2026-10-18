export interface CityItem {
  name: string;
  state: string;
  isPopular?: boolean;
}

export const POPULAR_INDIAN_CITIES = [
  'Mumbai',
  'Delhi-NCR',
  'Bengaluru',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Pune',
  'Ahmedabad',
  'Jaipur',
  'Goa',
  'Chandigarh',
  'Lucknow',
  'Kochi',
  'Indore',
  'Bhopal',
  'Surat',
  'Varanasi',
  'Patna',
  'Coimbatore',
  'Vadodara',
] as const;

export const INDIAN_CITIES_DATA: CityItem[] = [
  // Metro & Major Enclaves
  { name: 'Mumbai', state: 'Maharashtra', isPopular: true },
  { name: 'Delhi-NCR', state: 'Delhi & NCR', isPopular: true },
  { name: 'Bengaluru', state: 'Karnataka', isPopular: true },
  { name: 'Hyderabad', state: 'Telangana', isPopular: true },
  { name: 'Chennai', state: 'Tamil Nadu', isPopular: true },
  { name: 'Kolkata', state: 'West Bengal', isPopular: true },
  { name: 'Pune', state: 'Maharashtra', isPopular: true },
  { name: 'Ahmedabad', state: 'Gujarat', isPopular: true },
  { name: 'Jaipur', state: 'Rajasthan', isPopular: true },
  { name: 'Goa', state: 'Goa', isPopular: true },
  { name: 'Chandigarh', state: 'Chandigarh & Punjab', isPopular: true },
  { name: 'Lucknow', state: 'Uttar Pradesh', isPopular: true },
  { name: 'Kochi', state: 'Kerala', isPopular: true },
  { name: 'Indore', state: 'Madhya Pradesh', isPopular: true },
  { name: 'Bhopal', state: 'Madhya Pradesh', isPopular: true },
  { name: 'Surat', state: 'Gujarat', isPopular: true },
  { name: 'Varanasi', state: 'Uttar Pradesh', isPopular: true },
  { name: 'Patna', state: 'Bihar', isPopular: true },
  { name: 'Coimbatore', state: 'Tamil Nadu', isPopular: true },
  { name: 'Vadodara', state: 'Gujarat', isPopular: true },

  // Maharashtra
  { name: 'Nagpur', state: 'Maharashtra' },
  { name: 'Nashik', state: 'Maharashtra' },
  { name: 'Thane', state: 'Maharashtra' },
  { name: 'Chhatrapati Sambhaji Nagar', state: 'Maharashtra' },
  { name: 'Solapur', state: 'Maharashtra' },
  { name: 'Kolhapur', state: 'Maharashtra' },
  { name: 'Navi Mumbai', state: 'Maharashtra' },
  { name: 'Amravati', state: 'Maharashtra' },
  { name: 'Nanded', state: 'Maharashtra' },
  { name: 'Sangli', state: 'Maharashtra' },
  { name: 'Jalgaon', state: 'Maharashtra' },
  { name: 'Akola', state: 'Maharashtra' },
  { name: 'Latur', state: 'Maharashtra' },
  { name: 'Dhule', state: 'Maharashtra' },
  { name: 'Ahmednagar', state: 'Maharashtra' },
  { name: 'Chandrapur', state: 'Maharashtra' },
  { name: 'Satara', state: 'Maharashtra' },
  { name: 'Panvel', state: 'Maharashtra' },
  { name: 'Kalyan-Dombivli', state: 'Maharashtra' },
  { name: 'Vasai-Virar', state: 'Maharashtra' },

  // Delhi & NCR
  { name: 'New Delhi', state: 'Delhi & NCR' },
  { name: 'Noida', state: 'Delhi & NCR' },
  { name: 'Greater Noida', state: 'Delhi & NCR' },
  { name: 'Gurugram', state: 'Delhi & NCR' },
  { name: 'Faridabad', state: 'Delhi & NCR' },
  { name: 'Ghaziabad', state: 'Delhi & NCR' },

  // Karnataka
  { name: 'Mysuru', state: 'Karnataka' },
  { name: 'Hubballi-Dharwad', state: 'Karnataka' },
  { name: 'Mangaluru', state: 'Karnataka' },
  { name: 'Belagavi', state: 'Karnataka' },
  { name: 'Kalaburagi', state: 'Karnataka' },
  { name: 'Davanagere', state: 'Karnataka' },
  { name: 'Ballari', state: 'Karnataka' },
  { name: 'Shivamogga', state: 'Karnataka' },
  { name: 'Tumakuru', state: 'Karnataka' },
  { name: 'Udupi', state: 'Karnataka' },
  { name: 'Bidar', state: 'Karnataka' },

  // Tamil Nadu
  { name: 'Madurai', state: 'Tamil Nadu' },
  { name: 'Tiruchirappalli', state: 'Tamil Nadu' },
  { name: 'Salem', state: 'Tamil Nadu' },
  { name: 'Tirunelveli', state: 'Tamil Nadu' },
  { name: 'Erode', state: 'Tamil Nadu' },
  { name: 'Vellore', state: 'Tamil Nadu' },
  { name: 'Thoothukudi', state: 'Tamil Nadu' },
  { name: 'Dindigul', state: 'Tamil Nadu' },
  { name: 'Thanjavur', state: 'Tamil Nadu' },
  { name: 'Kanchipuram', state: 'Tamil Nadu' },
  { name: 'Nagercoil', state: 'Tamil Nadu' },

  // Telangana
  { name: 'Warangal', state: 'Telangana' },
  { name: 'Nizamabad', state: 'Telangana' },
  { name: 'Karimnagar', state: 'Telangana' },
  { name: 'Ramagundam', state: 'Telangana' },
  { name: 'Khammam', state: 'Telangana' },
  { name: 'Mahbubnagar', state: 'Telangana' },
  { name: 'Nalgonda', state: 'Telangana' },

  // Andhra Pradesh
  { name: 'Visakhapatnam', state: 'Andhra Pradesh' },
  { name: 'Vijayawada', state: 'Andhra Pradesh' },
  { name: 'Guntur', state: 'Andhra Pradesh' },
  { name: 'Nellore', state: 'Andhra Pradesh' },
  { name: 'Kurnool', state: 'Andhra Pradesh' },
  { name: 'Kakinada', state: 'Andhra Pradesh' },
  { name: 'Rajahmundry', state: 'Andhra Pradesh' },
  { name: 'Tirupati', state: 'Andhra Pradesh' },
  { name: 'Kadapa', state: 'Andhra Pradesh' },
  { name: 'Anantapur', state: 'Andhra Pradesh' },
  { name: 'Vizianagaram', state: 'Andhra Pradesh' },
  { name: 'Eluru', state: 'Andhra Pradesh' },

  // Gujarat
  { name: 'Rajkot', state: 'Gujarat' },
  { name: 'Bhavnagar', state: 'Gujarat' },
  { name: 'Jamnagar', state: 'Gujarat' },
  { name: 'Junagadh', state: 'Gujarat' },
  { name: 'Gandhinagar', state: 'Gujarat' },
  { name: 'Anand', state: 'Gujarat' },
  { name: 'Navsari', state: 'Gujarat' },
  { name: 'Morbi', state: 'Gujarat' },
  { name: 'Bharuch', state: 'Gujarat' },
  { name: 'Porbandar', state: 'Gujarat' },
  { name: 'Vapi', state: 'Gujarat' },

  // Uttar Pradesh
  { name: 'Kanpur', state: 'Uttar Pradesh' },
  { name: 'Agra', state: 'Uttar Pradesh' },
  { name: 'Prayagraj', state: 'Uttar Pradesh' },
  { name: 'Meerut', state: 'Uttar Pradesh' },
  { name: 'Bareilly', state: 'Uttar Pradesh' },
  { name: 'Aligarh', state: 'Uttar Pradesh' },
  { name: 'Moradabad', state: 'Uttar Pradesh' },
  { name: 'Saharanpur', state: 'Uttar Pradesh' },
  { name: 'Gorakhpur', state: 'Uttar Pradesh' },
  { name: 'Jhansi', state: 'Uttar Pradesh' },
  { name: 'Mathura', state: 'Uttar Pradesh' },
  { name: 'Ayodhya', state: 'Uttar Pradesh' },
  { name: 'Firozabad', state: 'Uttar Pradesh' },
  { name: 'Muzaffarnagar', state: 'Uttar Pradesh' },
  { name: 'Rampur', state: 'Uttar Pradesh' },
  { name: 'Shahjahanpur', state: 'Uttar Pradesh' },

  // Rajasthan
  { name: 'Jodhpur', state: 'Rajasthan' },
  { name: 'Udaipur', state: 'Rajasthan' },
  { name: 'Kota', state: 'Rajasthan' },
  { name: 'Bikaner', state: 'Rajasthan' },
  { name: 'Ajmer', state: 'Rajasthan' },
  { name: 'Bhilwara', state: 'Rajasthan' },
  { name: 'Alwar', state: 'Rajasthan' },
  { name: 'Sikar', state: 'Rajasthan' },
  { name: 'Pali', state: 'Rajasthan' },
  { name: 'Sri Ganganagar', state: 'Rajasthan' },
  { name: 'Bharatpur', state: 'Rajasthan' },
  { name: 'Jaisalmer', state: 'Rajasthan' },
  { name: 'Mount Abu', state: 'Rajasthan' },

  // West Bengal
  { name: 'Howrah', state: 'West Bengal' },
  { name: 'Siliguri', state: 'West Bengal' },
  { name: 'Durgapur', state: 'West Bengal' },
  { name: 'Asansol', state: 'West Bengal' },
  { name: 'Bardhaman', state: 'West Bengal' },
  { name: 'Kharagpur', state: 'West Bengal' },
  { name: 'Malda', state: 'West Bengal' },
  { name: 'Darjeeling', state: 'West Bengal' },
  { name: 'Jalpaiguri', state: 'West Bengal' },

  // Madhya Pradesh
  { name: 'Gwalior', state: 'Madhya Pradesh' },
  { name: 'Jabalpur', state: 'Madhya Pradesh' },
  { name: 'Ujjain', state: 'Madhya Pradesh' },
  { name: 'Sagar', state: 'Madhya Pradesh' },
  { name: 'Dewas', state: 'Madhya Pradesh' },
  { name: 'Satna', state: 'Madhya Pradesh' },
  { name: 'Ratlam', state: 'Madhya Pradesh' },
  { name: 'Rewa', state: 'Madhya Pradesh' },
  { name: 'Singrauli', state: 'Madhya Pradesh' },
  { name: 'Katni', state: 'Madhya Pradesh' },

  // Punjab
  { name: 'Ludhiana', state: 'Punjab' },
  { name: 'Amritsar', state: 'Punjab' },
  { name: 'Jalandhar', state: 'Punjab' },
  { name: 'Patiala', state: 'Punjab' },
  { name: 'Bathinda', state: 'Punjab' },
  { name: 'Mohali', state: 'Punjab' },
  { name: 'Pathankot', state: 'Punjab' },
  { name: 'Hoshiarpur', state: 'Punjab' },

  // Haryana
  { name: 'Panipat', state: 'Haryana' },
  { name: 'Ambala', state: 'Haryana' },
  { name: 'Karnal', state: 'Haryana' },
  { name: 'Rohtak', state: 'Haryana' },
  { name: 'Hisar', state: 'Haryana' },
  { name: 'Sonipat', state: 'Haryana' },
  { name: 'Panchkula', state: 'Haryana' },
  { name: 'Yamunanagar', state: 'Haryana' },

  // Kerala
  { name: 'Thiruvananthapuram', state: 'Kerala' },
  { name: 'Kozhikode', state: 'Kerala' },
  { name: 'Thrissur', state: 'Kerala' },
  { name: 'Kollam', state: 'Kerala' },
  { name: 'Alappuzha', state: 'Kerala' },
  { name: 'Palakkad', state: 'Kerala' },
  { name: 'Kannur', state: 'Kerala' },
  { name: 'Kottayam', state: 'Kerala' },
  { name: 'Wayanad', state: 'Kerala' },

  // Bihar
  { name: 'Gaya', state: 'Bihar' },
  { name: 'Bhagalpur', state: 'Bihar' },
  { name: 'Muzaffarpur', state: 'Bihar' },
  { name: 'Purnia', state: 'Bihar' },
  { name: 'Darbhanga', state: 'Bihar' },
  { name: 'Bihar Sharif', state: 'Bihar' },
  { name: 'Arrah', state: 'Bihar' },
  { name: 'Begusarai', state: 'Bihar' },

  // Odisha
  { name: 'Bhubaneswar', state: 'Odisha' },
  { name: 'Cuttack', state: 'Odisha' },
  { name: 'Rourkela', state: 'Odisha' },
  { name: 'Berhampur', state: 'Odisha' },
  { name: 'Sambalpur', state: 'Odisha' },
  { name: 'Puri', state: 'Odisha' },
  { name: 'Balasore', state: 'Odisha' },

  // Assam & North East
  { name: 'Guwahati', state: 'Assam' },
  { name: 'Silchar', state: 'Assam' },
  { name: 'Dibrugarh', state: 'Assam' },
  { name: 'Jorhat', state: 'Assam' },
  { name: 'Tezpur', state: 'Assam' },
  { name: 'Shillong', state: 'Meghalaya' },
  { name: 'Agartala', state: 'Tripura' },
  { name: 'Aizawl', state: 'Mizoram' },
  { name: 'Imphal', state: 'Manipur' },
  { name: 'Kohima', state: 'Nagaland' },
  { name: 'Dimapur', state: 'Nagaland' },
  { name: 'Itanagar', state: 'Arunachal Pradesh' },
  { name: 'Gangtok', state: 'Sikkim' },

  // Uttarakhand & Himachal Pradesh
  { name: 'Dehradun', state: 'Uttarakhand' },
  { name: 'Haridwar', state: 'Uttarakhand' },
  { name: 'Rishikesh', state: 'Uttarakhand' },
  { name: 'Roorkee', state: 'Uttarakhand' },
  { name: 'Haldwani', state: 'Uttarakhand' },
  { name: 'Nainital', state: 'Uttarakhand' },
  { name: 'Mussoorie', state: 'Uttarakhand' },
  { name: 'Shimla', state: 'Himachal Pradesh' },
  { name: 'Dharamshala', state: 'Himachal Pradesh' },
  { name: 'Manali', state: 'Himachal Pradesh' },
  { name: 'Mandi', state: 'Himachal Pradesh' },
  { name: 'Solan', state: 'Himachal Pradesh' },
  { name: 'Kullu', state: 'Himachal Pradesh' },

  // Jammu & Kashmir / Ladakh
  { name: 'Srinagar', state: 'Jammu & Kashmir' },
  { name: 'Jammu', state: 'Jammu & Kashmir' },
  { name: 'Anantnag', state: 'Jammu & Kashmir' },
  { name: 'Baramulla', state: 'Jammu & Kashmir' },
  { name: 'Leh', state: 'Ladakh' },

  // Jharkhand & Chhattisgarh
  { name: 'Ranchi', state: 'Jharkhand' },
  { name: 'Jamshedpur', state: 'Jharkhand' },
  { name: 'Dhanbad', state: 'Jharkhand' },
  { name: 'Bokaro Steel City', state: 'Jharkhand' },
  { name: 'Deoghar', state: 'Jharkhand' },
  { name: 'Hazaribagh', state: 'Jharkhand' },
  { name: 'Raipur', state: 'Chhattisgarh' },
  { name: 'Bhilai', state: 'Chhattisgarh' },
  { name: 'Bilaspur', state: 'Chhattisgarh' },
  { name: 'Korba', state: 'Chhattisgarh' },
  { name: 'Durg', state: 'Chhattisgarh' },

  // Goa & Union Territories
  { name: 'Panaji', state: 'Goa' },
  { name: 'Margao', state: 'Goa' },
  { name: 'Vasco da Gama', state: 'Goa' },
  { name: 'Pondicherry', state: 'Puducherry' },
  { name: 'Port Blair', state: 'Andaman & Nicobar' },
  { name: 'Daman', state: 'Dadra and Nagar Haveli & Daman and Diu' },
  { name: 'Silvassa', state: 'Dadra and Nagar Haveli & Daman and Diu' },
];

// Unique alphabetically sorted array of all city names
export const ALL_INDIAN_CITIES = Array.from(
  new Set(INDIAN_CITIES_DATA.map((c) => c.name))
).sort((a, b) => a.localeCompare(b));

// Group cities by state
export const CITIES_BY_STATE: Record<string, string[]> = INDIAN_CITIES_DATA.reduce(
  (acc, item) => {
    if (!acc[item.state]) {
      acc[item.state] = [];
    }
    if (!acc[item.state].includes(item.name)) {
      acc[item.state].push(item.name);
    }
    return acc;
  },
  {} as Record<string, string[]>
);

// Search helper
export function filterIndianCities(query: string): CityItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return INDIAN_CITIES_DATA;
  return INDIAN_CITIES_DATA.filter(
    (c) => c.name.toLowerCase().includes(q) || c.state.toLowerCase().includes(q)
  );
}
