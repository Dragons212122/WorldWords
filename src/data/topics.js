export const TOPICS = [
  { id: 'academic', title: 'Academic Excellence', words: '6 WORDS', levels: ['A1', 'C1'], img: '/imgs/academic.jpg', desc: 'Master advanced vocabulary tailored for university-level research and scholarly presentations.' },
  { id: 'business', title: 'Business Communication', words: '6 WORDS', levels: ['B2'], img: '/imgs/business.jpg', desc: 'Master professional terminology for negotiations, meetings, and project management.' },
  { id: 'daily', title: 'Daily Conversations', words: '6 WORDS', levels: ['A2'], img: '/imgs/daily.jpg', desc: 'Common phrases and idioms to help you communicate naturally like a native speaker.' },
  { id: 'research', title: 'Research Methodology', words: '6 WORDS', levels: ['C1'], img: '/imgs/research.jpg', desc: 'Master the terminology of systematic investigation and academic inquiry.' },
  { id: 'critical', title: 'Critical Analysis', words: '6 WORDS', levels: ['B2', 'C1'], img: '/imgs/critical.jpg', desc: 'Essential vocabulary for evaluating complex arguments and synthesizing diverse sources.' },
  { id: 'scientific', title: 'Scientific Writing', words: '6 WORDS', levels: ['C1'], img: '/imgs/scientific.jpg', desc: 'Technical terminology required for drafting precise journal articles and documentation.' }
];

export const WORDS_BY_TOPIC = {
  academic: [
    { term: "Mitigate", pos: "Verb", def: "To make something less severe, serious, or painful.", ex: "Drainage schemes have helped to mitigate the risk of flooding.", trans: "Làm nhẹ bớt, giảm nhẹ mức độ nghiêm trọng." },
    { term: "Paradigm", pos: "Noun", def: "A typical example or pattern of something; a model.", ex: "The new research represents a paradigm shift in our understanding.", trans: "Mô hình, hình mẫu." },
    { term: "Substantiate", pos: "Verb", def: "Provide evidence to support or prove the truth of.", ex: "The findings were substantiated by further analysis.", trans: "Chứng minh, xác minh." },
    { term: "Ephemeral", pos: "Adjective", def: "Lasting for a very short time.", ex: "Fashions are ephemeral.", trans: "Chóng tàn, phù du." },
    { term: "Ebullient", pos: "Adjective", def: "Cheerful and full of energy.", ex: "The ebullient atmosphere at the university gala was contagious.", trans: "Sôi nổi, hăng hái." },
    { term: "Ubiquitous", pos: "Adjective", def: "Present, appearing, or found everywhere.", ex: "Computers are now ubiquitous in modern education environments.", trans: "Có mặt ở khắp nơi." }
  ],
  business: [
    { term: "Pragmatic", pos: "Adjective", def: "Dealing with things sensibly and realistically.", ex: "We need to take a pragmatic approach to the problem.", trans: "Thực tế, thực dụng." },
    { term: "Synergy", pos: "Noun", def: "The combined power of a group of things when they are working together.", ex: "The synergy between the two companies will create more value.", trans: "Sự hợp lực, sức mạnh tổng hợp." },
    { term: "Lucrative", pos: "Adjective", def: "Producing a great deal of profit.", ex: "The software business is a lucrative industry.", trans: "Sinh lợi, có lời." },
    { term: "Negotiate", pos: "Verb", def: "To reach an agreement through discussion.", ex: "The two companies are still negotiating the terms.", trans: "Đàm phán." },
    { term: "Leverage", pos: "Verb", def: "To use something to maximum advantage.", ex: "We should leverage our existing network.", trans: "Tận dụng lợi thế." },
    { term: "Stakes", pos: "Noun", def: "The potential risks or rewards in a given situation.", ex: "The stakes are high in this acquisition.", trans: "Rủi ro hoặc phần thưởng tiềm năng." }
  ],
  daily: [
    { term: "Resilient", pos: "Adjective", def: "Able to withstand or recover quickly from difficult conditions.", ex: "Babies are generally far more resilient than new parents realize.", trans: "Kiên cường, mau phục hồi." },
    { term: "Nostalgia", pos: "Noun", def: "A sentimental longing or wistful affection for the past.", ex: "I was overcome with acute nostalgia for my days in college.", trans: "Sự hoài niệm." },
    { term: "Serendipity", pos: "Noun", def: "The occurrence and development of events by chance in a happy or beneficial way.", ex: "A fortunate stroke of serendipity.", trans: "Sự tình cờ may mắn." },
    { term: "Catch up", pos: "Phrasal Verb", def: "To talk to someone you haven't seen for a while.", ex: "Let's grab a coffee and catch up!", trans: "Trò chuyện sau một thời gian." },
    { term: "Break the ice", pos: "Idiom", def: "To say or do something that makes people feel more relaxed.", ex: "He told a joke to break the ice.", trans: "Phá vỡ sự ngượng ngùng." },
    { term: "Hang out", pos: "Phrasal Verb", def: "To spend time relaxing.", ex: "We usually hang out at the park on weekends.", trans: "Đi chơi, thư giãn." }
  ],
  research: [
    { term: "Empirical", pos: "Adjective", def: "Based on observation or experience rather than theory.", ex: "They provided empirical evidence for their claims.", trans: "Thực nghiệm." },
    { term: "Qualitative", pos: "Adjective", def: "Relating to, measuring, or measured by the quality of something.", ex: "The study used qualitative interviews.", trans: "Định tính." },
    { term: "Methodology", pos: "Noun", def: "A system of methods used in a particular area of study.", ex: "The methodology was clearly outlined in the paper.", trans: "Phương pháp luận." },
    { term: "Correlation", pos: "Noun", def: "A mutual relationship or connection between two or more things.", ex: "There is a strong correlation between these two variables.", trans: "Sự tương quan." },
    { term: "Peer-reviewed", pos: "Adjective", def: "Evaluated by experts in the same field before publication.", ex: "The results were published in a peer-reviewed journal.", trans: "Được bình duyệt." },
    { term: "Quantitative", pos: "Adjective", def: "Relating to, measuring, or measured by the quantity of something.", ex: "The researchers gathered extensive quantitative data.", trans: "Định lượng." }
  ],
  critical: [
    { term: "Objective", pos: "Adjective", def: "Not influenced by personal feelings or opinions in considering facts.", ex: "The report provided an objective analysis.", trans: "Khách quan." },
    { term: "Inference", pos: "Noun", def: "A conclusion reached on the basis of evidence and reasoning.", ex: "What inference can we draw from these facts?", trans: "Sự suy luận." },
    { term: "Synthesize", pos: "Verb", def: "Combine (a number of things) into a coherent whole.", ex: "Pupils should synthesize the data they have gathered.", trans: "Tổng hợp." },
    { term: "Subjective", pos: "Adjective", def: "Based on or influenced by personal feelings, tastes, or opinions.", ex: "Art criticism is highly subjective.", trans: "Chủ quan." },
    { term: "Bias", pos: "Noun", def: "Prejudice in favor of or against one thing, person, or group.", ex: "The study was criticized for its inherent bias.", trans: "Sự thiên vị." },
    { term: "Scrutinize", pos: "Verb", def: "Examine or inspect closely and thoroughly.", ex: "Customers were warned to scrutinize the small print.", trans: "Xem xét kỹ lưỡng." }
  ],
  scientific: [
    { term: "Hypothesis", pos: "Noun", def: "A proposed explanation made on the basis of limited evidence.", ex: "The researchers tested their hypothesis in the lab.", trans: "Giả thuyết." },
    { term: "Catalyst", pos: "Noun", def: "A substance that increases the rate of a chemical reaction.", ex: "Chlorine acts as a catalyst promoting the breakdown of ozone.", trans: "Chất xúc tác." },
    { term: "Variables", pos: "Noun", def: "An element, feature, or factor that is liable to vary or change.", ex: "There are too many variables in the experiment to predict the result.", trans: "Biến số." },
    { term: "Replicate", pos: "Verb", def: "Make an exact copy of; reproduce.", ex: "They failed to replicate the original experimental findings.", trans: "Tái tạo, sao chép." },
    { term: "Control group", pos: "Noun", def: "The group in an experiment or study that does not receive treatment.", ex: "The control group received a placebo instead of the drug.", trans: "Nhóm đối chứng." },
    { term: "Anomaly", pos: "Noun", def: "Something that deviates from what is standard, normal, or expected.", ex: "There was a significant anomaly in the test results.", trans: "Sự dị thường." }
  ]
};
