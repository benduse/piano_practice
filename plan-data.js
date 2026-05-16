// plan-data.js — single source of truth for the 3-month practice plan
// To add/edit weeks: modify this array only. The timeline renders from this data.

const PLAN_DATA = [
  {
    month: 1,
    monthTitle: 'Foundation & First 15 Songs',
    weeks: [
      {
        id: 1,
        title: 'Week 1: Chord Shapes',
        tasks: [
          'Learn C, Am, F, G in root position',
          'Practice chord transitions Am→F→C→G',
          'Play with metronome: 60 BPM'
        ],
        goal: 'Clean transitions, 1 chord per measure'
      },
      {
        id: 2,
        title: 'Week 2: Songs 1–4',
        tasks: [
          'Let It Be – The Beatles',
          'No Woman No Cry – Bob Marley',
          'With or Without You – U2',
          'You Gotta Be – Des\'ree'
        ],
        goal: 'Play 4 songs start to finish, simple rhythm'
      },
      {
        id: 3,
        title: 'Week 3: Songs 5–10',
        tasks: [
          'Apologize – OneRepublic',
          'Africa – Toto',
          'Poker Face – Lady Gaga',
          'I\'m Yours – Jason Mraz',
          'Secrets – OneRepublic',
          'Love Me Like You Do – Ellie Goulding'
        ],
        goal: 'Add left-hand bass notes C-A-F-G'
      },
      {
        id: 4,
        title: 'Week 4: Songs 11–15',
        tasks: [
          'She Will Be Loved – Maroon 5',
          'What Goes Around – Justin Timberlake',
          'Bulletproof – La Roux',
          'The Man Who Can\'t Be Moved – The Script',
          'When I Come Around – Green Day'
        ],
        goal: 'Introduce inversions: start F chord on A'
      }
    ]
  },
  {
    month: 2,
    monthTitle: 'Rhythm, Inversions & Artists You Love',
    weeks: [
      {
        id: 5,
        title: 'Week 5: Songs 16–22',
        tasks: [
          'Chandelier – Sia',
          'Elastic Heart – Sia',
          'Cheap Thrills – Sia',
          'Just The Way You Are – Bruno Mars',
          'When I Was Your Man – Bruno Mars',
          'Grenade – Bruno Mars',
          'Enemigos – Aitana'
        ],
        goal: 'Sia ballad style: broken chords RH, sustain pedal'
      },
      {
        id: 6,
        title: 'Week 6: Songs 23–28',
        tasks: [
          'Sin Ti – Becky G',
          'Mayores – Becky G',
          'Faded – Alan Walker',
          'Alone – Alan Walker',
          'On My Way – Alan Walker',
          'The Nights – Avicii'
        ],
        goal: 'EDM groove: play chords on beats 2 & 4 only'
      },
      {
        id: 7,
        title: 'Week 7: Songs 29–34',
        tasks: [
          'Wake Me Up – Avicii',
          'Demons – Imagine Dragons',
          'Radioactive – Imagine Dragons',
          'Counting Stars – OneRepublic',
          'All of Me – John Legend',
          'We Don\'t Talk Anymore – Charlie Puth'
        ],
        goal: 'Syncopated pop rhythms, anticipate chord changes'
      },
      {
        id: 8,
        title: 'Week 8: Hymns Intro 35–40',
        tasks: [
          'Amazing Grace – Traditional',
          'How Great Thou Art – Hymn',
          '10,000 Reasons – Matt Redman',
          'Cornerstone – Hillsong',
          'In Christ Alone – Hymn',
          'What a Friend – Traditional'
        ],
        goal: 'Hymn style: block chords, 3/4 & 4/4 time'
      }
    ]
  },
  {
    month: 3,
    monthTitle: 'Mastery, Transposing & Final 10',
    weeks: [
      {
        id: 9,
        title: 'Week 9: Worship 41–44',
        tasks: [
          'Great Are You Lord – All Sons & Daughters',
          'Oceans – Hillsong United',
          'Reckless Love – Cory Asbury',
          'King of My Heart – Bethel'
        ],
        goal: 'Worship feel: slow, spacious, add sus chords'
      },
      {
        id: 10,
        title: 'Week 10: Classics 45–48',
        tasks: [
          'Stand By Me – Ben E. King',
          'Otherside – Red Hot Chili Peppers',
          'Save Tonight – Eagle-Eye Cherry',
          'If I Were a Boy – Beyoncé'
        ],
        goal: 'Transpose: play 3 songs in G major Em-C-G-D'
      },
      {
        id: 11,
        title: 'Week 11: Final Songs 49–50 + Review',
        tasks: [
          'Can You Feel The Love Tonight – Elton John',
          'Love The Way You Lie – Eminem ft. Rihanna',
          'Review: Play any 10 songs from memory',
          'Practice: Transpose Let It Be to F major'
        ],
        goal: '50-song repertoire, transpose to 3 keys'
      },
      {
        id: 12,
        title: 'Week 12: Performance Week',
        tasks: [
          'Day 1–2: Record yourself playing 5 songs',
          'Day 3–4: Play for friend/family',
          'Day 5: Learn to add melody with RH',
          'Day 6–7: Create your own mashup!'
        ],
        goal: 'Perform confidently, improvise fills'
      }
    ]
  }
];
