import { GradeLevel, SubjectCategory, Quiz } from '../types';

export interface SubjectOption {
  id: SubjectCategory;
  nameEn: string;
  nameBn: string;
  labelEn: string;
  labelBn: string;
  iconName: string;
  color: string;
}

export const SUBJECT_OPTIONS: SubjectOption[] = [
  { id: 'math', nameEn: 'Mathematics', nameBn: 'গণিত', labelEn: 'Mathematics', labelBn: 'গণিত', iconName: 'Calculator', color: 'bg-indigo-500' },
  { id: 'physics', nameEn: 'Physics', nameBn: 'পদার্থবিজ্ঞান', labelEn: 'Physics', labelBn: 'পদার্থবিজ্ঞান', iconName: 'Zap', color: 'bg-blue-500' },
  { id: 'chemistry', nameEn: 'Chemistry', nameBn: 'রসায়ন', labelEn: 'Chemistry', labelBn: 'রসায়ন', iconName: 'FlaskConical', color: 'bg-emerald-500' },
  { id: 'biology', nameEn: 'Biology', nameBn: 'জীববিজ্ঞান', labelEn: 'Biology', labelBn: 'জীববিজ্ঞান', iconName: 'Dna', color: 'bg-teal-500' },
  { id: 'english', nameEn: 'English', nameBn: 'ইংরেজি', labelEn: 'English', labelBn: 'ইংরেজি', iconName: 'Languages', color: 'bg-purple-500' },
  { id: 'agriculture', nameEn: 'Agriculture Studies', nameBn: 'কৃষিশিক্ষা', labelEn: 'Agriculture Studies', labelBn: 'কৃষিশিক্ষা', iconName: 'Sprout', color: 'bg-lime-600' },
  { id: 'economics', nameEn: 'Economics', nameBn: 'অর্থনীতি', labelEn: 'Economics', labelBn: 'অর্থনীতি', iconName: 'TrendingUp', color: 'bg-amber-600' },
  { id: 'ict', nameEn: 'ICT & Tech', nameBn: 'আইসিটি', labelEn: 'ICT & Tech', labelBn: 'আইসিটি', iconName: 'Cpu', color: 'bg-cyan-600' },
  { id: 'bangla', nameEn: 'Bangla', nameBn: 'বাংলা', labelEn: 'Bangla', labelBn: 'বাংলা', iconName: 'BookOpen', color: 'bg-rose-500' },
  { id: 'general_knowledge', nameEn: 'General Knowledge', nameBn: 'সাধারণ জ্ঞান', labelEn: 'General Knowledge', labelBn: 'সাধারণ জ্ঞান', iconName: 'Globe', color: 'bg-sky-500' },
];

export interface GradeOption {
  id: GradeLevel;
  labelEn: string;
  labelBn: string;
}

export const GRADE_OPTIONS: GradeOption[] = [
  { id: 'class_1_5', labelEn: 'Primary (Class 1-5)', labelBn: 'প্রাথমিক (১ম - ৫ম শ্রেণি)' },
  { id: 'class_6_8', labelEn: 'Junior (Class 6-8)', labelBn: 'জুনিয়র (৬ষ্ঠ - ৮ম শ্রেণি)' },
  { id: 'ssc_class_9_10', labelEn: 'SSC (Class 9-10)', labelBn: 'এসএসসি (৯ম - ১০ম শ্রেণি)' },
  { id: 'hsc_class_11_12', labelEn: 'HSC (Class 11-12)', labelBn: 'এইচএসসি (১১শ -১২শ শ্রেণি)' },
  { id: 'university', labelEn: 'University / Admission', labelBn: 'বিশ্ববিদ্যালয় ভর্তি পরীক্ষা' },
  { id: 'general', labelEn: 'General Learning', labelBn: 'সাধারণ শিক্ষা' },
];

export const QUICK_PROMPTS = [
  {
    topic: 'Pythagorean Theorem',
    promptBn: 'পিথাগোরাসের উপপাদ্য (a² + b² = c²) কী এবং এটি কীভাবে ব্যবহার করা হয়?',
    promptEn: 'Explain the Pythagorean theorem (a² + b² = c²) with step-by-step math examples.',
    subject: 'math' as SubjectCategory
  },
  {
    topic: 'Newton\'s Laws',
    promptBn: 'নিউটন-এর গতির ৩টি সূত্র সহজ উদাহরণের মাধ্যমে বুঝিয়ে দাও।',
    promptEn: 'Explain Newton\'s 3 Laws of Motion with simple daily examples.',
    subject: 'physics' as SubjectCategory
  },
  {
    topic: 'Periodic Table & Valency',
    promptBn: 'পর্যায় সারণি ও যোজনী (Valency) নির্ণয়ের সহজ নিয়ম কী?',
    promptEn: 'Explain the periodic table trends and how to determine Valency.',
    subject: 'chemistry' as SubjectCategory
  },
  {
    topic: 'Photosynthesis',
    promptBn: 'সালোকসংশ্লেষণ (Photosynthesis) প্রক্রিয়াটি কীভাবে ঘটে?',
    promptEn: 'Explain the process and chemical equation of Photosynthesis in biology.',
    subject: 'biology' as SubjectCategory
  },
  {
    topic: 'Active & Passive Voice',
    promptBn: 'English-এ Active to Passive Voice রূপান্তরের সহজ নিয়মগুলো কী?',
    promptEn: 'Rules for converting Active voice to Passive voice in English with examples.',
    subject: 'english' as SubjectCategory
  },
  {
    topic: 'Crop Rotation & Irrigation',
    promptBn: 'ফসলের পর্যায়ক্রমিক চাষ (Crop Rotation) ও আধুনিক সেচ পদ্ধতির সুবিধা কী?',
    promptEn: 'What are the benefits of Crop Rotation and modern irrigation in Agriculture?',
    subject: 'agriculture' as SubjectCategory
  },
  {
    topic: 'Supply & Demand',
    promptBn: 'অর্থনীতিতে চাহিদা ও যোগানের নীতি (Law of Supply and Demand) কীভাবে কাজ করে?',
    promptEn: 'Explain the Law of Supply and Demand in Economics with a real market example.',
    subject: 'economics' as SubjectCategory
  },
  {
    topic: 'Binary to Decimal',
    promptBn: 'বাইনারি সংখ্যা থেকে ডেসিমালে পরিবর্তনের সহজ নিয়ম কী?',
    promptEn: 'How to convert Binary numbers to Decimal easily in ICT?',
    subject: 'ict' as SubjectCategory
  }
];

export const SAMPLE_PRESET_QUIZZES: Quiz[] = [
  {
    id: 'math_physics_ssc',
    title: 'Mathematics & Physics Essentials (গণিত ও পদার্থবিজ্ঞান কুইজ)',
    subject: 'physics',
    grade: 'ssc_class_9_10',
    createdAt: Date.now(),
    userAnswers: {},
    questions: [
      {
        id: 'q1',
        questionBn: 'বলের এস.আই (SI) একক কোনটি?',
        questionEn: 'What is the SI unit of Force?',
        optionsBn: ['জুল (Joule)', 'নিউটন (Newton)', 'ওয়াট (Watt)', 'প্যাসকেল (Pascal)'],
        optionsEn: ['Joule', 'Newton', 'Watt', 'Pascal'],
        correctIndex: 1,
        explanationBn: 'বলের এস.আই একক হলো নিউটন (N)। ১ নিউটন = ১ কেজি × ১ মি/সে²।',
        explanationEn: 'The SI unit of force is Newton (N). 1 N = 1 kg·m/s².'
      },
      {
        id: 'q2',
        questionBn: 'দ্বিঘাত সমীকরণ ax² + bx + c = 0 এর মূল নির্ণয়ের সূত্র কোনটি?',
        questionEn: 'Which is the correct formula to find roots of ax² + bx + c = 0?',
        optionsBn: ['x = (-b ± √(b² - 4ac)) / 2a', 'x = (-b ± √(b² + 4ac)) / 2a', 'x = (b ± √(b² - 4ac)) / a', 'x = -b / 2a'],
        optionsEn: ['x = (-b ± √(b² - 4ac)) / 2a', 'x = (-b ± √(b² + 4ac)) / 2a', 'x = (b ± √(b² - 4ac)) / a', 'x = -b / 2a'],
        correctIndex: 0,
        explanationBn: 'দ্বিঘাত সূত্রের সাহায্যে যেকোনো দ্বিঘাত সমীকরণের দুই মূল x = (-b ± √(b² - 4ac)) / 2a পাওয়া যায়।',
        explanationEn: 'The quadratic formula gives roots x = (-b ± √(b² - 4ac)) / 2a.'
      }
    ]
  },
  {
    id: 'biology_chemistry_quiz',
    title: 'Biology & Chemistry Basics (জীববিজ্ঞান ও রসায়ন কুইজ)',
    subject: 'biology',
    grade: 'ssc_class_9_10',
    createdAt: Date.now() - 50000,
    userAnswers: {},
    questions: [
      {
        id: 'bq1',
        questionBn: 'কোষের শক্তিঘর (Powerhouse of Cell) কাকে বলা হয়?',
        questionEn: 'Which organelle is known as the Powerhouse of the Cell?',
        optionsBn: ['রাইবোজোম (Ribosome)', 'মাইটোকন্ড্রিয়া (Mitochondria)', 'গলজি বস্তু (Golgi Apparatus)', 'লাইসোজোম (Lysosome)'],
        optionsEn: ['Ribosome', 'Mitochondria', 'Golgi Apparatus', 'Lysosome'],
        correctIndex: 1,
        explanationBn: 'মাইটোকন্ড্রিয়ায় শ্বসন প্রক্রিয়ায় ATP আকারে শক্তি উৎপন্ন হয়, তাই একে কোষের শক্তিঘর বলে।',
        explanationEn: 'Mitochondria produce ATP during cellular respiration, earning the title powerhouse of the cell.'
      },
      {
        id: 'cq1',
        questionBn: 'পানির রাসায়নিক সংকেত কোনটি?',
        questionEn: 'What is the chemical formula of Water?',
        optionsBn: ['H₂O', 'CO₂', 'NaCl', 'H₂SO₄'],
        optionsEn: ['H2O', 'CO2', 'NaCl', 'H2SO4'],
        correctIndex: 0,
        explanationBn: 'পানির একটি অণুতে ২টি হাইড্রোজেন পরমাণু ও ১টি অক্সিজেন পরমাণু থাকে (H₂O)।',
        explanationEn: 'A molecule of water consists of two hydrogen atoms and one oxygen atom (H2O).'
      }
    ]
  },
  {
    id: 'agri_econo_quiz',
    title: 'Agriculture & Economics Overview (কৃষিশিক্ষা ও অর্থনীতি কুইজ)',
    subject: 'agriculture',
    grade: 'ssc_class_9_10',
    createdAt: Date.now() - 100000,
    userAnswers: {},
    questions: [
      {
        id: 'aq1',
        questionBn: 'মাটির উর্বরতা বৃদ্ধিতে সাহায্য করে কোন ধরনের ফসল?',
        questionEn: 'Which family of crops helps increase soil nitrogen/fertility?',
        optionsBn: ['ধান জাতীয় (Cereal crops)', 'ডাল জাতীয় (Legume/Pulses crops)', 'কন্দ জাতীয় (Tuber crops)', 'আঁশ জাতীয় (Fiber crops)'],
        optionsEn: ['Cereal crops', 'Legume/Pulses crops', 'Tuber crops', 'Fiber crops'],
        correctIndex: 1,
        explanationBn: 'ডাল বা শিম জাতীয় উদ্ভিদের মূলে রাইজোবিয়াম ব্যাকটেরিয়া থাকে যা বাতাসে মুক্ত নাইট্রোজেন মাটিতে ধরে রাখে।',
        explanationEn: 'Leguminous crops fix atmospheric nitrogen through Rhizobium bacteria in their root nodules.'
      },
      {
        id: 'eq1',
        questionBn: 'অর্থনীতিতে কোনো দ্রব্যের দাম বাড়লে সাধারণ নিয়মে তার চাহিদার কী পরিবর্তন ঘটে?',
        questionEn: 'In economics, according to the Law of Demand, what happens to demand when price increases?',
        optionsBn: ['চাহিদা বাড়ে (Demand increases)', 'চাহিদা কমে (Demand decreases)', 'চাহিদা অপরিবর্তিত থাকে (Remains unchanged)', 'যোগান শূন্য হয় (Supply becomes zero)'],
        optionsEn: ['Demand increases', 'Demand decreases', 'Remains unchanged', 'Supply becomes zero'],
        correctIndex: 1,
        explanationBn: 'চাহিদার নিয়ম অনুযায়ী অন্যান্য বিষয় অপরিবর্তিত থাকলে দাম বাড়লে চাহিদা কমে এবং দাম কমলে চাহিদা বাড়ে।',
        explanationEn: 'The Law of Demand states that higher prices lead to lower quantity demanded, ceteris paribus.'
      }
    ]
  },
  {
    id: 'english_grammar_1',
    title: 'English Language & Grammar Practice (ইংরেজি কুইজ)',
    subject: 'english',
    grade: 'ssc_class_9_10',
    createdAt: Date.now() - 200000,
    userAnswers: {},
    questions: [
      {
        id: 'eq1',
        questionBn: 'Choose the correct sentence:',
        questionEn: 'Choose the correct sentence:',
        optionsBn: [
          'He is senior than me.',
          'He is senior to me.',
          'He is more senior than me.',
          'He is senior from me.'
        ],
        optionsEn: [
          'He is senior than me.',
          'He is senior to me.',
          'He is more senior than me.',
          'He is senior from me.'
        ],
        correctIndex: 1,
        explanationBn: 'Senior, Junior, Superior, Inferior শব্দগুলোর পর "than" না বসে preposition "to" বসে।',
        explanationEn: 'Adjectives like senior, junior, superior are followed by the preposition "to", not "than".'
      },
      {
        id: 'eq2',
        questionBn: 'What is the synonym of "Diligent"?',
        questionEn: 'What is the synonym of "Diligent"?',
        optionsBn: ['Lazy (অলস)', 'Hardworking (পরিশ্রমী)', 'Careless (অসাবধান)', 'Short (সংক্ষিপ্ত)'],
        optionsEn: ['Lazy', 'Hardworking', 'Careless', 'Short'],
        correctIndex: 1,
        explanationBn: 'Diligent মানে অধ্যবসায়ী বা পরিশ্রমী। এর প্রতিশব্দ Hardworking/Industrious।',
        explanationEn: 'Diligent means showing care and conscientiousness in work; synonym is Hardworking.'
      }
    ]
  }
];
