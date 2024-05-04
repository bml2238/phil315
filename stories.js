const story_data = [
    {
      "headline": "Viral Photo of Koala Had Been Photoshopped",
      "is_true": true,
      "expected_readers": 75,
      "source1": "[original photo showing a koala that is not pink]",
      "source2": "no species of pink koalas ever discovered",
      "source3": ""
    },
    {
      "headline": "Pink Koala Escapes From Zerthania Zoo",
      "is_true": false,
      "expected_readers": 125,
      "source1": "[photo of pink koala]",
      "source2": "",
      "source3": ""
    },
    {
      "headline": "New Variety of Potato Set to Revolutionise Our Eating Habits",
      "is_true": "misleading",
      "expected_readers": 150,
      "source1": "[scientific paper about a new, temperature resistent potato variety]",
      "source2": "",
      "source3": ""
    },
    {
      "headline": "New Potato Variety Created to Survive Warming Climate",
      "is_true": true,
      "expected_readers": 100,
      "source1": "[report showing potatos dying off in high temperatures]",
      "source2": "[scientific paper about a new, temperature resistent potato variety]",
      "source3": ""
    },
    {
      "headline": "The World’s Biggest Potato Measuring Over 1M",
      "is_true": false,
      "expected_readers": 200,
      "source1": "Quote from winner of local potato contest: 'I bet next year they could almost be a meter long! I ain't there yet though'",
      "source2": "",
      "source3": ""
    },
    {
      "headline": "Small Volcanic Eruption Forcast in Northern Regions",
      "is_true": true,
      "expected_readers": 60,
      "source1": "[reports about unusual seismic activity in small part of Nothern Regions]",
      "source2": "[local government ordinance asking certain citizens to evacuate]",
      "source3": ""
    },
    {
      "headline": "Volcanic Eruption Causes Devastation",
      "is_true": true,
      "expected_readers": 250,
      "source1": "[census data showing thousands of homes destroyed]",
      "source2": "",
      "source3": ""
    },
    {
      "headline": "Butterfly Tattoos Banned in North Jestan",
      "is_true": false,
      "expected_readers": 200,
      "source1": "[quote from anonymous source claiming that the North Jestan leader hates butterflies and tattoos]",
      "source2": "",
      "source3": ""
    },
    {
      "headline": "New Virus Found in Muzzaetos Union, Already Killed 33",
      "is_true": "misleading",
      "expected_readers": 150,
      "source1": "[data showing Muzzaetos Union flu seasons kills around 100-150 per year]",
      "source2": "biologists in Muzzaetos Union debate classification of flu varient",
      "source3": ""
    },
    {
      "headline": "Muzzaetian Flu Season Extra Deadly",
      "is_true": true,
      "expected_readers": 100,
      "source1": "[data showing Muzzaetos Union flu seasons kills around 100-150 per year]",
      "source2": "[report from hospitals that 200 people have died from various flu strains this year]",
      "source3": ""
    },
    {
      "headline": "Man Found Dead on Building, Covered in “Red Stuff”",
      "is_true": true,
      "expected_readers": 50,
      "source1": "[police report about a man stabbed in a robbery]",
      "source2": "",
      "source3": ""
    },
    {
      "headline": "Nastle Files for Chapter 13 Bankruptcy",
      "is_true": false,
      "expected_readers": 300,
      "source1": "Quote from Nastle insider: 'yeah back a few years ago we considered bankrupcy, after all those investigations'",
      "source2": "",
      "source3": ""
    },
    {
      "headline": "Vampire Weekend Names Their Third-Born Son Lucifer",
      "is_true": true,
      "expected_readers": 60,
      "source1": "[social media post from Vampire Weekend announcing the birth of their son, Lucifer]",
      "source2": "",
      "source3": ""
    },
    {
      "headline": "Government to Arrest Everyone on September 2",
      "is_true": false,
      "expected_readers": 350,
      "source1": "[anonymous social media post claiming the government wants to arrest everyone]",
      "source2": "[cult leader announces the end on September 2nd]",
      "source3": ""
    },
    {
      "headline": "Man From Hit Movie Steals the Constitution of Keneland",
      "is_true": "misleading",
      "expected_readers": 140,
      "source1": "[advertisement from upcoming movie, Let's Steal Keneland]",
      "source2": "",
      "source3": ""
    },
    {
      "headline": "New Movie About Stealing the Consitution of Keneland Entering Production",
      "is_true": true,
      "expected_readers": 40,
      "source1": "[advertisement from upcoming movie, Let's Steal Keneland]",
      "source2": "",
      "source3": ""
    },
    {
      "headline": "The Vetan Globe Under Fire for Posting Fake Info Online",
      "is_true": true,
      "expected_readers": 90,
      "source1": "[Vetan Globe story claiming xyz cheated on their wife]",
      "source2": "[Defamation Lawsuit: XYZ vs Vetan Globe]",
      "source3": "Quote from xyz's wife: 'There has never been any infidelity'"
    },
    {
      "headline": "A Myserious Object Seen Flying Over Rural Zerthania",
      "is_true": "misleading",
      "expected_readers": 100,
      "source1": "[phone footage of blurry object in the sky]",
      "source2": "[announcement from airlines about starting new Zerthanian routes]",
      "source3": ""
    },
    {
      "headline": "New Plane Routes Begin over Zerthania",
      "is_true": true,
      "expected_readers": 30,
      "source1": "[announcement from airlines about starting new Zerthanian routes]",
      "source2": "",
      "source3": ""
    },
    {
      "headline": "Warren Duffett Becomes World’s First Trillionaire",
      "is_true": false,
      "expected_readers": 90,
      "source1": "Quote from economics professor: 'Should these trends continue, I wouldn't be surprised if someone like Duffet eventually got to a trillion dollars'",
      "source2": "",
      "source3": ""
    },
    {
      "headline": "Anonymous Person Steals $1 Million Worth of Ambacoin",
      "is_true": true,
      "expected_readers": 150,
      "source1": "[announcement from Ambacoin about large-scale hack]",
      "source2": "[blockchain records of 48.4324 Ambacoins transferred to new wallet]",
      "source3": "[announcement from Ambacoin that the price has surpassed $20k]"
    },
    {
      "headline": "World Population to Quadruple by 2037",
      "is_true": false,
      "expected_readers": 400,
      "source1": "[census data showing certain areas experienced 100% population growth]",
      "source2": "",
      "source3": ""
    },
    {
      "headline": "10 Troubling Secrets About Will Gates",
      "is_true": true,
      "expected_readers": 200,
      "source1": "[anonymous internet post detailing information about Gates]",
      "source2": "[PR statement from Gates confirming leaked information]",
      "source3": "[police report detailing the arrest of former Gates employee for leaking company secrets]"
    },
    {
      "headline": "Owner Sells Business for $8 to Employee",
      "is_true": true,
      "expected_readers": 100,
      "source1": "[social media post from employer announcing account mistake]",
      "source2": "[original copy of sale contract showing 'million' scribbled out]",
      "source3": ""
    },
    {
      "headline": "Yellow Fever Terrorizes Zerthania, as Cases Rise 15% Each Day",
      "is_true": true,
      "expected_readers": 130,
      "source1": "[government report announcing 13 more cases of yellow fever]",
      "source2": "[government report announce 10 cases of yellow fever]",
      "source3": ""
    },
    {
      "headline": "Unexplained Phenomenon Causes Livestock to Vanish in Rural Stoland",
      "is_true": "misleading",
      "expected_readers": 150,
      "source1": "[government announcement about new wildlife restoration project]",
      "source2": "[population study of wolves in Stoland shows increasing number of wolves]",
      "source3": ""
    },
    {
      "headline": "Wolves Return to Stoland, Causing Problems for Ranchers",
      "is_true": true,
      "expected_readers": 75,
      "source1": "[government announcement about new wildlife restoration project]",
      "source2": "[population study of wolves in Stoland shows increasing number of wolves]",
      "source3": ""
    },
    {
      "headline": "Mysterious Illness Strikes Antarctic Research Station, Quarantine Initiated",
      "is_true": "misleading",
      "expected_readers": 90,
      "source1": "[social media post of Antarctic researcher announcing they are in bed rest]",
      "source2": "Quote from Antarctic researcher: 'We had no idea that she was allergic. Oops'",
      "source3": ""
    },
    {
      "headline": "Renowned Chef Bankrupt After Being Fined by Strupheeny Republic for Unlicensed Use of Truffles",
      "is_true": true,
      "expected_readers": 150,
      "source1": "[announcement from Strupheeny Republic that truffles are now banned]",
      "source2": "[police records showing arrests of drug traffickers claiming that drugs were just truffles]",
      "source3": "[social media post from chef complaining about Strupheeny Republic laws]"
    },
    {
      "headline": "Study Predicts Volanic Eruption to Destroy the North",
      "is_true": "misleading",
      "expected_readers": 250,
      "source1": "[reports about unusual seismic activity in small part of the Nothern Regions]",
      "source2": "[local government ordinance asking certain citizens to evacuate]",
      "source3": ""
    }
  ]

let used_stories = [];


// user data
let total_score = 0;


export function loadStories() {
    console.log(story_data);
}


export function getStory() {
    if (story_data.length == used_stories.length) {
        used_stories = [];
    }
    let index = Math.round(Math.random() * (story_data.length - 1));
    while (used_stories.some((story_num) => story_num == index)) {   // regenerate if we already have this story
        index = Math.round(Math.random() * story_data.length);
    }
    used_stories.push(index);

    return story_data[index];
}
