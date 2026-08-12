export interface AgriEconTopic {
  id: string;
  nameEn: string;
  nameBn: string;
  category: 'Fundamentals' | 'Micro & Production' | 'Farm Management' | 'Marketing & Policy' | 'Quantitative & Advanced';
  shortExplanationEn: string;
  shortExplanationBn: string;
  definitions: { titleBn: string; titleEn: string; descBn: string; descEn: string }[];
  formulas?: { name: string; formula: string; descBn: string }[];
  examples: string[];
  examPoints: string[];
  mcqs: { questionBn: string; options: string[]; answerIndex: number; explanationBn: string }[];
  shortQuestions: { questionBn: string; answerBn: string }[];
  broadQuestions: { questionBn: string; outlineBn: string[] }[];
}

export const AGRI_ECON_TOPICS: AgriEconTopic[] = [
  {
    id: 'intro_agri_econ',
    nameEn: 'Introduction to Agricultural Economics',
    nameBn: 'কৃষি অর্থনীতির ভূমিকা',
    category: 'Fundamentals',
    shortExplanationEn: 'Applied economics dealing with allocation, production, processing, distribution, and consumption of agricultural goods under scarcity.',
    shortExplanationBn: 'কৃষি সম্পদের সীমাবদ্ধতা বিবেচনা করে কৃষি পণ্য উৎপাদন, বণ্টন, বিপণন ও খরচের অর্থনৈতিক বিশ্লেষণ।',
    definitions: [
      {
        titleBn: 'কৃষি অর্থনীতি (Agricultural Economics)',
        titleEn: 'Agricultural Economics',
        descBn: 'অর্থনীতির একটি ফলিত শাখা যা কৃষি খাতে সীমিত সম্পদের সর্বোচ্চ লাভজনক ব্যবহার ও খাদ্য উৎপাদন ব্যবস্থাপনা বিশ্লেষণ করে।',
        descEn: 'An applied social science dealing with how humans use technical knowledge and scarce resources to produce food and fiber and distribute them.'
      }
    ],
    formulas: [
      { name: 'কৃষি নিট আয় (Net Farm Income)', formula: 'NFI = Total Revenue (TR) - Total Cost (TC)', descBn: 'মোট আয় থেকে মোট ব্যয় বিয়োগ করে খামারের নিট লাভ পাওয়া যায়।' }
    ],
    examples: [
      'বাংলাদেশের বোরো ধান চাষে সার ও সেচের সঠিক মিশ্রণ বেছে নেওয়া।',
      'কৃষকের শস্য বিক্রির সময় স্থানীয় আড়তদার ও পাইকারি বাজারের মূল্য পার্থক্য পর্যবেক্ষণ।'
    ],
    examPoints: [
      'কৃষি অর্থনীতি সাধারণ অর্থনীতির একটি ফলিত (applied) ও বিশেষায়িত শাখা।',
      'কৃষি উৎপাদন জলবায়ু, আবহাওয়া ও প্রাকৃতিক ঝুঁকির ওপর সরাসরি নির্ভরশীল।'
    ],
    mcqs: [
      {
        questionBn: 'কৃষি অর্থনীতি প্রধানত কিসের প্রয়োগ নির্দেশ করে?',
        options: ['শিল্প নীতি', 'অর্থনৈতিক তত্ত্বের কৃষি খাতে প্রয়োগ', 'শুধুমাত্র ব্যাংকিং', 'মৎস্য আহরণ'],
        answerIndex: 1,
        explanationBn: 'সাধারণ অর্থনীতির মূল নীতিগুলো কৃষি উৎপাদন ও বিপণনে প্রয়োগই কৃষি অর্থনীতি।'
      }
    ],
    shortQuestions: [
      {
        questionBn: 'কৃষি অর্থনীতি বলতে কী বোঝায়?',
        answerBn: 'কৃষি অর্থনীতি হলো অর্থনীতির একটি ফলিত শাখা যা সীমিত কৃষি সম্পদের (জমি, শ্রম, মূলধন) দক্ষ বণ্টন এবং কৃষি পণ্যের উৎপাদন, প্রক্রিয়াজাতকরণ ও বাজারজাতকরণ নিয়ে আলোচনা করে।'
      }
    ],
    broadQuestions: [
      {
        questionBn: 'কৃষি অর্থনীতির পরিধি ও বাংলাদেশের অর্থনীতিতে এর গুরুত্ব আলোচনা করুন।',
        outlineBn: [
          '১. ভূমিকা ও কৃষি অর্থনীতির সংজ্ঞা',
          '২. কৃষি অর্থনীতির পরিধি (উৎপাদন, বাজারজাতকরণ, পলিসি, রিসোর্স)',
          '৩. খাদ্য নিরাপত্তা ও জিডিপিতে কৃষির অবদান',
          '৪. কর্মসংস্থান সৃষ্টি ও গ্রামীণ দারিদ্র্য বিমোচন',
          '৫. উপসংহার'
        ]
      }
    ]
  },
  {
    id: 'principles_agri_econ',
    nameEn: 'Principles of Agricultural Economics',
    nameBn: 'কৃষি অর্থনীতির মৌলিক নীতিসমূহ',
    category: 'Fundamentals',
    shortExplanationEn: 'Core economic principles applied to agricultural enterprise: opportunity cost, marginalism, substitution, and equi-marginal return.',
    shortExplanationBn: 'সুযোগ ব্যয়, প্রান্তিক উৎপাদনশীলতা, সম-প্রান্তিক আয় এবং বিকল্পায়নের মূল নীতি যা খামার পরিচালনায় প্রযোজ্য।',
    definitions: [
      {
        titleBn: 'সুযোগ ব্যয় নীতি (Opportunity Cost Principle)',
        titleEn: 'Opportunity Cost Principle',
        descBn: 'একটি কৃষি পন্য উৎপাদনে সম্পদ ব্যবহারে যে পরবর্তী সেরা বিকল্পটির সুযোগ ত্যাগ করা হয়, তাই সুযোগ ব্যয়।',
        descEn: 'The value of the next best alternative forgone when a choice is made.'
      },
      {
        titleBn: 'সম-প্রান্তিক নীতি (Equi-Marginal Principle)',
        titleEn: 'Equi-Marginal Principle',
        descBn: 'সীমিত মূলধন এমনভাবে বিভিন্ন খাতে বণ্টন করা উচিত যাতে প্রতিটি খাতের শেষ টাকার প্রান্তিক আয় সমান হয়।',
        descEn: 'A resource should be allocated among enterprises so that the marginal returns are equal across all uses.'
      }
    ],
    formulas: [
      { name: 'সম-প্রান্তিক আয় সমীকরণ', formula: 'MVP_1 = MVP_2 = ... = MVP_n', descBn: 'সকল খাতে প্রান্তিক মূল্য উৎপাদন (MVP) সমান হওয়া।' }
    ],
    examples: [
      'জমিতে ধান চাষ করলে পাট চাষ থেকে প্রাপ্ত সম্ভাব্য মুনাফা হলো ধান চাষের সুযোগ ব্যয়।',
      '১০০০ টাকা সারে নাকি কিটনাশকে প্রয়োগ করলে বেশি লাভ আসবে তা নির্ধারণ।'
    ],
    examPoints: [
      'সীমিত মূলধনের ক্ষেত্রে সম-প্রান্তিক নীতি সর্বোচ্চ লাভ নিশ্চিত করে।',
      'প্রান্তিক বিশ্লেষণ (Marginal Analysis) কৃষি সিদ্ধান্তের মূল চাবিকাঠি।'
    ],
    mcqs: [
      {
        questionBn: 'সীমিত মূলধনে সর্বোচ্চ মুনাফা পাওয়ার নীতি কোনটি?',
        options: ['সুযোগ ব্যয় নীতি', 'সম-প্রান্তিক নীতি', 'ক্রমহ্রাসমান হার', 'উৎপাদন ফাংশন'],
        answerIndex: 1,
        explanationBn: 'সম-প্রান্তিক নীতির সাহায্যে সীমিত মূলধন বিভিন্ন কৃষি খাতে বণ্টন করে সর্বাধিক রিটার্ন পাওয়া যায়।'
      }
    ],
    shortQuestions: [
      {
        questionBn: 'কৃষি অর্থনীতিতে সুযোগ ব্যয় নীতি বলতে কী বোঝায়?',
        answerBn: 'একটি কৃষি সম্পদ (যেমন জমি বা টাকা) কোনো একটি নির্দিষ্ট শস্যে ব্যবহার করার ফলে পরবর্তী সম্ভাব্য লাভজনক বিকল্প ব্যবহার থেকে যে আয় ত্যাগ করতে হয়, তাকে সুযোগ ব্যয় বলা হয়।'
      }
    ],
    broadQuestions: [
      {
        questionBn: 'কৃষি অর্থনীতিতে সম-প্রান্তিক নীতি উদাহরণসহ ব্যাখ্যা করুন।',
        outlineBn: [
          '১. সম-প্রান্তিক নীতির সংজ্ঞা',
          '২. সীমিত সম্পদের সঠিক বন্টনের গাণিতিক সমীকরণ',
          '৩. খামার উদাহরণের সাহায্যে ব্যাখ্যা (ধান বনাম সবজি চাষ)',
          '৪. খামার ব্যবস্থাপনায় সিদ্ধান্ত গ্রহণের গুরুত্ব'
        ]
      }
    ]
  },
  {
    id: 'microeconomics',
    nameEn: 'Microeconomics',
    nameBn: 'ব্যষ্টিগত অর্থনীতি (Microeconomics)',
    category: 'Fundamentals',
    shortExplanationEn: 'Study of individual decision-making units—farmers, consumers, firms, and agricultural product markets.',
    shortExplanationBn: 'একক কৃষক, নির্দিষ্ট কৃষি খামার, একক ভোক্তা এবং শস্য বাজারের অর্থনৈতিক আচরণ বিশ্লেষণ।',
    definitions: [
      {
        titleBn: 'ব্যষ্টিগত অর্থনীতি (Microeconomics)',
        titleEn: 'Microeconomics',
        descBn: 'অর্থনীতির যে শাখায় একক অর্থনৈতিক ইউনিট যেমন কৃষক, ভোক্তা বা নির্দিষ্ট ফার্মের আচরণ পড়া হয়।',
        descEn: 'Branch of economics that studies the behavior of individual decision-making units.'
      }
    ],
    formulas: [
      { name: 'চাহিদার স্থিতিস্থাপকতা (Ed)', formula: 'Ed = (% Change in Quantity Demanded) / (% Change in Price)', descBn: 'দামের পরিবর্তনের ফলে চাহিদার পরিমাণের অনুপাত।' }
    ],
    examples: ['ময়মনসিংহের পাইকারি বাজারে আলুর দাম ১০% বাড়লে একক পরিবার কী পরিমাণ কেনা কমায়।'],
    examPoints: ['কৃষকের উৎপাদন খরচ ও বাজারে বিক্রয় সিদ্ধান্ত ব্যষ্টিগত অর্থনীতির অংশ।'],
    mcqs: [
      {
        questionBn: 'নিচের কোনটি ব্যষ্টিগত অর্থনীতির বিষয়বস্তু?',
        options: ['জাতীয় আয়', 'একক কৃষকের উৎপাদন সিদ্ধান্ত', 'মুদ্রাস্ফীতি', 'বেকারত্ব হার'],
        answerIndex: 1,
        explanationBn: 'একক কৃষক বা ফার্মের সিদ্ধান্ত ব্যষ্টিগত অর্থনীতির আওতায় পড়ে।'
      }
    ],
    shortQuestions: [
      {
        questionBn: 'ব্যষ্টিগত অর্থনীতি কী?',
        answerBn: 'ব্যষ্টিগত অর্থনীতি হলো অর্থনীতির সেই শাখা যা পৃথক ব্যক্তি, কৃষক বা খামারের সিদ্ধান্ত গ্রহণ ও বাজার আচরণ বিশ্লেষণ করে।'
      }
    ],
    broadQuestions: [
      {
        questionBn: 'কৃষি উৎপাদনে ব্যষ্টিগত অর্থনীতির প্রয়োগ আলোচনা করুন।',
        outlineBn: ['১. ব্যষ্টিগত অর্থনীতির মূল ধারণা', '২. চাহিদার দাম স্থিতিস্থাপকতা', '৩. কৃষকের উৎপাদন ব্যয় ও মুনাফা', '৪. উপসংহার']
      }
    ]
  },
  {
    id: 'macroeconomics',
    nameEn: 'Macroeconomics',
    nameBn: 'সমষ্টিগত অর্থনীতি (Macroeconomics)',
    category: 'Fundamentals',
    shortExplanationEn: 'Study of aggregate economy: national agricultural output, food inflation, export-import trade, subsidies, and employment.',
    shortExplanationBn: 'সামগ্রিক অর্থনীতি: জিডিপিতে কৃষির অবদান, খাদ্য মূল্যস্ফীতি, কৃষি ভতুর্কি, আমাদানি-রপ্তানি নীতি এবং জাতীয় কর্মসংস্থান।',
    definitions: [
      {
        titleBn: 'সমষ্টিগত অর্থনীতি (Macroeconomics)',
        titleEn: 'Macroeconomics',
        descBn: 'জাতীয় আয়, মূল্যস্ফীতি, মোট বিনিয়োগ ও সার্বিক কৃষি খাতের অগ্রগতি বিশ্লেষণ।',
        descEn: 'Study of the economy as a whole, including aggregate national income and food security.'
      }
    ],
    formulas: [
      { name: 'জিডিপিতে কৃষির অবদান (%)', formula: 'Agri GDP Share = (Agri Value Added / Total GDP) * 100', descBn: 'মোট অভ্যন্তরীণ উৎপাদনে কৃষি খাতের অবদান।' }
    ],
    examples: ['বাংলাদেশে সারের ভর্তুকি বৃদ্ধির ফলে সার্বিক খাদ্য উৎপাদনে প্রভাব।'],
    examPoints: ['খাদ্য নিরাপত্তা ও কৃষি নীতি সমষ্টিগত অর্থনীতির অন্তর্ভুক্ত।'],
    mcqs: [
      {
        questionBn: 'খাদ্য মূল্যস্ফীতি অর্থনীতির কোন শাখার আলোচ্য বিষয়?',
        options: ['ব্যষ্টিগত অর্থনীতি', 'সমষ্টিগত অর্থনীতি', 'মাইক্রো-ফাইনান্স', 'অ্যানাটমি'],
        answerIndex: 1,
        explanationBn: 'সার্বিক মূল্যস্ফীতি একটি সমষ্টিগত অর্থনৈতিক নির্দেশক।'
      }
    ],
    shortQuestions: [
      {
        questionBn: 'কৃষিতে সমষ্টিগত অর্থনীতির ভূমিকা কী?',
        answerBn: 'সমষ্টিগত অর্থনীতি জাতীয় কৃষি নীতি, খাদ্য নিরাপত্তা, ব্যাংক ঋণ ও ভতুর্কি কাঠামোর মাধ্যমে সামগ্রিক কৃষির উন্নয়ন ত্বরান্বিত করে।'
      }
    ],
    broadQuestions: [
      {
        questionBn: 'বাংলাদেশের খাদ্য নিরাপত্তা অর্জনে সমষ্টিগত কৃষি নীতির ভূমিকা ব্যাখ্যা করুন।',
        outlineBn: ['১. সমষ্টিগত অর্থনীতির সংজ্ঞা', '২. সার ও বীজে সরকারি ভতুর্কি', '৩. খাদ্য শস্যের মজুদ নীতি', '৪. উপসংহার']
      }
    ]
  },
  {
    id: 'production_economics',
    nameEn: 'Production Economics',
    nameBn: 'উৎপাদন অর্থনীতি (Production Economics)',
    category: 'Micro & Production',
    shortExplanationEn: 'Application of economic principles to agricultural production optimization, input combination, and cost minimization.',
    shortExplanationBn: 'কৃষি উপকরণ (সার, বীজ, সেচ) ও উৎপাদনের মধ্যকার অর্থনৈতিক সম্পর্ক এবং সর্বনিম্ন খরচে সর্বোচ্চ ফলন অর্জন।',
    definitions: [
      {
        titleBn: 'উৎপাদন অর্থনীতি',
        titleEn: 'Production Economics',
        descBn: 'কৃষি উপকরণ সমূহের অনুপাত ও সংযোগ পরিবর্তন করে সর্বোচ্চ লাভ অর্জনের কৌশল।',
        descEn: 'Applied economics dealing with optimization of input combinations to maximize farm profits.'
      }
    ],
    formulas: [
      { name: 'প্রান্তিক শারীরিক উৎপাদন (MPP)', formula: 'MPP = ΔTPP / ΔX', descBn: 'উপকরণ (X) ১ একক বাড়লে মোট উৎপাদন (TPP) এর পরিবর্তন।' },
      { name: 'প্রান্তিক মূল্য উৎপাদন (MVP)', formula: 'MVP = MPP * Py', descBn: 'MPP কে উৎপাদিত পণ্যের দাম (Py) দিয়ে গুণ।' }
    ],
    examples: ['ইউরিয়া সারের মাত্রা বাড়ালে ধান ফলন কীভাবে পরিবর্তন হয় তা MPP ও MVP দিয়ে হিসাব।'],
    examPoints: ['MVP = Px (উপকরণের দাম) হলে সর্বোচ্চ মুনাফার বিন্দু অর্জিত হয়।'],
    mcqs: [
      {
        questionBn: 'সর্বোচ্চ মুনাফা অর্জনের শর্ত কোনটি?',
        options: ['MVP > Px', 'MVP = Px', 'MVP < Px', 'MPP = 0'],
        answerIndex: 1,
        explanationBn: 'উপকরণের প্রান্তিক মূল্য উৎপাদন (MVP) উপকরণের দাম (Px) এর সমান হলে মুনাফা সর্বোচ্চ হয়।'
      }
    ],
    shortQuestions: [
      {
        questionBn: 'প্রান্তিক মূল্য উৎপাদন (MVP) কী?',
        answerBn: 'এক একক অতিরিক্ত উপকরণ ব্যবহারের ফলে যে অতিরিক্ত উৎপাদন পাওয়া যায়, তাকে পণ্যের বাজারমূল্য দিয়ে গুণ করলে MVP পাওয়া যায়।'
      }
    ],
    broadQuestions: [
      {
        questionBn: 'উৎপাদন ফাংশনের তিনটি ধাপ চিত্রসহ ব্যাখ্যা করুন।',
        outlineBn: [
          '১. উৎপাদন ফাংশনের ধারণা (TPP, APP, MPP)',
          '২. প্রথম ধাপ (Stage I): ক্রমবর্ধমান রিটার্ন',
          '৩. দ্বিতীয় ধাপ (Stage II): অর্থনৈতিকভাবে যুক্তিসঙ্গত অঞ্চল (Rational Zone)',
          '৪. তৃতীয় ধাপ (Stage III): অযুক্তিসঙ্গত অঞ্চল (Negative MPP)'
        ]
      }
    ]
  },
  {
    id: 'farm_management',
    nameEn: 'Farm Management',
    nameBn: 'খামার ব্যবস্থাপনা (Farm Management)',
    category: 'Farm Management',
    shortExplanationEn: 'Decision making on farm resource combination, budgeting, crop planning, record keeping, and risk reduction.',
    shortExplanationBn: 'খামারের জমি, শ্রম ও মূলধনের সঠিক বিন্যাস, বাজেট তৈরি, শস্য পরিকল্পনা ও আয়-ব্যয়ের হিসাব রাখা।',
    definitions: [
      {
        titleBn: 'ফার্ম বাজেটিং (Farm Budgeting)',
        titleEn: 'Farm Budgeting',
        descBn: 'ভবিষ্যত খামার কার্যক্রমের সম্ভাব্য আয় ও ব্যয়ের পূর্বানুমানিক হিসাব।',
        descEn: 'A method of estimating expected costs and returns of a farm business plan.'
      }
    ],
    formulas: [
      { name: 'আংশিক বাজেট (Partial Budget)', formula: 'Net Change = (Added Revenue + Reduced Cost) - (Added Cost + Reduced Revenue)', descBn: 'নতুন প্রযুক্তি গ্রহণে নিট লাভ বা ক্ষতি হিসাব।' }
    ],
    examples: ['প্রথাগত জাত থেকে উফশী ধান জাতে পরিবর্তনের সময় আংশিক বাজেট তৈরি।'],
    examPoints: ['আংশিক বাজেট (Partial Budget) ছোট প্রযুক্তিগত পরিবর্তনের জন্য ব্যবহৃত হয়।'],
    mcqs: [
      {
        questionBn: 'ছোটখাটো প্রযুক্তি পরিবর্তনের প্রভাব পরিমাপের জন্য কোনটি দরকারী?',
        options: ['সম্পূর্ণ বাজেট', 'আংশিক বাজেট', 'এন্টারপ্রাইজ বাজেট', 'ক্যাশ ফ্লো'],
        answerIndex: 1,
        explanationBn: 'আংশিক বাজেট কোনো একটি ছোট পরিবর্তন বা প্রযুক্তির প্রভাব মূল্যায়নে ব্যবহৃত হয়।'
      }
    ],
    shortQuestions: [
      {
        questionBn: 'আংশিক বাজেট (Partial Budget) কী?',
        answerBn: 'খামারে কোনো নির্দিষ্ট ছোট পরিবর্তন (যেমন নতুন জাতের বীজ বা নতুন সেচ পদ্ধতি) আনলে আয় ও ব্যয়ের কী নিট পরিবর্তন হবে তার হিসাব রাখা।'
      }
    ],
    broadQuestions: [
      {
        questionBn: 'একটি দুগ্ধ খামারের জন্য এন্টারপ্রাইজ বাজেটের উপাদানসমূহ আলোচনা করুন।',
        outlineBn: ['১. এন্টারপ্রাইজ বাজেটের সংজ্ঞা', '২. পরিবর্তনশীল ব্যয় (খাদ্য, ওষুধ, মজুরি)', '৩. স্থায়ী ব্যয় (শেড, যন্ত্রপাতি অবচয়)', '৪. মোট আয় ও নিট লাভ']
      }
    ]
  },
  {
    id: 'agri_marketing',
    nameEn: 'Agricultural Marketing',
    nameBn: 'কৃষি বিপণন (Agricultural Marketing)',
    category: 'Marketing & Policy',
    shortExplanationEn: 'Supply chain of farm products, marketing channels, intermediaries (Farria, Bepari, Aratdar), price spreads, and value addition.',
    shortExplanationBn: 'কৃষি পণ্যের খামার থেকে চূড়ান্ত ভোক্তার কাছে পৌঁছানোর মাধ্যম, মধ্যস্বত্বভোগী, বাজার মার্জিন ও প্রক্রিয়াজাতকরণ।',
    definitions: [
      {
        titleBn: 'মার্কেটিং মার্জিন (Marketing Margin)',
        titleEn: 'Marketing Margin',
        descBn: 'ভোক্তার দেওয়া দর এবং কৃষকের পাওয়া দরের মধ্যকার পার্থক্য যা মধ্যস্বত্বভোগীদের খরচ ও মুনাফা নির্দেশ করে।',
        descEn: 'The difference between the price paid by consumer and price received by farmer.'
      }
    ],
    formulas: [
      { name: 'মার্কেটিং মার্জিন (%)', formula: 'Margin % = ((Pr - Pf) / Pr) * 100', descBn: 'Pr = খুচরা মূল্য, Pf = খামার প্রান্তের মূল্য।' },
      { name: 'কৃষকের প্রাপ্তি অংশ (Farmer\'s Share)', formula: 'Farmer\'s Share % = (Pf / Pr) * 100', descBn: 'ভোক্তার দরের কত শতাংশ কৃষক পায়।' }
    ],
    examples: ['সবজির পাইকারি বাজার (কারওয়ান বাজার) থেকে খুচরা বাজারে দামের পার্থক্য।'],
    examPoints: ['ফড়িয়া, ব্যাপারী ও আড়তদার মধ্যস্বত্বভোগী হিসেবে কাজ করে।'],
    mcqs: [
      {
        questionBn: 'কৃষকের প্রাপ্তি অংশ (Farmer\'s Share) বাড়াতে কোনটি প্রয়োজন?',
        options: ['মধ্যস্বত্বভোগী বাড়ানো', 'মার্কেটিং মার্জিন কমানো', 'পরিবহন খরচ বাড়ানো', 'টোল বৃদ্ধি'],
        answerIndex: 1,
        explanationBn: 'মার্কেটিং মার্জিন কমলে কৃষক উৎপাদিত পণ্যের বেশি অংশ দাম পান।'
      }
    ],
    shortQuestions: [
      {
        questionBn: 'মার্কেটিং মার্জিন বলতে কী বোঝায়?',
        answerBn: 'চূড়ান্ত খুচরা বিক্রয়মূল্য এবং কৃষকের খামার প্রান্তের মূল্যের ব্যবধানকে মার্কেটিং মার্জিন বলে, যার মধ্যে পরিবহন, প্রক্রিয়াজাতকরণ ও মধ্যস্বত্বভোগীদের মুনাফা অন্তর্ভুক্ত।'
      }
    ],
    broadQuestions: [
      {
        questionBn: 'বাংলাদেশের পচনশীল কৃষি পণ্যের (সবজি ও ফল) বিপণন সমস্যা ও সমাধানের উপায় আলোচনা করুন।',
        outlineBn: ['১. কৃষি বিপণনের গুরুত্ব', '২. প্রধান সমস্যাবলী (কোল্ড চেইনের অভাব, মধ্যস্বত্বভোগী, পরিবহন)', '৩. সমাধানের কৌশল (ই-কমার্স, সমবায় বিপণন)', '৪. উপসংহার']
      }
    ]
  },
  {
    id: 'agri_finance',
    nameEn: 'Agricultural Finance',
    nameBn: 'কৃষি অর্থায়ন (Agricultural Finance)',
    category: 'Marketing & Policy',
    shortExplanationEn: 'Study of financial resources, microcredit, institutional loans (BKB, RAKUB), collateral, 3Cs/5Cs of credit, and crop insurance.',
    shortExplanationBn: 'কৃষি ঋণ, প্রাতিষ্ঠানিক ব্যাংক ঋণ, ক্ষুদ্রঋণ, ঋণের ৫C নীতি এবং শস্য বিমা।',
    definitions: [
      {
        titleBn: 'ঋণের ৫টি C (5 Cs of Credit)',
        titleEn: '5 Cs of Credit',
        descBn: 'Character (চরিত্র), Capacity (ক্ষমতা), Capital (মূলধন), Collateral (জামানত), Conditions (শর্তাবলী)।',
        descEn: 'The framework used by lenders to evaluate creditworthiness: Character, Capacity, Capital, Collateral, Conditions.'
      }
    ],
    formulas: [
      { name: 'চক্রবৃদ্ধি চক্র (Compound Value)', formula: 'A = P * (1 + r/n)^(nt)', descBn: 'ঋণের ভবিষ্যৎ মান নির্ধারণ।' }
    ],
    examples: ['বাংলাদেশ কৃষি ব্যাংক (BKB) থেকে কম সুদে বোরো ধান চাষের প্রাতিষ্ঠানিক ঋণগ্রহণ।'],
    examPoints: ['বাংলাদেশ ব্যাংক কর্তৃক ১০ টাকার ব্যাংক একাউন্ট ও কৃষি ঋণ লক্ষ্যমাত্রা নির্ধারণ।'],
    mcqs: [
      {
        questionBn: 'ঋণগ্রহীতার মূলধন যাচাই নীতিতে কোনটি অন্যতম C?',
        options: ['Color', 'Capital', 'Cost', 'Crop'],
        answerIndex: 1,
        explanationBn: '5 Cs এর একটি হলো Capital (মূলধন)।'
      }
    ],
    shortQuestions: [
      {
        questionBn: 'কৃষি ঋণের ৩টি C কী কী?',
        answerBn: '১. Character (চরিত্র) ২. Capacity (পরিশোধের ক্ষমতা) ৩. Capital (মূলধন)।'
      }
    ],
    broadQuestions: [
      {
        questionBn: 'বাংলাদেশের প্রাতিষ্ঠানিক বনাম অপ্রাতিষ্ঠানিক কৃষি ঋণের তুলনামূলক সুবিধা ও অসুবিধা আলোচনা করুন।',
        outlineBn: ['১. কৃষি ঋণের প্রয়োজনীয়তা', '২. প্রাতিষ্ঠানিক উৎস (BKB, NGO) এর বৈশিষ্ট্য', '৩. অপ্রাতিষ্ঠানিক উৎস (মহাজন, দাদন) এর ফাঁদ', '৪. ঋণের সহজীকরণে সুপারিশ']
      }
    ]
  },
  {
    id: 'agri_stats',
    nameEn: 'Agricultural Statistics',
    nameBn: 'কৃষি পরিসংখ্যান (Agricultural Statistics)',
    category: 'Quantitative & Advanced',
    shortExplanationEn: 'Experimental designs (CRD, RCBD), sampling techniques, crop yield estimation, correlation, and regression analysis.',
    shortExplanationBn: 'কৃষি গবেষণার পরীক্ষামূলক নকশা (RCBD, CRD), নমুনা জরিপ, শস্য ফলন পূর্বাভাস ও অনুমিতি পরীক্ষা।',
    definitions: [
      {
        titleBn: 'RCBD (Randomized Complete Block Design)',
        titleEn: 'Randomized Complete Block Design',
        descBn: 'জমিতে উর্বরতার তারতম্য থাকলে ব্লকিং করে ব্লকের ভেতরে দৈবচয়ন বা এলোমেলোভাবে ট্রিটমেন্ট প্রয়োগের নকশা।',
        descEn: 'An experimental design where treatments are assigned at random within homogenous blocks.'
      }
    ],
    formulas: [
      { name: 'গড় (Mean)', formula: 'x̄ = Σx / n', descBn: 'নমুনার গড় মান।' },
      { name: 'প্রমিত বিচ্যুতি (Standard Deviation)', formula: 's = √(Σ(x - x̄)² / (n - 1))', descBn: 'তথ্যের বিস্তারের পরিমাপ।' }
    ],
    examples: ['ধানের ৪টি জাতের ফলন তুলনা করতে ৫টি ব্লকে RCBD ডিজাইনে ট্রায়াল পরিচালনা।'],
    examPoints: ['কৃষি গবেষণায় মাটির হেটেরোজেনিটির কারণে RCBD সবচেয়ে বহুল ব্যবহৃত নকশা।'],
    mcqs: [
      {
        questionBn: 'মাটির উর্বরতার একদিকে গ্রাডিয়েন্ট থাকলে কোন এক্সপেরিমেন্টাল ডিজাইন উপযুক্ত?',
        options: ['CRD', 'RCBD', 'LSD', 'Split Plot'],
        answerIndex: 1,
        explanationBn: 'একমুখী উর্বরতার তারতম্যে RCBD অত্যন্ত কার্যকর।'
      }
    ],
    shortQuestions: [
      {
        questionBn: 'RCBD ডিজাইন কেন কৃষি পরীক্ষায় বেশি ব্যবহৃত হয়?',
        answerBn: 'কৃষি জমিতে উর্বরতার তারতম্য থাকে। RCBD ডিজাইনে ব্লক তৈরি করে এই তারতম্য দূর করে সঠিক ফলন তুলনা করা যায়।'
      }
    ],
    broadQuestions: [
      {
        questionBn: 'কৃষি ফলন পূর্বাভাসে নমুনা জরিপ (Sample Survey) ও ANOVA টেস্টের ব্যবহার আলোচনা করুন।',
        outlineBn: ['১. কৃষি পরিসংখ্যানের পরিধি', '২. দৈবচয়ন নমুনায়ন', '৩. ANOVA টেবিল গঠন ও F-টেস্ট', '৪. সিদ্ধান্ত গ্রহণ']
      }
    ]
  },
  {
    id: 'econometrics',
    nameEn: 'Econometrics',
    nameBn: 'ইকোনোমেট্রিক্স (Econometrics)',
    category: 'Quantitative & Advanced',
    shortExplanationEn: 'Application of mathematical and statistical methods to agricultural data for testing economic hypotheses and forecasting.',
    shortExplanationBn: 'কৃষি অর্থনৈতিক তথ্যের ওপর গাণিতিক ও পরিসংখ্যানিক মডেল (OLS, Cobb-Douglas) প্রয়োগ করে নীতি নির্ধারণ।',
    definitions: [
      {
        titleBn: 'সাধারণ ন্যূনতম বর্গ পদ্ধতি (OLS)',
        titleEn: 'Ordinary Least Squares (OLS)',
        descBn: 'রিগ্রেশন মডেলে ভুলের বর্গ সমষ্টি (Sum of Squared Residuals) সর্বনিম্ন করে সহগ নির্ণয়ের পদ্ধতি।',
        descEn: 'A linear least squares method for estimating the unknown parameters in a linear regression model.'
      }
    ],
    formulas: [
      { name: 'সরল রিগ্রেশন মডেল', formula: 'Y = β₀ + β₁X + ε', descBn: 'Y = নির্ভরশীল চলক (ফলন), X = স্বাধীন চলক (সার)।' }
    ],
    examples: ['সার ও সেচের পরিমাণের ওপর ধানের ফলন নির্ভরতার Cobb-Douglas মডেল রিগ্রেশন।'],
    examPoints: ['R² (Coefficient of Determination) মডেলের ব্যাখ্যা ক্ষমতা প্রকাশ করে।'],
    mcqs: [
      {
        questionBn: 'মডেলের সামগ্রিক নির্ভুলতা বা ব্যাখ্যা ক্ষমতা নির্দেশ করে কোনটি?',
        options: ['p-value', 'R-squared (R²)', 'F-statistic', 't-test'],
        answerIndex: 1,
        explanationBn: 'R² নির্দেশ করে স্বাধীন চলকগুলো নির্ভরশীল চলকের কত শতাংশ পরিবর্তন ব্যাখ্যা করে।'
      }
    ],
    shortQuestions: [
      {
        questionBn: 'Cobb-Douglas উৎপাদন ফাংশন ইকোনোমেট্রিক্সে কেন জনপ্রিয়?',
        answerBn: 'এটি সহজে লিনিয়ার ফর্মে রূপান্তর করা যায় এবং সরাসরি স্কেল রিটার্ন ও উপকরণের স্থিতিস্থাপকতা নির্দেশ করে।'
      }
    ],
    broadQuestions: [
      {
        questionBn: 'Cobb-Douglas উৎপাদন ফাংশনের গাণিতিক রূপ ও এর অর্থনৈতিক বৈশিষ্ট্যসমূহ ব্যাখ্যা করুন।',
        outlineBn: ['১. Cobb-Douglas মডেলের সমীকরণ Y = A * L^α * K^β', '২. উভয়পক্ষে লগ প্রয়োগ ln Y = ln A + α ln L + β ln K', '৩. স্কেল রিটার্ন (α + β = 1, >1, <1)', '৪. কৃষি নীতিতে প্রয়োগ']
      }
    ]
  },
  {
    id: 'supply_demand',
    nameEn: 'Supply and Demand',
    nameBn: 'যোগান ও চাহিদা (Supply and Demand)',
    category: 'Micro & Production',
    shortExplanationEn: 'Market equilibrium in agricultural products, shifting factors (weather, cobweb model, price volatility).',
    shortExplanationBn: 'কৃষি পণ্যের ভারসাম্য দাম নির্ধারণ, কওয়েব মডেল (Cobweb model) এবং আবহাওয়ার প্রভাবে যোগান শিফট।',
    definitions: [
      {
        titleBn: 'কওয়েব তত্ত্ব (Cobweb Theory)',
        titleEn: 'Cobweb Theory',
        descBn: 'কৃষি উৎপাদনে সময়ের বিলম্বের (Time Lag) কারণে দাম ও যোগানের মধ্যে চক্রাকারে ওঠানামার ব্যাখ্যা।',
        descEn: 'An economic model that explains why prices might be subject to periodic fluctuations in agricultural markets due to time lags.'
      }
    ],
    formulas: [
      { name: 'ভারসাম্য শর্ত (Equilibrium)', formula: 'Qd = Qs', descBn: 'চাহিদার পরিমাণ ও যোগানের পরিমাণ সমান হওয়া।' }
    ],
    examples: ['চলতি বছর পেঁয়াজের দাম বেশি দেখে আগামী বছর বেশি চাষ করায় উদ্বৃত্ত হয়ে দাম পড়ে যাওয়া।'],
    examPoints: ['কৃষি পণ্যের যোগান স্বল্পমেয়াদে অস্থিতিস্থাপক (Inelastic)।'],
    mcqs: [
      {
        questionBn: 'কৃষি পণ্যের দামে চক্রাকার ওঠানামা ব্যাখ্যা করে কোন মডেল?',
        options: ['IS-LM মডেল', 'কওয়েব মডেল (Cobweb Model)', 'সলৌ মডেল', 'হারোড-ডমার'],
        answerIndex: 1,
        explanationBn: 'কওয়েব মডেল কৃষি ফসলের দামের চক্রাকার অস্থিরতা প্রদর্শন করে।'
      }
    ],
    shortQuestions: [
      {
        questionBn: 'স্বল্পমেয়াদে কৃষি পণ্যের যোগান কেন অস্থিতিস্থাপক?',
        answerBn: 'কারণ ফসল উৎপাদনে নির্দিষ্ট সময় লাগে এবং তাৎক্ষণিকভাবে কারখানার মতো উৎপাদন বাড়ানো সম্ভব নয়।'
      }
    ],
    broadQuestions: [
      {
        questionBn: 'কওয়েব মডেল চিত্রসহ আলোচনা করে কৃষি বাজার অস্থিরতা দূরীকরণের উপায় প্রস্তাব করুন।',
        outlineBn: ['১. কওয়েব মডেলের মূল ধারণা ও সময় বিলম্ব', '২. তিন ধরণের কওয়েব (Convergent, Divergent, Continuous)', '৩. সরকারি মূল্য সমর্থন নীতি (Price Support) ও গুদামজাতকরণ']
      }
    ]
  },
  {
    id: 'production_function',
    nameEn: 'Production Function',
    nameBn: 'উৎপাদন ফাংশন (Production Function)',
    category: 'Micro & Production',
    shortExplanationEn: 'Physical relationship between input factors (land, labor, capital) and output quantity under technology.',
    shortExplanationBn: 'উপকরণ ও উৎপাদনের ভৌত সম্পর্ক: TPP, APP এবং MPP রূপরেখা।',
    definitions: [
      {
        titleBn: 'উৎপাদন ফাংশন',
        titleEn: 'Production Function',
        descBn: 'প্রযুক্তি স্থির রেখে নির্দিষ্ট উপকরণ ব্যবহারের মাধ্যমে সর্বোচ্চ সম্ভাব্য ফলনের ভৌত সম্পর্ক।',
        descEn: 'The technical or physical relationship between inputs used and the maximum output produced.'
      }
    ],
    formulas: [
      { name: 'উৎপাদন ফাংশন রূপ', formula: 'Q = f(X1, X2 | X3...Xn)', descBn: 'Q = ফলন, X1 = পরিবর্তনশীল উপকরণ (সার), X2..Xn = স্থির।' }
    ],
    examples: ['১ একর জমিতে সারের পরিমাণ (কেজি) বাড়ানোর সাথে ধান উৎপাদনের (মন) সম্পর্ক।'],
    examPoints: ['APP সর্বোচ্চ হলে MPP = APP হয়।'],
    mcqs: [
      {
        questionBn: 'গড় উৎপাদন (APP) সর্বোচ্চ হলে প্রান্তিক উৎপাদন (MPP) কেমন হয়?',
        options: ['শূন্য', 'APP এর সমান', 'ঋণাত্মক', 'অসীম'],
        answerIndex: 1,
        explanationBn: 'যখন APP তার সর্বোচ্চ বিন্দুতে থাকে, তখন MPP কার্ভটি APP কার্ভকে ছেদ করে, অর্থাৎ MPP = APP।'
      }
    ],
    shortQuestions: [
      {
        questionBn: 'TPP, APP ও MPP এর পূর্ণরূপ কী?',
        answerBn: 'TPP = Total Physical Product, APP = Average Physical Product, MPP = Marginal Physical Product.'
      }
    ],
    broadQuestions: [
      {
        questionBn: 'উৎপাদন ফাংশনের ধ্রুপদী বক্ররেখা (Classical Production Curve) চিত্র একে এর তিন অঞ্চলের তাৎপর্য ব্যাখ্যা করুন।',
        outlineBn: ['১. চিত্র অঙ্কন (TPP, APP, MPP)', '২. অঞ্চল ১ (Stage I): Increasing returns', '৩. অঞ্চল ২ (Stage II): Rational economic zone', '৪. অঞ্চল ৩ (Stage III): Negative returns']
      }
    ]
  },
  {
    id: 'cost_concepts',
    nameEn: 'Cost Concepts',
    nameBn: 'ব্যয় ধারণা (Cost Concepts)',
    category: 'Micro & Production',
    shortExplanationEn: 'Fixed cost, variable cost, total cost, marginal cost, average cost, and opportunity cost in farm accounting.',
    shortExplanationBn: 'স্থায়ী ব্যয় (TFC), পরিবর্তনশীল ব্যয় (TVC), মোট ব্যয় (TC), প্রান্তিক ব্যয় (MC) ও গড় ব্যয় (AC)।',
    definitions: [
      {
        titleBn: 'স্থায়ী ব্যয় (Total Fixed Cost - TFC)',
        titleEn: 'Total Fixed Cost',
        descBn: 'উৎপাদন শূন্য হলেও যে ব্যয় পরিবর্তন হয় না, যেমন জমির খাজনা ও ট্রাক্টরের অবচয়।',
        descEn: 'Costs that do not change with the level of production.'
      },
      {
        titleBn: 'পরিবর্তনশীল ব্যয় (Total Variable Cost - TVC)',
        titleEn: 'Total Variable Cost',
        descBn: 'উৎপাদনের পরিমাণ বাড়লে বা কমলে যে খরচ পরিবর্তিত হয়, যেমন সার, বীজ ও শ্রমিকের মজুরি।',
        descEn: 'Costs that vary directly with the level of output.'
      }
    ],
    formulas: [
      { name: 'মোট ব্যয় (TC)', formula: 'TC = TFC + TVC', descBn: 'স্থায়ী ব্যয় ও পরিবর্তনশীল ব্যয়ের যোগফল।' },
      { name: 'প্রান্তিক ব্যয় (MC)', formula: 'MC = ΔTC / ΔQ', descBn: 'এক একক অতিরিক্ত উৎপাদনে বাড়তি খরচ।' }
    ],
    examples: ['জমি প্রস্তুত রাখা বা না রাখা সত্ত্বেও জমির বাৎসরিক লিজ ফি প্রদান হলো TFC।'],
    examPoints: ['MC কার্ভটি AC কার্ভকে তার সর্বনিম্ন বিন্দুতে ছেদ করে।'],
    mcqs: [
      {
        questionBn: 'নিচের কোনটি খামারের স্থায়ী ব্যয়ের (Fixed Cost) উদাহরণ?',
        options: ['ইউরিয়া সার কেনা', 'দিনের মজুরি প্রদান', 'জমির বাৎসরিক খাজনা', 'বীজ ক্রয়'],
        answerIndex: 2,
        explanationBn: 'জমির বাৎসরিক খাজনা উৎপাদন হোক বা না হোক একই থাকে।'
      }
    ],
    shortQuestions: [
      {
        questionBn: 'প্রান্তিক ব্যয় (Marginal Cost) কী?',
        answerBn: 'উৎপাদনের পরিমাণ এক একক বৃদ্ধির ফলে মোট ব্যয়ের যে পরিবর্তন ঘটে, তাকে প্রান্তিক ব্যয় বা MC বলে।'
      }
    ],
    broadQuestions: [
      {
        questionBn: 'খামার আয়ের স্বল্পমেয়াদী ব্যয় রেখাসমূহ (TFC, TVC, TC, AFC, AVC, AC, MC) চিত্রসহ আলোচনা করুন।',
        outlineBn: ['১. মোট ব্যয় রেখাঙ্কন', '২. গড় ব্যয় ও প্রান্তিক ব্যয়ের ইউ-শেপ (U-shape) রেখা', '৩. MC ও AC এর সম্পর্ক']
      }
    ]
  },
  {
    id: 'elasticity',
    nameEn: 'Elasticity',
    nameBn: 'স্থিতিস্থাপকতা (Elasticity)',
    category: 'Micro & Production',
    shortExplanationEn: 'Price elasticity of demand, income elasticity, cross elasticity, and price elasticity of agricultural supply.',
    shortExplanationBn: 'চাহিদার দাম স্থিতিস্থাপকতা, আয় স্থিতিস্থাপকতা, আড়াআড়ি স্থিতিস্থাপকতা ও কৃষি যোগান স্থিতিস্থাপকতা।',
    definitions: [
      {
        titleBn: 'চাহিদার দাম স্থিতিস্থাপকতা',
        titleEn: 'Price Elasticity of Demand',
        descBn: 'পণ্যের দাম ১% পরিবর্তিত হলে চাহিদার পরিমাণের শতকরা কত পরিবর্তন হয়।',
        descEn: 'Percentage change in quantity demanded relative to percentage change in price.'
      }
    ],
    formulas: [
      { name: 'চাহিদার দাম স্থিতিস্থাপকতা (Ep)', formula: 'Ep = (ΔQ/Q) / (ΔP/P)', descBn: 'ΔQ = চাহিদার পরিবর্তন, ΔP = দামের পরিবর্তন।' }
    ],
    examples: ['চাল একটি নিত্যপ্রয়োজনীয় পণ্য হওয়ায় এর চাহিদার দাম স্থিতিস্থাপকতা অস্থিতিস্থাপক (Inelastic, Ep < 1)।'],
    examPoints: ['নিত্যপ্রয়োজনীয় খাদ্য দ্রব্যের চাহিদা অস্থিতিস্থাপক হয়।'],
    mcqs: [
      {
        questionBn: 'নিত্যপ্রয়োজনীয় কৃষি পণ্য যেমন চালের চাহিদার স্থিতিস্থাপকতা কেমন?',
        options: ['এককের বেশি (>1)', 'এককের কম (<1)', 'অসীম', 'শূন্য'],
        answerIndex: 1,
        explanationBn: 'দামের বড় পরিবর্তনেও চালের ব্যবহারে বিশেষ পরিবর্তন হয় না, তাই অস্থিতিস্থাপক (<1)।'
      }
    ],
    shortQuestions: [
      {
        questionBn: 'আড়াআড়ি স্থিতিস্থাপকতা (Cross Elasticity) বলতে কী বোঝায়?',
        answerBn: 'একটি পণ্যের (যেমন খাসির মাংস) দামের পরিবর্তনের ফলে অন্য একটি বিকল্প বা পরিপূরক পণ্যের (যেমন মুরগির মাংস) চাহিদার পরিবর্তনের অনুপাত।'
      }
    ],
    broadQuestions: [
      {
        questionBn: 'কৃষি অর্থনীতিতে চাহিদার স্থিতিস্থাপকতার বিভিন্ন প্রকারভেদ ও কৃষকের আয় নির্ধারণে এর ভূমিকা আলোচনা করুন।',
        outlineBn: ['১. দাম, আয় ও আড়াআড়ি স্থিতিস্থাপকতা', '২. গাণিতিক উদাহরণসহ ব্যাখ্যা', '৩. বাম্পার ফলনে কৃষকের আয় কমার রহস্য (King\'s Effect)']
      }
    ]
  },
  {
    id: 'linear_programming',
    nameEn: 'Linear Programming',
    nameBn: 'লিনিয়ার প্রোগ্রামিং (Linear Programming)',
    category: 'Quantitative & Advanced',
    shortExplanationEn: 'Optimization tool for allocating scarce farm resources (land, capital, labor) to maximize profit or minimize cost.',
    shortExplanationBn: 'সীমিত খামার সম্পদ (জমি, মূলধন, শ্রম) ব্যবহার করে সর্বোচ্চ মুনাফা অর্জন বা ব্যয় কমানোর গাণিতিক মডেল।',
    definitions: [
      {
        titleBn: 'উদ্দেশ্যমূলক ফাংশন (Objective Function)',
        titleEn: 'Objective Function',
        descBn: 'খামারের মোট মুনাফা সর্বোচ্চকরণ বা উৎপাদন খরচ সর্বনিম্নকরণের মূল সমীকরণ।',
        descEn: 'The mathematical expression representing the goal (profit maximization or cost minimization).'
      }
    ],
    formulas: [
      { name: 'মুনাফা সর্বোচ্চকরণ রূপ', formula: 'Maximize Z = c1*x1 + c2*x2 + ... + cn*xn', descBn: 'Z = মোট মুনাফা, x = শস্যের পরিমাণ, c = একক মুনাফা।' }
    ],
    examples: ['১০ একর জমিতে ধান ও সরিষা কীভাবে চাষ করলে ২০ হাজার টাকা মূলধনে সর্বোচ্চ লাভ হবে তার সমাধান।'],
    examPoints: ['লিনিয়ার প্রোগ্রামিং মডেলের বাধাগুলো (Constraints) অসমতা (Inequalities) দিয়ে প্রকাশ করা হয়।'],
    mcqs: [
      {
        questionBn: 'লিনিয়ার প্রোগ্রামিং-এ খামার সম্পদ সীমাবদ্ধতাকে কী বলা হয়?',
        options: ['Objective Function', 'Constraint (বাধা)', 'Slack Variable', 'Simplex'],
        answerIndex: 1,
        explanationBn: 'জমি, পানি বা ঋণের সীমাবদ্ধতাকে Constraint বলা হয়।'
      }
    ],
    shortQuestions: [
      {
        questionBn: 'লিনিয়ার প্রোগ্রামিং (LP) এর মূল দুটি অংশ কী কী?',
        answerBn: '১. Objective Function (উদ্দেশ্যমূলক সমীকরণ) ২. Constraints (সম্পদ সীমাবদ্ধতার সমীকরণ)।'
      }
    ],
    broadQuestions: [
      {
        questionBn: 'খামার পরিকল্পনায় লিনিয়ার প্রোগ্রামিং এর সিমপ্লেক্স পদ্ধতি (Simplex Method) বা গ্রাফিক্যাল পদ্ধতির প্রয়োগ আলোচনা করুন।',
        outlineBn: ['১. এলপি এর মৌলিক শর্তসমূহ', '২. সমীকরণ গঠন (উদ্দেশ্য ও বাধা)', '৩. গ্রাফিক্যাল সমাধানে Feasible Region চিত্রায়ণ', '৪. সিদ্ধান্ত গ্রহণ']
      }
    ]
  },
  {
    id: 'returns_to_scale',
    nameEn: 'Returns to Scale',
    nameBn: 'উৎপাদন মাত্রা বা স্কেল রিটার্ন (Returns to Scale)',
    category: 'Micro & Production',
    shortExplanationEn: 'Long-run production response when all input factors are increased proportionally (Constant, Increasing, Decreasing).',
    shortExplanationBn: 'দীর্ঘমেয়াদে সকল উপকরণ একই অনুপাতে বাড়ালে উৎপাদনে যে পরিবর্তন ঘটে (ক্রমবর্ধমান, স্থির, ক্রমহ্রাসমান)।',
    definitions: [
      {
        titleBn: 'স্কেল রিটার্ন (Returns to Scale)',
        titleEn: 'Returns to Scale',
        descBn: 'দীর্ঘমেয়াদে জমি, শ্রম, মূলধন সবগুলো উপাদান একত্রে ১০% বাড়ালে ফলন কত % বাড়ে তার অনুপাত।',
        descEn: 'The quantitative change in output resulting from a proportional change in all inputs.'
      }
    ],
    formulas: [
      { name: 'Cobb-Douglas স্কেল রিটার্ন', formula: 'Scale = α + β', descBn: 'α + β = 1 হলে স্থির, > 1 হলে ক্রমবর্ধমান, < 1 হলে ক্রমহ্রাসমান।' }
    ],
    examples: ['খামারের জমি ও শ্রমিক দ্বিগুণ করায় ধান ফলন আড়াই গুণ হলে ক্রমবর্ধমান স্কেল রিটার্ন।'],
    examPoints: ['Cobb-Douglas মডেলে সহগদ্বয়ের যোগফল α + β দ্বারা স্কেল রিটার্ন পরিমাপ করা হয়।'],
    mcqs: [
      {
        questionBn: 'উপকরণ ১০% বাড়ালে উৎপাদন ১৫% বাড়লে তা কোন ধরণের স্কেল রিটার্ন?',
        options: ['স্থির', 'ক্রমবর্ধমান', 'ক্রমহ্রাসমান', 'ঋণাত্মক'],
        answerIndex: 1,
        explanationBn: 'উপকরণের তুলনায় উৎপাদন বেশি হারে বাড়লে তাকে ক্রমবর্ধমান স্কেল রিটার্ন বলে।'
      }
    ],
    shortQuestions: [
      {
        questionBn: 'স্থির স্কেল রিটার্ন (Constant Returns to Scale) কাকে বলে?',
        answerBn: 'সকল উপকরণ যে অনুপাতে বাড়ানো হয় (যেমন ৫০%), উৎপাদনও যদি ঠিক একই অনুপাতে বৃদ্ধি পায় (৫০%), তাকে স্থির স্কেল রিটার্ন বলে।'
      }
    ],
    broadQuestions: [
      {
        questionBn: 'দীর্ঘমেয়াদী উৎপাদন প্রক্রিয়ায় স্কেল রিটার্নের তিন অবস্থা চিত্রসহ ব্যাখ্যা করুন।',
        outlineBn: ['১. স্কেল রিটার্নের সংজ্ঞা', '২. Increasing, Constant & Decreasing Returns to Scale', '৩. আইসোকোয়্যান্ট (Isoquant) ম্যাপের মাধ্যমে চিত্র উপস্থাপন', '৪. কৃষি খামারে প্রয়োগ']
      }
    ]
  },
  {
    id: 'law_variable_proportions',
    nameEn: 'Law of Variable Proportions',
    nameBn: 'পরিবর্তনশীল অনুপাত বিধি (Law of Variable Proportions)',
    category: 'Micro & Production',
    shortExplanationEn: 'Short-run production behavior when one input is varied keeping all other inputs fixed.',
    shortExplanationBn: 'স্বল্পমেয়াদে অন্যান্য উপকরণ স্থির রেখে কেবল একটি উপকরণ বাড়াতে থাকলে মোট ও প্রান্তিক উৎপাদনের ধাপে ধাপে পরিবর্তন।',
    definitions: [
      {
        titleBn: 'পরিবর্তনশীল অনুপাত বিধি',
        titleEn: 'Law of Variable Proportions',
        descBn: 'স্বল্পমেয়াদে স্থির উপকরণের সাথে পরিবর্তনশীল উপকরণ বাড়াতে থাকলে প্রথমে ক্রমবর্ধমান, পরে ক্রমহ্রাসমান এবং অবশেষে ঋণাত্মক প্রান্তিক উৎপাদন পাওয়া যায়।',
        descEn: 'As more units of a variable input are added to fixed inputs, total product increases at increasing rate, then decreasing rate, and eventually declines.'
      }
    ],
    formulas: [
      { name: 'প্রান্তিক উৎপাদন', formula: 'MPP = ΔTPP / ΔX', descBn: 'উপকরণের এক একক পরিবর্তনের জন্য মোট উৎপাদনের পরিবর্তন।' }
    ],
    examples: ['১ একর স্থির জমিতে সার না বাড়িয়ে কেবল শ্রমিক ১ জন থেকে বাড়িয়ে ১০ জন করার প্রভাব।'],
    examPoints: ['কৃষি খামারে দ্বিতীয় ধাপ (Stage II) হলো অর্থনৈতিকভাবে যুক্তিযুক্ত অঞ্চল।'],
    mcqs: [
      {
        questionBn: 'পরিবর্তনশীল অনুপাত বিধির কোন ধাপে একজন বুদ্ধিমান কৃষক খামার পরিচালনা করেন?',
        options: ['প্রথম ধাপ', 'দ্বিতীয় ধাপ', 'তৃতীয় ধাপ', 'যে কোনো ধাপ'],
        answerIndex: 1,
        explanationBn: 'দ্বিতীয় ধাপে MPP ধনাত্মক থাকে কিন্তু কমে, এটিই মুনাফা অর্জনের জন্য যুক্তিযুক্ত।'
      }
    ],
    shortQuestions: [
      {
        questionBn: 'উৎপাদনে তৃতীয় ধাপে (Stage III) শ্রমিক নিয়োগ কেন অযুক্তিসঙ্গত?',
        answerBn: 'তৃতীয় ধাপে প্রান্তিক উৎপাদন (MPP) ঋণাত্মক হয়ে যায়, ফলে মোট উৎপাদনও কমে যায়।'
      }
    ],
    broadQuestions: [
      {
        questionBn: 'পরিবর্তনশীল অনুপাত বিধি বিস্তারিত চিত্রসহ আলোচনা করুন এবং কৃষি উৎপাদনে এর প্রাসঙ্গিকতা ব্যাখ্যা করুন।',
        outlineBn: ['১. বিধির অনুমিতিসমূহ (Assumptions)', '২. TPP, APP, MPP টেবিল ও ডায়াগ্রাম', '৩. তিন ধাপের সীমানা নির্ধারণ', '৪. কৃষকদের জন্য শিক্ষণীয় দিক']
      }
    ]
  }
];
