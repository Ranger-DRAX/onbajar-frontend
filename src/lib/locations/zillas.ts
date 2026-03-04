import type { LocationMap } from "./type";

/**
 * Official Bangladesh Zilla → Thana/Upazila map.
 * Keys   = District names  — must match backend Joi whitelist EXACTLY.
 * Values = Upazila names   — must match backend Joi whitelist EXACTLY.
 * Source: Bangladesh National Portal / BBS 2022
 */
export const LOCATION_MAP: LocationMap = {
  // ── Dhaka Division ─────────────────────────────────────────────────────────
  Dhaka: [
    "Adabor", "Badda", "Bangshal", "Biman Bandar", "Cantonment",
    "Chawkbazar", "Dakshinkhan", "Darus Salam", "Demra", "Dhamrai",
    "Dohar", "Gendaria", "Gulshan", "Hazaribagh", "Kadamtali",
    "Kafrul", "Kalabagan", "Kamrangirchar", "Keraniganj", "Khilgaon",
    "Khilkhet", "Kotwali", "Lalbagh", "Mirpur", "Mohammadpur",
    "Motijheel", "Mugda", "Nawabganj", "Newmarket", "Pallabi",
    "Paltan", "Ramna", "Rayer Bazar", "Sabujbagh", "Savar",
    "Shah Ali", "Shahjahanpur", "Shyampur", "Sher-e-Bangla Nagar",
    "Sutrapur", "Tejgaon", "Tejgaon Industrial Area", "Turag",
    "Uttara", "Uttara West", "Uttarkhan", "Wari",
  ],
  Gazipur: [
    "Gazipur Sadar", "Kaliakair", "Kaliganj", "Kapasia", "Sreepur", "Tongi",
  ],
  Kishoreganj: [
    "Astagram", "Bajitpur", "Bhairab", "Hossainpur", "Itna",
    "Karimganj", "Katiadi", "Kishoreganj Sadar", "Kuliarchar",
    "Mithamain", "Nikli", "Pakundia", "Tarail",
  ],
  Madaripur: [
    "Kalkini", "Madaripur Sadar", "Rajoir", "Shibchar",
  ],
  Manikganj: [
    "Daulatpur", "Ghior", "Harirampur", "Manikganj Sadar",
    "Saturia", "Shivalaya", "Singair",
  ],
  Munshiganj: [
    "Gazaria", "Louhajang", "Munshiganj Sadar", "Sirajdikhan",
    "Sreenagar", "Tongibari",
  ],
  Narayanganj: [
    "Araihazar", "Bandar", "Fatullah", "Narayanganj Sadar",
    "Rupganj", "Siddhirganj", "Sonargaon",
  ],
  Narsingdi: [
    "Belabo", "Monohardi", "Narsingdi Sadar", "Palash", "Raipura", "Shibpur",
  ],
  Rajbari: [
    "Baliakandi", "Goalandaghat", "Kalukhali", "Pangsha", "Rajbari Sadar",
  ],
  Shariatpur: [
    "Bhedarganj", "Damudya", "Gosairhat", "Naria", "Shariatpur Sadar", "Zanjira",
  ],
  Tangail: [
    "Basail", "Bhuapur", "Delduar", "Dhanbari", "Ghatail", "Gopalpur",
    "Kalihati", "Madhupur", "Mirzapur", "Nagarpur", "Sakhipur", "Tangail Sadar",
  ],
  Faridpur: [
    "Alfadanga", "Bhanga", "Boalmari", "Char Bhadrasan", "Faridpur Sadar",
    "Madhukhali", "Nagarkanda", "Sadarpur", "Saltha",
  ],

  // ── Chittagong Division ────────────────────────────────────────────────────
  Chittagong: [
    "Akbarshah", "Anwara", "Bakalia", "Banshkhali", "Bayazid",
    "Boalkhali", "Chandgaon", "Chandanaish", "Chittagong Port",
    "Double Mooring", "Fatikchhari", "Halishahar", "Hathazari",
    "Karnaphuli", "Khulshi", "Kotwali", "Lohagara", "Mirsharai",
    "Pahartali", "Panchlaish", "Patiya", "Potenga", "Rangunia",
    "Raozan", "Sandwip", "Satkania", "Sitakunda",
  ],
  Bandarban: [
    "Ali Kadam", "Bandarban Sadar", "Lama", "Naikhongchhari",
    "Rowangchhari", "Ruma", "Thanchi",
  ],
  Brahmanbaria: [
    "Akhaura", "Ashuganj", "Bancharampur", "Bijoynagar", "Brahmanbaria Sadar",
    "Kasba", "Nabinagar", "Nasirnagar", "Sarail",
  ],
  Chandpur: [
    "Chandpur Sadar", "Faridganj", "Haimchar", "Haziganj",
    "Kachua", "Matlab North", "Matlab South", "Shahrasti",
  ],
  Cumilla: [
    "Barura", "Brahmanpara", "Burichang", "Chandina", "Chauddagram",
    "Cumilla Sadar", "Cumilla Sadar South", "Daudkandi", "Debidwar",
    "Homna", "Laksam", "Lalmai", "Meghna", "Monohorganj",
    "Muradnagar", "Nangalkot", "Titas",
  ],
  "Cox's Bazar": [
    "Chakaria", "Cox's Bazar Sadar", "Kutubdia", "Maheshkhali",
    "Pekua", "Ramu", "Teknaf", "Ukhia",
  ],
  Feni: [
    "Chhagalnaiya", "Daganbhuiyan", "Feni Sadar", "Parshuram", "Sonagazi",
  ],
  Khagrachhari: [
    "Dighinala", "Guimara", "Khagrachhari Sadar", "Lakshmichhari",
    "Mahalchhari", "Manikchhari", "Matiranga", "Panchhari", "Ramgarh",
  ],
  Lakshmipur: [
    "Kamalnagar", "Lakshmipur Sadar", "Ramganj", "Ramgati", "Roypur",
  ],
  Noakhali: [
    "Begumganj", "Chatkhil", "Companiganj", "Hatiya", "Kabir Hat",
    "Noakhali Sadar", "Senbagh", "Sonaimuri", "Subarnachar",
  ],
  Rangamati: [
    "Bagaichhari", "Barkal", "Belaichhari", "Juraichhari", "Kaptai",
    "Kawkhali", "Langadu", "Naniarchar", "Rajasthali", "Rangamati Sadar",
  ],

  // ── Rajshahi Division ──────────────────────────────────────────────────────
  Rajshahi: [
    "Bagha", "Bagmara", "Boalia", "Charghat", "Durgapur", "Godagari",
    "Matihar", "Mohanpur", "Paba", "Puthia", "Rajpara", "Shah Makhdum", "Tanore",
  ],
  Bogura: [
    "Adamdighi", "Bogura Sadar", "Dhunat", "Dhupchanchia", "Gabtali",
    "Kahaloo", "Nandigram", "Sariakandi", "Shajahanpur", "Sherpur",
    "Shibganj", "Sonatala",
  ],
  Chapainawabganj: [
    "Bholahat", "Chapainawabganj Sadar", "Gomastapur", "Nachole", "Shibganj",
  ],
  Joypurhat: [
    "Akkelpur", "Joypurhat Sadar", "Kalai", "Khetlal", "Panchbibi",
  ],
  Naogaon: [
    "Atrai", "Badalgachhi", "Dhamoirhat", "Manda", "Mahadebpur",
    "Naogaon Sadar", "Niamatpur", "Patnitala", "Porsha", "Raninagar", "Sapahar",
  ],
  Natore: [
    "Bagatipara", "Baraigram", "Gurudaspur", "Lalpur", "Natore Sadar", "Singra",
  ],
  Pabna: [
    "Atgharia", "Bera", "Bhangura", "Chatmohar", "Faridpur",
    "Ishwardi", "Pabna Sadar", "Santhia", "Sujanagar",
  ],
  Sirajganj: [
    "Belkuchi", "Chauhali", "Kamarkhanda", "Kazipur", "Raiganj",
    "Shahjadpur", "Sirajganj Sadar", "Tarash", "Ullapara",
  ],

  // ── Khulna Division ────────────────────────────────────────────────────────
  Khulna: [
    "Batiaghata", "Dacope", "Daulatpur", "Dighalia", "Dumuria",
    "Khalishpur", "Khan Jahan Ali", "Kotwali", "Koyra",
    "Paikgachha", "Phultala", "Rupsa", "Sonadanga", "Terokhada",
  ],
  Bagerhat: [
    "Bagerhat Sadar", "Chitalmari", "Fakirhat", "Kachua", "Mollahat",
    "Mongla", "Morrelganj", "Rampal", "Sarankhola",
  ],
  Chuadanga: [
    "Alamdanga", "Chuadanga Sadar", "Damurhuda", "Jibannagar",
  ],
  Jessore: [
    "Abhaynagar", "Bagherpara", "Chaugachha", "Jessore Sadar",
    "Jhikargachha", "Keshabpur", "Manirampur", "Sharsha",
  ],
  Jhenaidah: [
    "Harinakunda", "Jhenaidah Sadar", "Kaliganj", "Kotchandpur",
    "Maheshpur", "Shailkupa",
  ],
  Kushtia: [
    "Bheramara", "Daulatpur", "Khoksa", "Kumarkhali", "Kushtia Sadar", "Mirpur",
  ],
  Magura: [
    "Magura Sadar", "Mohammadpur", "Shalikha", "Sreepur",
  ],
  Meherpur: [
    "Gangni", "Meherpur Sadar", "Mujibnagar",
  ],
  Narail: [
    "Kalia", "Lohagara", "Narail Sadar",
  ],
  Satkhira: [
    "Assasuni", "Debhata", "Kalaroa", "Kaliganj", "Satkhira Sadar",
    "Shyamnagar", "Tala",
  ],

  // ── Barishal Division ──────────────────────────────────────────────────────
  Barishal: [
    "Agailjhara", "Babuganj", "Bakerganj", "Banaripara", "Barishal Sadar",
    "Gaurnadi", "Hizla", "Mehendiganj", "Muladi", "Wazirpur",
  ],
  Barguna: [
    "Amtali", "Bamna", "Barguna Sadar", "Betagi", "Patharghata", "Taltali",
  ],
  Bhola: [
    "Bhola Sadar", "Burhanuddin", "Char Fasson", "Daulatkhan",
    "Lalmohan", "Manpura", "Tazumuddin",
  ],
  Jhalokati: [
    "Jhalokati Sadar", "Kathalia", "Nalchity", "Rajapur",
  ],
  Patuakhali: [
    "Bauphal", "Dashmina", "Dumki", "Galachipa", "Kalapara",
    "Mirzaganj", "Patuakhali Sadar", "Rangabali",
  ],
  Pirojpur: [
    "Bhandaria", "Kawkhali", "Mathbaria", "Nazirpur",
    "Nesarabad", "Pirojpur Sadar", "Zianagar",
  ],

  // ── Sylhet Division ────────────────────────────────────────────────────────
  Sylhet: [
    "Balaganj", "Beanibazar", "Bishwanath", "Companiganj", "Dakshin Surma",
    "Fenchuganj", "Golapganj", "Gowainghat", "Jaintiapur", "Kanaighat",
    "Kotwali", "Osmani Nagar", "South Surma", "Sylhet Sadar", "Zakiganj",
  ],
  Habiganj: [
    "Ajmiriganj", "Bahubal", "Baniachong", "Chunarughat", "Habiganj Sadar",
    "Lakhai", "Madhabpur", "Nabiganj",
  ],
  Moulvibazar: [
    "Barlekha", "Juri", "Kamalganj", "Kulaura", "Moulvibazar Sadar",
    "Rajnagar", "Sreemangal",
  ],
  Sunamganj: [
    "Bishwamvarpur", "Chhatak", "Derai", "Dharmapasha", "Dowarabazar",
    "Jagannathpur", "Jamalganj", "Sullah", "Sunamganj Sadar", "Tahirpur",
  ],

  // ── Rangpur Division ──────────────────────────────────────────────────────
  Rangpur: [
    "Badarganj", "Gangachara", "Kaunia", "Mithapukur", "Pirgachha",
    "Pirganj", "Rangpur Sadar", "Taraganj",
  ],
  Dinajpur: [
    "Birampur", "Birganj", "Biral", "Bochaganj", "Chirirbandar",
    "Dinajpur Sadar", "Fulbari", "Ghoraghat", "Hakimpur",
    "Kaharole", "Khansama", "Nawabganj", "Parbatipur",
  ],
  Gaibandha: [
    "Fulchhari", "Gaibandha Sadar", "Gobindaganj", "Palashbari",
    "Sadullapur", "Saghata", "Sundarganj",
  ],
  Kurigram: [
    "Bhurungamari", "Char Rajibpur", "Chilmari", "Kurigram Sadar",
    "Nageshwari", "Phulbari", "Rajarhat", "Raumari", "Ulipur",
  ],
  Lalmonirhat: [
    "Aditmari", "Hatibandha", "Kaliganj", "Lalmonirhat Sadar", "Patgram",
  ],
  Nilphamari: [
    "Dimla", "Domar", "Jaldhaka", "Kishoreganj", "Nilphamari Sadar", "Saidpur",
  ],
  Panchagarh: [
    "Atwari", "Boda", "Debiganj", "Panchagarh Sadar", "Tetulia",
  ],
  Thakurgaon: [
    "Baliadangi", "Haripur", "Pirganj", "Ranisankail", "Thakurgaon Sadar",
  ],

  // ── Mymensingh Division ────────────────────────────────────────────────────
  Mymensingh: [
    "Bhaluka", "Dhobaura", "Fulbaria", "Gaffargaon", "Gauripur",
    "Haluaghat", "Ishwarganj", "Mymensingh Sadar", "Muktagachha",
    "Nandail", "Phulpur", "Trishal",
  ],
  Jamalpur: [
    "Bakshiganj", "Dewanganj", "Islampur", "Jamalpur Sadar",
    "Madarganj", "Melandaha", "Sarishabari",
  ],
  Netrokona: [
    "Atpara", "Barhatta", "Durgapur", "Kalmakanda", "Kendua",
    "Khaliajuri", "Madan", "Mohanganj", "Netrokona Sadar", "Purbadhala",
  ],
  Sherpur: [
    "Jhenaigati", "Nakla", "Nalitabari", "Sherpur Sadar", "Sreebardi",
  ],
};