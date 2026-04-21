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
