import type { ContentBlock } from "../content-blocks";

export const childAdolescentPsychiatryBlocks: ContentBlock[] = [
  {
    type: "callout",
    heading: "If your child is in immediate danger",
    body:
      "Call 911, or take them to the nearest emergency department. Call or text 988 for the Suicide and Crisis Lifeline, which serves young people and their parents 24 hours a day. Asking a child directly whether they have thought about hurting themselves does not plant the idea. Research consistently finds the opposite: asking makes it more likely they will tell you.",
    variant: "urgent",
    tone: "plain",
  },
  {
    type: "prose",
    eyebrow: "Where to begin",
    heading: "Telling development apart from a problem",
    paragraphs: [
      "Almost every symptom in child psychiatry also appears in ordinary development. Toddlers have meltdowns. Nine-year-olds worry. Teenagers withdraw, sleep oddly, and become difficult to reach. The question is never whether a behaviour exists, it is whether it is out of proportion for the age, whether it persists, and whether it is costing the child something.",
      "The practical threshold is function. Is this affecting school, friendships, family life, or sleep? A child who is anxious but still going to school, still keeping friends, still sleeping, is in a different position from one whose world is visibly narrowing. Parents usually know which one they are looking at, even when they doubt themselves.",
      "Children also rarely announce what is wrong. Distress arrives as behaviour instead: stomach aches with no medical cause, refusing school, aggression, regression to younger habits, or a sudden collapse in grades. Younger children in particular do not have the vocabulary to say they are depressed, so it shows up as irritability rather than sadness.",
      "You do not need to be certain before booking. Bringing a child to be assessed is not a claim that something is wrong with them. It is a request for a professional opinion, and being told this is within normal range is a perfectly good outcome.",
    ],
  },
  {
    type: "age-bands",
    eyebrow: "By developmental stage",
    heading: "What care looks like at different ages",
    intro:
      "Approach, involvement of parents, and the balance of medication against other supports all shift with age.",
    bands: [
      {
        range: "5 to 8",
        label: "Early school years",
        focus:
          "The parent is the primary informant and the primary agent of change. Work centres on parent guidance, school coordination, and environment, with medication used conservatively and for clear indications.",
        examples: [
          "ADHD assessment using parent and teacher Vanderbilt scales",
          "Separation anxiety and school refusal",
          "Sleep problems affecting daytime behaviour",
          "Disruptive behaviour and emotional regulation",
        ],
      },
      {
        range: "9 to 12",
        label: "Late childhood",
        focus:
          "Children begin describing their own inner experience. Visits usually include time with the child alone, and treatment starts building their understanding of what is happening rather than only managing it around them.",
        examples: [
          "Anxiety disorders including generalised and social anxiety",
          "Early depressive symptoms and irritability",
          "ADHD that emerges as academic demands rise",
          "Difficulty coping with family change or loss",
        ],
      },
      {
        range: "13 to 15",
        label: "Early adolescence",
        focus:
          "Confidentiality becomes central to whether treatment works at all. Most of the visit is with the adolescent alone, with parents brought in for planning and safety. Screening for self-harm and substance use is routine.",
        examples: [
          "Depression, self-harm, and suicidal ideation",
          "Social anxiety and school avoidance",
          "ADHD carried into secondary school",
          "Emerging mood instability and sleep disruption",
        ],
      },
      {
        range: "16 to 17",
        label: "Later adolescence",
        focus:
          "Care moves toward the adult model, with the young person taking a lead role in decisions. Planning includes the practical transition to adult services and independent management of their own treatment.",
        examples: [
          "Depression and anxiety alongside academic pressure",
          "First presentation of bipolar spectrum illness",
          "ADHD with independence, driving, and substance-use considerations",
          "Preparing to manage prescriptions and appointments independently",
        ],
      },
    ],
  },
  {
    type: "process",
    eyebrow: "How it runs",
    heading: "A family evaluation, step by step",
    steps: [
      {
        title: "Parent or guardian intake",
        description:
          "Developmental history, medical history, family psychiatric history, school reports, and what specifically prompted you to seek help now. That last question is often the most informative one.",
      },
      {
        title: "Rating scales from more than one setting",
        description:
          "Vanderbilt scales completed by parents and by teachers, because behaviour that only appears in one setting points somewhere different from behaviour that appears everywhere. Teacher input is collected through a secure link that requires no account or app.",
      },
      {
        title: "Time with the whole family together",
        description:
          "Everyone present, so your provider can hear the concern in the child's presence and see how the family talks about it. How a family discusses a problem is itself clinical information.",
      },
      {
        title: "Time with the child or adolescent alone",
        description:
          "For older children particularly, this is where the honest account usually emerges. Adolescents are told at the start what stays private and what does not, because vague promises break trust the moment safety requires disclosure.",
      },
      {
        title: "Feedback to the family",
        description:
          "Your provider explains the impression in plain language, at a level the child can follow. Children generally do better when they understand what is happening to them rather than being discussed over.",
      },
      {
        title: "A plan with parts for everyone",
        description:
          "Rarely medication alone. Typically some combination of therapy referral, school accommodations, parent strategies, and medication where it is genuinely indicated.",
      },
    ],
  },
  {
    type: "checklist",
    eyebrow: "Working with school",
    heading: "Support that extends beyond the appointment",
    intro:
      "For most children, school is where difficulty is most visible and where support does the most good.",
    items: [
      {
        title: "Teacher rating scales",
        description:
          "Sent directly to teachers through a secure link, with no account to create. Their observations are part of both diagnosis and monitoring over time.",
      },
      {
        title: "Documentation for accommodations",
        description:
          "Letters supporting classroom accommodations such as extended time, reduced distraction settings, or seating adjustments, for use in 504 plan or IEP discussions.",
      },
      {
        title: "Input for school meetings",
        description:
          "Written clinical input to bring to a school meeting, so a parent is not the only one making the case.",
      },
      {
        title: "Monitoring across settings",
        description:
          "Repeat teacher scales after starting treatment give an outside measure of whether it is working, independent of how things look at home.",
      },
      {
        title: "Planning around school refusal",
        description:
          "Avoidance strengthens quickly. Return plans are usually graded rather than all-or-nothing, and coordinated with the school rather than negotiated at the door each morning.",
      },
    ],
  },
  {
    type: "prose",
    eyebrow: "California law",
    heading: "Consent, confidentiality, and what parents can expect",
    paragraphs: [
      "California law allows minors aged 12 and over to consent to outpatient mental health treatment on their own, where a provider determines they are mature enough to participate intelligently in it. This exists because a meaningful number of adolescents who need help would not seek it if a parent had to be involved from the first step.",
      "In practice, most families here work together, and involving parents is usually clinically better as well as practically easier. The law matters mainly for the adolescents who would otherwise go without care entirely.",
      "Confidentiality with an adolescent is explained at the start rather than assumed. Broadly, what they discuss stays between them and their provider, with clear exceptions: risk of serious harm to themselves, risk to someone else, and suspected abuse. Setting this out plainly at the beginning is what makes the honest conversation possible, and it prevents a betrayal later when safety requires disclosure.",
      "For medication in particular, involving parents is strongly preferred and usually necessary in practice. Someone at home needs to know what is being taken, at what dose, and what to watch for.",
    ],
  },
  {
    type: "faq",
    eyebrow: "Common questions",
    heading: "What parents ask",
    items: [
      {
        question: "Is my child too young for psychiatric care?",
        answer:
          "We see patients from around age five. Younger children are usually helped most through parent guidance, environmental change, and school coordination, with medication reserved for clearer indications, so an early appointment is not a step toward medication by default.",
      },
      {
        question: "Will you put my child on medication?",
        answer:
          "Only where it is genuinely indicated and only with your involvement. Plenty of families leave an evaluation with a therapy referral, school accommodations, and a set of strategies rather than a prescription.",
      },
      {
        question: "Do both parents need to consent?",
        answer:
          "That depends on your custody arrangement. Where legal custody is shared, both parents typically need to consent to treatment of a child under 12. Tell us about your situation at intake so it is handled correctly from the start.",
      },
      {
        question: "Can my teenager be seen without me in the room?",
        answer:
          "Yes, and for adolescents that time alone is usually where the most useful information comes out. You will normally join for the opening and for the plan at the end.",
      },
      {
        question: "Does telehealth work for children?",
        answer:
          "It works well, and for some children better. Many are more comfortable at home than in an unfamiliar office, and school-time appointments are far easier to arrange. Younger children may need a parent nearby to help them stay settled.",
      },
      {
        question: "What if my child does not want to come?",
        answer:
          "Common, and worth naming rather than working around. Reluctance is often about fear of being labelled, or of being told something is wrong with them. Framing the first visit as one conversation, with no obligation beyond it, helps more than pressure.",
      },
      {
        question: "Will this go on their permanent record?",
        answer:
          "Medical records are protected health information. They are not shared with schools, employers, or anyone else without your written authorisation, apart from narrow legal exceptions such as an imminent safety risk.",
      },
      {
        question: "How do I talk to my child about the appointment?",
        answer:
          "Honestly and without weight. Something close to: we are going to talk to someone whose job is helping with worries and feelings, and they are going to ask both of us some questions. Avoid framing it as a consequence of behaviour.",
      },
    ],
  },
];
