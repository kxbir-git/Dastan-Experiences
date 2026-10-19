export interface CityItem {
  name: string;
  state: string;
  isPopular?: boolean;
  aliases?: string[];
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
  'Udaipur',
  'Dehradun',
  'Amritsar',
  'Bhubaneswar',
  'Srinagar',
] as const;

export const INDIAN_CITIES_DATA: CityItem[] = [
  // Metro & Major Enclaves
  { name: 'Mumbai', state: 'Maharashtra', isPopular: true, aliases: ['Bombay', 'BOM', 'Navi Mumbai', 'Thane'] },
  { name: 'Delhi-NCR', state: 'Delhi & NCR', isPopular: true, aliases: ['Delhi', 'New Delhi', 'NCR', 'DEL', 'Gurgaon', 'Gurugram', 'Noida', 'Faridabad', 'Ghaziabad'] },
  { name: 'Bengaluru', state: 'Karnataka', isPopular: true, aliases: ['Bangalore', 'BLR'] },
  { name: 'Hyderabad', state: 'Telangana', isPopular: true, aliases: ['HYD', 'Secunderabad', 'Cyberabad'] },
  { name: 'Chennai', state: 'Tamil Nadu', isPopular: true, aliases: ['Madras', 'MAA'] },
  { name: 'Kolkata', state: 'West Bengal', isPopular: true, aliases: ['Calcutta', 'CCU'] },
  { name: 'Pune', state: 'Maharashtra', isPopular: true, aliases: ['Poona', 'PNQ'] },
  { name: 'Ahmedabad', state: 'Gujarat', isPopular: true, aliases: ['Amdavad', 'AMD'] },
  { name: 'Jaipur', state: 'Rajasthan', isPopular: true, aliases: ['Pink City', 'JAI'] },
  { name: 'Goa', state: 'Goa', isPopular: true, aliases: ['Panaji', 'North Goa', 'South Goa', 'Margao'] },
  { name: 'Chandigarh', state: 'Chandigarh & Punjab', isPopular: true, aliases: ['Tricity', 'Mohali', 'Panchkula', 'IXC'] },
  { name: 'Lucknow', state: 'Uttar Pradesh', isPopular: true, aliases: ['Awadh', 'Avadh', 'LKO'] },
  { name: 'Kochi', state: 'Kerala', isPopular: true, aliases: ['Cochin', 'Ernakulam', 'COK'] },
  { name: 'Indore', state: 'Madhya Pradesh', isPopular: true, aliases: ['IDR'] },
  { name: 'Bhopal', state: 'Madhya Pradesh', isPopular: true, aliases: ['BHO'] },
  { name: 'Surat', state: 'Gujarat', isPopular: true, aliases: ['STV'] },
  { name: 'Varanasi', state: 'Uttar Pradesh', isPopular: true, aliases: ['Kashi', 'Banaras', 'Benares', 'VNS'] },
  { name: 'Patna', state: 'Bihar', isPopular: true, aliases: ['PAT', 'Pataliputra'] },
  { name: 'Coimbatore', state: 'Tamil Nadu', isPopular: true, aliases: ['Kovai', 'CJB'] },
  { name: 'Vadodara', state: 'Gujarat', isPopular: true, aliases: ['Baroda', 'BDQ'] },
  { name: 'Udaipur', state: 'Rajasthan', isPopular: true, aliases: ['City of Lakes', 'UDR'] },
  { name: 'Dehradun', state: 'Uttarakhand', isPopular: true, aliases: ['DED', 'Doovalley'] },
  { name: 'Amritsar', state: 'Punjab', isPopular: true, aliases: ['ATQ', 'Golden Temple City'] },
  { name: 'Bhubaneswar', state: 'Odisha', isPopular: true, aliases: ['BBI', 'Temple City'] },
  { name: 'Srinagar', state: 'Jammu & Kashmir', isPopular: true, aliases: ['SXR', 'Kashmir'] },

  // Maharashtra
  { name: 'Nagpur', state: 'Maharashtra', aliases: ['NAG'] },
  { name: 'Nashik', state: 'Maharashtra', aliases: ['Nasik', 'Wine Capital'] },
  { name: 'Thane', state: 'Maharashtra' },
  { name: 'Chhatrapati Sambhaji Nagar', state: 'Maharashtra', aliases: ['Aurangabad'] },
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
  { name: 'Ahmednagar', state: 'Maharashtra', aliases: ['Ahilyanagar'] },
  { name: 'Chandrapur', state: 'Maharashtra' },
  { name: 'Satara', state: 'Maharashtra' },
  { name: 'Panvel', state: 'Maharashtra' },
  { name: 'Kalyan-Dombivli', state: 'Maharashtra' },
  { name: 'Vasai-Virar', state: 'Maharashtra' },
  { name: 'Alibaug', state: 'Maharashtra', isPopular: true, aliases: ['Alibag', 'Raigad'] },
  { name: 'Lonavala', state: 'Maharashtra', isPopular: true, aliases: ['Khandala'] },
  { name: 'Mahabaleshwar', state: 'Maharashtra', isPopular: true, aliases: ['Panchgani'] },
  { name: 'Shirdi', state: 'Maharashtra', aliases: ['Sai Nagar'] },
  { name: 'Ratnagiri', state: 'Maharashtra', aliases: ['Konkan'] },
  { name: 'Sindhudurg', state: 'Maharashtra', aliases: ['Malvan', 'Tarkarli'] },

  // Delhi & NCR
  { name: 'New Delhi', state: 'Delhi & NCR', aliases: ['Delhi', 'Central Delhi'] },
  { name: 'Gurugram', state: 'Delhi & NCR', isPopular: true, aliases: ['Gurgaon', 'Millennium City'] },
  { name: 'Noida', state: 'Delhi & NCR', isPopular: true, aliases: ['Gautam Buddha Nagar'] },
  { name: 'Greater Noida', state: 'Delhi & NCR' },
  { name: 'Faridabad', state: 'Delhi & NCR' },
  { name: 'Ghaziabad', state: 'Delhi & NCR' },

  // Karnataka
  { name: 'Mysuru', state: 'Karnataka', isPopular: true, aliases: ['Mysore', 'MYQ'] },
  { name: 'Hubballi-Dharwad', state: 'Karnataka', aliases: ['Hubli', 'Dharwad'] },
  { name: 'Mangaluru', state: 'Karnataka', isPopular: true, aliases: ['Mangalore', 'IXE'] },
  { name: 'Belagavi', state: 'Karnataka', aliases: ['Belgaum'] },
  { name: 'Kalaburagi', state: 'Karnataka', aliases: ['Gulbarga'] },
  { name: 'Davanagere', state: 'Karnataka' },
  { name: 'Ballari', state: 'Karnataka', aliases: ['Bellary'] },
  { name: 'Shivamogga', state: 'Karnataka', aliases: ['Shimoga'] },
  { name: 'Tumakuru', state: 'Karnataka', aliases: ['Tumkur'] },
  { name: 'Udupi', state: 'Karnataka', aliases: ['Manipal'] },
  { name: 'Hampi', state: 'Karnataka', isPopular: true, aliases: ['Vijayanagara', 'Hospet'] },
  { name: 'Gokarna', state: 'Karnataka', isPopular: true },
  { name: 'Coorg', state: 'Karnataka', isPopular: true, aliases: ['Madikeri', 'Kodagu'] },
  { name: 'Chikkamagaluru', state: 'Karnataka', aliases: ['Chikmagalur'] },
  { name: 'Bidar', state: 'Karnataka' },
  { name: 'Hassan', state: 'Karnataka' },

  // Tamil Nadu
  { name: 'Madurai', state: 'Tamil Nadu', aliases: ['IXM', 'Temple City'] },
  { name: 'Tiruchirappalli', state: 'Tamil Nadu', aliases: ['Trichy', 'TRZ'] },
  { name: 'Salem', state: 'Tamil Nadu' },
  { name: 'Tirunelveli', state: 'Tamil Nadu' },
  { name: 'Erode', state: 'Tamil Nadu' },
  { name: 'Vellore', state: 'Tamil Nadu' },
  { name: 'Thoothukudi', state: 'Tamil Nadu', aliases: ['Tuticorin'] },
  { name: 'Dindigul', state: 'Tamil Nadu' },
  { name: 'Thanjavur', state: 'Tamil Nadu', aliases: ['Tanjore'] },
  { name: 'Kanchipuram', state: 'Tamil Nadu' },
  { name: 'Nagercoil', state: 'Tamil Nadu' },
  { name: 'Ooty', state: 'Tamil Nadu', isPopular: true, aliases: ['Udhagamandalam', 'Nilgiris'] },
  { name: 'Kodaikanal', state: 'Tamil Nadu', isPopular: true, aliases: ['Kodai'] },
  { name: 'Rameswaram', state: 'Tamil Nadu', isPopular: true, aliases: ['Rameshwaram'] },
  { name: 'Kanyakumari', state: 'Tamil Nadu', isPopular: true, aliases: ['Cape Comorin'] },
  { name: 'Tiruvannamalai', state: 'Tamil Nadu' },
  { name: 'Kumbakonam', state: 'Tamil Nadu' },

  // Telangana
  { name: 'Warangal', state: 'Telangana', aliases: ['Kazipet'] },
  { name: 'Nizamabad', state: 'Telangana' },
  { name: 'Karimnagar', state: 'Telangana' },
  { name: 'Ramagundam', state: 'Telangana' },
  { name: 'Khammam', state: 'Telangana' },
  { name: 'Mahbubnagar', state: 'Telangana' },
  { name: 'Nalgonda', state: 'Telangana' },
  { name: 'Adilabad', state: 'Telangana' },

  // Andhra Pradesh
  { name: 'Visakhapatnam', state: 'Andhra Pradesh', isPopular: true, aliases: ['Vizag', 'VTZ'] },
  { name: 'Vijayawada', state: 'Andhra Pradesh', aliases: ['VGA', 'Bezawada'] },
  { name: 'Guntur', state: 'Andhra Pradesh' },
  { name: 'Nellore', state: 'Andhra Pradesh' },
  { name: 'Kurnool', state: 'Andhra Pradesh' },
  { name: 'Kakinada', state: 'Andhra Pradesh' },
  { name: 'Rajahmundry', state: 'Andhra Pradesh', aliases: ['Rajamahendravaram'] },
  { name: 'Tirupati', state: 'Andhra Pradesh', isPopular: true, aliases: ['TIR', 'Tirumala'] },
  { name: 'Kadapa', state: 'Andhra Pradesh', aliases: ['Cuddapah'] },
  { name: 'Anantapur', state: 'Andhra Pradesh' },
  { name: 'Vizianagaram', state: 'Andhra Pradesh' },
  { name: 'Eluru', state: 'Andhra Pradesh' },
  { name: 'Ongole', state: 'Andhra Pradesh' },

  // Gujarat
  { name: 'Rajkot', state: 'Gujarat', aliases: ['RAJ'] },
  { name: 'Bhavnagar', state: 'Gujarat' },
  { name: 'Jamnagar', state: 'Gujarat' },
  { name: 'Junagadh', state: 'Gujarat' },
  { name: 'Gandhinagar', state: 'Gujarat', aliases: ['Capital of Gujarat'] },
  { name: 'Anand', state: 'Gujarat', aliases: ['Milk Capital'] },
  { name: 'Navsari', state: 'Gujarat' },
  { name: 'Morbi', state: 'Gujarat' },
  { name: 'Bharuch', state: 'Gujarat' },
  { name: 'Porbandar', state: 'Gujarat' },
  { name: 'Vapi', state: 'Gujarat' },
  { name: 'Bhuj', state: 'Gujarat', isPopular: true, aliases: ['Kutch', 'Rann of Kutch'] },
  { name: 'Somnath', state: 'Gujarat', aliases: ['Veraval'] },
  { name: 'Dwarka', state: 'Gujarat' },

  // Uttar Pradesh
  { name: 'Kanpur', state: 'Uttar Pradesh', aliases: ['KNU', 'Cawnpore'] },
  { name: 'Agra', state: 'Uttar Pradesh', isPopular: true, aliases: ['Taj Mahal City', 'AGR'] },
  { name: 'Prayagraj', state: 'Uttar Pradesh', isPopular: true, aliases: ['Allahabad', 'Triveni Sangam', 'IXD'] },
  { name: 'Ayodhya', state: 'Uttar Pradesh', isPopular: true, aliases: ['Faizabad', 'Ram Mandir City', 'AYJ'] },
  { name: 'Mathura', state: 'Uttar Pradesh', isPopular: true, aliases: ['Braj', 'Krishna Janmabhoomi'] },
  { name: 'Vrindavan', state: 'Uttar Pradesh', isPopular: true, aliases: ['Radha Kund'] },
  { name: 'Meerut', state: 'Uttar Pradesh' },
  { name: 'Bareilly', state: 'Uttar Pradesh' },
  { name: 'Aligarh', state: 'Uttar Pradesh' },
  { name: 'Moradabad', state: 'Uttar Pradesh' },
  { name: 'Saharanpur', state: 'Uttar Pradesh' },
  { name: 'Gorakhpur', state: 'Uttar Pradesh', aliases: ['GOP'] },
  { name: 'Jhansi', state: 'Uttar Pradesh' },
  { name: 'Firozabad', state: 'Uttar Pradesh' },
  { name: 'Muzaffarnagar', state: 'Uttar Pradesh' },
  { name: 'Rampur', state: 'Uttar Pradesh' },
  { name: 'Shahjahanpur', state: 'Uttar Pradesh' },
  { name: 'Mirzapur', state: 'Uttar Pradesh' },
  { name: 'Etawah', state: 'Uttar Pradesh' },
  { name: 'Amroha', state: 'Uttar Pradesh' },
  { name: 'Hapur', state: 'Uttar Pradesh' },
  { name: 'Bulandshahr', state: 'Uttar Pradesh' },
  { name: 'Jaunpur', state: 'Uttar Pradesh' },
  { name: 'Sitapur', state: 'Uttar Pradesh' },

  // Rajasthan
  { name: 'Jodhpur', state: 'Rajasthan', isPopular: true, aliases: ['Blue City', 'JDH'] },
  { name: 'Jaisalmer', state: 'Rajasthan', isPopular: true, aliases: ['Golden City', 'JSA', 'Sam Sand Dunes'] },
  { name: 'Pushkar', state: 'Rajasthan', isPopular: true, aliases: ['Pushkar Lake'] },
  { name: 'Kota', state: 'Rajasthan' },
  { name: 'Bikaner', state: 'Rajasthan', aliases: ['BKB'] },
  { name: 'Ajmer', state: 'Rajasthan', aliases: ['Ajmer Sharif', 'Khwaja Garib Nawaz'] },
  { name: 'Bhilwara', state: 'Rajasthan' },
  { name: 'Alwar', state: 'Rajasthan', aliases: ['Sariska'] },
  { name: 'Sikar', state: 'Rajasthan' },
  { name: 'Pali', state: 'Rajasthan' },
  { name: 'Sri Ganganagar', state: 'Rajasthan' },
  { name: 'Bharatpur', state: 'Rajasthan', aliases: ['Keoladeo'] },
  { name: 'Mount Abu', state: 'Rajasthan', isPopular: true, aliases: ['Dilwara'] },
  { name: 'Chittorgarh', state: 'Rajasthan', aliases: ['Chittor'] },
  { name: 'Sawai Madhopur', state: 'Rajasthan', aliases: ['Ranthambore'] },
  { name: 'Kumbhalgarh', state: 'Rajasthan' },
  { name: 'Neemrana', state: 'Rajasthan' },

  // West Bengal
  { name: 'Howrah', state: 'West Bengal' },
  { name: 'Siliguri', state: 'West Bengal', isPopular: true, aliases: ['Gateway to North East', 'IXB'] },
  { name: 'Darjeeling', state: 'West Bengal', isPopular: true, aliases: ['Queen of the Hills'] },
  { name: 'Kalimpong', state: 'West Bengal', isPopular: true },
  { name: 'Durgapur', state: 'West Bengal' },
  { name: 'Asansol', state: 'West Bengal' },
  { name: 'Bardhaman', state: 'West Bengal', aliases: ['Burdwan'] },
  { name: 'Kharagpur', state: 'West Bengal' },
  { name: 'Malda', state: 'West Bengal' },
  { name: 'Jalpaiguri', state: 'West Bengal' },
  { name: 'Santiniketan', state: 'West Bengal', isPopular: true, aliases: ['Bolpur', 'Visva-Bharati'] },
  { name: 'Sundarbans', state: 'West Bengal' },

  // Madhya Pradesh
  { name: 'Gwalior', state: 'Madhya Pradesh', isPopular: true, aliases: ['GWL'] },
  { name: 'Jabalpur', state: 'Madhya Pradesh', aliases: ['JLR', 'Bhedaghat'] },
  { name: 'Ujjain', state: 'Madhya Pradesh', isPopular: true, aliases: ['Mahakaleshwar', 'Avanti'] },
  { name: 'Khajuraho', state: 'Madhya Pradesh', isPopular: true, aliases: ['HJR', 'Temples'] },
  { name: 'Orchha', state: 'Madhya Pradesh', isPopular: true },
  { name: 'Mandu', state: 'Madhya Pradesh' },
  { name: 'Sagar', state: 'Madhya Pradesh' },
  { name: 'Dewas', state: 'Madhya Pradesh' },
  { name: 'Satna', state: 'Madhya Pradesh' },
  { name: 'Ratlam', state: 'Madhya Pradesh' },
  { name: 'Rewa', state: 'Madhya Pradesh' },
  { name: 'Singrauli', state: 'Madhya Pradesh' },
  { name: 'Katni', state: 'Madhya Pradesh' },
  { name: 'Chhindwara', state: 'Madhya Pradesh' },
  { name: 'Pachmarhi', state: 'Madhya Pradesh', isPopular: true },

  // Punjab
  { name: 'Ludhiana', state: 'Punjab' },
  { name: 'Jalandhar', state: 'Punjab' },
  { name: 'Patiala', state: 'Punjab' },
  { name: 'Bathinda', state: 'Punjab' },
  { name: 'Mohali', state: 'Punjab', aliases: ['SAS Nagar'] },
  { name: 'Pathankot', state: 'Punjab' },
  { name: 'Hoshiarpur', state: 'Punjab' },
  { name: 'Batala', state: 'Punjab' },
  { name: 'Moga', state: 'Punjab' },
  { name: 'Abohar', state: 'Punjab' },
  { name: 'Firozpur', state: 'Punjab' },

  // Haryana
  { name: 'Panipat', state: 'Haryana' },
  { name: 'Ambala', state: 'Haryana' },
  { name: 'Karnal', state: 'Haryana' },
  { name: 'Rohtak', state: 'Haryana' },
  { name: 'Hisar', state: 'Haryana' },
  { name: 'Sonipat', state: 'Haryana' },
  { name: 'Panchkula', state: 'Haryana' },
  { name: 'Yamunanagar', state: 'Haryana' },
  { name: 'Kurukshetra', state: 'Haryana', aliases: ['Dharmakshetra'] },
  { name: 'Rewari', state: 'Haryana' },
  { name: 'Sirsa', state: 'Haryana' },

  // Kerala
  { name: 'Thiruvananthapuram', state: 'Kerala', isPopular: true, aliases: ['Trivandrum', 'TRV', 'Kovalam'] },
  { name: 'Kozhikode', state: 'Kerala', isPopular: true, aliases: ['Calicut', 'CCJ'] },
  { name: 'Munnar', state: 'Kerala', isPopular: true, aliases: ['Idukki'] },
  { name: 'Alappuzha', state: 'Kerala', isPopular: true, aliases: ['Alleppey', 'Venice of the East'] },
  { name: 'Wayanad', state: 'Kerala', isPopular: true, aliases: ['Kalpetta'] },
  { name: 'Thrissur', state: 'Kerala', aliases: ['Trichur'] },
  { name: 'Kollam', state: 'Kerala', aliases: ['Quilon'] },
  { name: 'Palakkad', state: 'Kerala', aliases: ['Palghat'] },
  { name: 'Kannur', state: 'Kerala', aliases: ['Cannanore'] },
  { name: 'Kottayam', state: 'Kerala', aliases: ['Kumarakom'] },
  { name: 'Varkala', state: 'Kerala', isPopular: true, aliases: ['Varkala Beach'] },
  { name: 'Bekal', state: 'Kerala', aliases: ['Kasaragod'] },

  // Bihar
  { name: 'Gaya', state: 'Bihar', isPopular: true, aliases: ['GAY'] },
  { name: 'Bodh Gaya', state: 'Bihar', isPopular: true, aliases: ['Enlightenment City'] },
  { name: 'Bhagalpur', state: 'Bihar', aliases: ['Silk City'] },
  { name: 'Muzaffarpur', state: 'Bihar' },
  { name: 'Purnia', state: 'Bihar' },
  { name: 'Darbhanga', state: 'Bihar', aliases: ['DBR'] },
  { name: 'Bihar Sharif', state: 'Bihar', aliases: ['Nalanda', 'Rajgir'] },
  { name: 'Arrah', state: 'Bihar', aliases: ['Ara'] },
  { name: 'Begusarai', state: 'Bihar' },
  { name: 'Katihar', state: 'Bihar' },
  { name: 'Munger', state: 'Bihar' },
  { name: 'Chhapra', state: 'Bihar' },

  // Odisha
  { name: 'Puri', state: 'Odisha', isPopular: true, aliases: ['Jagannath Puri', 'PURI'] },
  { name: 'Cuttack', state: 'Odisha', aliases: ['Silver City'] },
  { name: 'Rourkela', state: 'Odisha', aliases: ['Steel City', 'RRK'] },
  { name: 'Berhampur', state: 'Odisha', aliases: ['Brahmapur'] },
  { name: 'Sambalpur', state: 'Odisha' },
  { name: 'Balasore', state: 'Odisha', aliases: ['Baleshwar'] },
  { name: 'Konark', state: 'Odisha', isPopular: true, aliases: ['Sun Temple City'] },

  // Assam & North East
  { name: 'Guwahati', state: 'Assam', isPopular: true, aliases: ['Gauhati', 'GAU', 'Kamakhya'] },
  { name: 'Silchar', state: 'Assam' },
  { name: 'Dibrugarh', state: 'Assam', aliases: ['Tea City'] },
  { name: 'Jorhat', state: 'Assam' },
  { name: 'Tezpur', state: 'Assam' },
  { name: 'Kaziranga', state: 'Assam', isPopular: true, aliases: ['Rhino Country'] },
  { name: 'Majuli', state: 'Assam' },
  { name: 'Shillong', state: 'Meghalaya', isPopular: true, aliases: ['Scotland of the East', 'SHL'] },
  { name: 'Cherrapunji', state: 'Meghalaya', isPopular: true, aliases: ['Sohra', 'Living Root Bridges'] },
  { name: 'Agartala', state: 'Tripura', aliases: ['IXA'] },
  { name: 'Aizawl', state: 'Mizoram', aliases: ['AJL'] },
  { name: 'Imphal', state: 'Manipur', aliases: ['IMF'] },
  { name: 'Kohima', state: 'Nagaland', aliases: ['Hornbill City'] },
  { name: 'Dimapur', state: 'Nagaland', aliases: ['DMU'] },
  { name: 'Itanagar', state: 'Arunachal Pradesh', aliases: ['HGI'] },
  { name: 'Tawang', state: 'Arunachal Pradesh', isPopular: true },
  { name: 'Ziro', state: 'Arunachal Pradesh', isPopular: true, aliases: ['Ziro Valley'] },
  { name: 'Gangtok', state: 'Sikkim', isPopular: true, aliases: ['PYG'] },
  { name: 'Pelling', state: 'Sikkim' },

  // Uttarakhand & Himachal Pradesh
  { name: 'Rishikesh', state: 'Uttarakhand', isPopular: true, aliases: ['Yoga Capital of the World'] },
  { name: 'Haridwar', state: 'Uttarakhand', isPopular: true, aliases: ['Gateway to Gods', 'Ganga Aarti'] },
  { name: 'Nainital', state: 'Uttarakhand', isPopular: true, aliases: ['Lake District'] },
  { name: 'Mussoorie', state: 'Uttarakhand', isPopular: true, aliases: ['Queen of the Hills'] },
  { name: 'Roorkee', state: 'Uttarakhand' },
  { name: 'Haldwani', state: 'Uttarakhand' },
  { name: 'Jim Corbett', state: 'Uttarakhand', isPopular: true, aliases: ['Ramnagar', 'Corbett'] },
  { name: 'Auli', state: 'Uttarakhand', isPopular: true, aliases: ['Ski Resort'] },
  { name: 'Kausani', state: 'Uttarakhand' },
  { name: 'Shimla', state: 'Himachal Pradesh', isPopular: true, aliases: ['Simla', 'Summer Capital'] },
  { name: 'Manali', state: 'Himachal Pradesh', isPopular: true, aliases: ['Kullu Valley', 'Rohtang'] },
  { name: 'Dharamshala', state: 'Himachal Pradesh', isPopular: true, aliases: ['McLeod Ganj', 'DHM'] },
  { name: 'Kasol', state: 'Himachal Pradesh', isPopular: true, aliases: ['Parvati Valley', 'Little Greece'] },
  { name: 'Bir Billing', state: 'Himachal Pradesh', isPopular: true, aliases: ['Paragliding Capital'] },
  { name: 'Spiti Valley', state: 'Himachal Pradesh', isPopular: true, aliases: ['Kaza', 'Tabo'] },
  { name: 'Kullu', state: 'Himachal Pradesh' },
  { name: 'Mandi', state: 'Himachal Pradesh' },
  { name: 'Solan', state: 'Himachal Pradesh' },
  { name: 'Dalhousie', state: 'Himachal Pradesh', isPopular: true, aliases: ['Khajjiar'] },

  // Jammu & Kashmir / Ladakh
  { name: 'Jammu', state: 'Jammu & Kashmir', isPopular: true, aliases: ['City of Temples', 'JMU', 'Vaishno Devi'] },
  { name: 'Gulmarg', state: 'Jammu & Kashmir', isPopular: true, aliases: ['Meadow of Flowers', 'Ski Capital'] },
  { name: 'Pahalgam', state: 'Jammu & Kashmir', isPopular: true, aliases: ['Valley of Shepherds', 'Betaab Valley'] },
  { name: 'Sonamarg', state: 'Jammu & Kashmir', isPopular: true },
  { name: 'Anantnag', state: 'Jammu & Kashmir' },
  { name: 'Baramulla', state: 'Jammu & Kashmir' },
  { name: 'Leh', state: 'Ladakh', isPopular: true, aliases: ['IXL', 'Land of High Passes', 'Pangong'] },
  { name: 'Nubra Valley', state: 'Ladakh', isPopular: true, aliases: ['Diskit', 'Hunder'] },
  { name: 'Kargil', state: 'Ladakh' },

  // Jharkhand & Chhattisgarh
  { name: 'Ranchi', state: 'Jharkhand', isPopular: true, aliases: ['IXR', 'City of Waterfalls'] },
  { name: 'Jamshedpur', state: 'Jharkhand', isPopular: true, aliases: ['Tatanagar', 'Steel City'] },
  { name: 'Dhanbad', state: 'Jharkhand', aliases: ['Coal Capital'] },
  { name: 'Bokaro Steel City', state: 'Jharkhand', aliases: ['Bokaro'] },
  { name: 'Deoghar', state: 'Jharkhand', aliases: ['Baidyanath Dham'] },
  { name: 'Hazaribagh', state: 'Jharkhand' },
  { name: 'Raipur', state: 'Chhattisgarh', isPopular: true, aliases: ['RPR'] },
  { name: 'Bhilai', state: 'Chhattisgarh', aliases: ['Durg-Bhilai'] },
  { name: 'Bilaspur', state: 'Chhattisgarh' },
  { name: 'Korba', state: 'Chhattisgarh' },
  { name: 'Jagdalpur', state: 'Chhattisgarh', aliases: ['Bastar', 'Chitrakote Falls'] },

  // Goa & Union Territories
  { name: 'Panaji', state: 'Goa', isPopular: true, aliases: ['Panjim', 'Capital of Goa'] },
  { name: 'Margao', state: 'Goa', aliases: ['Madgaon'] },
  { name: 'Vasco da Gama', state: 'Goa', aliases: ['Vasco'] },
  { name: 'Calangute', state: 'Goa', aliases: ['Baga', 'Anjuna', 'Vagator'] },
  { name: 'Pondicherry', state: 'Puducherry', isPopular: true, aliases: ['Puducherry', 'Auroville', 'PNY'] },
  { name: 'Port Blair', state: 'Andaman & Nicobar', isPopular: true, aliases: ['IXZ', 'Havelock', 'Neil Island'] },
  { name: 'Diu', state: 'Dadra and Nagar Haveli & Daman and Diu', isPopular: true },
  { name: 'Daman', state: 'Dadra and Nagar Haveli & Daman and Diu' },
  { name: 'Silvassa', state: 'Dadra and Nagar Haveli & Daman and Diu' },
  { name: 'Kavaratti', state: 'Lakshadweep', aliases: ['Agatti', 'Bangaram'] },
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

// Search helper with smart ranking & alias resolution
export function filterIndianCities(query: string): CityItem[] {
  const q = query.trim().toLowerCase();
  if (!q) return INDIAN_CITIES_DATA;

  // Filter matching by city name, state name, or common aliases
  const matched = INDIAN_CITIES_DATA.filter((c) => {
    if (c.name.toLowerCase().includes(q)) return true;
    if (c.state.toLowerCase().includes(q)) return true;
    if (c.aliases && c.aliases.some((a) => a.toLowerCase().includes(q))) return true;
    return false;
  });

  // Rank matches: exact prefix on city name > popular hubs > prefix on alias/state > alphabetical
  return matched.sort((a, b) => {
    const aStarts = a.name.toLowerCase().startsWith(q);
    const bStarts = b.name.toLowerCase().startsWith(q);
    if (aStarts && !bStarts) return -1;
    if (!aStarts && bStarts) return 1;

    if (a.isPopular && !b.isPopular) return -1;
    if (!a.isPopular && b.isPopular) return 1;

    return a.name.localeCompare(b.name);
  });
}
