export const khazanaCategories = [
  { id: "funny", label: "Viral Funny Scripts", emoji: "🔥" },
  { id: "love", label: "Love & Dating Twists", emoji: "💕" },
  { id: "friendzone", label: "Friendzone & Bro-zone Tales", emoji: "💔" },
  { id: "daily", label: "Daily Relatable Memes & Jokes", emoji: "🤣" },
] as const;

export type KhazanaCategory = (typeof khazanaCategories)[number]["id"];
type Scenario = { category: KhazanaCategory; title: string; hooks: string[]; twists: string[]; punchlines: string[] };
export type ViralScript = { id: string; title: string; hook: string; twist: string; punchline: string };

// Variations stay inside one scenario: unrelated setups and endings are never mixed.
const scenarios: Scenario[] = [
  {
    category: "funny", title: "Mummy's secret influencer account",
    hooks: [
      '[Camera close-up] Bhai, mummy ne mera phone chheen liya: "Poora din reels!" Main emotional ho gaya. Socha aaj finally meri digital detox ki shuruaat hai.',
      '[Whisper to camera] Mummy boli, "Phone do, tumhari internet ki aadat chhudaani hai." Maine socha family intervention hai. Background mein dramatic music bhi baja diya.',
      '[Enter with empty hands] Mummy ne kaha, "Is ghar mein ab reels band!" Maine phone surrender kiya. Papa ne taali bajayi. Main apni farewell speech taiyaar karne laga.',
    ],
    twists: [
      '[Cut to kitchen] Das minute baad mummy ring light ke saamne: "Aaj banayenge viral paneer!" Papa reflector pakad rahe hain. Mujhe camera operator ki unpaid job mil gayi.',
      '[Peek through door] Mummy mere phone pe cooking reel shoot kar rahi hain. Papa third take mein bhi namak galat time daal rahe hain. Director mummy full angry mode.',
    ],
    punchlines: [
      '[Deadpan] Maine kaha, "Meri addiction?" Mummy boli, "Beta, teri reels time waste hain. Meri reels family business." Ab pocket money bhi views ke hisaab se milegi!',
      '[Look into lens] Phone wapas maanga toh mummy boli, "Pehle like, share, subscribe." Bachpan mein pair chhoota tha. Ab ghar mein entry ke liye notification bell dabata hoon.',
      '[Freeze, then zoom] Mummy ke pehle video pe lakh views. Mere pe baarah. Unmein bhi mummy ke chaar accounts. Ghar ki daant ab officially sponsored content hai!',
    ],
  },
  {
    category: "funny", title: "The interview plot twist",
    hooks: [
      '[Straighten imaginary tie] Interviewer bola, "Apni biggest strength batao." Maine confidence se kaha, "Pressure mein kaam karta hoon." Mujhe laga ab offer letter seedha haath mein aayega.',
      '[Serious office face] Job interview mein maine bola, "Main pressure handle kar sakta hoon." HR impressed. Main mentally first salary se naya phone bhi khareed chuka tha.',
      '[Walk toward camera] Interview ke liye teen motivational reels dekhi. HR ne strength poochhi. Maine bola, "Pressure mera best friend hai." Background mein imaginary applause shuru ho gaya.',
    ],
    twists: [
      '[Switch to HR voice] HR bola, "Great! Salary late, deadline early, weekends working." Main hans diya. Woh nahi hansa. Room mein sirf AC aur meri hopes thandi ho rahi thi.',
      '[Smile slowly disappears] HR ne bola, "Perfect. Team mein sirf tum hoge. Kaam paanch logon ka." Maine poochha, "Training?" Bola, "Pressure hi tumhara trainer hoga."',
    ],
    punchlines: [
      '[Stand up carefully] Maine kaha, "Sir, pressure mein kaam karta hoon, pressure cooker mein nahi." Offer letter se pehle exit door ko accept kar liya. Immediate joining: ghar.',
      '[Call home] Mummy ko bola, "Job mil gayi... bhaagne ki." HR ne notice period poochha. Maine kaha, "Aapne jo red flags diye, unka notice already le liya."',
      '[Deadpan camera look] HR bola, "We are a family." Maine kaha, "Meri existing family already bina salary ke kaam karwaati hai. Same role ke liye transfer kyun loon?"',
    ],
  },
  {
    category: "funny", title: "Gym membership, premium guilt",
    hooks: [
      '[Flex confidently] Gym ki annual membership li. Trainer bola, "Transformation pakka." Maine before photo kheench li. Itna confidence tha ki after photo ke liye shirt bhi order kar di.',
      '[Hold imaginary receipt] Bhai, iss baar fitness serious hai. Annual gym fees advance. Protein shaker ready. Maine doston ko bola, "Agli baar milunga toh pehchaan nahi paaoge."',
      '[Dramatic mirror stare] Monday se new me! Gym mein entry maari, motivational music chalaaya. Trainer ne poochha, "Goal?" Maine kaha, "Teen mahine mein complete transformation, boss."',
    ],
    twists: [
      '[Three months later] Trainer ne progress photo maangi. Maine wahi photo bheji, bas brightness badha di. Woh bola, "Body same kyun?" Maine kaha, "Consistency dekh rahe ho?"',
      '[Cut to sofa] Teen mahine baad gym ka call: "Sir, aap zinda hain?" Maine kaha, "Haan." Bola, "Aapki attendance dekh ke humne dumbbells pe condolence ribbon laga diya."',
    ],
    punchlines: [
      '[Look down at wallet] Transformation hua hai, bhai. Body same, bank balance skinny. Gym ne six-pack nahi diya, twelve-month guilt subscription diya. Renewal reminder mein bhi muscle hai!',
      '[Hold shaker like trophy] Trainer bola, "Kuch toh lose kiya?" Maine kaha, "Paise, confidence aur gym card." Shaker mein ab chai peeta hoon. Bulking with biscuits, naturally.',
      '[Point at phone] Ab gym ke paas se auto bhi nikaalta hoon toh phone silent kar deta hoon. Trainer se nahi, apne annual commitment se chhup raha hoon.',
    ],
  },
  {
    category: "funny", title: "The OTP family emergency",
    hooks: [
      '[Answer frantic call] Papa ka call: "Beta, turant ghar aa!" Main darr gaya. Shoes pehne, cab book ki, office se emergency leave li. Dil mein full thriller soundtrack.',
      '[Run in place] Family group mein papa ka message: "Emergency. Sab online aao." Maine socha serious situation hai. Cousins bhi aa gaye. Ek toh video call pe ro bhi diya.',
      '[Whisper urgently] Papa ne teen missed calls kiye. Fourth pe bole, "Life ka important matter hai." Main meeting chhod ke nikla. Boss ko bola, "Family needs me."',
    ],
    twists: [
      '[Become dad] Papa bole, "TV pe OTP aaya hai, kahan daalna hai?" Maine kaha, "Screen pe box mein." Bole, "TV pe pen se?" Mera soul buffering karne laga.',
      '[Cut to living room] Ghar aaya toh papa remote leke baithe: "Streaming login karwa." OTP expire. Naya OTP. Phir expire. Main beta kam, resend button zyaada tha.',
    ],
    punchlines: [
      '[Deadpan] Login hua toh papa bole, "Ab jaa, privacy chahiye." Jis ghar mein meri privacy zero thi, usmein OTP daal ke guest ban gaya. Tech support ka sanskaari version!',
      '[Look into camera] Papa ne family group mein likha, "Beta finally kaam aaya." Meri degree, promotion, sab cancel. Career highlight: chhe digits successfully type kiye.',
      '[Phone rings again] Office lautte hi papa ka call: "Logout ho gaya." Maine HR se poochha, "Family emergency ka monthly pass milta hai?" Papa ne background mein bola, "Premium lena!"',
    ],
  },
  {
    category: "funny", title: "The ₹99 shopping trap",
    hooks: [
      '[Excited phone stare] Online shirt sirf ninyanve rupaye! Maine socha universe finally mere budget ke saath hai. Cart mein daali, apne fashion comeback ka announcement bhi kar diya.',
      '[Show imaginary bargain] Bhai, ₹99 mein premium shirt mili. Product photo mein model foreign trip pe tha. Main bhi mentally airport pahunch gaya. Bas payment karni thi.',
      '[Lean toward camera] Sale notification aayi: "Luxury under ₹99." Maine kaha, "Aaj rich dikhenge." Shirt select, size select, mirror selfie ka caption tak taiyaar kar liya.',
    ],
    twists: [
      '[Read bill slowly] Checkout pe delivery ₹149, handling ₹49, platform fee ₹29. Shirt se zyaada toh usko ghar laane ki izzat mehengi thi. Total dekh ke aankh twitch hui.',
      '[Pause mid-click] Free shipping ke liye ₹999 shopping chahiye. Ek shirt lene gaya tha. App ne bola, "Saath mein nau aur lo." Discount ne mujhe wholesale dealer bana diya.',
    ],
    punchlines: [
      '[Close phone] Maine cart abandon kiya. App bola, "You forgot something!" Maine kaha, "Haan, apni aukaat." Ab purani shirt ko limited-edition vintage bolke pehen raha hoon.',
      '[Proud pose] Order cancel. Mummy boli, "Paise bacha liye?" Maine kaha, "Nahi, fashion industry ko notice de diya." Ab wardrobe wahi hai, bas uska attitude premium hai.',
      '[Zoom in] Model shirt mein foreign trip kar raha tha. Main uski delivery fee mein local trip bhi nahi kar sakta. ₹99 ka sapna, checkout pe financial horror film!',
    ],
  },
  {
    category: "love", title: "The perfect date, split edition",
    hooks: ['[Romantic smile] Date pe woh boli, "Mujhe simple ladke pasand hain." Maine fancy restaurant cancel kiya. Socha personality win karegi. Dil ne background mein violin budget approve kar diya.', '[Adjust collar] Crush ne kaha, "Expensive gifts nahi, effort chahiye." Main handwritten letter aur ek rose le gaya. Aaj laga meri middle-class love story finally green signal pe hai.', '[Soft camera voice] Usne bola, "Bas genuine hona, show-off nahi." Main simple date plan karke aaya. Phone silent, full attention. Apne dimaag mein couple username bhi reserve kar liya.'],
    twists: ['[Switch voice] Woh boli, "Simple matlab minimal luxury." Menu khula. Coffee ka price dekh ke meri heartbeat romantic se medical ho gayi. Maine waiter se paani ki EMI poochh li.', '[Glance at menu] Usne "light snack" order kiya. Bill heavy nikla. Main smile kar raha tha, calculator bhi. Mere budget ko pehli baar date pe third wheel banna pada.'],
    punchlines: ['[Careful smile] Maine bola, "Bill split?" Woh boli, "Tum practical ho." Romance ka pata nahi, lekin finance compatibility confirm. Pehli date ka successful match: do UPI payments.', '[Stare at rose] Rose ₹20 ka tha, dinner ne poora garden khareed liya. Usne poochha, "Phir kab milenge?" Maine kaha, "Next salary season mein, limited slots available."', '[Deadpan] Usne kaha, "Tumhare saath time ka pata nahi chala." Maine kaha, "Mere saath balance ka bhi nahi." Date achhi thi. Bank account ko closure chahiye.'],
  },
  {
    category: "love", title: "Typing… the suspense thriller",
    hooks: ['[Phone close-up gesture] Crush ne message kiya, "Ek baat kehni hai." Phir typing. Main seedha romantic mode. Dost ko bola, "Bhai, meri single life ka last episode chal raha hai."', '[Sit up suddenly] Raat ke baarah baje crush ka text: "Are you awake?" Main toh so raha tha, par reply kiya, "Bas tumhare message ka wait." Acting Oscar level.', '[Whisper] Crush boli, "Tumse ek personal baat karni hai." Maine headphones lagaaye, door lock kiya. Itna suspense ki apni life mein interval announcement karne ka mann hua.'],
    twists: ['[Watch invisible dots] Paanch minute typing chali. Maine profile photo badli, hairstyle set ki. Message aaya: "Tumhare dost ka naam kya hai?" Romantic background score ne resignation de diya.', '[Smile drops] Message aaya: "Tumhara woh cute friend single hai?" Main phone pakad ke baitha raha. Mere dil se pehle mere drafted love confession ka crash hua.'],
    punchlines: ['[Customer-service voice] Maine reply kiya, "For this enquiry, press one." Love story ka hero banna tha. Relationship helpdesk ban gaya. Ab referral commission toh milna chahiye!', '[Turn to camera] Dost ne poochha, "Kya scene?" Maine kaha, "Teri casting ho gayi. Main production assistant." Mere dil ki film mein main hi end credits mein hoon.', '[Fake cheerful smile] Maine dono ko introduce karwa diya. Woh boli, "You are the best!" Haan, best supporting actor. Award mein chocolate mili. Couple discount unko.'],
  },
  {
    category: "love", title: "The relationship soft launch",
    hooks: ['[Excited whisper] Usne bola, "Hum relationship private rakhenge." Maine kaha, "Bilkul." Socha mature love hai. Story mein sirf do coffee cups daale. Internet detectives active ho gaye.', '[Hold imaginary camera] Pehli couple story: faces nahi, bas shoes. Private relationship, aesthetic vibes. Maine caption likha, "Something special." Do minute mein family group ka notification aaya.', '[Dreamy smile] Usne kaha, "No public drama, just us." Maine romantic dinner ki blurry photo daali. Secret relationship launch tha. Mere chacha ne blurry photo bhi zoom kar li.'],
    twists: ['[Read notifications] Mummy ne cup pe reflection dekh liya. Cousin ne shoes identify kiye. Chachi ne restaurant bata diya. Privacy settings se tez toh family investigation team nikli.', '[Become auntie] Family group mein kisi ne likha, "Do cups kyun?" Kisi ne table number bheja. Main explain karne laga. Tab mummy boli, "Beta, hum bhi young the."'],
    punchlines: ['[Surrender gesture] Private relationship thi. Ab family ke paas location, timeline aur wedding moodboard hai. Soft launch kiya tha, rishtedaaron ne press conference kar di!', '[Look at phone] Usne poochha, "Kisi ko pata toh nahi?" Maine kaha, "Bas woh log jo shaadi mein aayenge." Privacy maintained: catering wale abhi unaware hain.', '[Deadpan] Agli story mein ek hi cup daala. Mummy boli, "Ladai ho gayi?" Ab coffee nahi pee raha, relationship status ka live broadcast chala raha hoon.'],
  },
  {
    category: "friendzone", title: "Emergency contact, not boyfriend",
    hooks: ['[Hopeful smile] Woh boli, "Tum meri life ke sabse important insaan ho." Maine dil mein wedding playlist khol li. Itne saal ki friendship ko finally promotion milne wala tha.', '[Lean in] Usne raat ko call karke kaha, "Tumhare bina kya karti?" Main emotional. Socha ab love confession aayega. Apni voice ko unnecessarily deep bhi kar liya.', '[Fix hair] Crush ne bola, "Tum hamesha mere liye available hote ho." Maine kaha, "Always." Dimaag mein boyfriend badge unlock hua. Reality ne abhi loading screen bhi nahi dikhayi thi.'],
    twists: ['[Switch to her voice] Woh boli, "Mere boyfriend se fight hui, use samjha do." Main freeze. Important insaan matlab relationship customer care. Uska pyaar, mera night shift.', '[Stare at phone] Usne kaha, "Tum mere boyfriend ko explain kar sakte ho?" Phir dono conference call pe. Main mediator. Apni feelings mute, unki argument full volume.'],
    punchlines: ['[Formal voice] Maine kaha, "Aapki complaint resolve ho gayi. Please rate your bro." Usne five stars diye. Romance zero, service rating excellent. Dil ka appraisal alag department mein hai.', '[Camera stare] Dono ka patch-up hua. Mujhe thank-you message mila. Couple ko happy ending, mujhe call summary. Main love triangle nahi, triangle ka customer-support number hoon.', '[Pretend invoice] Ab har reconciliation ka invoice banaunga: listening charges, emotional damage tax, late-night surcharge. Friendzone mein rent nahi milta toh consultancy hi sahi.'],
  },
  {
    category: "friendzone", title: "The public bhai announcement",
    hooks: ['[Big smile] Crush ne sabke saamne kaha, "Yeh mere liye bahut special hai." Maine posture seedha kiya. Dost camera nikaalne laga. Main apni love story ka trailer imagine kar raha tha.', '[Walk confidently] Party mein crush ne mera haath pakad ke introduction diya. Main khush. Itni public affection? Aaj toh group chat mein victory speech pakki thi.', '[Whisper] Usne friends se bola, "Iske jaisa koi nahi." Maine andar se shaadi ka venue shortlist kar liya. Bahar humble smile, andar dhol aur band full volume.'],
    twists: ['[Record scratch face] Phir boli, "Yeh mera bhai jaisa hai." Dost ne camera slow-motion pe kar diya. Meri smile wahi rahi, bas soul ne party quietly chhod di.', '[Become crush] Woh boli, "Meet my favourite bro!" Sabne aww kaha. Maine bhi aww kiya. Farq bas itna: unka cute wala, mera internal injury wala.'],
    punchlines: ['[Formal smile] Maine kaha, "Thanks, behen." Uski smile gayi. Bhai title one-way tha kya? Ab dono ka romance cancelled. Equality ka first practical test successful!', '[Deadpan] Ghar aake mummy se bola, "Family expand ho gayi." Mummy khush. Maine kaha, "Bas bahu ki jagah behen mili." Rishta same budget, genre completely different.', '[Look at imaginary camera] Dost bola, "Video delete kar doon?" Maine kaha, "Nahi, portfolio mein daal. Best performance: smiling through a public demotion." Academy, please notice.'],
  },
  {
    category: "friendzone", title: "Boyfriend interview coach",
    hooks: ['[Proud voice] Crush boli, "Tum ladkon ko achhe se samajhte ho." Maine socha finally meri personality ka appreciation. Usne notebook nikali. Main apni achievements batane ko ready ho gaya.', '[Sit upright] Usne kaha, "Tumhari opinion mere liye matter karti hai." Dil khush. Socha relationship decision mein main top candidate. Interview bina application ke mil gaya.', '[Smile at phone] Crush ka message: "Can I ask you something about dating?" Maine kaha, "Of course." Dimaag ne imaginary ring pe EMI options bhi search kar liye.'],
    twists: ['[Read list] Usne teen ladkon ki profiles dikhaayi: "Kaun better boyfriend hoga?" Main shortlist committee nikla. Apna naam list mein dhoonda. Search result: no matches found.', '[Hold clipboard] Usne kaha, "Meri date ka interview le lo." Main us ladke se goals poochh raha tha. Woh confident answers de raha tha. Main apni feelings ko waiting room mein bitha chuka tha.'],
    punchlines: ['[Office voice] Maine kaha, "Selected candidate ko congratulations. Rejected candidate khud main hoon." Crush boli, "You are so helpful!" Haan, unpaid HR with emotional overtime.', '[Deadpan] Uska boyfriend select hua. Mujhe selection process ka thank-you mila. Love story mein vacancy thi. Main applicant nahi, recruitment agency nikla.', '[Put clipboard down] Agli baar boli, "Dating advice?" Maine kaha, "Office hours nine to five." Friendzone permanent hai, par free consultation ka trial expire ho gaya.'],
  },
  {
    category: "daily", title: "Salary's one-day world tour",
    hooks: ['[Dance with phone] Salary credited! Maine phone ko kiss kiya. Socha iss mahine savings, shopping, sab hoga. Account balance dekh ke posture automatically CEO wala ho gaya.', '[Confident entrance] Salary aate hi maine friends ko bola, "Dinner on me." Bank notification abhi warm tha. Main financially responsible adult se generous billionaire ban chuka tha.', '[Hold invisible money] Month end khatam. Salary aa gayi. Maine spreadsheet kholi aur bola, "Ab proper planning." Pehla step: balance ko thoda pyaar se dekhna.'],
    twists: ['[Rapid notification impressions] Rent debit. EMI debit. Electricity debit. Subscription debit. Phone ek minute mein itna baja ki laga paisa nahi, farewell messages aa rahe hain.', '[Read phone] Auto-pay ne bina hello bole entry maari. Rent, bills, subscriptions sab line mein. Salary meri thi, welcome committee poori duniya ki thi.'],
    punchlines: ['[Wave goodbye] Salary tourist hai, bhai. Account mein check-in, selfie, phir checkout. Main bas hotel receptionist hoon. Savings? Guest ne review bhi nahi chhoda.', '[Look at friends] Dinner on me ab revised hai: mere ghar ki chai. Biscuit apne laana. Financial generosity ka software update balance ke saath automatically ho gaya.', '[Deadpan] Bank app boli, "Track your spending." Maine kaha, "Spending ko track karun ya missing salary ki FIR?" Paisa aaya tha. Evidence sirf notification mein bacha hai.'],
  },
  {
    category: "daily", title: "Five more minutes, director's cut",
    hooks: ['[Sleepy voice] Alarm saat baje baja. Maine kaha, "Bas paanch minute." Itna innocent sentence. Socha aankh band karunga, fresh uthunga. Zindagi ne skip-intro button dabaa diya.', '[Reach for alarm] Raat ko promise: kal early morning productive day. Alarm baja toh motivational speech cancel. Maine snooze dabaaya jaise productivity ka free trial extend kar raha hoon.', '[Eyes half closed] Subah alarm ne meri taraf dekha, maine alarm ki taraf. Mutual agreement hua: paanch minute aur. Main kambal mein wapas, future self ko responsibility transfer.'],
    twists: ['[Jump up] Aankh khuli: nau baj gaye. Office ka call. Maine sleepy voice ko network issue bana diya: "Hello... signal..." Boss bola, "Tumhara snooze online dikh raha hai."', '[Stare at clock] Utha toh breakfast lunch ban chuka tha. Mummy boli, "Good afternoon, morning person." Maine phone dekha: seven alarms, zero successful missions.'],
    punchlines: ['[Deadpan] Paanch minute ka nap nahi tha, time travel tha. Alarm clock science hai. Snooze meri superpower. Bas superhero bhi attendance mein late marked hai.', '[Wrap blanket like cape] Aaj productivity ka first task complete: guilt generate kiya. Kal se pakka jaldi uthunga. Yeh statement meri life ka longest-running sequel hai.', '[Look at phone] Ab alarm ka naam "Salary cut" rakha hai. Motivation se nahi utha. Financial horror se seedha bed se launch ho gaya. Personal growth, budget edition.'],
  },
  {
    category: "daily", title: "The family Wi-Fi tribunal",
    hooks: ['[Urgent whisper] Ghar ka Wi-Fi band hua. Pehle laga normal issue hai. Das second baad poora parivaar drawing room mein. Pehli baar sab apni marzi se ek saath baithe.', '[Hold router gesture] Wi-Fi suddenly gaya. Mummy ki recipe ruki, papa ka news ruka, meri reel ruki. Humne ek doosre ko dekha, jaise strangers ka emergency meetup ho.', '[Panic stare] Internet nahi chal raha tha. Maine router restart kiya. Papa aaye, mummy aayi, behen aayi. Itni family attendance birthday pe bhi nahi milti.'],
    twists: ['[Switch voices quickly] Sabne poochha, "Tune kya kiya?" Main router ke paas tha, toh criminal main. Papa bole, "Engineering padhi hai na?" Ab degree ki final exam drawing room mein.', '[Point at imaginary jury] Mummy boli, "Phone kam chala." Papa bole, "Router khol." Behen boli, "Mera data recharge kar." Wi-Fi gaya, meri reputation aur wallet dono danger mein.'],
    punchlines: ['[Slow blink] Bill unpaid tha. Papa quietly UPI kar rahe the. Maine kaha, "Engineer innocent." Papa bole, "Family mein investigation nahi karte." Truth connected, justice disconnected.', '[Celebrate router lights] Bill pay hua, internet aaya. Sab rooms mein gayab. Family bonding ki total duration: chaar minute. Agli meeting scheduled at next payment failure.', '[Deadpan] Wi-Fi connect hote hi papa bole, "Dekha, mere restart se hua." Payment notification unke phone pe chamak raha tha. Technical credit bhi ghar mein seniority se milta hai.'],
  },
];

export function scriptsForCategory(category: KhazanaCategory): ViralScript[] {
  return scenarios.filter((scenario) => scenario.category === category).flatMap((scenario, scenarioIndex) =>
    scenario.hooks.flatMap((hook, h) => scenario.twists.flatMap((twist, t) => scenario.punchlines.map((punchline, p) => ({
      id: `${category}-${scenarioIndex}-${h}-${t}-${p}`, title: scenario.title, hook, twist, punchline,
    })))),
  );
}

export function shuffledScripts(category: KhazanaCategory, day: string, cycle = 0): ViralScript[] {
  const scripts = scriptsForCategory(category);
  let seed = 2166136261;
  for (const char of `${category}:${day}:${cycle}`) seed = Math.imul(seed ^ char.charCodeAt(0), 16777619) >>> 0;
  const random = () => { seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0; return seed / 4294967296; };
  // Shuffle scenario groups first and round-robin them to avoid same-topic clusters.
  const groups = [...new Set(scripts.map((script) => script.title))].map((title) => scripts.filter((script) => script.title === title));
  const shuffle = <T,>(items: T[]) => {
    for (let i = items.length - 1; i > 0; i--) {
      const j = Math.floor(random() * (i + 1));
      const a = items[i]; const b = items[j];
      if (a !== undefined && b !== undefined) { items[i] = b; items[j] = a; }
    }
  };
  groups.forEach(shuffle); shuffle(groups);
  return Array.from({ length: 18 }, (_, index) => groups.flatMap((group) => group[index] ? [group[index]] : [])).flat();
}

export function scriptText(script: ViralScript): string {
  return `${script.title}\n\nHook (0–10s)\n${script.hook}\n\nTwist (10–20s)\n${script.twist}\n\nPunchline (20–30s)\n${script.punchline}`;
}

export function localDay(date = new Date()): string {
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
}