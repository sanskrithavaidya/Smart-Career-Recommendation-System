// ======================== STARS ========================
(function(){
  const s=document.getElementById('stars');
  for(let i=0;i<120;i++){
    const d=document.createElement('div');
    d.className='star';
    d.style.cssText=`left:${Math.random()*100}%;top:${Math.random()*100}%;--d:${2+Math.random()*4}s;--delay:${Math.random()*5}s;--op:${0.3+Math.random()*0.7}`;
    s.appendChild(d);
  }
})();

// ======================== STATE ========================
let state={
  name:'',age:'',level:'',stream:'',overall:0,
  interests:[],skills:[],abroad:3,salary:3,
  goal:'',env:'',finance:''
};

const INTEREST_OPTIONS=['Mathematics','Physics','Chemistry','Biology','Computer Science','Electronics','Economics','Accounts','History','Geography','Political Science','Psychology','Sociology','English Literature','Art & Design','Music','Sports & Fitness','Law & Justice','Agriculture','Architecture'];
const SKILL_OPTIONS=['Problem Solving','Coding / Programming','Writing & Communication','Drawing / Designing','Leadership','Research & Analysis','Helping People','Public Speaking','Numbers & Data','Creativity','Critical Thinking','Teamwork','Management','Medical/Healthcare'];

// ======================== INIT CHIPS ========================
function initChips(){
  const ic=document.getElementById('interestChips');
  ic.innerHTML=INTEREST_OPTIONS.map(i=>`<div class="chip" onclick="toggleChip(this,'interests','${i}')">${i}</div>`).join('');
  const sc=document.getElementById('skillChips');
  sc.innerHTML=SKILL_OPTIONS.map(s=>`<div class="chip" onclick="toggleChip(this,'skills','${s}')">${s}</div>`).join('');
}
initChips();

function toggleChip(el,key,val){
  el.classList.toggle('selected');
  if(!state[key])state[key]=[];
  const idx=state[key].indexOf(val);
  if(idx>-1)state[key].splice(idx,1);
  else state[key].push(val);
}
function selectSingle(el,key,val){
  el.closest('.chips-grid').querySelectorAll('.chip').forEach(c=>c.classList.remove('selected'));
  el.classList.add('selected');
  state[key]=val;
}

// ======================== LEVEL CONTEXT ========================
function updateLevelContext(){
  const level=document.getElementById('s1Level').value;
  const streamRow=document.getElementById('streamRow');
  streamRow.style.display=level&&level!=='10th'?'grid':'none';
  buildMarksGrid(level);
}
function buildMarksGrid(level){
  const grid=document.getElementById('marksGrid');
  let subjects=[];
  if(level==='10th') subjects=['Mathematics','Science','English','Social Studies','Hindi/Lang'];
  else if(level==='12th'){subjects=['Mathematics/Biology','Physics','Chemistry','English','Optional'];}
  else if(level==='graduation') subjects=['Core Subject 1','Core Subject 2','Core Subject 3','Core Subject 4','Project/Thesis'];
  else if(level==='postgrad') subjects=['Specialization 1','Specialization 2','Research','Elective','Dissertation'];
  grid.innerHTML=subjects.map((s,i)=>`<div class="mark-item"><label>${s}</label><input type="number" id="mark${i}" placeholder="%" min="0" max="100" class="mark-input"/></div>`).join('');
}

// ======================== NAVIGATION ========================
function startApp(){
  document.getElementById('hero').style.display='none';
  var appEl=document.getElementById('app');
  if(appEl&&appEl.scrollIntoView){appEl.scrollIntoView({behavior:'smooth'});}
  showStep(1);
}
function showStep(n){
  document.querySelectorAll('.card').forEach(c=>c.classList.remove('active'));
  document.getElementById('step'+n)?.classList.add('active');
  document.getElementById('results').style.display='none';
  document.getElementById('progressWrap').style.display='block';
  const pct=[25,50,75,100][n-1];
  document.getElementById('progressFill').style.width=pct+'%';
  document.getElementById('progressLabel').textContent=`Step ${n} of 4`;
  buildDots(n);
  window.scrollTo({top:0,behavior:'smooth'});
}
function buildDots(active){
  const c=document.getElementById('stepDots');
  c.innerHTML=[1,2,3,4].map(i=>`<div class="step-dot ${i<active?'done':''} ${i===active?'active':''}"></div>`).join('');
}
function goStep(n){

    // Step 1 Validation
    if(n === 2){

        let name = document.getElementById('s1Name').value.trim();
        let age = document.getElementById('s1Age').value;
        let level = document.getElementById('s1Level').value;

        if(name === ""){
            alert("Please enter your name");
            return;
        }

        if(age === ""){
            alert("Please enter your age");
            return;
        }

        if(level === ""){
            alert("Please select your education level");
            return;
        }
    }

    // Step 2 Validation
    if(n === 3){

        let overall = document.getElementById('s2Overall').value;

        if(overall === ""){
            alert("Please enter your Overall Percentage");
            return;
        }
    }

    // Step 3 Validation
    if(n === 4){

        if(state.interests.length === 0){
            alert("Select at least one Interest");
            return;
        }

        if(state.skills.length === 0){
            alert("Select at least one Skill");
            return;
        }
    }

    collectStep(n-1);
    showStep(n);
}

function collectStep(from){
  if(from===1){
    state.name=document.getElementById('s1Name').value||'Student';
    state.age=document.getElementById('s1Age').value;
    state.level=document.getElementById('s1Level').value;
    state.stream=document.getElementById('s1Stream')?.value||'';
  }
  if(from===2){
    state.overall=parseFloat(document.getElementById('s2Overall').value)||0;
    state.board=document.getElementById('s2Board').value;
    state.marks=[];
    document.querySelectorAll('.mark-input').forEach(inp=>state.marks.push(parseFloat(inp.value)||0));
  }
  if(from===3){
    state.abroad=parseInt(document.getElementById('s3Abroad').value);
    state.salary=parseInt(document.getElementById('s3Salary').value);
  }
  if(from===4){
    state.goal=document.getElementById('s4Goal').value;
  }
}

// ======================== RECOMMENDATION ENGINE ========================
const CAREER_DATA={
  '10th':[
    {id:'science_stream',name:'Science Stream (PCM)',icon:'🔬',duration:'2 years',desc:'Best for students strong in Maths & Science. Opens doors to Engineering, Technology, and Research.',tags:['IIT-JEE','NEET','Engineering','Technology'],conditions:{minMarks:60,interests:['Mathematics','Physics','Chemistry','Computer Science'],goal:['higher_study','job','abroad']},matchBase:70},
    {id:'science_bio',name:'Science Stream (PCB)',icon:'🧬',duration:'2 years',desc:'Ideal for aspiring doctors, pharmacists, and biotechnology professionals.',tags:['NEET','MBBS','Pharmacy','Biotechnology'],conditions:{minMarks:55,interests:['Biology','Chemistry','Medical/Healthcare'],goal:['higher_study','job']},matchBase:70},
    {id:'commerce',name:'Commerce Stream',icon:'📊',duration:'2 years',desc:'Perfect for future accountants, business analysts, bankers, and entrepreneurs.',tags:['CA','MBA','Banking','Finance'],conditions:{minMarks:50,interests:['Mathematics','Economics','Accounts'],goal:['business','job','higher_study']},matchBase:65},
    {id:'arts',name:'Arts / Humanities',icon:'🎨',duration:'2 years',desc:'Explore history, literature, psychology, and prepare for UPSC, law, journalism.',tags:['UPSC','Journalism','Law','Psychology'],conditions:{minMarks:40,interests:['History','Political Science','English Literature','Art & Design'],goal:['govt','creative','higher_study']},matchBase:65},
    {id:'vocational',name:'Vocational / Diploma',icon:'🔧',duration:'1-2 years',desc:'Fast-track skill-based courses: ITI, Polytechnic. Best for quick employment.',tags:['ITI','Polytechnic','Skill India','Trade'],conditions:{minMarks:35,goal:['job'],finance:['low','medium']},matchBase:60},
  ],
  '12th':[
    {id:'btech',name:'B.Tech / B.E.',icon:'⚙️',duration:'4 years',desc:'Top engineering degree. Opens doors to top tech companies, startups, and research.',tags:['IIT','NIT','JEE Advanced','Software','Core Engineering'],conditions:{minMarks:70,stream:['science_pcm','science_pcmb'],interests:['Mathematics','Physics','Computer Science','Electronics'],goal:['job','higher_study','abroad']},matchBase:75},
    {id:'mbbs',name:'MBBS / Medicine',icon:'🩺',duration:'5.5 years',desc:'Become a doctor. Requires NEET qualification. High dedication but highly rewarding.',tags:['NEET','Doctor','AIIMS','Medical'],conditions:{minMarks:75,stream:['science_pcb','science_pcmb'],interests:['Biology','Medical/Healthcare'],goal:['higher_study','job']},matchBase:80},
    {id:'bsc',name:'B.Sc (Science)',icon:'🧪',duration:'3 years',desc:'Study pure or applied sciences — Physics, Chemistry, Biology, Computer Science, Math.',tags:['Research','M.Sc','Teaching','Lab Science'],conditions:{minMarks:55,stream:['science_pcm','science_pcb','science_pcmb'],interests:['Physics','Chemistry','Biology','Mathematics'],goal:['higher_study','teaching']},matchBase:65},
    {id:'bca',name:'BCA / B.Sc CS',icon:'💻',duration:'3 years',desc:'Computer applications & software development. Great for IT sector roles.',tags:['IT Jobs','Programming','MCA','App Dev'],conditions:{minMarks:55,interests:['Computer Science','Coding / Programming'],goal:['job','higher_study']},matchBase:70},
    {id:'bba',name:'BBA / BBM',icon:'🏢',duration:'3 years',desc:'Foundation for MBA. Learn management, marketing, finance, and entrepreneurship.',tags:['MBA','Management','Marketing','Business'],conditions:{minMarks:50,stream:['commerce'],interests:['Economics','Accounts','Leadership'],goal:['business','job','higher_study']},matchBase:65},
    {id:'bcom',name:'B.Com / B.Com(H)',icon:'💰',duration:'3 years',desc:'Commerce degree for banking, accounting, finance, and CA pathway.',tags:['CA','CMA','Banking','Accounts'],conditions:{minMarks:50,stream:['commerce'],interests:['Mathematics','Accounts','Economics'],goal:['job','higher_study']},matchBase:65},
    {id:'ba',name:'BA / Humanities Degree',icon:'📖',duration:'3 years',desc:'Study history, political science, sociology, psychology, literature. UPSC and law prep.',tags:['UPSC','Journalism','Social Work','Education'],conditions:{minMarks:45,stream:['arts'],interests:['History','Political Science','English Literature','Psychology','Sociology'],goal:['govt','creative','higher_study']},matchBase:60},
    {id:'bdes',name:'B.Des / Fine Arts',icon:'🖼️',duration:'4 years',desc:'Design your future in graphic design, UX, fashion, industrial design, and more.',tags:['NID','NIFT','UX Design','Fashion'],conditions:{minMarks:50,interests:['Art & Design','Creativity','Drawing / Designing'],goal:['creative','job']},matchBase:70},
    {id:'polytechnic',name:'Polytechnic / Diploma Eng.',icon:'🔩',duration:'3 years',desc:'Job-ready engineering diploma. Can join B.Tech via lateral entry.',tags:['Lateral Entry','Technical Jobs','Skilled Engineer'],conditions:{minMarks:40,goal:['job'],finance:['low','medium']},matchBase:55},
    {id:'law_llb',name:'BA LLB / Law',icon:'⚖️',duration:'5 years',desc:'Integrated law degree. Career in courts, companies, civil services, activism.',tags:['Advocate','Corporate Law','UPSC','LLM'],conditions:{minMarks:55,interests:['Law & Justice','Political Science','English Literature'],goal:['job','govt','higher_study']},matchBase:65},
  ],
  'graduation':[
    {id:'mtech',name:'M.Tech / M.E.',icon:'🔬',duration:'2 years',desc:'Advanced engineering. For research, academia, and senior tech roles.',tags:['GATE','IIT','Research','R&D'],conditions:{minMarks:60,stream:['cs_it'],interests:['Computer Science','Mathematics','Problem Solving'],goal:['higher_study','abroad']},matchBase:75},
    {id:'mba',name:'MBA',icon:'📈',duration:'2 years',desc:'Master of Business Administration. For management, consulting, finance, marketing leadership.',tags:['CAT','IIM','Management','Leadership'],conditions:{minMarks:55,interests:['Leadership','Management','Economics'],goal:['business','job','higher_study']},matchBase:75},
    {id:'msc',name:'M.Sc (Science)',icon:'⚗️',duration:'2 years',desc:'Research-focused science masters. Opens PhD and academic career paths.',tags:['CSIR NET','PhD','Research','Teaching'],conditions:{minMarks:55,interests:['Physics','Chemistry','Biology','Mathematics'],goal:['higher_study','teaching']},matchBase:65},
    {id:'mca',name:'MCA',icon:'🖥️',duration:'3 years',desc:'Master of Computer Applications. Entry into IT roles and software development.',tags:['IT Sector','Programming','Software Engineer'],conditions:{minMarks:55,interests:['Computer Science','Coding / Programming'],goal:['job']},matchBase:65},
    {id:'llm',name:'LLM (Law)',icon:'📜',duration:'1-2 years',desc:'Specialised legal education. Corporate law, IPR, international law, judiciary prep.',tags:['Advocate','Judge','Corporate Lawyer','Judiciary'],conditions:{minMarks:50,stream:['law'],interests:['Law & Justice'],goal:['job','higher_study']},matchBase:70},
    {id:'civil_services',name:'UPSC / Civil Services',icon:'🏛️',duration:'1-2 years prep',desc:'IAS, IPS, IFS and other services. Most prestigious govt career path.',tags:['IAS','IPS','UPSC','Governance'],conditions:{minMarks:50,interests:['History','Political Science','Geography','Sociology'],goal:['govt']},matchBase:70},
    {id:'phd',name:'Ph.D / Doctorate',icon:'🎓',duration:'3-5 years',desc:'Research at the highest level. For academics, scientists, domain experts.',tags:['Research','Academia','Scientist','Professor'],conditions:{minMarks:65,interests:['Research & Analysis','Critical Thinking'],goal:['higher_study']},matchBase:70},
    {id:'mba_abroad',name:'MBA Abroad (US/UK)',icon:'✈️',duration:'1-2 years',desc:'Top international MBA programs — Harvard, Wharton, LBS. Expensive but highly rewarding.',tags:['GMAT','Harvard','Global Career','International'],conditions:{minMarks:65,goal:['abroad','higher_study'],abroad:[4,5]},matchBase:75},
    {id:'chartered_acc',name:'CA / CMA / CFA',icon:'💹',duration:'3-5 years',desc:'Professional finance certifications. High earning potential in finance and accounting.',tags:['ICAI','Finance','Audit','Investment Banking'],conditions:{minMarks:55,stream:['bba_bcom'],interests:['Mathematics','Accounts','Numbers & Data'],goal:['job']},matchBase:70},
  ],
  'postgrad':[
    {id:'phd_pg',name:'Ph.D (Specialisation)',icon:'🔭',duration:'3-5 years',desc:'Doctoral research in your field. Become a domain expert, scientist, or professor.',tags:['Research','Scientist','Professor','Innovation'],conditions:{minMarks:60,goal:['higher_study'],interests:['Research & Analysis']},matchBase:75},
    {id:'postdoc',name:'Post-Doctoral Research',icon:'🧫',duration:'1-3 years',desc:'Advanced research after PhD. Usually abroad. For cutting-edge scientific work.',tags:['Academia','Science','International','R&D'],conditions:{minMarks:70,goal:['higher_study','abroad']},matchBase:70},
    {id:'fellowship',name:'Government Fellowship / UPSC',icon:'🏛️',duration:'1-2 years',desc:'IAS, IRS and other elite services. Also UGC/CSIR NET for lectureship.',tags:['IAS','NET','Lecturer','Government'],conditions:{minMarks:55,interests:['Political Science','History','Sociology'],goal:['govt']},matchBase:70},
    {id:'mba_exec',name:'Executive MBA',icon:'👔',duration:'1 year',desc:'For working professionals. Advance to senior management and C-suite roles.',tags:['IIM','Leadership','Senior Management','Corporate'],conditions:{minMarks:55,interests:['Leadership','Management'],goal:['business','job']},matchBase:65},
    {id:'startup_path',name:'Startup / Entrepreneurship',icon:'🚀',duration:'Ongoing',desc:'Build your own company. Apply your expertise to solve real-world problems.',tags:['Founder','Innovation','Funding','Product'],conditions:{minMarks:50,interests:['Creativity','Problem Solving','Leadership'],goal:['business']},matchBase:70},
  ]
};

function scoreCareer(career,s){
  let score=career.matchBase;
  const c=career.conditions;
  // Marks
  if(c.minMarks&&s.overall>=c.minMarks) score+=15;
  else if(c.minMarks&&s.overall>=c.minMarks-10) score+=5;
  else if(c.minMarks&&s.overall<c.minMarks-15) score-=20;
  // Interests
  if(c.interests){
    const overlap=c.interests.filter(i=>s.interests.includes(i)).length;
    score+=overlap*8;
  }
  // Stream match
  if(c.stream&&s.stream){
    if(c.stream.includes(s.stream)) score+=15;
  }
  // Goal
  if(c.goal&&s.goal&&c.goal.includes(s.goal)) score+=12;
  // Abroad
  if(c.abroad&&s.abroad>=4) score+=10;
  // Finance
  if(c.finance&&s.finance&&c.finance.includes(s.finance)) score+=8;
  // Salary pref
  if(s.salary>=4&&['btech','mba','mbbs','mba_abroad','chartered_acc'].includes(career.id)) score+=8;
  // Skill overlap
  const skillMap={
    'btech':['Coding / Programming','Problem Solving','Mathematics'],
    'mba':['Leadership','Management','Public Speaking'],
    'mbbs':['Medical/Healthcare','Helping People','Biology'],
    'bdes':['Drawing / Designing','Creativity','Art & Design'],
    'civil_services':['Writing & Communication','Critical Thinking','Leadership'],
    'phd':['Research & Analysis','Critical Thinking','Writing & Communication'],
    'startup_path':['Creativity','Leadership','Problem Solving'],
  };
  if(skillMap[career.id]){
    const sk=skillMap[career.id].filter(sk=>s.skills.includes(sk)).length;
    score+=sk*5;
  }
  return Math.min(99,Math.max(30,score));
}

function generateResults(){

    collectStep(4);

    let goal = document.getElementById('s4Goal').value;

    if(goal === ""){
        alert("Please select a Career Goal");
        return;
    }

    if(state.env === ""){
        alert("Please select Work Environment");
        return;
    }

    if(state.finance === ""){
        alert("Please select Financial Support option");
        return;
    }

    const level = state.level;
    const careers = CAREER_DATA[level] || [];

    const scored = careers
        .map(c => ({
            ...c,
            score: scoreCareer(c, state)
        }))
        .sort((a,b) => b.score - a.score);

    renderResults(scored);
}

function renderResults(list){
  document.querySelectorAll('.card').forEach(c=>c.classList.remove('active'));
  document.getElementById('progressWrap').style.display='none';
  document.getElementById('results').style.display='block';

  const levelLabel={'10th':'After 10th Class','12th':'After 12th / Intermediate','graduation':'After Graduation','postgrad':'After Post Graduation'};
  document.getElementById('resultsSub').textContent=`Personalised recommendations for ${state.name} — ${levelLabel[state.level]||''}`;

  // Profile Summary
  document.getElementById('profileSummary').innerHTML=`
    <div class="ps-title">Your Profile</div>
    <div class="ps-grid">
      <div class="ps-item"><div class="ps-label">Name</div><div class="ps-val">${state.name}</div></div>
      <div class="ps-item"><div class="ps-label">Level</div><div class="ps-val">${levelLabel[state.level]||state.level}</div></div>
      <div class="ps-item"><div class="ps-label">Overall %</div><div class="ps-val">${state.overall||'N/A'}%</div></div>
      <div class="ps-item"><div class="ps-label">Top Interests</div><div class="ps-val">${state.interests.slice(0,2).join(', ')||'Various'}</div></div>
      <div class="ps-item"><div class="ps-label">Goal</div><div class="ps-val">${state.goal||'Exploring'}</div></div>
      <div class="ps-item"><div class="ps-label">Top Skill</div><div class="ps-val">${state.skills[0]||'Developing'}</div></div>
    </div>`;

  // Results Grid
  const grid=document.getElementById('resultsGrid');
  grid.innerHTML=list.map((c,i)=>{
    const tier=i===0?'top':i<=2?'good':'consider';
    const matchTier=c.score>=80?'high':c.score>=65?'med':'low';
    const matchLabel=c.score>=80?'Strong Match':c.score>=65?'Good Match':'Worth Considering';
    const delay=i*0.1;
    return `<div class="result-card ${tier}" style="animation-delay:${delay}s">
      <div class="rc-icon">${c.icon}</div>
      <div class="rc-match ${matchTier}">${matchLabel} · ${c.score}%</div>
      <div class="rc-name">${c.name}</div>
      <div class="rc-duration">⏱ ${c.duration}</div>
      <div class="rc-desc">${c.desc}</div>
      <div class="rc-tags">${c.tags.map(t=>`<span class="rc-tag">${t}</span>`).join('')}</div>
      <div class="match-bar"><div class="match-fill ${matchTier}" style="width:0%" data-w="${c.score}%"></div></div>
    </div>`;
  }).join('');

  // Animate bars
  setTimeout(()=>document.querySelectorAll('.match-fill').forEach(b=>{b.style.width=b.dataset.w;}),100);

  // Insights
  const top=list[0];
  const insights=buildInsights(top,state);
  document.getElementById('insightsBox').innerHTML=`
    <div class="insights-title">Smart Insights for ${state.name}</div>
    ${insights.map(i=>`<div class="insight-item">${i}</div>`).join('')}`;

  window.scrollTo({top:0,behavior:'smooth'});
}

function buildInsights(top,s){
  const ins=[];
  if(s.overall>=75) ins.push(`With ${s.overall}% marks, you are eligible for top institutions. Start preparing for entrance exams early.`);
  else if(s.overall>=55) ins.push(`Your marks qualify you for most good colleges. Focus on entrance test preparation to improve your options.`);
  else ins.push(`Consider improving your score through re-examination or focus on vocational/practical skill courses.`);
  if(s.interests.includes('Computer Science')||s.skills.includes('Coding / Programming')) ins.push(`Your interest in technology is a big asset. The IT sector in India is growing 12% annually — tech careers offer excellent scope.`);
  if(s.goal==='govt') ins.push(`For government services, start current affairs reading and reasoning practice now. Consistency beats intensity.`);
  if(s.goal==='business') ins.push(`Entrepreneurship path: focus on domain expertise first (technical or management degree), then build your startup with a solid foundation.`);
  if(s.abroad>=4) ins.push(`For studying abroad, prepare for IELTS/TOEFL and GRE/GMAT. Scholarships like Chevening, Fulbright, and DAAD can fund your education.`);
  if(s.finance==='low') ins.push(`Financial support is available — explore SC/ST scholarships, PM scholarship, NSP portal, and bank education loans up to ₹10 lakhs.`);
  ins.push(`Your top recommendation "${top.name}" has strong career growth in the next decade. Start researching entrance exams and top colleges today.`);
  if(s.interests.includes('Art & Design')||s.skills.includes('Drawing / Designing')) ins.push(`Creative skills are in high demand — UI/UX design, animation, and content creation are among the fastest-growing freelance and full-time careers.`);
  return ins.slice(0,5);
}

function restart(){
  state={name:'',age:'',level:'',stream:'',overall:0,interests:[],skills:[],abroad:3,salary:3,goal:'',env:'',finance:''};
  document.getElementById('results').style.display='none';
  document.getElementById('hero').style.display='flex';
  document.querySelectorAll('.chip').forEach(c=>c.classList.remove('selected'));
  document.querySelectorAll('input,select').forEach(i=>{if(i.type!=='range')i.value='';});
  document.getElementById('streamRow').style.display='none';
  document.getElementById('marksGrid').innerHTML='';
  document.getElementById('progressWrap').style.display='none';
  window.scrollTo({top:0,behavior:'smooth'});
}s