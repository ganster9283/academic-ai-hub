import { BAUFaculty, BAUDepartment, BAUCourse } from '../types';

export const OFFICIAL_BAU_FACULTIES: BAUFaculty[] = [
  {
    id: 'fac_vet',
    code: 'FVS',
    nameEn: 'Faculty of Veterinary Science',
    nameBn: 'ভেটেরিনারি সায়েন্স অনুষদ',
    descriptionEn: 'Established in 1961, providing world-class veterinary medical education, diagnostic services, and animal health research in Bangladesh.',
    descriptionBn: '১৯৬১ সালে প্রতিষ্ঠিত, বাংলাদেশের অন্যতম শীর্ষস্থানীয় ভেটেরিনারি শিক্ষা, ডায়াগনস্টিক ও প্রাণীস্বাস্থ্য গবেষণা কেন্দ্র।',
    established: '1961',
    departmentsCount: 8
  },
  {
    id: 'fac_ag',
    code: 'FA',
    nameEn: 'Faculty of Agriculture',
    nameBn: 'কৃষি অনুষদ',
    descriptionEn: 'The flagship faculty of BAU dedicated to crop science, agronomy, soil management, plant protection, and biotechnology.',
    descriptionBn: 'বাকৃবির মূল অনুষদ যা ফসল বিজ্ঞান, মৃত্তিকা ব্যবস্থাপনা, উদ্ভিদ সংরক্ষণ ও বায়োটেকনোলজিতে শিক্ষা প্রদান করে।',
    established: '1961',
    departmentsCount: 13
  },
  {
    id: 'fac_ah',
    code: 'FAH',
    nameEn: 'Faculty of Animal Husbandry',
    nameBn: 'পশুপালন অনুষদ',
    descriptionEn: 'Pioneering education and research in animal nutrition, poultry science, breeding genetics, dairy technology, and livestock management.',
    descriptionBn: 'পশুপুষ্টি, পোল্ট্রি সায়েন্স, ব্রিডিং অ্যান্ড জেনেটিক্স, ডেইরি টেকনোলজি ও গবাদিপশু ব্যবস্থাপনার পথিকৃৎ।',
    established: '1961',
    departmentsCount: 5
  },
  {
    id: 'fac_agecon',
    code: 'FAERS',
    nameEn: 'Faculty of Agricultural Economics & Rural Sociology',
    nameBn: 'কৃষি অর্থনীতি ও গ্রামীণ সমাজবিজ্ঞান অনুষদ',
    descriptionEn: 'Focusing on agribusiness, farm management, agricultural finance, rural development, and socio-economic policy.',
    descriptionBn: 'কৃষি ব্যবসা, খামার ব্যবস্থাপনা, কৃষি অর্থায়ন, গ্রামীণ উন্নয়ন ও আর্থ-সামাজিক নীতি বিশ্লেষণে বিশেষায়িত।',
    established: '1963',
    departmentsCount: 5
  },
  {
    id: 'fac_agengg',
    code: 'FAET',
    nameEn: 'Faculty of Agricultural Engineering & Technology',
    nameBn: 'কৃষি প্রকৌশল ও প্রযুক্তি অনুষদ',
    descriptionEn: 'Advancing agricultural mechanization, farm machinery, irrigation water management, food processing, and structures.',
    descriptionBn: 'কৃষি যান্ত্রিকীকরণ, ফার্ম যন্ত্রপাতি, সেচ ও পানি ব্যবস্থাপনা, ফুড প্রসেসিং এবং ফার্ম স্ট্রাকচারে বিশ্বমানের শিক্ষা।',
    established: '1964',
    departmentsCount: 5
  },
  {
    id: 'fac_fish',
    code: 'FF',
    nameEn: 'Faculty of Fisheries',
    nameBn: 'মৎস্যবিজ্ঞান অনুষদ',
    descriptionEn: 'Leading research and training in aquaculture, fisheries management, aquatic ecology, fish genetics, and post-harvest processing.',
    descriptionBn: 'অ্যাকুয়াকালচার, মৎস্য ব্যবস্থাপনা, জলজ পরিবেশ, মৎস্য জেনেটিক্স ও প্রক্রিয়াজাতকরণ প্রযুক্তির জাতীয় কেন্দ্র।',
    established: '1967',
    departmentsCount: 4
  }
];

export const OFFICIAL_BAU_DEPARTMENTS: BAUDepartment[] = [
  // Veterinary Science
  {
    id: 'dept_anatomy',
    facultyId: 'fac_vet',
    code: 'ANAT',
    nameEn: 'Department of Anatomy & Histology',
    nameBn: 'অ্যানাটমি অ্যান্ড হিস্টোলজি বিভাগ',
    descriptionEn: 'Study of structural organization, gross anatomy, and microscopic cell structure of domestic animals.',
    descriptionBn: 'গৃহপালিত প্রাণীদের অঙ্গসংস্থানিক গঠন, গ্রস অ্যানাটমি এবং অনুবীক্ষণিক কলার তাত্ত্বিক ও ব্যবহারিক শিক্ষা।',
    programs: ['DVM', 'MS in Anatomy', 'PhD'],
    researchAreas: ['Comparative Anatomy', 'Histochemistry', 'Avian Gross Morphology'],
    sourceName: 'BAU Official Academic Bulletin',
    sourceURL: 'https://www.bau.edu.bd/faculty/fvs',
    lastVerified: '2026-01-15'
  },
  {
    id: 'dept_physio',
    facultyId: 'fac_vet',
    code: 'PHYS',
    nameEn: 'Department of Physiology',
    nameBn: 'ফিজিওলজি বিভাগ',
    descriptionEn: 'Focusing on body function, endocrinology, neurophysiology, and metabolic pathways of livestock.',
    descriptionBn: 'গবাদিপশু ও পাখির শারীরবৃত্তীয় কর্মকাণ্ড, হরমোন, স্নায়ুতন্ত্র ও মেটাবলিক প্রক্রিয়ার গবেষণা।',
    programs: ['DVM', 'MS in Physiology', 'PhD'],
    researchAreas: ['Reproductive Endocrinology', 'Stress Physiology', 'Ruminant Digestion'],
    sourceName: 'BAU Official Academic Bulletin',
    sourceURL: 'https://www.bau.edu.bd/faculty/fvs',
    lastVerified: '2026-01-15'
  },
  {
    id: 'dept_micro',
    facultyId: 'fac_vet',
    code: 'MICRO',
    nameEn: 'Department of Microbiology & Hygiene',
    nameBn: 'মাইক্রোবায়োলজি অ্যান্ড হাইজিন বিভাগ',
    descriptionEn: 'Bacteriology, virology, immunology, and food hygiene for animal health and zoonoses prevention.',
    descriptionBn: 'ব্যাকটেরিওলজি, ভাইরোলজি, ইমিউনোলজি এবং প্রাণী হতে মানবে সংক্রমিত রোগ (জুওনোটিক ডিজিজ) প্রতিরোধ।',
    programs: ['DVM', 'MS in Microbiology', 'PhD'],
    researchAreas: ['Vaccine Development', 'Antimicrobial Resistance (AMR)', 'Avian Influenza Surveillance'],
    sourceName: 'BAU Official Academic Bulletin',
    sourceURL: 'https://www.bau.edu.bd/faculty/fvs',
    lastVerified: '2026-01-15'
  },
  {
    id: 'dept_patho',
    facultyId: 'fac_vet',
    code: 'PATH',
    nameEn: 'Department of Pathology',
    nameBn: 'প্যাথলজি বিভাগ',
    descriptionEn: 'Diagnostic necropsy, histopathology, clinical pathology, and disease pathogenesis in livestock.',
    descriptionBn: 'রোগের কারণ ও প্রকৃতি নিরূপণ, ময়নাতদন্ত, ক্লিনিক্যাল প্যাথলজি ও টিস্যু পরীক্ষা।',
    programs: ['DVM', 'MS in Pathology', 'PhD'],
    researchAreas: ['Oncology in Domestic Animals', 'Avian Pathology', 'Immunopathology'],
    sourceName: 'BAU Official Academic Bulletin',
    sourceURL: 'https://www.bau.edu.bd/faculty/fvs',
    lastVerified: '2026-01-15'
  },

  // Agriculture
  {
    id: 'dept_agronomy',
    facultyId: 'fac_ag',
    code: 'AGRO',
    nameEn: 'Department of Agronomy',
    nameBn: 'এগ্রোনমি (মৃত্তিকা ও ফসল ব্যবস্থাপনা) বিভাগ',
    descriptionEn: 'Crop production techniques, weed management, seed technology, climate-resilient agriculture, and cropping systems.',
    descriptionBn: 'ফসল উৎপাদন প্রযুক্তি, আগাছা ব্যবস্থাপনা, বীজ প্রযুক্তি, জলবায়ু-সহনশীল কৃষি ও ফসল বিন্যাস।',
    programs: ['B.Sc. Ag. (Hons.)', 'MS in Agronomy', 'PhD'],
    researchAreas: ['Climate Resilient Cropping', 'Weed Science', 'Organic Agriculture'],
    sourceName: 'BAU Official Academic Bulletin',
    sourceURL: 'https://www.bau.edu.bd/faculty/fa',
    lastVerified: '2026-01-15'
  },
  {
    id: 'dept_soil',
    facultyId: 'fac_ag',
    code: 'SOIL',
    nameEn: 'Department of Soil Science',
    nameBn: 'মৃত্তিকাবিজ্ঞান বিভাগ',
    descriptionEn: 'Soil chemistry, physics, microbiology, soil fertility management, and environmental soil quality.',
    descriptionBn: 'মাটির ভৌত ও রাসায়নিক গুণাবলী, মাটির অণুজীব, উর্বরতা বৃদ্ধি ও সার ব্যবস্থাপনা।',
    programs: ['B.Sc. Ag. (Hons.)', 'MS in Soil Science', 'PhD'],
    researchAreas: ['Soil Nutrient Cycling', 'Salinity Management', 'Soil Carbon Sequestration'],
    sourceName: 'BAU Official Academic Bulletin',
    sourceURL: 'https://www.bau.edu.bd/faculty/fa',
    lastVerified: '2026-01-15'
  },
  {
    id: 'dept_entomology',
    facultyId: 'fac_ag',
    code: 'ENTO',
    nameEn: 'Department of Entomology',
    nameBn: 'এন্টমোলজি (কীটতত্ত্ব) বিভাগ',
    descriptionEn: 'Insect biology, taxonomy, Integrated Pest Management (IPM), and beneficial insect rearing.',
    descriptionBn: 'কীটপতঙ্গের জীবনচক্র, ক্ষতিকারক পোকা দমন (আইপিএম) ও মৌমাছি/রেশম পোকা চাষ।',
    programs: ['B.Sc. Ag. (Hons.)', 'MS in Entomology', 'PhD'],
    researchAreas: ['Pesticide Toxicology', 'Biopesticides', 'Beekeeping & Pollination'],
    sourceName: 'BAU Official Academic Bulletin',
    sourceURL: 'https://www.bau.edu.bd/faculty/fa',
    lastVerified: '2026-01-15'
  },
  {
    id: 'dept_horticulture',
    facultyId: 'fac_ag',
    code: 'HORT',
    nameEn: 'Department of Horticulture',
    nameBn: 'উদ্যানপালন (হর্টিকালচার) বিভাগ',
    descriptionEn: 'Cultivation of fruits, vegetables, flowers, medicinal plants, post-harvest handling, and tissue culture.',
    descriptionBn: 'ফল, শাকসবজি, ফুল, ঔষধি গাছের আধুনিক চাষাবাদ ও সংরক্ষণ প্রযুক্তি।',
    programs: ['B.Sc. Ag. (Hons.)', 'MS in Horticulture', 'PhD'],
    researchAreas: ['Fruit Breeding', 'Floriculture & Landscaping', 'Post-Harvest Technology'],
    sourceName: 'BAU Official Academic Bulletin',
    sourceURL: 'https://www.bau.edu.bd/faculty/fa',
    lastVerified: '2026-01-15'
  },

  // Animal Husbandry
  {
    id: 'dept_nutrition',
    facultyId: 'fac_ah',
    code: 'ANNU',
    nameEn: 'Department of Animal Nutrition',
    nameBn: 'এনিম্যাল নিউট্রিশন বিভাগ',
    descriptionEn: 'Feed evaluation, feed formulation, ruminant and non-ruminant metabolism, feed additives, and pasture evaluation.',
    descriptionBn: 'পশু ও পাখির সুষম খাদ্য তৈরি, খাদ্য উপাদান মূল্যায়ন ও খাদ্য বিপাক প্রক্রিয়া।',
    programs: ['B.Sc. Animal Husbandry (Hons.)', 'MS in Animal Nutrition', 'PhD'],
    researchAreas: ['Unconventional Feedstuff Utilization', 'Ruminant Methane Mitigation', 'Feed Mill Technology'],
    sourceName: 'BAU Official Academic Bulletin',
    sourceURL: 'https://www.bau.edu.bd/faculty/fah',
    lastVerified: '2026-01-15'
  },
  {
    id: 'dept_poultry',
    facultyId: 'fac_ah',
    code: 'POUL',
    nameEn: 'Department of Poultry Science',
    nameBn: 'পোল্ট্রি সায়েন্স বিভাগ',
    descriptionEn: 'Broiler and layer management, poultry breeding, incubation, hatchery management, and egg quality processing.',
    descriptionBn: 'ব্রয়লার, লেয়ার ও হাঁস-মুরগি পালন, প্রজনন, হ্যাচারি পরিচালনা এবং ডিম ও গোশত প্রক্রিয়াজাতকরণ।',
    programs: ['B.Sc. Animal Husbandry (Hons.)', 'MS in Poultry Science', 'PhD'],
    researchAreas: ['Indigenous Duck Conservation', 'Quail Production', 'Poultry Bio-security'],
    sourceName: 'BAU Official Academic Bulletin',
    sourceURL: 'https://www.bau.edu.bd/faculty/fah',
    lastVerified: '2026-01-15'
  },
  {
    id: 'dept_dairy',
    facultyId: 'fac_ah',
    code: 'DAIRY',
    nameEn: 'Department of Dairy Science',
    nameBn: 'ডেইরি সায়েন্স বিভাগ',
    descriptionEn: 'Dairy cattle management, milk chemistry, dairy microbiology, cheese/butter production, and plant engineering.',
    descriptionBn: 'দুগ্ধল গাভী খামার ব্যবস্থাপনা, দুধের রসায়ন, দই-পনির উৎপাদন ও ডেইরি প্রসেসিং।',
    programs: ['B.Sc. Animal Husbandry (Hons.)', 'MS in Dairy Science', 'PhD'],
    researchAreas: ['Probiotic Dairy Products', 'Milk Adulteration Detection', 'Buffalo Dairy Farming'],
    sourceName: 'BAU Official Academic Bulletin',
    sourceURL: 'https://www.bau.edu.bd/faculty/fah',
    lastVerified: '2026-01-15'
  },

  // Ag Economics
  {
    id: 'dept_agecon',
    facultyId: 'fac_agecon',
    code: 'AGEC',
    nameEn: 'Department of Agricultural Economics',
    nameBn: 'কৃষি অর্থনীতি বিভাগ',
    descriptionEn: 'Production economics, farm resource allocation, price analysis, agricultural policy, and econometric modeling.',
    descriptionBn: 'কৃষি উৎপাদন অর্থনীতি, খামার সম্পদ বণ্টন, বাজার দর বিশ্লেষণ ও কৃষি নীতি গবেষণা।',
    programs: ['B.Sc. Ag. Econ. (Hons.)', 'MS in Agricultural Economics', 'PhD'],
    researchAreas: ['Agricultural Value Chain', 'Food Security Economics', 'Impact Evaluation'],
    sourceName: 'BAU Official Academic Bulletin',
    sourceURL: 'https://www.bau.edu.bd/faculty/faers',
    lastVerified: '2026-01-15'
  },
  {
    id: 'dept_agribusiness',
    facultyId: 'fac_agecon',
    code: 'ABM',
    nameEn: 'Department of Agribusiness & Marketing',
    nameBn: 'এগ্রিবিজনেস অ্যান্ড মার্কেটিং বিভাগ',
    descriptionEn: 'Agri-supply chain management, marketing channels, export-import policies, and enterprise management.',
    descriptionBn: 'কৃষি পণ্যের বাজারজাতকরণ, সাপ্লাই চেইন, ব্যবসা পরিকল্পনা ও রপ্তানি বাণিজ্য।',
    programs: ['B.Sc. Ag. Econ. (Hons.)', 'MS in Agribusiness', 'PhD'],
    researchAreas: ['Supply Chain Efficiency', 'E-commerce in Agriculture', 'Market Margin Analysis'],
    sourceName: 'BAU Official Academic Bulletin',
    sourceURL: 'https://www.bau.edu.bd/faculty/faers',
    lastVerified: '2026-01-15'
  },

  // Ag Engineering
  {
    id: 'dept_fpm',
    facultyId: 'fac_agengg',
    code: 'FPM',
    nameEn: 'Department of Farm Power & Machinery',
    nameBn: 'ফার্ম পাওয়ার অ্যান্ড মেশিনারি বিভাগ',
    descriptionEn: 'Tractor technology, harvesting machinery, precision agriculture, power engines, and farm mechanization.',
    descriptionBn: 'ট্রাক্টর ইঞ্জিন, পাওয়ার টিলার, ধান কাটার কম্বাইন হারভেস্টার ও আধুনিক যন্ত্রায়ন।',
    programs: ['B.Sc. Ag. Engg.', 'MS in Farm Power & Machinery', 'PhD'],
    researchAreas: ['Solar Power Paddy Harvester', 'Precision Planter Technology', 'Smallholder Mechanization'],
    sourceName: 'BAU Official Academic Bulletin',
    sourceURL: 'https://www.bau.edu.bd/faculty/faet',
    lastVerified: '2026-01-15'
  },
  {
    id: 'dept_iwm',
    facultyId: 'fac_agengg',
    code: 'IWM',
    nameEn: 'Department of Irrigation & Water Management',
    nameBn: 'ইরিগেশন অ্যান্ড ওয়াটার ম্যানেজমেন্ট বিভাগ',
    descriptionEn: 'Hydraulics, drip and sprinkler irrigation, groundwater hydrology, water quality, and drainage engineering.',
    descriptionBn: 'কৃষি সেচ ব্যবস্থা, ড্রিপ ও স্প্রিংকলার সেচ, ভূগর্ভস্থ পানি রিচার্জ ও ড্রেনেজ প্রকৌশল।',
    programs: ['B.Sc. Ag. Engg.', 'MS in Irrigation Water Management', 'PhD'],
    researchAreas: ['Water Saving Irrigation', 'Arsenic Contamination Mitigation', 'Smart Sensor Irrigation'],
    sourceName: 'BAU Official Academic Bulletin',
    sourceURL: 'https://www.bau.edu.bd/faculty/faet',
    lastVerified: '2026-01-15'
  },

  // Fisheries
  {
    id: 'dept_aquaculture',
    facultyId: 'fac_fish',
    code: 'AQ',
    nameEn: 'Department of Aquaculture',
    nameBn: 'অ্যাকুয়াকালচার (মৎস্য চাষ) বিভাগ',
    descriptionEn: 'Pond culture systems, Biofloc technology, fish breeding, water quality management, and hatchery operations.',
    descriptionBn: 'পুকুরে মাছ ও চিংড়ি চাষ, বায়োফ্লক প্রযুক্তি, হ্যাচারি পরিচালনা ও ওয়াটার কোয়ালিটি।',
    programs: ['B.Sc. Fisheries (Hons.)', 'MS in Aquaculture', 'PhD'],
    researchAreas: ['Pangasius & Tilapia Intensive Culture', 'Biofloc System Optimization', 'RAS Systems'],
    sourceName: 'BAU Official Academic Bulletin',
    sourceURL: 'https://www.bau.edu.bd/faculty/ff',
    lastVerified: '2026-01-15'
  },
  {
    id: 'dept_fish_mgmt',
    facultyId: 'fac_fish',
    code: 'FMG',
    nameEn: 'Department of Fisheries Management',
    nameBn: 'ফিশারিজ ম্যানেজমেন্ট বিভাগ',
    descriptionEn: 'Aquatic biodiversity, fish population dynamics, limnology, riverine fisheries conservation, and sanctuary management.',
    descriptionBn: 'নদী ও হাওর অঞ্চলের মৎস্য সম্পদ সংরক্ষণ, মাছ ধরা নিয়ন্ত্রণ ও অভয়াশ্রম ব্যবস্থাপনা।',
    programs: ['B.Sc. Fisheries (Hons.)', 'MS in Fisheries Management', 'PhD'],
    researchAreas: ['Hilsa Sanctuary Management', 'Haor Wetland Fisheries', 'Climate Change Impact on Fisheries'],
    sourceName: 'BAU Official Academic Bulletin',
    sourceURL: 'https://www.bau.edu.bd/faculty/ff',
    lastVerified: '2026-01-15'
  }
];

export const OFFICIAL_BAU_COURSES: BAUCourse[] = [
  // Faculty of Agriculture - Agronomy
  {
    id: 'course_agro_101',
    facultyId: 'fac_ag',
    facultyNameBn: 'কৃষি অনুষদ',
    facultyNameEn: 'Faculty of Agriculture',
    departmentId: 'dept_agronomy',
    departmentNameBn: 'এগ্রোনমি বিভাগ',
    departmentNameEn: 'Department of Agronomy',
    program: 'B.Sc. Ag. (Hons.)',
    year: 1,
    semester: 1,
    courseCode: 'AGRO 101',
    courseTitle: 'Fundamentals of Agronomy',
    courseTitleBn: 'এগ্রোনমির মৌলিক বিষয়াবলী',
    credit: '3 (2+1)',
    courseType: 'Combined',
    description: 'Introduction to agriculture, crop classification, tillage, sowing methods, seed germination, and crop nutrition principles.',
    descriptionBn: 'কৃষি পরিচিতি, ফসলের শ্রেণীবিন্যাস, জমি চাষ বা টিলেজ, বীজ বপন পদ্ধতি, অঙ্কুরোদ্গম ও ফসল পুষ্টির মৌলিক তথ্য।',
    topics: [
      'Scope and history of Bangladesh Agriculture',
      'Classification of agronomic crops (Cereals, Pulses, Oilseeds)',
      'Tillage: Objectives, types (Zero, Minimum, Conventional) and equipment',
      'Seed quality, viability test, and sowing depth',
      'Crop nutrition and organic vs inorganic fertilizers',
      'Intercultural operations: Weeding, thinning, mulching'
    ],
    practicalTopics: [
      'Identification of agronomic crop seeds, crops, and weeds',
      'Preparation of seedbed and calculation of seed rate',
      'Demonstration of tillage implements and zero-tillage seed drill',
      'Seed viability testing using Tetrazolium method'
    ],
    references: [
      'Principles of Agronomy - T.Y. Reddy and G.H.S. Reddi',
      'Hand Book of Agriculture - ICAR',
      'Agronomy at a Glance - BAU Department Series'
    ],
    sourceName: 'BAU Official Course Syllabus Bulletin',
    sourceURL: 'https://www.bau.edu.bd/faculty/fa/agronomy',
    lastVerified: '2026-01-15',
    verificationStatus: 'verified'
  },
  {
    id: 'course_soil_102',
    facultyId: 'fac_ag',
    facultyNameBn: 'কৃষি অনুষদ',
    facultyNameEn: 'Faculty of Agriculture',
    departmentId: 'dept_soil',
    departmentNameBn: 'মৃত্তিকাবিজ্ঞান বিভাগ',
    departmentNameEn: 'Department of Soil Science',
    program: 'B.Sc. Ag. (Hons.)',
    year: 1,
    semester: 2,
    courseCode: 'SOIL 102',
    courseTitle: 'Introductory Soil Science',
    courseTitleBn: 'মৃত্তিকাবিজ্ঞানের ভূমিকা',
    credit: '3 (2+1)',
    courseType: 'Combined',
    description: 'Soil formation, rocks and minerals, soil profile development, soil physical properties (texture, structure, density), and pH.',
    descriptionBn: 'মাটি তৈরি, শিলা ও খনিজ, সোয়েল প্রোফাইল, মাটির ভৌত বৈশিষ্ট্য (টেক্সচার, স্ট্রাকচার, ঘনত্ব) ও মাটি পিএইচ।',
    topics: [
      'Pedology vs Edaphology definitions',
      'Weathering of rocks and minerals (Physical, Chemical, Biological)',
      'Soil Profile horizons (O, A, E, B, C, R)',
      'Soil Texture: USDA textural triangle classification',
      'Soil Structure and Bulk/Particle Density',
      'Soil pH, Buffering capacity and Liming'
    ],
    practicalTopics: [
      'Collection and processing of representative soil samples',
      'Soil texture determination by Hydrometer method',
      'Determination of soil pH using glass electrode pH meter',
      'Calculation of soil porosity and bulk density'
    ],
    references: [
      'The Nature and Properties of Soils - N.C. Brady and R.R. Weil',
      'Introductory Soil Science - D.K. Das'
    ],
    sourceName: 'BAU Official Course Syllabus Bulletin',
    sourceURL: 'https://www.bau.edu.bd/faculty/fa/soilscience',
    lastVerified: '2026-01-15',
    verificationStatus: 'verified'
  },
  {
    id: 'course_ento_201',
    facultyId: 'fac_ag',
    facultyNameBn: 'কৃষি অনুষদ',
    facultyNameEn: 'Faculty of Agriculture',
    departmentId: 'dept_entomology',
    departmentNameBn: 'কীটতত্ত্ব বিভাগ',
    departmentNameEn: 'Department of Entomology',
    program: 'B.Sc. Ag. (Hons.)',
    year: 2,
    semester: 1,
    courseCode: 'ENTO 201',
    courseTitle: 'Insect Morphology and Classification',
    courseTitleBn: 'পতঙ্গের বাহ্যিক গঠন ও শ্রেণীবিন্যাস',
    credit: '3 (2+1)',
    courseType: 'Combined',
    description: 'External anatomy of insects (Head, Thorax, Abdomen), metamorphosis, antenna/leg modifications, and major insect orders.',
    descriptionBn: 'কীটপতঙ্গের মাথা, বক্ষ ও উদরের গঠন, রূপান্তর, অ্যান্টেনা ও পায়ের পরিবর্তন এবং প্রধান আটটি ইনসেক্ট অর্ডার।',
    topics: [
      'Insect body segmentation (Tagmosis)',
      'Mouthparts types: Biting-chewing, Piercing-sucking, Siphoning',
      'Insect Metamorphosis: Ametabolous, Hemimetabolous, Holometabolous',
      'Major Insect Orders: Coleoptera, Lepidoptera, Hemiptera, Diptera, Hymenoptera',
      'Economic importance of pests vs beneficial insects'
    ],
    practicalTopics: [
      'Dissection of Grasshopper / Cockroach mouthparts',
      'Preservation of insect specimens (Pinning, Staining, Labeling)',
      'Identification of insect orders using taxonomic keys'
    ],
    references: [
      'Borror and DeLong\'s Introduction to the Study of Insects',
      'Agricultural Entomology - BAU Press'
    ],
    sourceName: 'BAU Official Course Syllabus Bulletin',
    sourceURL: 'https://www.bau.edu.bd/faculty/fa/entomology',
    lastVerified: '2026-01-15',
    verificationStatus: 'verified'
  },

  // Faculty of Veterinary Science
  {
    id: 'course_vet_101',
    facultyId: 'fac_vet',
    facultyNameBn: 'ভেটেরিনারি সায়েন্স অনুষদ',
    facultyNameEn: 'Faculty of Veterinary Science',
    departmentId: 'dept_anatomy',
    departmentNameBn: 'অ্যানাটমি অ্যান্ড হিস্টোলজি বিভাগ',
    departmentNameEn: 'Department of Anatomy & Histology',
    program: 'DVM',
    year: 1,
    semester: 1,
    courseCode: 'ANAT 101',
    courseTitle: 'General Veterinary Osteology and Arthrology',
    courseTitleBn: 'ভেটেরিনারি অস্থিরূপ ও অস্থিসন্ধি বিজ্ঞান',
    credit: '4 (2+2)',
    courseType: 'Combined',
    description: 'Gross anatomy of bones, axial and appendicular skeleton of ruminants (ox/goat) and poultry, joint classification and ligaments.',
    descriptionBn: 'গরু, ছাগল ও মুরগির কঙ্কালতন্ত্র, হাড়ের গঠন, এক্সিয়াল ও অ্যাপেন্ডিকুলার অস্থি এবং জোড়া বা জয়েন্টের বিশদ বিবরণ।',
    topics: [
      'Structure and chemical composition of bone',
      'Comparative Osteology: Skull, Vertebral Column, Ribs, Sternum',
      'Bones of Forelimb (Scapula, Humerus, Radius-Ulna, Metacarpus) and Hindlimb',
      'Poultry skeletal peculiarities (Pneumatic bones, Pygostyle, Synsacrum)',
      'Joint classification: Synarthrosis, Amphiarthrosis, Diarthrosis'
    ],
    practicalTopics: [
      'Identification of articulated and disarticulated ruminant bones',
      'Demonstration of synovial joints and ligaments in cattle leg specimen',
      'Poultry bone mounting and skeletal preparation'
    ],
    references: [
      'Sisson and Grossman\'s The Anatomy of the Domestic Animals',
      'Veterinary Anatomy Atlas - BAU FVS Press'
    ],
    sourceName: 'BAU Official DVM Curriculum Bulletin',
    sourceURL: 'https://www.bau.edu.bd/faculty/fvs/anatomy',
    lastVerified: '2026-01-15',
    verificationStatus: 'verified'
  },
  {
    id: 'course_micro_201',
    facultyId: 'fac_vet',
    facultyNameBn: 'ভেটেরিনারি সায়েন্স অনুষদ',
    facultyNameEn: 'Faculty of Veterinary Science',
    departmentId: 'dept_micro',
    departmentNameBn: 'মাইক্রোবায়োলজি অ্যান্ড হাইজিন বিভাগ',
    departmentNameEn: 'Department of Microbiology & Hygiene',
    program: 'DVM',
    year: 2,
    semester: 1,
    courseCode: 'MICRO 201',
    courseTitle: 'General Veterinary Bacteriology and Immunology',
    courseTitleBn: 'সাধারণ ভেটেরিনারি ব্যাকটেরিওলজি ও ইমিউনোলজি',
    credit: '3 (2+1)',
    courseType: 'Combined',
    description: 'Bacterial morphology, Gram staining, bacterial growth kinetics, sterilization techniques, innate and adaptive immunity.',
    descriptionBn: 'ব্যাকটেরিয়ার আকৃতি, গ্রাম স্টেইনিং, জন্মচক্র, নির্বীজকরণ পদ্ধতি এবং সহজাত ও অর্জিত রোগপ্রতিরোধ ব্যবস্থা।',
    topics: [
      'Bacterial cell wall structure: Gram-positive vs Gram-negative',
      'Bacterial growth curve phases (Lag, Log, Stationary, Decline)',
      'Sterilization vs Disinfection: Autoclaving, Hot air oven, Chemical agents',
      'Antigens, Epitopes, and Antibody Classes (IgG, IgM, IgA, IgE, IgD)',
      'Hypersensitivity reactions Type I-IV'
    ],
    practicalTopics: [
      'Preparation of culture media (Nutrient Agar, MacConkey Agar)',
      'Gram staining technique and microscopic observation',
      'Antimicrobial Susceptibility Testing (Kirby-Bauer Disk Diffusion Method)'
    ],
    references: [
      'Veterinary Microbiology and Microbial Disease - Quinn et al.',
      'Roitt\'s Essential Immunology'
    ],
    sourceName: 'BAU Official DVM Curriculum Bulletin',
    sourceURL: 'https://www.bau.edu.bd/faculty/fvs/microbiology',
    lastVerified: '2026-01-15',
    verificationStatus: 'verified'
  },

  // Faculty of Animal Husbandry
  {
    id: 'course_annu_101',
    facultyId: 'fac_ah',
    facultyNameBn: 'পশুপালন অনুষদ',
    facultyNameEn: 'Faculty of Animal Husbandry',
    departmentId: 'dept_nutrition',
    departmentNameBn: 'এনিম্যাল নিউট্রিশন বিভাগ',
    departmentNameEn: 'Department of Animal Nutrition',
    program: 'B.Sc. Animal Husbandry (Hons.)',
    year: 1,
    semester: 1,
    courseCode: 'ANNU 101',
    courseTitle: 'Principles of Animal Nutrition',
    courseTitleBn: 'পশুপুষ্টির মৌলিক নীতি',
    credit: '3 (2+1)',
    courseType: 'Combined',
    description: 'Proximate analysis of feedstuffs, digestive anatomy of ruminants vs non-ruminants, carbohydrate and protein metabolism.',
    descriptionBn: 'খাদ্যের প্রক্সিমেট অ্যানালিসিস, জাবর-কাটা ও সাধারণ পশুর পরিপাকতন্ত্র, শর্করা ও আমিষের পরিপাক ও শোষণ।',
    topics: [
      'Nutrient definition and classification (Water, CP, EE, CF, NFE, Ash)',
      'Comparative Anatomy of Digestive System (Ruminant vs Monogastric)',
      'Rumen Microbiology and volatile fatty acid (VFA) production (Acetate, Propionate, Butyrate)',
      'Essential amino acids for livestock and poultry',
      'Fat-soluble vs Water-soluble vitamins deficiency symptoms'
    ],
    practicalTopics: [
      'Sampling and moisture content estimation in green grass / straw',
      'Crude protein estimation using Kjeldahl Method',
      'Crude fiber estimation in fodder samples'
    ],
    references: [
      'Animal Nutrition - McDonald, Edwards, Greenhalgh',
      'Feeds and Feeding - Morrison'
    ],
    sourceName: 'BAU Official Animal Husbandry Bulletin',
    sourceURL: 'https://www.bau.edu.bd/faculty/fah/nutrition',
    lastVerified: '2026-01-15',
    verificationStatus: 'verified'
  },
  {
    id: 'course_poul_102',
    facultyId: 'fac_ah',
    facultyNameBn: 'পশুপালন অনুষদ',
    facultyNameEn: 'Faculty of Animal Husbandry',
    departmentId: 'dept_poultry',
    departmentNameBn: 'পোল্ট্রি সায়েন্স বিভাগ',
    departmentNameEn: 'Department of Poultry Science',
    program: 'B.Sc. Animal Husbandry (Hons.)',
    year: 1,
    semester: 2,
    courseCode: 'POUL 102',
    courseTitle: 'Commercial Poultry Production',
    courseTitleBn: 'বাণিজ্যিক পোল্ট্রি উৎপাদন',
    credit: '3 (2+1)',
    courseType: 'Combined',
    description: 'Broiler and layer housing, brooding management, egg formation, incubation parameters, and biosecurity protocols.',
    descriptionBn: 'ব্রয়লার ও লেয়ার মুরগির শেড নির্মাণ, বাচ্চা লালন-পালন, ডিম গঠন প্রক্রিয়া, ইনকিউবেশন এবং বায়োসিকিউরিটি।',
    topics: [
      'Poultry Breeds & Hybrids (Cobb 500, Hy-Line Brown, Sonali)',
      'Housing Systems: Deep litter vs Battery cage system',
      'Brooding management: Temperature, ventilation, lighting schedule',
      'Egg formation in Hen Oviduct (Infundibulum, Magnum, Isthmus, Uterus, Vagina)',
      'Incubation conditions: Temperature (99.5°F), RH (60-70%), Turning'
    ],
    practicalTopics: [
      'Debeaking and vaccination techniques in chicks',
      'Candling of incubated eggs to detect fertility and embryonic mortality',
      'Egg quality testing (Haugh Unit, Yolk Index, Shell Thickness)'
    ],
    references: [
      'Commercial Chicken Meat and Egg Production - Wilson and Bell',
      'Poultry Science Handbook - BAU Press'
    ],
    sourceName: 'BAU Official Animal Husbandry Bulletin',
    sourceURL: 'https://www.bau.edu.bd/faculty/fah/poultry',
    lastVerified: '2026-01-15',
    verificationStatus: 'verified'
  },

  // Faculty of Agricultural Economics
  {
    id: 'course_agec_101',
    facultyId: 'fac_agecon',
    facultyNameBn: 'কৃষি অর্থনীতি ও গ্রামীণ সমাজবিজ্ঞান অনুষদ',
    facultyNameEn: 'Faculty of Agricultural Economics & Rural Sociology',
    departmentId: 'dept_agecon',
    departmentNameBn: 'কৃষি অর্থনীতি বিভাগ',
    departmentNameEn: 'Department of Agricultural Economics',
    program: 'B.Sc. Ag. Econ. (Hons.)',
    year: 1,
    semester: 1,
    courseCode: 'AGEC 101',
    courseTitle: 'Principles of Agricultural Economics',
    courseTitleBn: 'কৃষি অর্থনীতির মৌলিক তথ্য',
    credit: '3 (3+0)',
    courseType: 'Theoretical',
    description: 'Microeconomics principles applied to farming, supply-demand elasticity, law of diminishing returns, and production functions.',
    descriptionBn: 'কৃষি খামারে মাইক্রো-ইকোনমিক্স প্রয়োগ, চাহিদা ও যোগানের স্থিতিস্থাপকতা, ক্রমহ্রাসমান প্রান্তিক উৎপাদন বিধি।',
    topics: [
      'Scope of Agricultural Economics in Bangladesh Economy',
      'Law of Demand and Supply, Market Equilibrium',
      'Price Elasticity, Income Elasticity, and Cross Elasticity',
      'Production Function: Classical Factor-Product Relationship (Stage I, II, III)',
      'Marginal Rate of Technical Substitution (MRTS) and Isoquants'
    ],
    practicalTopics: [],
    references: [
      'Agricultural Production Economics - David L. Debertin',
      'Economics - Samuelson and Nordhaus'
    ],
    sourceName: 'BAU Official Ag Economics Bulletin',
    sourceURL: 'https://www.bau.edu.bd/faculty/faers/agecon',
    lastVerified: '2026-01-15',
    verificationStatus: 'verified'
  },

  // Faculty of Agricultural Engineering
  {
    id: 'course_fpm_101',
    facultyId: 'fac_agengg',
    facultyNameBn: 'কৃষি প্রকৌশল ও প্রযুক্তি অনুষদ',
    facultyNameEn: 'Faculty of Agricultural Engineering & Technology',
    departmentId: 'dept_fpm',
    departmentNameBn: 'ফার্ম পাওয়ার অ্যান্ড মেশিনারি বিভাগ',
    departmentNameEn: 'Department of Farm Power & Machinery',
    program: 'B.Sc. Ag. Engg.',
    year: 1,
    semester: 1,
    courseCode: 'FPM 101',
    courseTitle: 'Engineering Mechanics and Engines',
    courseTitleBn: 'ইঞ্জিনিয়ারিং মেকানিক্স ও পাওয়ার ইঞ্জিন',
    credit: '3 (2+1)',
    courseType: 'Combined',
    description: 'Forces, friction, internal combustion engines (2-stroke & 4-stroke Diesel/Petrol engines), ignition and cooling systems.',
    descriptionBn: 'বলের ভেক্টর, ঘর্ষণ, আইসি ইঞ্জিন (২-স্ট্রোক ও ৪-স্ট্রোক ডিজেল/পেট্রোল ইঞ্জিন), ইগনিশন ও কুলিং সিস্টেম।',
    topics: [
      'Resultant of Coplanar Forces and Equilibrium conditions',
      'Working principles of 4-Stroke Diesel Engine vs Petrol Engine',
      'Thermal Efficiency, Indicated Power (IP), Brake Horse Power (BHP)',
      'Engine Lubrication, Fuel Injection Pump (FIP), and Governor',
      'Power Tiller and Tractor Power Take-Off (PTO) mechanism'
    ],
    practicalTopics: [
      'Disassembly and assembly of a 4-stroke single cylinder Diesel engine',
      'Valve timing diagram setup and measurement',
      'Dyna-meter brake power testing on farm engine'
    ],
    references: [
      'Elements of Agricultural Engineering - Jagdishwar Sahay',
      'Farm Power and Machinery - BAU FAET Press'
    ],
    sourceName: 'BAU Official Ag Engineering Bulletin',
    sourceURL: 'https://www.bau.edu.bd/faculty/faet/fpm',
    lastVerified: '2026-01-15',
    verificationStatus: 'verified'
  },

  // Faculty of Fisheries
  {
    id: 'course_aq_101',
    facultyId: 'fac_fish',
    facultyNameBn: 'মৎস্যবিজ্ঞান অনুষদ',
    facultyNameEn: 'Faculty of Fisheries',
    departmentId: 'dept_aquaculture',
    departmentNameBn: 'অ্যাকুয়াকালচার বিভাগ',
    departmentNameEn: 'Department of Aquaculture',
    program: 'B.Sc. Fisheries (Hons.)',
    year: 1,
    semester: 1,
    courseCode: 'AQ 101',
    courseTitle: 'Principles of Aquaculture',
    courseTitleBn: 'অ্যাকুয়াকালচার বা মৎস্য চাষের মূলনীতি',
    credit: '3 (2+1)',
    courseType: 'Combined',
    description: 'Pond ecosystem, water quality parameters (DO, pH, Alkalinity, Ammonia), fertilizing, supplementary feeding, and fish species selection.',
    descriptionBn: 'পুকুর ইকোসিস্টেম, পানির গুণাগুণ পরীক্ষা (দ্রবীভূত অক্সিজেন, পিএইচ, অ্যামোনিয়া), সার প্রয়োগ ও সম্পূরক খাদ্য প্রস্তুত।',
    topics: [
      'History and status of aquaculture in Bangladesh',
      'Physico-chemical parameters of pond water (DO, Temperature, Transparency, pH)',
      'Monoculture vs Polyculture of Carps (Rui, Katla, Mrigal)',
      'Pond preparation: Liming, Organic Manuring, Chemical Fertilizers',
      'Supplementary feed formulation and Feed Conversion Ratio (FCR)'
    ],
    practicalTopics: [
      'Measurement of Water Transparency using Secchi Disk',
      'Determination of Dissolved Oxygen (DO) by Winkler Method',
      'Formulation of 30% crude protein supplementary fish feed'
    ],
    references: [
      'Aquaculture Principles and Practices - T.V.R. Pillay',
      'Fisheries of Bangladesh - BAU FF Press'
    ],
    sourceName: 'BAU Official Fisheries Bulletin',
    sourceURL: 'https://www.bau.edu.bd/faculty/ff/aquaculture',
    lastVerified: '2026-01-15',
    verificationStatus: 'verified'
  }
];
