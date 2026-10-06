const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Mess = require('../models/Mess');
const User = require('../models/User');
const Meal = require('../models/Meal');
const Feedback = require('../models/Feedback');

dotenv.config({ path: __dirname + '/../.env' });

const getLocalDateString = (d = new Date()) => {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const sampleMesses = [
  {
    name: 'Himalaya Central Mess',
    area: 'North Campus Zone',
    code: 'HCM',
    description: 'Central dining hall serving North Campus hostel residences with North & South Indian delicacies.',
  },
  {
    name: 'Ganga Royal Dining',
    area: 'South Hostel Complex',
    code: 'GRD',
    description: 'Premier dining facility catering to South hostel blocks with hygienic meals and continental options.',
  },
  {
    name: 'Cauvery Food Hall',
    area: 'East Campus Sector',
    code: 'CFH',
    description: 'Modern food court serving students of Engineering and Science hostel wings.',
  },
];

const mealTemplates = {
  HCM: {
    Breakfast: [
      { items: ['Poha', 'Tea', 'Banana', 'Boiled Eggs', 'Bread & Butter'], description: 'Traditional tempered flattened rice with roasted peanuts, fresh coriander and hot masala chai.' },
      { items: ['Idli Sambar', 'Coconut Chutney', 'Filter Coffee', 'Boiled Egg'], description: 'Steamed fluffy rice-lentil cakes served with piping hot drumstick sambar and fresh coconut dip.' },
      { items: ['Aloo Paratha', 'Fresh Curd', 'Mango Pickle', 'Tea'], description: 'Crisp whole-wheat stuffed flatbreads with spiced mashed potato filling served with butter and curd.' },
      { items: ['Masala Dosa', 'Sambar', 'Tomato Chutney', 'Tea'], description: 'Crispy golden crepes filled with tempered potato masala and authentic South Indian sambar.' },
    ],
    Lunch: [
      { items: ['Steamed Rice', 'Yellow Dal Tadka', 'Paneer Butter Masala', 'Phulka Roti', 'Green Salad'], description: 'Nutritious balanced lunch plate featuring rich cottage cheese curry and tempered yellow lentils.' },
      { items: ['Jeera Rice', 'Rajma Masala', 'Aloo Gobi', 'Tawa Roti', 'Cucumber Raita'], description: 'Flavored cumin basmati rice accompanied by slow-cooked Kashmiri kidney beans curry.' },
      { items: ['Rice', 'Drumstick Sambar', 'Mix Veg Korma', 'Chapati', 'Crispy Papad'], description: 'Wholesome homestyle South-Indian lunch with assorted vegetables in spiced coconut gravy.' },
      { items: ['Veg Pulao', 'Chole Masala', 'Bhature', 'Boondi Raita', 'Pickle'], description: 'Festive spiced rice with robust Punjabi chickpea curry and crispy accompaniments.' },
    ],
    Snacks: [
      { items: ['Hot Veg Samosa', 'Green Mint Chutney', 'Sweet Chutney', 'Masala Chai'], description: 'Crisp flaky pastries packed with spiced potatoes and peas paired with piping hot tea.' },
      { items: ['Mumbai Pav Bhaji', 'Buttered Pav', 'Chopped Onions', 'Lemon Tea'], description: 'Mashed vegetable gravy slow-simmered on tawa, seasoned with authentic pav bhaji spices.' },
      { items: ['Onion Pakoda', 'Tomato Ketchup', 'Ginger Tea'], description: 'Golden crunchy batter-fried onion fritters with fragrant ginger cardamom tea.' },
      { items: ['Bun Maska', 'Veg Puff', 'Special Cutting Chai'], description: 'Warm toasted buns lathered with salted butter alongside flaky baked vegetable puffs.' },
    ],
    Dinner: [
      { items: ['Steamed Rice', 'Dal Makhani', 'Kadai Paneer', 'Butter Naan', 'Gulab Jamun'], description: 'Rich slow-simmered black lentils cooked overnight in cream and butter with soft paneer curry.' },
      { items: ['Hyderabadi Veg Biryani', 'Mirchi Ka Salan', 'Onion Raita', 'Moong Dal Halwa'], description: 'Aromatic layered basmati rice infused with whole saffron and spices, cooked on dum.' },
      { items: ['Rice', 'Dal Tadka', 'Aloo Methi', 'Phulka Roti', 'Rasgulla'], description: 'Light comforting dinner plate featuring fresh fenugreek greens and potatoes.' },
      { items: ['Jeera Rice', 'Matar Paneer', 'Palak Dal', 'Roti', 'Kheer'], description: 'Classic green pea and paneer curry with wholesome spinach-infused lentils.' },
    ],
  },
  GRD: {
    Breakfast: [
      { items: ['Medu Vada', 'Sambar', 'Coconut Chutney', 'Filter Coffee'], description: 'Crisp golden lentil fritters with aromatic sambar and authentic South Indian filter coffee.' },
      { items: ['Uttapam', 'Tomato Chutney', 'Tea', 'Boiled Eggs'], description: 'Thick fermented savory pancakes topped with diced tomatoes, onions and green chillies.' },
      { items: ['Upma', 'Coconut Chutney', 'Banana', 'Chai'], description: 'Roasted semolina tempered with mustard seeds, curry leaves, ginger and cashew nuts.' },
      { items: ['Puri Bhaji', 'Halwa', 'Masala Tea'], description: 'Puffy deep-fried golden wheat bread served with spiced potato gravy and sweet suji halwa.' },
    ],
    Lunch: [
      { items: ['Ghee Rice', 'Dal Fry', 'Kadhai Mushroom', 'Tandoori Roti', 'Spiced Buttermilk'], description: 'Fragrant buttered rice with savory mushroom pepper gravy and chilled tempered buttermilk.' },
      { items: ['Brown Rice', 'Lauki Kofta', 'Moong Dal', 'Phulka', 'Sprouted Salad'], description: 'Healthy low-glycemic meal featuring tender bottle gourd dumplings in mildly spiced gravy.' },
      { items: ['Lemon Rice', 'Avial', 'Curd Rice', 'Papad', 'Pickle'], description: 'Tangy tempered turmeric rice accompanied by Kerala-style mixed vegetable and coconut avial.' },
      { items: ['Veg Biryani', 'Paneer Tikka Masala', 'Roomali Roti', 'Burani Raita'], description: 'Fragrant basmati rice cooked with spices, accompanied by chargrilled paneer cubes.' },
    ],
    Snacks: [
      { items: ['Corn Cheese Balls', 'Garlic Dip', 'Green Tea'], description: 'Crunchy golden orbs filled with molten mozzarella and sweet corn kernels.' },
      { items: ['Sev Puri', 'Mint Chutney', 'Tamarind Dip', 'Cutting Chai'], description: 'Crisp flat puris topped with diced potatoes, onions and tangy chutneys.' },
      { items: ['Bread Pakoda', 'Green Chutney', 'Hot Cardamom Chai'], description: 'Batter-fried sandwich triangles with spiced potato filling.' },
      { items: ['Khaman Dhokla', 'Fried Green Chillies', 'Filter Coffee'], description: 'Steamed spongy gram flour cakes tempered with mustard seeds and curry leaves.' },
    ],
    Dinner: [
      { items: ['Kashmiri Pulao', 'Dum Aloo', 'Yellow Dal', 'Garlic Naan', 'Gajar Halwa'], description: 'Festive rice with raisins and nuts paired with baby potatoes slow-cooked in curd gravy.' },
      { items: ['Steamed Rice', 'Paneer Lababdar', 'Dal Tadka', 'Laccha Paratha', 'Ice Cream'], description: 'Luscious tomato cashew gravy with cottage cheese cubes and multi-layered flaky paratha.' },
      { items: ['Curd Rice', 'Potato Roast', 'Sambar', 'Roti', 'Fruit Custard'], description: 'Cooling seasoned yogurt rice paired with spiced crispy potato slices and creamy dessert.' },
      { items: ['Jeera Rice', 'Malai Kofta', 'Dal Makhani', 'Butter Roti', 'Jalebi'], description: 'Melt-in-mouth cottage cheese and potato dumplings in luxurious velvety white gravy.' },
    ],
  },
  CFH: {
    Breakfast: [
      { items: ['Methi Thepla', 'Chhunda', 'Curd', 'Masala Tea'], description: 'Spiced Gujarati fenugreek flatbreads with sweet mango relish and curd.' },
      { items: ['Appam', 'Veg Stew', 'Tea', 'Boiled Eggs'], description: 'Lacy fermented rice batter hoppers with fragrant coconut milk vegetable stew.' },
      { items: ['Gobhi Paratha', 'Butter', 'Pickle', 'Ginger Tea'], description: 'Whole-wheat flatbread stuffed with spiced grated cauliflower.' },
      { items: ['Poha', 'Sprouts Salad', 'Boiled Eggs', 'Filter Coffee'], description: 'Classic morning meal loaded with protein sprouts and roasted peanuts.' },
    ],
    Lunch: [
      { items: ['Rice', 'Sambhar', 'Bhindi Masala', 'Chapatis', 'Curd'], description: 'Crisp stir-fried spiced okra with homestyle lentil stew and hot chapatis.' },
      { items: ['Jeera Rice', 'Chana Masala', 'Aloo Shimla Mirch', 'Tawa Roti', 'Raita'], description: 'Hearty spiced chickpeas with capsicum potato curry.' },
      { items: ['Veg Pulao', 'Palak Paneer', 'Dal Tadka', 'Phulka', 'Salad'], description: 'Fresh spinach puree with cottage cheese and fragrant rice.' },
      { items: ['Rice', 'Rasam', 'Potato Fry', 'Curd', 'Papad'], description: 'Tangy peppery South Indian rasam with golden roasted spiced potatoes.' },
    ],
    Snacks: [
      { items: ['Mix Veg Cutlet', 'Mint Mayo', 'Tea'], description: 'Crispy breadcrumb-coated vegetable patties with herb dip.' },
      { items: ['Bhel Puri', 'Chutneys', 'Lemonade'], description: 'Puffed rice tossed with tomatoes, onions, raw mango and sweet tangy dips.' },
      { items: ['Mirchi Bajji', 'Peanut Chutney', 'Filter Coffee'], description: 'Crispy batter-fried banana peppers with Andhra style chutney.' },
      { items: ['Sandwich', 'Potato Chips', 'Masala Chai'], description: 'Grilled vegetable cheese sandwich with fresh tomatoes and cucumber.' },
    ],
    Dinner: [
      { items: ['Fried Rice', 'Chilli Paneer Gravy', 'Veg Manchurian', 'Sweet Corn Soup'], description: 'Indo-Chinese evening special with wok-tossed long-grain rice and paneer.' },
      { items: ['Rice', 'Dal Tadka', 'Paneer Bhurji', 'Phulka', 'Kheer'], description: 'Crumbled cottage cheese sautéed with onions and tomatoes.' },
      { items: ['Biryani', 'Raita', 'Mirchi Salan', 'Gulab Jamun'], description: 'Slow-cooked spiced dum biryani served with spicy chilli gravy.' },
      { items: ['Jeera Rice', 'Rajma', 'Aloo Gobi', 'Roti', 'Suji Halwa'], description: 'Rich Punjabi kidney bean curry with roasted cauliflower.' },
    ],
  },
};

const issuesPool = [
  'Too spicy',
  'Too salty',
  'Too oily',
  'Food was cold',
  'Poor quality',
  'Less quantity',
  'Poor variety',
];

const feedbackComments = {
  Breakfast: [
    'Poha was hot and freshly prepared! Good amount of peanuts and lemon.',
    'Tea was a bit too sweet today, please keep sugar separate.',
    'Fluffy idlis and fresh coconut chutney. Loved it!',
    'Aloo parathas were crispy and well stuffed with butter.',
    'Great breakfast to kickstart the day.',
  ],
  Lunch: [
    'Paneer curry was delicious, but dal had way too much salt.',
    'Food was lukewarm by the time we reached mess at 1:15 PM.',
    'Dal tadka was too oily today. Please reduce oil quantity.',
    'Roti was soft and hot. Paneer was very good quality.',
    'Curd was slightly sour, but overall satisfactory lunch.',
    'Very high spice level in the mix veg curry.',
    'Need more variety in seasonal greens.',
  ],
  Snacks: [
    'Samosas were crispy and hot! Green chutney was excellent.',
    'Ginger tea was very refreshing after evening lectures.',
    'Pav bhaji was slightly cold, but taste was authentic.',
    'Limited quantity per student at the counter.',
    'Great snack, perfect evening tea combo.',
  ],
  Dinner: [
    'Dal Makhani was restaurant quality! Creamy and rich.',
    'Gulab jamun was warm and fresh. Best dinner this week.',
    'Veg biryani dum aroma was awesome. Raita was balanced.',
    'Food was served promptly with great hygiene standards.',
    'Butter naan was slightly chewy, otherwise great food.',
  ],
};

const clampRating = (base) => {
  const jitter = (Math.random() * 1.6 - 0.8);
  const val = Math.round(base + jitter);
  return Math.max(1, Math.min(5, val));
};

const seedDatabase = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/hostelbites');
    console.log(`Connected to MongoDB for multi-mess seeding: ${conn.connection.host}`);

    // Clear existing data
    await Mess.deleteMany({});
    await User.deleteMany({});
    await Meal.deleteMany({});
    await Feedback.deleteMany({});
    try {
      await Meal.collection.dropIndexes();
      await Feedback.collection.dropIndexes();
    } catch (e) {
      console.log('Index drop note:', e.message);
    }
    console.log('Cleared existing Messes, Users, Meals, and Feedback and reset indexes.');

    // 1. Create Messes
    const createdMesses = await Mess.create(sampleMesses);
    console.log(`Created ${createdMesses.length} messes: ${createdMesses.map((m) => m.name).join(', ')}`);

    const messHimalaya = createdMesses[0];
    const messGanga = createdMesses[1];
    const messCauvery = createdMesses[2];

    // 2. Create Admins for each Mess
    const adminDocs = [
      {
        name: 'Mess Supervisor Rao',
        email: 'admin@messmate.edu',
        password: 'Admin@123',
        role: 'admin',
        hostel: 'Himalaya Block Admin',
        roomNumber: 'M-01',
        messId: messHimalaya._id,
      },
      {
        name: 'Mess Supervisor Rao',
        email: 'admin@hostelbites.edu',
        password: 'Admin@123',
        role: 'admin',
        hostel: 'Himalaya Block Admin',
        roomNumber: 'M-01',
        messId: messHimalaya._id,
      },
      {
        name: 'Catering Officer Mehra',
        email: 'ganga.admin@messmate.edu',
        password: 'Admin@123',
        role: 'admin',
        hostel: 'Ganga Mess Complex',
        roomNumber: 'G-101',
        messId: messGanga._id,
      },
      {
        name: 'Manager Venkatesh',
        email: 'cauvery.admin@messmate.edu',
        password: 'Admin@123',
        role: 'admin',
        hostel: 'Cauvery Dining Office',
        roomNumber: 'C-02',
        messId: messCauvery._id,
      },
    ];
    const createdAdmins = await User.create(adminDocs);
    console.log(`Created ${createdAdmins.length} Admin users across 3 messes.`);

    // 3. Create Students distributed across the 3 messes
    const studentDocs = [
      // Students in Himalaya Central Mess
      {
        name: 'Rahul Sharma',
        email: 'rahul@messmate.edu',
        password: 'Student@123',
        role: 'student',
        hostel: 'Himalaya Block A',
        roomNumber: '204',
        messId: messHimalaya._id,
      },
      {
        name: 'Rahul Sharma',
        email: 'rahul@hostelbites.edu',
        password: 'Student@123',
        role: 'student',
        hostel: 'Himalaya Block A',
        roomNumber: '204',
        messId: messHimalaya._id,
      },
      {
        name: 'Amit Verma',
        email: 'amit@messmate.edu',
        password: 'Student@123',
        role: 'student',
        hostel: 'Himalaya Block B',
        roomNumber: '108',
        messId: messHimalaya._id,
      },
      {
        name: 'Vikram Malhotra',
        email: 'vikram@messmate.edu',
        password: 'Student@123',
        role: 'student',
        hostel: 'Himalaya Block C',
        roomNumber: '219',
        messId: messHimalaya._id,
      },

      // Students in Ganga Royal Dining
      {
        name: 'Priya Patel',
        email: 'priya@messmate.edu',
        password: 'Student@123',
        role: 'student',
        hostel: 'Ganga Block B',
        roomNumber: '312',
        messId: messGanga._id,
      },
      {
        name: 'Priya Patel',
        email: 'priya@hostelbites.edu',
        password: 'Student@123',
        role: 'student',
        hostel: 'Ganga Block B',
        roomNumber: '312',
        messId: messGanga._id,
      },
      {
        name: 'Ananya Iyer',
        email: 'ananya@messmate.edu',
        password: 'Student@123',
        role: 'student',
        hostel: 'Ganga Block A',
        roomNumber: '405',
        messId: messGanga._id,
      },
      {
        name: 'Sneha Reddy',
        email: 'sneha@messmate.edu',
        password: 'Student@123',
        role: 'student',
        hostel: 'Ganga Block C',
        roomNumber: '115',
        messId: messGanga._id,
      },

      // Students in Cauvery Food Hall
      {
        name: 'Rohan Das',
        email: 'rohan@messmate.edu',
        password: 'Student@123',
        role: 'student',
        hostel: 'Cauvery Block East',
        roomNumber: '502',
        messId: messCauvery._id,
      },
      {
        name: 'Tanvi Shah',
        email: 'tanvi@messmate.edu',
        password: 'Student@123',
        role: 'student',
        hostel: 'Cauvery Block West',
        roomNumber: '318',
        messId: messCauvery._id,
      },
    ];

    const createdStudents = await User.create(studentDocs);
    console.log(`Created ${createdStudents.length} Students partitioned across messes.`);

    // Map students by messId
    const studentsByMess = {
      [messHimalaya._id.toString()]: createdStudents.filter((s) => s.messId.toString() === messHimalaya._id.toString()),
      [messGanga._id.toString()]: createdStudents.filter((s) => s.messId.toString() === messGanga._id.toString()),
      [messCauvery._id.toString()]: createdStudents.filter((s) => s.messId.toString() === messCauvery._id.toString()),
    };

    // 4. Generate Meals and Feedbacks for each Mess (11 days: -7 to +3)
    const today = new Date();
    let totalMealsCreated = 0;
    let totalFeedbacksCreated = 0;

    const messListWithTemplates = [
      { mess: messHimalaya, code: 'HCM' },
      { mess: messGanga, code: 'GRD' },
      { mess: messCauvery, code: 'CFH' },
    ];

    for (const { mess, code } of messListWithTemplates) {
      const templates = mealTemplates[code];
      const messMeals = [];

      for (let dayOffset = -7; dayOffset <= 3; dayOffset++) {
        const targetDate = new Date(today);
        targetDate.setDate(today.getDate() + dayOffset);
        const dateStr = getLocalDateString(targetDate);
        const dayIndex = Math.abs((targetDate.getDay() + 7) % 4);

        for (const mealType of ['Breakfast', 'Lunch', 'Snacks', 'Dinner']) {
          const template = templates[mealType][dayIndex];
          const mealDoc = await Meal.create({
            messId: mess._id,
            date: dateStr,
            mealType,
            items: template.items,
            description: template.description,
          });
          messMeals.push(mealDoc);
        }
      }
      totalMealsCreated += messMeals.length;

      // Generate realistic feedback for this mess
      const pastMeals = messMeals.filter((m) => m.date <= getLocalDateString(today));
      const messStudents = studentsByMess[mess._id.toString()];
      const feedbackList = [];
      let feedbackIndex = 0;

      for (const meal of pastMeals) {
        const numberOfFeedbacks = Math.min(messStudents.length, 2 + Math.floor(Math.random() * 2));
        const shuffledStudents = [...messStudents].sort(() => 0.5 - Math.random());

        for (let i = 0; i < numberOfFeedbacks; i++) {
          const student = shuffledStudents[i];
          const tasteRating = clampRating(4.0);
          const qualityRating = clampRating(3.9);
          const hygieneRating = clampRating(4.2);
          const quantityRating = clampRating(3.8);

          const hasIssue = Math.random() < 0.28;
          const issues = [];
          if (hasIssue) {
            const issue1 = issuesPool[Math.floor(Math.random() * issuesPool.length)];
            issues.push(issue1);
          } else {
            issues.push('No issue');
          }

          const commentsPool = feedbackComments[meal.mealType];
          const comment = commentsPool[(feedbackIndex + i) % commentsPool.length];

          feedbackList.push({
            messId: mess._id,
            studentId: student._id,
            mealId: meal._id,
            mealType: meal.mealType,
            date: meal.date,
            tasteRating,
            qualityRating,
            hygieneRating,
            quantityRating,
            issues,
            comment,
          });

          feedbackIndex++;
        }
      }

      const createdFeedbacks = await Feedback.create(feedbackList);
      totalFeedbacksCreated += createdFeedbacks.length;
    }

    console.log(`Created total ${totalMealsCreated} meals across 3 messes.`);
    console.log(`Created total ${totalFeedbacksCreated} feedback records scoped per mess.`);

    console.log('\n================ MULTI-MESS SEED SUMMARY ================');
    console.log('1. Himalaya Central Mess (North Campus Zone)');
    console.log('   - Admin: admin@messmate.edu / Admin@123');
    console.log('   - Student: rahul@messmate.edu / Student@123');
    console.log('2. Ganga Royal Dining (South Hostel Complex)');
    console.log('   - Admin: ganga.admin@messmate.edu / Admin@123');
    console.log('   - Student: priya@messmate.edu / Student@123');
    console.log('3. Cauvery Food Hall (East Campus Sector)');
    console.log('   - Admin: cauvery.admin@messmate.edu / Admin@123');
    console.log('   - Student: rohan@messmate.edu / Student@123');
    console.log('=========================================================\n');

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seedDatabase();
