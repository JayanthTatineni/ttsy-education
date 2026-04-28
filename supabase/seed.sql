insert into public.subjects (slug, name)
values
  ('math', 'Math'),
  ('science', 'Science')
on conflict (slug) do update set name = excluded.name;

insert into public.units (subject_id, grade_level, title, description, sort_order)
select id, 'K', 'Counting and Comparing', 'Counting, comparing, and describing sets.', 5
from public.subjects where slug = 'math'
on conflict (subject_id, grade_level, title) do update
set description = excluded.description, sort_order = excluded.sort_order;

insert into public.units (subject_id, grade_level, title, description, sort_order)
select id, '1', 'Number Stories', 'Early number sense with addition and subtraction.', 10
from public.subjects where slug = 'math'
on conflict (subject_id, grade_level, title) do update
set description = excluded.description, sort_order = excluded.sort_order;

insert into public.units (subject_id, grade_level, title, description, sort_order)
select id, '2', 'Place Value and Strategies', 'Understanding tens and ones with efficient computation strategies.', 15
from public.subjects where slug = 'math'
on conflict (subject_id, grade_level, title) do update
set description = excluded.description, sort_order = excluded.sort_order;

insert into public.units (subject_id, grade_level, title, description, sort_order)
select id, '3', 'Groups and Sharing', 'Multiplication and division with equal groups.', 20
from public.subjects where slug = 'math'
on conflict (subject_id, grade_level, title) do update
set description = excluded.description, sort_order = excluded.sort_order;

insert into public.units (subject_id, grade_level, title, description, sort_order)
select id, '4', 'Fractions and Patterns', 'Building fraction understanding with models and number lines.', 25
from public.subjects where slug = 'math'
on conflict (subject_id, grade_level, title) do update
set description = excluded.description, sort_order = excluded.sort_order;

insert into public.units (subject_id, grade_level, title, description, sort_order)
select id, '5', 'Matter and Motion', 'Matter, materials, pushes, pulls, and motion.', 30
from public.subjects where slug = 'science'
on conflict (subject_id, grade_level, title) do update
set description = excluded.description, sort_order = excluded.sort_order;

insert into public.units (subject_id, grade_level, title, description, sort_order)
select id, 'K', 'Weather and Sky', 'Daily weather and sky patterns that young scientists can observe.', 5
from public.subjects where slug = 'science'
on conflict (subject_id, grade_level, title) do update
set description = excluded.description, sort_order = excluded.sort_order;

insert into public.units (subject_id, grade_level, title, description, sort_order)
select id, '2', 'Matter and Materials', 'Describing, changing, and combining materials by their properties.', 15
from public.subjects where slug = 'science'
on conflict (subject_id, grade_level, title) do update
set description = excluded.description, sort_order = excluded.sort_order;

insert into public.units (subject_id, grade_level, title, description, sort_order)
select id, '4', 'Energy and Systems', 'Exploring energy transfer, conductors, insulators, and circuits.', 25
from public.subjects where slug = 'science'
on conflict (subject_id, grade_level, title) do update
set description = excluded.description, sort_order = excluded.sort_order;

insert into public.lessons (
  unit_id, subject_id, grade_level, title, slug, description, video_url,
  thumbnail_url, estimated_minutes, is_published, sort_order
)
select
  u.id, s.id, 'K', 'Counting to 10', 'counting-to-10',
  'Count objects, compare groups, and choose the number that matches a set up to 10.',
  'https://www.youtube.com/watch?v=Xcws7UWWDEs',
  'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=900&q=80',
  7, true, 1
from public.units u
join public.subjects s on s.id = u.subject_id
where s.slug = 'math' and u.grade_level = 'K' and u.title = 'Counting and Comparing'
on conflict (subject_id, grade_level, slug) do update
set title = excluded.title,
    description = excluded.description,
    video_url = excluded.video_url,
    thumbnail_url = excluded.thumbnail_url,
    estimated_minutes = excluded.estimated_minutes,
    is_published = excluded.is_published,
    sort_order = excluded.sort_order;

insert into public.lessons (
  unit_id, subject_id, grade_level, title, slug, description, video_url,
  thumbnail_url, estimated_minutes, is_published, sort_order
)
select
  u.id, s.id, 'K', 'Weather Patterns', 'weather-patterns',
  'Notice how weather can change each day and how the sky gives clues about the pattern.',
  'https://www.youtube.com/watch?v=KUS7YQfH1C8',
  'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?auto=format&fit=crop&w=900&q=80',
  7, true, 1
from public.units u
join public.subjects s on s.id = u.subject_id
where s.slug = 'science' and u.grade_level = 'K' and u.title = 'Weather and Sky'
on conflict (subject_id, grade_level, slug) do update
set title = excluded.title,
    description = excluded.description,
    video_url = excluded.video_url,
    thumbnail_url = excluded.thumbnail_url,
    estimated_minutes = excluded.estimated_minutes,
    is_published = excluded.is_published,
    sort_order = excluded.sort_order;

insert into public.lessons (
  unit_id, subject_id, grade_level, title, slug, description, video_url,
  thumbnail_url, estimated_minutes, is_published, sort_order
)
select
  u.id, s.id, '2', 'Place Value to 100', 'place-value-to-100',
  'Use tens and ones to read, build, compare, and describe numbers up to 100.',
  'https://www.youtube.com/watch?v=Qw0JxM1oA3I',
  'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=900&q=80',
  9, true, 1
from public.units u
join public.subjects s on s.id = u.subject_id
where s.slug = 'math' and u.grade_level = '2' and u.title = 'Place Value and Strategies'
on conflict (subject_id, grade_level, slug) do update
set title = excluded.title,
    description = excluded.description,
    video_url = excluded.video_url,
    thumbnail_url = excluded.thumbnail_url,
    estimated_minutes = excluded.estimated_minutes,
    is_published = excluded.is_published,
    sort_order = excluded.sort_order;

insert into public.lessons (
  unit_id, subject_id, grade_level, title, slug, description, video_url,
  thumbnail_url, estimated_minutes, is_published, sort_order
)
select
  u.id, s.id, '2', 'Matter and Materials', 'matter-and-materials',
  'Classify solids and liquids, notice physical properties, and see how materials can change.',
  'https://www.youtube.com/watch?v=3x8qXr7cVxU',
  'https://images.unsplash.com/photo-1516534775068-ba3e7458af70?auto=format&fit=crop&w=900&q=80',
  9, true, 1
from public.units u
join public.subjects s on s.id = u.subject_id
where s.slug = 'science' and u.grade_level = '2' and u.title = 'Matter and Materials'
on conflict (subject_id, grade_level, slug) do update
set title = excluded.title,
    description = excluded.description,
    video_url = excluded.video_url,
    thumbnail_url = excluded.thumbnail_url,
    estimated_minutes = excluded.estimated_minutes,
    is_published = excluded.is_published,
    sort_order = excluded.sort_order;

insert into public.lessons (
  unit_id, subject_id, grade_level, title, slug, description, video_url,
  thumbnail_url, estimated_minutes, is_published, sort_order
)
select
  u.id, s.id, '4', 'Equivalent Fractions', 'equivalent-fractions',
  'Use models and number lines to decide when two fractions name the same amount.',
  'https://www.youtube.com/watch?v=jwP0hApIh0k',
  'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=900&q=80',
  10, true, 1
from public.units u
join public.subjects s on s.id = u.subject_id
where s.slug = 'math' and u.grade_level = '4' and u.title = 'Fractions and Patterns'
on conflict (subject_id, grade_level, slug) do update
set title = excluded.title,
    description = excluded.description,
    video_url = excluded.video_url,
    thumbnail_url = excluded.thumbnail_url,
    estimated_minutes = excluded.estimated_minutes,
    is_published = excluded.is_published,
    sort_order = excluded.sort_order;

insert into public.lessons (
  unit_id, subject_id, grade_level, title, slug, description, video_url,
  thumbnail_url, estimated_minutes, is_published, sort_order
)
select
  u.id, s.id, '4', 'Energy and Circuits', 'energy-and-circuits',
  'Investigate energy transfer, sort conductors and insulators, and build simple circuits.',
  'https://www.youtube.com/watch?v=mc979OhitAg',
  'https://images.unsplash.com/photo-1516321497487-e288fb19713f?auto=format&fit=crop&w=900&q=80',
  10, true, 1
from public.units u
join public.subjects s on s.id = u.subject_id
where s.slug = 'science' and u.grade_level = '4' and u.title = 'Energy and Systems'
on conflict (subject_id, grade_level, slug) do update
set title = excluded.title,
    description = excluded.description,
    video_url = excluded.video_url,
    thumbnail_url = excluded.thumbnail_url,
    estimated_minutes = excluded.estimated_minutes,
    is_published = excluded.is_published,
    sort_order = excluded.sort_order;

insert into public.lessons (
  unit_id, subject_id, grade_level, title, slug, description, video_url,
  thumbnail_url, estimated_minutes, is_published, sort_order
)
select
  u.id, s.id, '1', 'Addition within 10', 'addition-within-10',
  'Use pictures, counting on, and number sentences to add numbers up to 10.',
  'https://www.youtube.com/watch?v=Fe8u2I3vmHU',
  'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&w=900&q=80',
  8, true, 1
from public.units u
join public.subjects s on s.id = u.subject_id
where s.slug = 'math' and u.grade_level = '1' and u.title = 'Number Stories'
on conflict (subject_id, grade_level, slug) do update
set title = excluded.title,
    description = excluded.description,
    video_url = excluded.video_url,
    thumbnail_url = excluded.thumbnail_url,
    estimated_minutes = excluded.estimated_minutes,
    is_published = excluded.is_published,
    sort_order = excluded.sort_order;

insert into public.lessons (
  unit_id, subject_id, grade_level, title, slug, description, video_url,
  thumbnail_url, estimated_minutes, is_published, sort_order
)
select
  u.id, s.id, '1', 'Subtraction within 10', 'subtraction-within-10',
  'Take away, compare, and find missing parts with numbers up to 10.',
  'https://www.youtube.com/watch?v=pwQKugrFmJQ',
  'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&w=900&q=80',
  8, true, 2
from public.units u
join public.subjects s on s.id = u.subject_id
where s.slug = 'math' and u.grade_level = '1' and u.title = 'Number Stories'
on conflict (subject_id, grade_level, slug) do update
set title = excluded.title,
    description = excluded.description,
    video_url = excluded.video_url,
    thumbnail_url = excluded.thumbnail_url,
    estimated_minutes = excluded.estimated_minutes,
    is_published = excluded.is_published,
    sort_order = excluded.sort_order;

insert into public.lessons (
  unit_id, subject_id, grade_level, title, slug, description, video_url,
  thumbnail_url, estimated_minutes, is_published, sort_order
)
select
  u.id, s.id, '3', 'Intro to Multiplication', 'intro-to-multiplication',
  'See multiplication as equal groups and repeated addition.',
  'https://www.youtube.com/watch?v=mvOkMYCygps',
  'https://images.unsplash.com/photo-1610484826967-09c5720778c7?auto=format&fit=crop&w=900&q=80',
  10, true, 1
from public.units u
join public.subjects s on s.id = u.subject_id
where s.slug = 'math' and u.grade_level = '3' and u.title = 'Groups and Sharing'
on conflict (subject_id, grade_level, slug) do update
set title = excluded.title,
    description = excluded.description,
    video_url = excluded.video_url,
    thumbnail_url = excluded.thumbnail_url,
    estimated_minutes = excluded.estimated_minutes,
    is_published = excluded.is_published,
    sort_order = excluded.sort_order;

insert into public.lessons (
  unit_id, subject_id, grade_level, title, slug, description, video_url,
  thumbnail_url, estimated_minutes, is_published, sort_order
)
select
  u.id, s.id, '3', 'Division as Equal Groups', 'division-as-equal-groups',
  'Share objects into equal groups and connect division to multiplication.',
  'https://www.youtube.com/watch?v=rGMecZ_aERo',
  'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=900&q=80',
  10, true, 2
from public.units u
join public.subjects s on s.id = u.subject_id
where s.slug = 'math' and u.grade_level = '3' and u.title = 'Groups and Sharing'
on conflict (subject_id, grade_level, slug) do update
set title = excluded.title,
    description = excluded.description,
    video_url = excluded.video_url,
    thumbnail_url = excluded.thumbnail_url,
    estimated_minutes = excluded.estimated_minutes,
    is_published = excluded.is_published,
    sort_order = excluded.sort_order;

insert into public.lessons (
  unit_id, subject_id, grade_level, title, slug, description, video_url,
  thumbnail_url, estimated_minutes, is_published, sort_order
)
select
  u.id, s.id, '5', 'States of Matter', 'states-of-matter',
  'Compare solids, liquids, and gases by their shape, volume, and particles.',
  'https://www.youtube.com/watch?v=JQ4WduVp9k4',
  'https://images.unsplash.com/photo-1532187643603-ba119ca4109e?auto=format&fit=crop&w=900&q=80',
  11, true, 1
from public.units u
join public.subjects s on s.id = u.subject_id
where s.slug = 'science' and u.grade_level = '5' and u.title = 'Matter and Motion'
on conflict (subject_id, grade_level, slug) do update
set title = excluded.title,
    description = excluded.description,
    video_url = excluded.video_url,
    thumbnail_url = excluded.thumbnail_url,
    estimated_minutes = excluded.estimated_minutes,
    is_published = excluded.is_published,
    sort_order = excluded.sort_order;

insert into public.lessons (
  unit_id, subject_id, grade_level, title, slug, description, video_url,
  thumbnail_url, estimated_minutes, is_published, sort_order
)
select
  u.id, s.id, '5', 'Simple Forces', 'simple-forces',
  'Explore pushes, pulls, friction, gravity, and how forces change motion.',
  'https://www.youtube.com/watch?v=GmlMV7bA0TM',
  'https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=900&q=80',
  11, true, 2
from public.units u
join public.subjects s on s.id = u.subject_id
where s.slug = 'science' and u.grade_level = '5' and u.title = 'Matter and Motion'
on conflict (subject_id, grade_level, slug) do update
set title = excluded.title,
    description = excluded.description,
    video_url = excluded.video_url,
    thumbnail_url = excluded.thumbnail_url,
    estimated_minutes = excluded.estimated_minutes,
    is_published = excluded.is_published,
    sort_order = excluded.sort_order;

delete from public.questions
where lesson_id in (
  select id from public.lessons
  where slug in (
    'counting-to-10',
    'weather-patterns',
    'place-value-to-100',
    'matter-and-materials',
    'equivalent-fractions',
    'energy-and-circuits',
    'addition-within-10',
    'subtraction-within-10',
    'intro-to-multiplication',
    'division-as-equal-groups',
    'states-of-matter',
    'simple-forces'
  )
);

insert into public.questions (
  lesson_id, type, prompt, explanation, correct_answer, answer_options,
  difficulty, skill_tag, sort_order
)
-- Original TTYS Education items.
-- For grades and subjects with released elementary STAAR forms, the item style is
-- inspired by released tests, answer keys, item rationales, and blueprints without
-- copying TEA questions verbatim.
select l.id, q.type, q.prompt, q.explanation, q.correct_answer, q.answer_options::jsonb,
  q.difficulty, q.skill_tag, q.sort_order
from public.lessons l
join (
  values
    ('counting-to-10', 'multiple_choice', 'Which group has 6 objects?', 'TEKS K.2A asks students to connect a counted set to the matching number. Choose the set that shows six.', '6 stars', '["5 stars","6 stars","7 stars","8 stars"]', 'easy', 'TEKS K.2A', 1),
    ('counting-to-10', 'numeric', 'Count the apples: 1, 2, 3, 4, 5. How many apples are there?', 'TEKS K.2A focuses on counting objects in a set with one-to-one correspondence.', '5', '[]', 'easy', 'TEKS K.2A', 2),
    ('counting-to-10', 'true_false', 'If a set has 8 cubes, the number 8 matches the set.', 'The counting number tells how many objects are in the set.', 'true', '[]', 'easy', 'TEKS K.2A', 3),
    ('counting-to-10', 'multiple_choice', 'Which number is one more than 4?', 'TEKS K.2B includes describing a number that is one more or one less.', '5', '["3","4","5","6"]', 'medium', 'TEKS K.2B', 4),
    ('counting-to-10', 'numeric', 'How many dots are in a ten-frame with 7 dots filled?', 'Count each filled space once to find the total.', '7', '[]', 'medium', 'TEKS K.2A', 5),

    ('weather-patterns', 'multiple_choice', 'Which weather word matches a day with rain falling from clouds?', 'TEKS K.10B asks students to observe and describe daily weather changes.', 'rainy', '["sunny","rainy","windless","night"]', 'easy', 'TEKS K.10B', 1),
    ('weather-patterns', 'true_false', 'Weather can change from one day to the next.', 'Kindergarten students observe that weather patterns can vary daily.', 'true', '[]', 'easy', 'TEKS K.10B', 2),
    ('weather-patterns', 'multiple_choice', 'What do you usually see in the sky during the day?', 'TEKS K.10C includes observing patterns of objects in the sky.', 'the Sun', '["the Sun","the Moon only","stars at noon","nothing"]', 'easy', 'TEKS K.10C', 3),
    ('weather-patterns', 'numeric', 'A class tracked 3 sunny days and 2 rainy days. How many days did they track?', 'Add the two groups of weather days to find the total.', '5', '[]', 'medium', 'TEKS K.10B', 4),
    ('weather-patterns', 'multiple_choice', 'Which tool helps you see if the day is sunny, cloudy, or rainy?', 'Students use observation to notice daily weather patterns.', 'your eyes and a weather chart', '["your eyes and a weather chart","a ruler","a magnet","a calculator"]', 'medium', 'TEKS K.10B', 5),

    ('place-value-to-100', 'multiple_choice', 'Which model shows 34?', 'TEKS 2.2A uses tens and ones to represent numbers. Three tens and four ones make 34.', '3 tens and 4 ones', '["2 tens and 4 ones","3 tens and 4 ones","4 tens and 3 ones","3 ones and 4 tens blocks"]', 'easy', 'TEKS 2.2A', 1),
    ('place-value-to-100', 'numeric', 'How many ones are in the number 58?', 'The ones digit in 58 is 8.', '8', '[]', 'easy', 'TEKS 2.2A', 2),
    ('place-value-to-100', 'true_false', '70 is greater than 67.', 'A number with 7 tens is greater than a number with 6 tens.', 'true', '[]', 'easy', 'TEKS 2.2B', 3),
    ('place-value-to-100', 'multiple_choice', 'Which number is 6 tens and 2 ones?', 'Six tens is 60 and 2 ones makes 62.', '62', '["26","62","60","52"]', 'medium', 'TEKS 2.2A', 4),
    ('place-value-to-100', 'numeric', 'Write the number that is 1 more than 49.', 'One more than 49 is 50.', '50', '[]', 'medium', 'TEKS 2.2B', 5),

    ('matter-and-materials', 'multiple_choice', 'Which item is a liquid?', 'TEKS 2.6A asks students to classify matter as a solid or liquid using observable properties.', 'juice', '["book","juice","rock","spoon"]', 'easy', 'TEKS 2.6A', 1),
    ('matter-and-materials', 'true_false', 'A sponge can feel flexible.', 'Flexibility is one observable physical property students can use to classify matter.', 'true', '[]', 'easy', 'TEKS 2.6A', 2),
    ('matter-and-materials', 'multiple_choice', 'What change happens when paper is folded?', 'TEKS 2.6B includes changing physical properties by folding, cutting, sanding, melting, or freezing.', 'its shape changes', '["its shape changes","it becomes a liquid","it disappears","it turns into metal"]', 'medium', 'TEKS 2.6B', 3),
    ('matter-and-materials', 'multiple_choice', 'Which material would be a good choice for building a small bridge from blocks?', 'TEKS 2.6C asks students to choose materials based on physical properties and purpose.', 'sturdy blocks', '["sturdy blocks","puddle water","soap bubbles","fog"]', 'medium', 'TEKS 2.6C', 4),
    ('matter-and-materials', 'numeric', 'A stack has 2 wood blocks and 3 plastic blocks. How many blocks are in the stack?', 'Combine the two groups to find the total number of building blocks.', '5', '[]', 'easy', 'TEKS 2.6C', 5),

    ('equivalent-fractions', 'multiple_choice', 'A point on a number line is halfway between 0 and 1. Which fraction could name that point?', 'Released STAAR fraction items often ask students to connect a visual model or number line to an equivalent fraction.', '2/4', '["1/4","2/4","3/4","4/5"]', 'easy', 'TEKS 4.3C', 1),
    ('equivalent-fractions', 'true_false', '2/3 and 4/6 name the same amount.', 'Multiply both numerator and denominator of 2/3 by 2 to get 4/6.', 'true', '[]', 'easy', 'TEKS 4.3C', 2),
    ('equivalent-fractions', 'multiple_choice', 'Which symbol makes the comparison true: 3/8 __ 1/2?', 'Compare each fraction to eighths. One-half is 4/8, so 3/8 is less than 1/2.', '<', '["<",">","=","+"]', 'medium', 'TEKS 4.3D', 3),
    ('equivalent-fractions', 'numeric', 'Complete the statement: 1/2 = __/8', 'Equivalent fractions represent the same amount. One-half equals four eighths.', '4', '[]', 'medium', 'TEKS 4.3C', 4),
    ('equivalent-fractions', 'multiple_choice', 'Which pair of fractions is equivalent?', 'Look for two fractions that can be matched to the same point on a model or number line.', '3/4 and 6/8', '["1/3 and 2/5","3/4 and 6/8","2/3 and 3/5","1/2 and 2/3"]', 'medium', 'TEKS 4.3C', 5),

    ('energy-and-circuits', 'multiple_choice', 'Which situation best shows sound energy being transferred?', 'Released science items often use short scenarios and ask students to identify the type of energy transfer in the situation.', 'a drum vibrating', '["a drum vibrating","a book on a shelf","a still chair","an unplugged lamp"]', 'easy', 'TEKS 4.8A', 1),
    ('energy-and-circuits', 'multiple_choice', 'A student wants to stop electrical energy from passing to her hand. Which material is the best insulator?', 'An insulator limits the transfer of electrical energy.', 'rubber', '["metal","rubber","copper wire","aluminum foil"]', 'easy', 'TEKS 4.8B', 2),
    ('energy-and-circuits', 'true_false', 'Electricity must travel in a closed path to light a bulb.', 'A complete circuit gives electrical energy a full path to travel through the bulb.', 'true', '[]', 'easy', 'TEKS 4.8C', 3),
    ('energy-and-circuits', 'multiple_choice', 'Which setup would most likely light a bulb?', 'A closed circuit needs the battery, wires, and bulb connected in one complete loop.', 'battery, bulb, and wires in a closed loop', '["battery, bulb, and wires in a closed loop","bulb by itself","wire touching only one side of a battery","battery under the desk"]', 'medium', 'TEKS 4.8C', 4),
    ('energy-and-circuits', 'multiple_choice', 'Which item is the best thermal insulator for protecting hands from heat?', 'Items that slow heat transfer act as thermal insulators.', 'an oven mitt', '["an oven mitt","a metal spoon","aluminum foil","a paper clip"]', 'medium', 'TEKS 4.8B', 5),

    ('addition-within-10', 'multiple_choice', 'Kai has 4 stickers. A friend gives him 3 more. How many stickers does Kai have now?', 'TEKS 1.3B focuses on joining sets in a story problem. Add the two groups to find the total.', '7', '["6","7","8","9"]', 'easy', 'TEKS 1.3B', 1),
    ('addition-within-10', 'numeric', 'What is 5 + 2?', 'TEKS 1.3D supports using efficient fact strategies such as counting on or making a ten.', '7', '[]', 'easy', 'TEKS 1.3D', 2),
    ('addition-within-10', 'true_false', '4 + 4 = 8', 'A doubles fact is a quick TEKS 1.3D strategy. Four and four make eight.', 'true', '[]', 'easy', 'TEKS 1.3D', 3),
    ('addition-within-10', 'multiple_choice', 'Which equation matches 2 red cubes and 6 blue cubes?', 'TEKS 1.5G asks students to apply properties and write matching equations for the quantities they see.', '2 + 6 = 8', '["2 + 6 = 8","6 - 2 = 4","8 - 2 = 6","2 + 5 = 7"]', 'medium', 'TEKS 1.5G', 4),
    ('addition-within-10', 'numeric', '1 + ? = 10. What number is missing?', 'TEKS 1.5F asks students to find an unknown in an addition equation.', '9', '[]', 'medium', 'TEKS 1.5F', 5),

    ('subtraction-within-10', 'multiple_choice', 'There are 9 birds on a fence. 3 fly away. How many birds stay on the fence?', 'TEKS 1.3B includes separating situations. Start with 9 and take away 3.', '6', '["4","5","6","7"]', 'easy', 'TEKS 1.3B', 1),
    ('subtraction-within-10', 'numeric', 'What is 8 - 5?', 'TEKS 1.3D encourages efficient subtraction strategies such as counting back or using related facts.', '3', '[]', 'easy', 'TEKS 1.3D', 2),
    ('subtraction-within-10', 'true_false', '10 - 1 = 8', 'One less than 10 is 9, so this equation is not true.', 'false', '[]', 'easy', 'TEKS 1.3D', 3),
    ('subtraction-within-10', 'multiple_choice', 'Which story matches 7 - 2?', 'A subtraction story begins with the whole amount and removes some of it.', '7 apples, 2 are eaten', '["2 apples, 7 more appear","7 apples, 2 are eaten","7 apples, 2 more are added","2 apples are shared by 7 kids"]', 'medium', 'TEKS 1.3B', 4),
    ('subtraction-within-10', 'numeric', '6 - ? = 4. What number is missing?', 'TEKS 1.5F asks students to determine the unknown in a subtraction equation.', '2', '[]', 'medium', 'TEKS 1.5F', 5),

    ('intro-to-multiplication', 'multiple_choice', 'A model shows 3 equal rows with 4 counters in each row. Which equation represents the model?', 'Released STAAR multiplication items often ask students to connect an array or equal-group model to an equation.', '3 x 4', '["3 + 4","3 x 4","4 - 3","12 x 3"]', 'easy', 'TEKS 3.5B', 1),
    ('intro-to-multiplication', 'numeric', 'Each box holds 2 crayons. There are 4 boxes. How many crayons are there in all?', 'This is an equal-groups problem. Multiply the number of groups by the amount in each group.', '8', '[]', 'easy', 'TEKS 3.4K', 2),
    ('intro-to-multiplication', 'true_false', '5 x 3 means 5 groups of 3.', 'TEKS 3.5B connects multiplication equations to equal groups, arrays, area models, and strip diagrams.', 'true', '[]', 'easy', 'TEKS 3.5B', 3),
    ('intro-to-multiplication', 'multiple_choice', 'A strip diagram has 2 equal parts labeled 6. Which repeated addition matches the diagram?', 'Two equal parts of 6 can be shown with repeated addition.', '6 + 6', '["2 + 6","6 + 6","2 + 2 + 2","6 - 2"]', 'medium', 'TEKS 3.5B', 4),
    ('intro-to-multiplication', 'numeric', 'An array has 3 rows and 5 columns. How many squares are in the array?', 'Multiply the number of rows by the number of columns to find the total.', '15', '[]', 'medium', 'TEKS 3.5B', 5),

    ('division-as-equal-groups', 'multiple_choice', '12 counters are split into 3 equal groups. How many counters are in each group?', 'TEKS 3.4K includes solving division by using equal groups and objects.', '4', '["3","4","6","9"]', 'easy', 'TEKS 3.4K', 1),
    ('division-as-equal-groups', 'numeric', 'What is 20 ÷ 5?', 'Think about how many are in each equal group when 20 is shared by 5 groups.', '4', '[]', 'easy', 'TEKS 3.4K', 2),
    ('division-as-equal-groups', 'true_false', '18 ÷ 3 = 6', 'If 3 equal groups of 6 make 18, then the division fact is true.', 'true', '[]', 'easy', 'TEKS 3.4K', 3),
    ('division-as-equal-groups', 'multiple_choice', 'Which multiplication fact helps solve 24 ÷ 4?', 'TEKS 3.5B connects division to a related multiplication equation.', '4 x 6 = 24', '["4 x 6 = 24","4 + 6 = 10","24 x 4 = 96","6 - 4 = 2"]', 'medium', 'TEKS 3.5B', 4),
    ('division-as-equal-groups', 'numeric', '15 pencils are packed 5 in each box. How many boxes are needed?', 'This equal-groups situation is solved with division: 15 divided by 5.', '3', '[]', 'medium', 'TEKS 3.4K', 5),

    ('states-of-matter', 'multiple_choice', 'Which state of matter keeps its own shape?', 'TEKS 5.6A asks students to compare matter by physical properties such as physical state.', 'solid', '["solid","liquid","gas","steam"]', 'easy', 'TEKS 5.6A', 1),
    ('states-of-matter', 'true_false', 'A liquid takes the shape of its container.', 'A liquid keeps its volume but changes shape to fit the container.', 'true', '[]', 'easy', 'TEKS 5.6A', 2),
    ('states-of-matter', 'multiple_choice', 'Which example is a gas at room temperature?', 'Air is a gas because it spreads to fill the space available.', 'air', '["ice cube","apple juice","air","rock"]', 'easy', 'TEKS 5.6A', 3),
    ('states-of-matter', 'numeric', 'Water freezes at 0 degrees Celsius. What number is that?', 'Temperature is a measurable property used to describe matter.', '0', '[]', 'medium', 'TEKS 5.6A', 4),
    ('states-of-matter', 'multiple_choice', 'What usually happens when a solid melts?', 'Melting changes a solid into a liquid without changing what the substance is made of.', 'It becomes a liquid.', '["It becomes a liquid.","It disappears.","It becomes a gas right away.","It stops taking up space."]', 'medium', 'TEKS 5.6A', 5),

    ('simple-forces', 'multiple_choice', 'A force is best described as what?', 'TEKS 5.7A begins with understanding that forces are pushes or pulls that affect motion.', 'a push or pull', '["a color","a push or pull","a kind of light","a measurement of time"]', 'easy', 'TEKS 5.7A', 1),
    ('simple-forces', 'true_false', 'Gravity pulls objects toward Earth.', 'Gravity is a force that pulls objects toward Earth.', 'true', '[]', 'easy', 'TEKS 5.7A', 2),
    ('simple-forces', 'multiple_choice', 'Which force slows a sliding book on a table?', 'Friction is a contact force that opposes motion between surfaces.', 'friction', '["gravity","friction","magnetism","sound"]', 'medium', 'TEKS 5.7A', 3),
    ('simple-forces', 'numeric', 'If two teams pull with the same force in opposite directions, what is the net force?', 'Balanced forces cancel out, so the net force is zero.', '0', '[]', 'challenge', 'TEKS 5.7A', 4),
    ('simple-forces', 'multiple_choice', 'Which setup best tests how a stronger push changes motion?', 'TEKS 5.7B asks students to design simple investigations that change one force variable at a time.', 'Use the same toy car and compare a gentle push to a strong push.', '["Use the same toy car and compare a gentle push to a strong push.","Use different toys on different floors.","Ask someone to guess what will happen.","Only read about force without testing anything."]', 'medium', 'TEKS 5.7B', 5)
) as q(slug, type, prompt, explanation, correct_answer, answer_options, difficulty, skill_tag, sort_order)
on l.slug = q.slug;

insert into public.subjects (slug, name)
values
  ('technology', 'Technology'),
  ('engineering', 'Engineering'),
  ('foundations', 'Foundations')
on conflict (slug) do update
set name = excluded.name;

with seed_units(subject_slug, grade_level, title, description, sort_order) as (
  values
    ('foundations', 'K', 'Alphabet and Colors', 'Build early letter, sound, and color recognition through songs, sorting, and speaking.', 10),
    ('science', 'K', 'Organisms and Environment', 'Notice what living things need and how people care for the places around them.', 10),
    ('technology', 'K', 'Digital Literacy', 'Learn the names of device parts and how to use technology with help and care.', 15),
    ('engineering', 'K', 'Scratch Projects', 'Create first coding projects with simple motion, sounds, and choices.', 20),
    ('science', '1', 'Organisms and Environment', 'Compare plant and animal needs and spot ways to care for a shared habitat.', 15),
    ('technology', '1', 'Digital Literacy', 'Practice safe logins, icons, and kind choices when using classroom devices.', 20),
    ('engineering', '1', 'Scratch Projects', 'Build short stories and repeating actions with beginner Scratch blocks.', 25),
    ('math', '2', 'Addition and Subtraction', 'Use place value and number sense to add, subtract, and solve stories.', 20),
    ('science', '2', 'Plants', 'Study plant parts, life cycles, and how plants support living things.', 20),
    ('science', '2', 'Organisms and Environment', 'Follow simple food chains and choose actions that protect habitats.', 25),
    ('technology', '2', 'Digital Literacy', 'Use keyboards, files, and safe searches to work independently online.', 30),
    ('engineering', '2', 'Scratch Projects', 'Create name animations and quiz cards with motion, looks, and events.', 35),
    ('math', '3', 'Big Addition and Subtraction', 'Add and subtract larger numbers with regrouping and estimation.', 30),
    ('science', '3', 'Organisms and Environment', 'Explain producers, consumers, decomposers, and changes in environments.', 30),
    ('technology', '3', 'Digital Literacy', 'Use tabs, search words, and source checks to gather information.', 35),
    ('engineering', '3', 'Scratch Projects', 'Build chase games and timer-based challenges with more code blocks.', 40),
    ('math', '4', 'Multiplication and Division', 'Model and solve multi-digit multiplication and division problems.', 20),
    ('math', '4', 'Place Value, Fractions, and Decimals', 'Connect large numbers, fractions, and decimals with models and number lines.', 30),
    ('science', '4', 'Water Cycle', 'Trace how water moves through Earth systems and affects weather.', 30),
    ('science', '4', 'Organisms and Environment', 'Analyze food chains and how people affect shared ecosystems.', 40),
    ('technology', '4', 'Digital Literacy', 'Research, organize notes, and present learning with strong digital habits.', 45),
    ('engineering', '4', 'Scratch Projects', 'Make animated stories and starter platform games with layered logic.', 50),
    ('math', '5', 'Multiplication and Division', 'Use bigger numbers and multi-step reasoning to multiply and divide efficiently.', 35),
    ('math', '5', 'Place Value, Fractions, and Decimals', 'Read decimals, compare values, and operate with fractions and decimals.', 40),
    ('science', '5', 'Force and Energy', 'Investigate energy transfer and explain motion using force ideas.', 35),
    ('science', '5', 'Organisms and Environment', 'Study food webs, biodiversity, and environmental balance.', 40),
    ('technology', '5', 'Digital Literacy', 'Evaluate media, plan digital projects, and use online tools responsibly.', 45),
    ('engineering', '5', 'Scratch Projects', 'Create scored games and simple simulations, then debug and refine them.', 50)
)
insert into public.units (subject_id, grade_level, title, description, sort_order)
select s.id, seed.grade_level, seed.title, seed.description, seed.sort_order
from seed_units seed
join public.subjects s on s.slug = seed.subject_slug
on conflict (subject_id, grade_level, title) do update
set description = excluded.description,
    sort_order = excluded.sort_order;

with seed_lessons(
  subject_slug, grade_level, unit_title, title, slug, description, video_url,
  estimated_minutes, sort_order
) as (
  values
    ('math', 'K', 'Counting and Comparing', 'Compare Groups', 'compare-groups-k', 'Compare two groups using more, fewer, and the same.', 'https://www.youtube.com/watch?v=Xcws7UWWDEs', 7, 2),
    ('math', 'K', 'Counting and Comparing', 'Numbers to 20', 'numbers-to-20-k', 'Count forward, count backward, and connect teen numbers to sets.', 'https://www.youtube.com/watch?v=Xcws7UWWDEs', 7, 3),
    ('foundations', 'K', 'Alphabet and Colors', 'Alphabet Sounds', 'alphabet-sounds-k', 'Match letters to beginning sounds and sing the alphabet with confidence.', 'https://www.youtube.com/watch?v=AsYabcQjNo4', 7, 1),
    ('foundations', 'K', 'Alphabet and Colors', 'Colors and Patterns', 'colors-and-patterns-k', 'Name common colors and notice patterns in classroom objects.', 'https://www.youtube.com/watch?v=AsYabcQjNo4', 7, 2),
    ('science', 'K', 'Organisms and Environment', 'Living or Not Living', 'living-or-not-k', 'Sort objects into living and nonliving and explain what living things need.', 'https://www.youtube.com/watch?v=X6TLFZUC9gI', 7, 1),
    ('science', 'K', 'Organisms and Environment', 'Plant and Animal Needs', 'plant-and-animal-needs-k', 'Notice that plants and animals both need water, air, and a place to live.', 'https://www.youtube.com/watch?v=X6TLFZUC9gI', 7, 2),
    ('technology', 'K', 'Digital Literacy', 'Device Parts and Care', 'device-parts-and-care-k', 'Learn the names of common device parts and how to carry and clean them safely.', 'https://www.youtube.com/watch?v=YPxSm3lU6c8', 6, 1),
    ('technology', 'K', 'Digital Literacy', 'Tap, Click, and Drag', 'tap-click-and-drag-k', 'Practice basic on-screen actions that help students open and move items.', 'https://www.youtube.com/watch?v=YPxSm3lU6c8', 6, 2),
    ('engineering', 'K', 'Scratch Projects', 'Scratch Move and Sound', 'scratch-move-and-sound-k', 'Build a first Scratch project that moves a sprite and plays a sound.', 'https://www.youtube.com/watch?v=Gh_815r8JYQ', 8, 1),
    ('engineering', 'K', 'Scratch Projects', 'Scratch Color Dance', 'scratch-color-dance-k', 'Use events and looks blocks to make a sprite dance with color changes.', 'https://www.youtube.com/watch?v=Gh_815r8JYQ', 8, 2),

    ('science', '1', 'Organisms and Environment', 'Habitats and Needs', 'habitats-and-needs-1', 'Describe how plants and animals get what they need from habitats.', 'https://www.youtube.com/watch?v=X6TLFZUC9gI', 8, 1),
    ('science', '1', 'Organisms and Environment', 'Caring for Our Environment', 'caring-for-our-environment-1', 'Spot simple ways young learners can protect a schoolyard or neighborhood habitat.', 'https://www.youtube.com/watch?v=hjN3AT5yykQ', 8, 2),
    ('technology', '1', 'Digital Literacy', 'Picture Passwords', 'picture-passwords-1', 'Learn that passwords stay private and help keep accounts safe.', 'https://www.youtube.com/watch?v=YPxSm3lU6c8', 6, 1),
    ('technology', '1', 'Digital Literacy', 'Kind Online Choices', 'kind-online-choices-1', 'Practice what to do when something online feels rude, confusing, or unsafe.', 'https://www.youtube.com/watch?v=YPxSm3lU6c8', 6, 2),
    ('engineering', '1', 'Scratch Projects', 'Scratch Story Scenes', 'scratch-story-scenes-1', 'Create a Scratch story by changing backdrops and adding simple dialogue.', 'https://www.youtube.com/watch?v=Gh_815r8JYQ', 8, 1),
    ('engineering', '1', 'Scratch Projects', 'Scratch Repeat Patterns', 'scratch-repeat-patterns-1', 'Use repeat blocks to build a predictable movement pattern.', 'https://www.youtube.com/watch?v=Gh_815r8JYQ', 8, 2),

    ('math', '2', 'Addition and Subtraction', 'Add within 100', 'add-within-100-2', 'Use tens and ones, number lines, and equations to add within 100.', 'https://www.youtube.com/watch?v=Fe8u2I3vmHU', 8, 1),
    ('math', '2', 'Addition and Subtraction', 'Subtract within 100', 'subtract-within-100-2', 'Subtract within 100 using place value models and efficient strategies.', 'https://www.youtube.com/watch?v=pwQKugrFmJQ', 8, 2),
    ('math', '2', 'Addition and Subtraction', 'Choose Add or Subtract', 'choose-add-or-subtract-2', 'Read a problem, decide the operation, and explain why it fits.', 'https://www.youtube.com/watch?v=FxKJIn7T7nc', 8, 3),
    ('science', '2', 'Plants', 'Parts of a Plant', 'parts-of-a-plant-2', 'Identify roots, stems, leaves, flowers, fruits, and seeds and tell what they do.', 'https://www.youtube.com/watch?v=X6TLFZUC9gI', 8, 1),
    ('science', '2', 'Plants', 'Plant Life Cycle', 'plant-life-cycle-2', 'Follow a plant from seed to adult plant and explain what helps it grow.', 'https://www.youtube.com/watch?v=X6TLFZUC9gI', 8, 2),
    ('science', '2', 'Organisms and Environment', 'Simple Food Chains', 'simple-food-chains-2', 'See how plants and animals depend on one another in a simple food chain.', 'https://www.youtube.com/watch?v=hjN3AT5yykQ', 8, 1),
    ('science', '2', 'Organisms and Environment', 'Protect Habitats', 'protect-habitats-2', 'Choose actions that help plants and animals stay safe in their habitats.', 'https://www.youtube.com/watch?v=hjN3AT5yykQ', 8, 2),
    ('technology', '2', 'Digital Literacy', 'Keyboard and Files', 'keyboard-and-files-2', 'Practice basic typing, saving work, and reopening a file.', 'https://www.youtube.com/watch?v=YPxSm3lU6c8', 7, 1),
    ('technology', '2', 'Digital Literacy', 'Safe Searching', 'safe-searching-2', 'Use careful search words and ask an adult when results feel confusing.', 'https://www.youtube.com/watch?v=YPxSm3lU6c8', 7, 2),
    ('engineering', '2', 'Scratch Projects', 'Scratch Animated Name', 'scratch-animated-name-2', 'Animate letters in Scratch with motion and timing blocks.', 'https://www.youtube.com/watch?v=Gh_815r8JYQ', 9, 1),
    ('engineering', '2', 'Scratch Projects', 'Scratch Quiz Card', 'scratch-quiz-card-2', 'Create a simple question-and-answer Scratch project with clickable choices.', 'https://www.youtube.com/watch?v=Gh_815r8JYQ', 9, 2),

    ('math', '3', 'Big Addition and Subtraction', 'Add with Regrouping', 'add-with-regrouping-3', 'Add larger numbers using regrouping, place value, and estimates.', 'https://www.youtube.com/watch?v=Fe8u2I3vmHU', 9, 1),
    ('math', '3', 'Big Addition and Subtraction', 'Subtract with Regrouping', 'subtract-with-regrouping-3', 'Subtract larger numbers and explain each regrouping step.', 'https://www.youtube.com/watch?v=pwQKugrFmJQ', 9, 2),
    ('math', '3', 'Groups and Sharing', 'Related Facts and Arrays', 'related-facts-and-arrays-3', 'Connect arrays to multiplication facts and use those facts to think about division.', 'https://www.youtube.com/watch?v=mvOkMYCygps', 9, 3),
    ('science', '3', 'Organisms and Environment', 'Producers, Consumers, and Decomposers', 'producers-consumers-decomposers-3', 'Classify organisms by how they get energy in an ecosystem.', 'https://www.youtube.com/watch?v=hjN3AT5yykQ', 9, 1),
    ('science', '3', 'Organisms and Environment', 'Environment Changes', 'environment-changes-3', 'Explain how environmental changes can help or harm living things.', 'https://www.youtube.com/watch?v=hjN3AT5yykQ', 9, 2),
    ('technology', '3', 'Digital Literacy', 'Tabs and Keywords', 'tabs-and-keywords-3', 'Use good search words and browser tabs to stay organized online.', 'https://www.youtube.com/watch?v=YPxSm3lU6c8', 7, 1),
    ('technology', '3', 'Digital Literacy', 'Checking Sources', 'checking-sources-3', 'Notice simple clues that show whether a website is helpful and trustworthy.', 'https://www.youtube.com/watch?v=YPxSm3lU6c8', 7, 2),
    ('engineering', '3', 'Scratch Projects', 'Scratch Chase Game', 'scratch-chase-game-3', 'Build a chase game with keyboard controls and a target sprite.', 'https://www.youtube.com/watch?v=Gh_815r8JYQ', 10, 1),
    ('engineering', '3', 'Scratch Projects', 'Scratch Timer Game', 'scratch-timer-game-3', 'Add a timer and win condition to make a Scratch game more exciting.', 'https://www.youtube.com/watch?v=Gh_815r8JYQ', 10, 2),

    ('math', '4', 'Multiplication and Division', 'Multi-Digit Multiplication', 'multi-digit-multiplication-4', 'Multiply larger numbers using place value, area models, and partial products.', 'https://www.youtube.com/watch?v=mvOkMYCygps', 10, 1),
    ('math', '4', 'Multiplication and Division', 'Division with Remainders', 'division-with-remainders-4', 'Divide larger numbers and decide what a remainder means in a story.', 'https://www.youtube.com/watch?v=rGMecZ_aERo', 10, 2),
    ('math', '4', 'Place Value, Fractions, and Decimals', 'Place Value to One Million', 'place-value-to-million-4', 'Read, write, compare, and expand large numbers through the millions place.', 'https://www.youtube.com/watch?v=FxKJIn7T7nc', 10, 1),
    ('math', '4', 'Fractions and Patterns', 'Fractions on a Number Line', 'fractions-on-number-line-4', 'Place fractions on a number line and connect models to the same value.', 'https://www.youtube.com/watch?v=jwP0hApIh0k', 10, 2),
    ('math', '4', 'Place Value, Fractions, and Decimals', 'Decimals and Tenths', 'decimals-and-tenths-4', 'Use place value charts and money models to connect tenths to decimals.', 'https://www.youtube.com/watch?v=FxKJIn7T7nc', 10, 2),
    ('science', '4', 'Water Cycle', 'Water Cycle Steps', 'water-cycle-steps-4', 'Trace evaporation, condensation, precipitation, and collection in order.', 'https://www.youtube.com/watch?v=wccPuKMKdSc', 9, 1),
    ('science', '4', 'Water Cycle', 'Weather and Water on Earth', 'weather-and-water-on-earth-4', 'Connect the water cycle to clouds, rainfall, rivers, and conservation.', 'https://www.youtube.com/watch?v=wccPuKMKdSc', 9, 2),
    ('science', '4', 'Energy and Systems', 'Force and Motion', 'force-and-motion-4', 'Describe how pushes, pulls, and friction change the motion of an object.', 'https://www.youtube.com/watch?v=GmlMV7bA0TM', 9, 2),
    ('science', '4', 'Energy and Systems', 'Light, Sound, and Heat', 'light-sound-and-heat-4', 'Sort examples of energy and explain how energy can transfer from place to place.', 'https://www.youtube.com/watch?v=mc979OhitAg', 9, 3),
    ('science', '4', 'Organisms and Environment', 'Food Chains in Ecosystems', 'food-chains-grade-4', 'Explain how energy moves from plants to consumers in a local ecosystem.', 'https://www.youtube.com/watch?v=hjN3AT5yykQ', 9, 1),
    ('science', '4', 'Organisms and Environment', 'Human Impact and Conservation', 'human-impact-grade-4', 'Recognize how human choices can help or harm habitats and resources.', 'https://www.youtube.com/watch?v=hjN3AT5yykQ', 9, 2),
    ('technology', '4', 'Digital Literacy', 'Research and Note Taking', 'research-and-note-taking-4', 'Gather notes from digital sources without copying every word.', 'https://www.youtube.com/watch?v=YPxSm3lU6c8', 8, 1),
    ('technology', '4', 'Digital Literacy', 'Slideshow Design', 'slideshow-design-4', 'Turn notes into a clear digital presentation with useful images and captions.', 'https://www.youtube.com/watch?v=YPxSm3lU6c8', 8, 2),
    ('engineering', '4', 'Scratch Projects', 'Scratch Animated Story', 'scratch-animated-story-4', 'Use scenes, dialogue, and events to build a polished Scratch story.', 'https://www.youtube.com/watch?v=Gh_815r8JYQ', 10, 1),
    ('engineering', '4', 'Scratch Projects', 'Scratch Platform Starter', 'scratch-platform-starter-4', 'Code jumping, landing, and hazards in a beginner platform game.', 'https://www.youtube.com/watch?v=Gh_815r8JYQ', 10, 2),

    ('math', '5', 'Multiplication and Division', 'Multi-Digit Multiplication', 'multi-digit-multiplication-5', 'Multiply whole numbers efficiently and explain why the method works.', 'https://www.youtube.com/watch?v=mvOkMYCygps', 11, 1),
    ('math', '5', 'Multiplication and Division', 'Long Division', 'long-division-5', 'Solve long-division problems and interpret remainders in real situations.', 'https://www.youtube.com/watch?v=rGMecZ_aERo', 11, 2),
    ('math', '5', 'Place Value, Fractions, and Decimals', 'Decimal Place Value', 'decimal-place-value-5', 'Compare decimals through thousandths using place value reasoning.', 'https://www.youtube.com/watch?v=FxKJIn7T7nc', 11, 1),
    ('math', '5', 'Place Value, Fractions, and Decimals', 'Add and Subtract Fractions', 'add-subtract-fractions-5', 'Use visual models and common denominators to add and subtract fractions.', 'https://www.youtube.com/watch?v=jwP0hApIh0k', 11, 2),
    ('math', '5', 'Place Value, Fractions, and Decimals', 'Compare Decimals', 'compare-decimals-5', 'Use place value and benchmark fractions to compare decimals with confidence.', 'https://www.youtube.com/watch?v=FxKJIn7T7nc', 11, 3),
    ('science', '5', 'Force and Energy', 'Energy Transfer', 'energy-transfer-5', 'Explain how energy moves by light, sound, heat, and electricity.', 'https://www.youtube.com/watch?v=mc979OhitAg', 10, 1),
    ('science', '5', 'Force and Energy', 'Potential and Kinetic Energy', 'potential-and-kinetic-energy-5', 'Compare stored energy and moving energy using everyday examples.', 'https://www.youtube.com/watch?v=GmlMV7bA0TM', 10, 2),
    ('science', '5', 'Organisms and Environment', 'Food Webs', 'food-webs-grade-5', 'Track how one change in a food web can affect many organisms.', 'https://www.youtube.com/watch?v=hjN3AT5yykQ', 10, 1),
    ('science', '5', 'Organisms and Environment', 'Ecosystem Balance', 'ecosystem-balance-5', 'Explain biodiversity, population changes, and why stable ecosystems matter.', 'https://www.youtube.com/watch?v=hjN3AT5yykQ', 10, 2),
    ('technology', '5', 'Digital Literacy', 'Media Literacy', 'media-literacy-5', 'Tell the difference between a fact, an opinion, an ad, and a misleading claim online.', 'https://www.youtube.com/watch?v=YPxSm3lU6c8', 8, 1),
    ('technology', '5', 'Digital Literacy', 'Digital Project Planning', 'digital-project-planning-5', 'Plan a digital project by organizing tasks, sources, and presentation choices.', 'https://www.youtube.com/watch?v=YPxSm3lU6c8', 8, 2),
    ('engineering', '5', 'Scratch Projects', 'Scratch Score Counter', 'scratch-score-counter-5', 'Use variables and events to keep score in a Scratch game.', 'https://www.youtube.com/watch?v=Gh_815r8JYQ', 10, 1),
    ('engineering', '5', 'Scratch Projects', 'Scratch Simulation Starter', 'scratch-simulation-starter-5', 'Build a simple simulation that changes when the user picks different inputs.', 'https://www.youtube.com/watch?v=Gh_815r8JYQ', 10, 2)
)
insert into public.lessons (
  unit_id, subject_id, grade_level, title, slug, description, video_url,
  thumbnail_url, estimated_minutes, is_published, sort_order
)
select
  u.id,
  s.id,
  seed.grade_level,
  seed.title,
  seed.slug,
  seed.description,
  seed.video_url,
  null,
  seed.estimated_minutes,
  true,
  seed.sort_order
from seed_lessons seed
join public.subjects s
  on s.slug = seed.subject_slug
join public.units u
  on u.subject_id = s.id
 and u.grade_level = seed.grade_level
 and u.title = seed.unit_title
on conflict (subject_id, grade_level, slug) do update
set title = excluded.title,
    description = excluded.description,
    video_url = excluded.video_url,
    thumbnail_url = excluded.thumbnail_url,
    estimated_minutes = excluded.estimated_minutes,
    is_published = excluded.is_published,
    sort_order = excluded.sort_order;

with seed_questions(
  slug, type, prompt, explanation, correct_answer, answer_options, difficulty,
  skill_tag, sort_order
) as (
  values
    ('compare-groups-k', 'multiple_choice', 'Which comparison is true for a group of 12 counters and a group of 9 counters?', 'Compare the totals. A group with 12 has more than a group with 9.', '12 is greater than 9', '["12 is greater than 9","12 is less than 9","12 and 9 are equal","9 is one more than 12"]', 'easy', 'Counting comparison', 1),
    ('compare-groups-k', 'true_false', 'If two groups have the same number of objects, they are equal.', 'Equal groups have the same count even if the objects are arranged differently.', 'true', '[]', 'easy', 'Equal groups', 2),
    ('numbers-to-20-k', 'numeric', 'What number is 1 more than 19?', 'Counting one more after 19 gives 20.', '20', '[]', 'easy', 'Counting forward', 1),
    ('numbers-to-20-k', 'multiple_choice', 'Which number shows 1 ten and 4 ones?', 'One ten is 10 and 4 ones make 14.', '14', '["11","14","20","41"]', 'easy', 'Teen numbers', 2),
    ('alphabet-sounds-k', 'multiple_choice', 'Which letter starts the word sun?', 'The first sound in sun is /s/, so the matching letter is S.', 'S', '["M","S","T","L"]', 'easy', 'Beginning sounds', 1),
    ('alphabet-sounds-k', 'true_false', 'The letter B comes before the letter C in the alphabet.', 'The alphabet order goes A, B, C.', 'true', '[]', 'easy', 'Alphabet order', 2),
    ('colors-and-patterns-k', 'multiple_choice', 'Which color comes next in this pattern: red, blue, red, blue, __?', 'The pattern repeats red then blue, so red comes next.', 'red', '["green","yellow","red","purple"]', 'easy', 'Color patterns', 1),
    ('colors-and-patterns-k', 'true_false', 'Green and yellow are different colors.', 'They are both colors, but they are not the same color.', 'true', '[]', 'easy', 'Color names', 2),
    ('living-or-not-k', 'multiple_choice', 'Which of these is living?', 'Living things grow and need air and water. A plant is living.', 'plant', '["rock","plant","pencil","chair"]', 'easy', 'Living things', 1),
    ('living-or-not-k', 'true_false', 'A toy car needs water to grow.', 'Toy cars are nonliving objects and do not grow.', 'false', '[]', 'easy', 'Nonliving things', 2),
    ('plant-and-animal-needs-k', 'multiple_choice', 'What do animals need to stay alive?', 'Animals need basics such as water, air, food, and shelter.', 'water', '["water","television","markers","sunglasses"]', 'easy', 'Animal needs', 1),
    ('plant-and-animal-needs-k', 'true_false', 'Plants need sunlight to make food.', 'Sunlight helps plants make food in their leaves.', 'true', '[]', 'easy', 'Plant needs', 2),
    ('device-parts-and-care-k', 'multiple_choice', 'Which part of a tablet shows the pictures?', 'The screen is the part that displays words, pictures, and buttons.', 'screen', '["screen","charger","case","table"]', 'easy', 'Device parts', 1),
    ('device-parts-and-care-k', 'true_false', 'It is safer to carry a tablet with two hands.', 'Two hands help keep a device steady and protected.', 'true', '[]', 'easy', 'Device care', 2),
    ('tap-click-and-drag-k', 'multiple_choice', 'Which action moves an item across the screen?', 'Dragging lets you press and move an item from one place to another.', 'drag', '["sleep","drag","erase","print"]', 'easy', 'Mouse actions', 1),
    ('tap-click-and-drag-k', 'true_false', 'A click can open an icon.', 'Clicking or tapping can open a tool, picture, or app.', 'true', '[]', 'easy', 'Opening tools', 2),
    ('scratch-move-and-sound-k', 'multiple_choice', 'Which kind of Scratch block makes a sprite move?', 'Motion blocks change where a sprite goes on the screen.', 'move steps block', '["move steps block","say block","paint block","score block"]', 'easy', 'Scratch motion', 1),
    ('scratch-move-and-sound-k', 'true_false', 'A sound block can make a sprite play a sound.', 'Scratch sound blocks let a project play music or effects.', 'true', '[]', 'easy', 'Scratch sound', 2),
    ('scratch-color-dance-k', 'multiple_choice', 'What can a sprite change to look different during a dance?', 'Looks blocks can change a sprite''s color or costume.', 'color', '["color","homework","battery","teacher"]', 'easy', 'Scratch looks', 1),
    ('scratch-color-dance-k', 'true_false', 'Testing a project helps you see if the code works.', 'Running the project lets you spot mistakes and fix them.', 'true', '[]', 'easy', 'Debugging', 2),

    ('habitats-and-needs-1', 'multiple_choice', 'A bird nest is an example of a ____.', 'A nest is a shelter inside a habitat.', 'habitat', '["habitat","keyboard","pattern","planet"]', 'easy', 'Habitats', 1),
    ('habitats-and-needs-1', 'true_false', 'Plants and animals both need water.', 'Water is a basic need for living things.', 'true', '[]', 'easy', 'Living needs', 2),
    ('caring-for-our-environment-1', 'multiple_choice', 'Which action helps a habitat stay clean?', 'Throwing trash away helps protect living spaces.', 'put trash in a bin', '["put trash in a bin","drop trash on the ground","break plants for fun","pour soap in a creek"]', 'easy', 'Environmental care', 1),
    ('caring-for-our-environment-1', 'true_false', 'Picking up litter can help animals stay safe.', 'Cleaner habitats help plants and animals thrive.', 'true', '[]', 'easy', 'Habitat protection', 2),
    ('picture-passwords-1', 'multiple_choice', 'Who should know your password?', 'Passwords stay private and are only shared with a trusted adult when needed.', 'a trusted adult helping you', '["everyone in class","a trusted adult helping you","someone online you just met","nobody ever"]', 'easy', 'Password safety', 1),
    ('picture-passwords-1', 'true_false', 'A password helps protect your account.', 'Passwords help keep personal work and information safe.', 'true', '[]', 'easy', 'Account safety', 2),
    ('kind-online-choices-1', 'multiple_choice', 'If something online feels mean or scary, what should you do first?', 'Students should stop and tell a trusted adult when something online feels unsafe.', 'tell a trusted adult', '["tell a trusted adult","send a mean message back","share it with everyone","ignore all adults"]', 'easy', 'Digital citizenship', 1),
    ('kind-online-choices-1', 'true_false', 'Kind words matter online just like they do in person.', 'Digital citizenship includes being respectful in messages and comments.', 'true', '[]', 'easy', 'Kind choices', 2),
    ('scratch-story-scenes-1', 'multiple_choice', 'Which Scratch feature helps a story change from one place to another?', 'Backdrops let a project switch scenes for a story.', 'backdrops', '["backdrops","erasers","passwords","printers"]', 'easy', 'Scratch stories', 1),
    ('scratch-story-scenes-1', 'true_false', 'A Scratch story can use more than one backdrop.', 'Changing backdrops helps show new scenes or locations.', 'true', '[]', 'easy', 'Backdrops', 2),
    ('scratch-repeat-patterns-1', 'multiple_choice', 'Which block repeats an action again and again?', 'Repeat blocks help code follow a pattern without many extra blocks.', 'repeat block', '["repeat block","sleep block","notebook block","speaker block"]', 'easy', 'Loops', 1),
    ('scratch-repeat-patterns-1', 'true_false', 'Loops can help code a pattern faster.', 'Repeating actions with a loop saves time and makes code cleaner.', 'true', '[]', 'easy', 'Coding patterns', 2),

    ('add-within-100-2', 'numeric', 'What is 47 + 12?', 'Add the ones and tens. 47 plus 12 equals 59.', '59', '[]', 'easy', 'Addition within 100', 1),
    ('add-within-100-2', 'multiple_choice', 'Which equation matches 36 + 20?', 'Adding 2 tens to 36 gives 56.', '56', '["46","56","66","26"]', 'easy', 'Tens and ones', 2),
    ('subtract-within-100-2', 'numeric', 'What is 63 - 21?', 'Take away 2 tens and 1 one. 63 minus 21 equals 42.', '42', '[]', 'easy', 'Subtraction within 100', 1),
    ('subtract-within-100-2', 'multiple_choice', 'Which answer is correct for 90 - 40?', 'Subtract 4 tens from 9 tens to get 5 tens.', '50', '["40","50","60","130"]', 'easy', 'Subtracting tens', 2),
    ('choose-add-or-subtract-2', 'multiple_choice', 'Mia had 28 beads and found 6 more. Which operation helps solve the problem?', 'When the amount grows, addition is the right operation.', 'addition', '["addition","subtraction","division","rounding only"]', 'easy', 'Story problem operation', 1),
    ('choose-add-or-subtract-2', 'true_false', 'If you have 45 apples and give away 9, you should subtract.', 'Giving away some means the total gets smaller.', 'true', '[]', 'easy', 'Problem solving', 2),
    ('parts-of-a-plant-2', 'multiple_choice', 'Which plant part takes in water from the soil?', 'Roots absorb water and help anchor the plant.', 'roots', '["roots","flowers","fruits","petals only"]', 'easy', 'Plant parts', 1),
    ('parts-of-a-plant-2', 'true_false', 'Leaves help a plant make food.', 'Leaves capture sunlight and help the plant make food.', 'true', '[]', 'easy', 'Plant functions', 2),
    ('plant-life-cycle-2', 'multiple_choice', 'Which stage comes first in a plant life cycle?', 'A plant begins as a seed before sprouting.', 'seed', '["leaf","seed","fruit","flower"]', 'easy', 'Life cycles', 1),
    ('plant-life-cycle-2', 'true_false', 'Plants can make new seeds after they grow flowers.', 'Flowers can help plants reproduce and make seeds.', 'true', '[]', 'easy', 'Plant reproduction', 2),
    ('simple-food-chains-2', 'multiple_choice', 'In a simple food chain, what usually comes first?', 'Plants make their own food, so they often start a food chain.', 'a plant', '["a plant","a hawk","a fox","a mushroom only"]', 'easy', 'Food chains', 1),
    ('simple-food-chains-2', 'true_false', 'Animals can depend on plants for food.', 'Many food chains begin with plants because animals eat plants or eat animals that ate plants.', 'true', '[]', 'easy', 'Dependence', 2),
    ('protect-habitats-2', 'multiple_choice', 'Which action helps protect a pond habitat?', 'Keeping water clean helps the plants and animals in a pond.', 'keep trash out of the water', '["keep trash out of the water","pour paint in the pond","step on all the plants","take every rock home"]', 'easy', 'Habitat care', 1),
    ('protect-habitats-2', 'true_false', 'Cutting down every tree would change an animal habitat.', 'Animals depend on trees and plants for food, shelter, and shade.', 'true', '[]', 'easy', 'Environmental change', 2),
    ('keyboard-and-files-2', 'multiple_choice', 'Where do you click to save your work?', 'The save button stores your work so you can find it later.', 'save button', '["save button","backpack","microphone","camera lens"]', 'easy', 'Saving work', 1),
    ('keyboard-and-files-2', 'true_false', 'A file name helps you find your work later.', 'Clear names make digital work easier to organize and reopen.', 'true', '[]', 'easy', 'File organization', 2),
    ('safe-searching-2', 'multiple_choice', 'Which search words are better for a report about frogs?', 'Clear keywords give better results than one broad word.', 'frog habitat facts', '["stuff","frog habitat facts","funny things","everything about everything"]', 'easy', 'Search keywords', 1),
    ('safe-searching-2', 'true_false', 'It is smart to ask an adult if a website feels confusing.', 'Trusted adults can help students judge results and stay safe.', 'true', '[]', 'easy', 'Online safety', 2),
    ('scratch-animated-name-2', 'multiple_choice', 'What makes an animated name more interesting in Scratch?', 'Motion and looks blocks can make letters move and change.', 'adding motion and looks blocks', '["adding motion and looks blocks","turning the screen off","deleting all sprites","typing only in all caps"]', 'easy', 'Scratch animation', 1),
    ('scratch-animated-name-2', 'true_false', 'Events blocks can start a Scratch animation.', 'Events tell the project when to begin an action.', 'true', '[]', 'easy', 'Scratch events', 2),
    ('scratch-quiz-card-2', 'multiple_choice', 'What should happen when a player clicks the right answer in a Scratch quiz?', 'A quiz should give feedback that tells the player they were correct.', 'show a correct message', '["show a correct message","close the computer","erase the sprite forever","do nothing every time"]', 'easy', 'Interactive projects', 1),
    ('scratch-quiz-card-2', 'true_false', 'Scratch can use buttons or sprites that react when clicked.', 'Sprites can be programmed to respond to clicks.', 'true', '[]', 'easy', 'User input', 2),

    ('add-with-regrouping-3', 'numeric', 'What is 278 + 146?', 'Add the ones, tens, and hundreds carefully. 278 plus 146 equals 424.', '424', '[]', 'medium', 'Regrouping addition', 1),
    ('add-with-regrouping-3', 'true_false', 'Estimation can help check whether an addition answer makes sense.', 'Rounding first gives a quick way to judge a final answer.', 'true', '[]', 'easy', 'Estimation', 2),
    ('subtract-with-regrouping-3', 'numeric', 'What is 503 - 178?', 'Regroup across the hundreds, tens, and ones to find 325.', '325', '[]', 'medium', 'Regrouping subtraction', 1),
    ('subtract-with-regrouping-3', 'true_false', 'If your answer is bigger than the starting number in a subtraction problem, you should check your work.', 'Subtraction should usually make the amount smaller in these problems.', 'true', '[]', 'easy', 'Reasonableness', 2),
    ('related-facts-and-arrays-3', 'multiple_choice', 'An array has 4 rows of 6. Which multiplication fact matches it?', 'Rows times columns gives 4 times 6.', '4 x 6 = 24', '["4 x 6 = 24","4 + 6 = 10","24 - 6 = 18","6 x 24 = 144"]', 'easy', 'Arrays', 1),
    ('related-facts-and-arrays-3', 'true_false', 'If 4 x 6 = 24, then 24 divided by 6 equals 4.', 'Multiplication and division are related facts.', 'true', '[]', 'easy', 'Fact families', 2),
    ('producers-consumers-decomposers-3', 'multiple_choice', 'Which organism is a producer?', 'Producers make their own food, usually by using sunlight.', 'grass', '["grass","hawk","rabbit","mushroom"]', 'easy', 'Ecosystem roles', 1),
    ('producers-consumers-decomposers-3', 'true_false', 'A decomposer helps break down dead material.', 'Decomposers return matter to the environment.', 'true', '[]', 'easy', 'Decomposers', 2),
    ('environment-changes-3', 'multiple_choice', 'Which change could make it harder for pond animals to live there?', 'Polluting the water can harm the living things in the pond.', 'trash in the pond', '["trash in the pond","clean water","more plants","a safe nesting area"]', 'easy', 'Environmental change', 1),
    ('environment-changes-3', 'true_false', 'A drought can change the plants and animals in an area.', 'Less water can affect survival in an ecosystem.', 'true', '[]', 'easy', 'Habitats', 2),
    ('tabs-and-keywords-3', 'multiple_choice', 'Why might you open a second browser tab?', 'Tabs help you keep more than one helpful page open at a time.', 'to compare more than one source', '["to compare more than one source","to make the internet disappear","to erase your keyboard","to skip reading"]', 'easy', 'Browser skills', 1),
    ('tabs-and-keywords-3', 'true_false', 'Specific keywords usually give better search results than one broad word.', 'Careful search words help narrow results.', 'true', '[]', 'easy', 'Search strategies', 2),
    ('checking-sources-3', 'multiple_choice', 'Which website clue is most helpful when checking a source?', 'Looking for the author or organization can help you judge a source.', 'who made the page', '["who made the page","how bright the colors are","how many ads it has","whether it uses all caps"]', 'medium', 'Source checking', 1),
    ('checking-sources-3', 'true_false', 'You should compare information from more than one source when you can.', 'Using more than one source helps you check whether information agrees.', 'true', '[]', 'easy', 'Research habits', 2),
    ('scratch-chase-game-3', 'multiple_choice', 'What should happen when the player sprite touches the target in a chase game?', 'A game should react clearly when the goal is reached.', 'the project should show a win or score change', '["the project should show a win or score change","the mouse should unplug itself","nothing at all should happen","the code should vanish"]', 'easy', 'Game design', 1),
    ('scratch-chase-game-3', 'true_false', 'Keyboard blocks can help a player control a sprite.', 'Scratch can respond when specific keys are pressed.', 'true', '[]', 'easy', 'Player controls', 2),
    ('scratch-timer-game-3', 'multiple_choice', 'Why add a timer to a game?', 'A timer creates a challenge and changes how the player makes decisions.', 'to create a challenge', '["to create a challenge","to remove all sprites","to lock the keyboard forever","to stop the game from running"]', 'easy', 'Game features', 1),
    ('scratch-timer-game-3', 'true_false', 'Testing a timer game helps you see whether the timing feels fair.', 'Playtesting shows whether the challenge works the way you planned.', 'true', '[]', 'easy', 'Testing', 2),

    ('multi-digit-multiplication-4', 'numeric', 'What is 23 x 4?', 'Multiply 23 by 4 to get 92.', '92', '[]', 'easy', 'Multiplication', 1),
    ('multi-digit-multiplication-4', 'true_false', 'An area model can help show multi-digit multiplication.', 'Area models break a large multiplication problem into smaller parts.', 'true', '[]', 'easy', 'Area models', 2),
    ('division-with-remainders-4', 'numeric', 'What is 29 divided by 4?', 'Four groups of 7 make 28 with 1 left over, so the answer is 7 remainder 1.', '7', '[]', 'medium', 'Division', 1),
    ('division-with-remainders-4', 'multiple_choice', 'What remainder is left when 29 is divided by 4?', '29 equals 4 groups of 7 with 1 left over.', '1', '["0","1","3","4"]', 'medium', 'Remainders', 2),
    ('place-value-to-million-4', 'multiple_choice', 'Which digit is in the ten-thousands place in 482,761?', 'Read the places from right to left: ones, tens, hundreds, thousands, ten-thousands.', '8', '["4","8","2","7"]', 'medium', 'Place value', 1),
    ('place-value-to-million-4', 'true_false', '700,000 is greater than 70,000.', 'A number with seven hundred-thousands is greater than a number with seven ten-thousands.', 'true', '[]', 'easy', 'Comparing numbers', 2),
    ('fractions-on-number-line-4', 'multiple_choice', 'Which fraction belongs halfway between 0 and 1 on a number line?', 'The halfway point names one-half.', '1/2', '["1/4","1/2","3/4","4/4"]', 'easy', 'Number lines', 1),
    ('fractions-on-number-line-4', 'true_false', 'Fractions can be shown on a number line.', 'Fractions name points between whole numbers on a number line.', 'true', '[]', 'easy', 'Fraction models', 2),
    ('decimals-and-tenths-4', 'multiple_choice', 'Which decimal names 3 tenths?', 'Three tenths is written as 0.3.', '0.3', '["3.0","0.03","0.3","3.3"]', 'easy', 'Decimals', 1),
    ('decimals-and-tenths-4', 'true_false', '0.7 is greater than 0.5.', 'Seven tenths is greater than five tenths.', 'true', '[]', 'easy', 'Comparing tenths', 2),
    ('water-cycle-steps-4', 'multiple_choice', 'What is the name for liquid water changing into water vapor?', 'Evaporation is the process that changes liquid water into water vapor.', 'evaporation', '["condensation","evaporation","collection","freezing"]', 'easy', 'Water cycle', 1),
    ('water-cycle-steps-4', 'true_false', 'Condensation helps clouds form.', 'When water vapor cools, it condenses into tiny droplets that form clouds.', 'true', '[]', 'easy', 'Condensation', 2),
    ('weather-and-water-on-earth-4', 'multiple_choice', 'Which part of the water cycle brings rain to Earth?', 'Precipitation is water falling from clouds as rain, snow, sleet, or hail.', 'precipitation', '["collection","precipitation","evaporation","melting only"]', 'easy', 'Precipitation', 1),
    ('weather-and-water-on-earth-4', 'true_false', 'Water in rivers can return to the air later in the water cycle.', 'Sunlight can warm surface water so it evaporates again.', 'true', '[]', 'easy', 'Earth systems', 2),
    ('force-and-motion-4', 'multiple_choice', 'Which force slows a sliding object?', 'Friction opposes motion between two surfaces touching.', 'friction', '["gravity","friction","sound","light"]', 'easy', 'Forces', 1),
    ('force-and-motion-4', 'true_false', 'A stronger push can change how fast an object moves.', 'Changing the size of a force can change motion.', 'true', '[]', 'easy', 'Motion', 2),
    ('light-sound-and-heat-4', 'multiple_choice', 'Which is an example of sound energy?', 'A ringing bell makes vibrations you can hear.', 'a ringing bell', '["a ringing bell","a sleeping rock","a still pencil","a closed book"]', 'easy', 'Energy types', 1),
    ('light-sound-and-heat-4', 'true_false', 'Heat can move from a warmer object to a cooler object.', 'Thermal energy transfers from warmer places to cooler places.', 'true', '[]', 'easy', 'Heat transfer', 2),
    ('food-chains-grade-4', 'multiple_choice', 'What usually provides the first energy in a food chain?', 'Plants capture energy from sunlight and start many food chains.', 'plants', '["plants","hawks","worms","rocks"]', 'easy', 'Food chains', 1),
    ('food-chains-grade-4', 'true_false', 'If plants in a habitat disappear, animals may be affected too.', 'Changes at one part of a food chain can affect the rest of the chain.', 'true', '[]', 'easy', 'Ecosystems', 2),
    ('human-impact-grade-4', 'multiple_choice', 'Which action helps conserve natural resources?', 'Using only what you need and recycling when possible helps conserve resources.', 'recycling paper and bottles', '["recycling paper and bottles","wasting clean water","leaving lights on all day","dropping litter in a park"]', 'easy', 'Conservation', 1),
    ('human-impact-grade-4', 'true_false', 'People can change habitats in ways that help or harm living things.', 'Human choices can improve or damage the places organisms need to survive.', 'true', '[]', 'easy', 'Human impact', 2),
    ('research-and-note-taking-4', 'multiple_choice', 'What is a good note-taking habit?', 'Notes should capture main ideas in your own words.', 'write key ideas in your own words', '["write key ideas in your own words","copy every sentence exactly","skip source names","delete all questions"]', 'easy', 'Note taking', 1),
    ('research-and-note-taking-4', 'true_false', 'Good research notes should match the question you are trying to answer.', 'Notes are more useful when they stay focused on the research goal.', 'true', '[]', 'easy', 'Research', 2),
    ('slideshow-design-4', 'multiple_choice', 'Which slide is usually easier to read?', 'A clear slide uses a short title, a few key points, and a useful picture.', 'a slide with a short title and a few key points', '["a slide with a short title and a few key points","a slide packed with tiny text","a blank slide with no labels","a slide with twenty fonts"]', 'easy', 'Presentation design', 1),
    ('slideshow-design-4', 'true_false', 'Pictures in a slideshow should help explain the idea on the slide.', 'Useful visuals support the message instead of distracting from it.', 'true', '[]', 'easy', 'Digital presentations', 2),
    ('scratch-animated-story-4', 'multiple_choice', 'What helps a Scratch story feel organized?', 'Scenes, dialogue, and events help a story follow a clear order.', 'events and scene changes', '["events and scene changes","random blocks with no plan","deleting all backdrops","never testing the story"]', 'easy', 'Scratch storytelling', 1),
    ('scratch-animated-story-4', 'true_false', 'Sprites can send messages to tell other sprites when to act.', 'Broadcast messages help different parts of a Scratch project work together.', 'true', '[]', 'medium', 'Broadcasts', 2),
    ('scratch-platform-starter-4', 'multiple_choice', 'Which feature is important in a platform game?', 'A platform game needs jumps, landings, and objects to avoid or collect.', 'jumping and landing code', '["jumping and landing code","only a still background","no player controls","one invisible sprite and nothing else"]', 'easy', 'Platform games', 1),
    ('scratch-platform-starter-4', 'true_false', 'Testing a platform game can show whether a jump is too easy or too hard.', 'Playtesting helps improve how the game feels.', 'true', '[]', 'easy', 'Game testing', 2),

    ('multi-digit-multiplication-5', 'numeric', 'What is 34 x 6?', '34 groups of 6 make 204.', '204', '[]', 'easy', 'Multiplication', 1),
    ('multi-digit-multiplication-5', 'true_false', 'Breaking a multiplication problem into smaller parts can make it easier to solve.', 'Partial products are one way to use smaller pieces to solve a larger problem.', 'true', '[]', 'easy', 'Partial products', 2),
    ('long-division-5', 'numeric', 'What is 84 divided by 7?', '84 split into 7 equal groups gives 12 in each group.', '12', '[]', 'easy', 'Division', 1),
    ('long-division-5', 'true_false', 'A remainder can matter when solving a real-world division problem.', 'The context of the problem tells how to use the remainder.', 'true', '[]', 'medium', 'Problem solving', 2),
    ('decimal-place-value-5', 'multiple_choice', 'Which decimal is greatest?', 'Compare the place values from left to right.', '0.83', '["0.38","0.8","0.83","0.308"]', 'medium', 'Decimal place value', 1),
    ('decimal-place-value-5', 'true_false', '0.5 and 0.50 name the same value.', 'Adding a zero to the right of a decimal digit does not change the value.', 'true', '[]', 'easy', 'Equivalent decimals', 2),
    ('add-subtract-fractions-5', 'multiple_choice', 'What is 1/4 + 1/4?', 'One fourth plus one fourth equals two fourths, which is one half.', '1/2', '["1/8","1/2","2/8","3/4"]', 'easy', 'Fraction addition', 1),
    ('add-subtract-fractions-5', 'true_false', 'You need common-sized parts to add fractions with different denominators.', 'Fractions must name equal-sized pieces before they can be combined.', 'true', '[]', 'medium', 'Equivalent fractions', 2),
    ('compare-decimals-5', 'multiple_choice', 'Which comparison is true?', 'Six tenths is greater than fifty-nine hundredths.', '0.60 > 0.59', '["0.60 > 0.59","0.4 > 0.41","0.08 > 0.8","0.35 = 0.53"]', 'medium', 'Comparing decimals', 1),
    ('compare-decimals-5', 'true_false', '0.27 is less than 0.3.', 'Twenty-seven hundredths is less than three tenths.', 'true', '[]', 'easy', 'Decimal comparison', 2),
    ('energy-transfer-5', 'multiple_choice', 'Which example shows electrical energy being used?', 'A circuit that lights a bulb uses electrical energy.', 'a battery lighting a bulb', '["a battery lighting a bulb","a pencil lying still","a rock on the ground","a closed book"]', 'easy', 'Energy transfer', 1),
    ('energy-transfer-5', 'true_false', 'Energy can move from one object to another.', 'Energy transfer can happen in many ways, including light, heat, and electricity.', 'true', '[]', 'easy', 'Systems', 2),
    ('potential-and-kinetic-energy-5', 'multiple_choice', 'Which example shows kinetic energy?', 'Kinetic energy is the energy of motion.', 'a rolling ball', '["a rolling ball","a book on a shelf","a stretched rubber band not moving","a still bicycle"]', 'easy', 'Kinetic energy', 1),
    ('potential-and-kinetic-energy-5', 'true_false', 'A stretched rubber band stores potential energy.', 'Stored energy that can be released later is potential energy.', 'true', '[]', 'easy', 'Potential energy', 2),
    ('food-webs-grade-5', 'multiple_choice', 'How is a food web different from a food chain?', 'A food web shows many connected feeding relationships instead of just one path.', 'It shows many connected food chains.', '["It shows many connected food chains.","It only has one organism.","It never includes plants.","It has no arrows."]', 'easy', 'Food webs', 1),
    ('food-webs-grade-5', 'true_false', 'A change in one population can affect other populations in a food web.', 'Food webs are connected systems, so one change can spread through the web.', 'true', '[]', 'easy', 'Interdependence', 2),
    ('ecosystem-balance-5', 'multiple_choice', 'Why does biodiversity matter in an ecosystem?', 'More variety can make ecosystems stronger and more stable.', 'It can make ecosystems more stable.', '["It can make ecosystems more stable.","It makes water disappear.","It stops all change.","It means only one species survives."]', 'medium', 'Biodiversity', 1),
    ('ecosystem-balance-5', 'true_false', 'Removing too many organisms from one part of an ecosystem can upset the balance.', 'Ecosystems depend on many relationships staying in balance.', 'true', '[]', 'easy', 'Ecosystem balance', 2),
    ('media-literacy-5', 'multiple_choice', 'Which question is most useful when checking online media?', 'Smart readers ask who made the message and why it was made.', 'Who made this and why?', '["Who made this and why?","Is the text in a fun font?","Does it load quickly?","Is it the first link you saw?"]', 'medium', 'Media literacy', 1),
    ('media-literacy-5', 'true_false', 'An online ad can be designed to look like regular information.', 'Some messages try to persuade while looking neutral, so readers should pay attention.', 'true', '[]', 'medium', 'Advertisements', 2),
    ('digital-project-planning-5', 'multiple_choice', 'What is a smart first step when starting a digital project?', 'A clear plan helps you stay organized before you build.', 'make a plan for tasks and sources', '["make a plan for tasks and sources","open random tabs and hope","skip the research step","change topics every minute"]', 'easy', 'Project planning', 1),
    ('digital-project-planning-5', 'true_false', 'A checklist can help you manage a longer digital project.', 'Checklists help students track progress and stay on schedule.', 'true', '[]', 'easy', 'Organization', 2),
    ('scratch-score-counter-5', 'multiple_choice', 'Which Scratch tool keeps track of a score that changes during a game?', 'Variables store values that can change while the game runs.', 'variable', '["variable","backdrop only","paint tool","speaker icon"]', 'easy', 'Scratch variables', 1),
    ('scratch-score-counter-5', 'true_false', 'A game can add points each time the player reaches a goal.', 'Code can increase a score variable when events happen.', 'true', '[]', 'easy', 'Scoring', 2),
    ('scratch-simulation-starter-5', 'multiple_choice', 'What makes a Scratch project a simulation?', 'A simulation lets users change inputs and watch what happens.', 'it models what happens when conditions change', '["it models what happens when conditions change","it never reacts to the player","it only shows one still picture","it has no code"]', 'medium', 'Simulations', 1),
    ('scratch-simulation-starter-5', 'true_false', 'Testing different inputs is part of building a simulation.', 'Simulations are useful because users can explore different outcomes.', 'true', '[]', 'easy', 'Testing models', 2)
),
deleted as (
  delete from public.questions
  where lesson_id in (
    select l.id
    from public.lessons l
    join (select distinct slug from seed_questions) seeded
      on seeded.slug = l.slug
  )
  returning 1
)
insert into public.questions (
  lesson_id, type, prompt, explanation, correct_answer, answer_options,
  difficulty, skill_tag, sort_order
)
select
  l.id,
  q.type,
  q.prompt,
  q.explanation,
  q.correct_answer,
  q.answer_options::jsonb,
  q.difficulty,
  q.skill_tag,
  q.sort_order
from public.lessons l
join seed_questions q
  on q.slug = l.slug;
