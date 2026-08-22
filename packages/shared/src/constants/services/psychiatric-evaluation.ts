import type { ContentBlock } from "../content-blocks";

export const psychiatricEvaluationBlocks: ContentBlock[] = [
  {
    type: "callout",
    heading: "You do not need to be in crisis to book an evaluation",
    body:
      "Most people wait far longer than they need to, usually because they are not sure their situation counts as bad enough. There is no threshold to cross. If something is changing how you sleep, work, think, or relate to the people around you, that is reason enough to have it looked at properly. If you are having thoughts of suicide or self-harm right now, call or text 988 to reach the Suicide and Crisis Lifeline, or call 911 for a medical emergency. Please do not wait for an appointment.",
    variant: "info",
    tone: "plain",
  },
  {
    type: "prose",
    eyebrow: "What it actually is",
    heading: "An evaluation is a structured conversation, not a test you can fail",
    paragraphs: [
      "A psychiatric evaluation is the visit where a licensed provider builds a full picture of what you are experiencing and what is likely driving it. It combines your history, your current symptoms, validated screening questionnaires, and a clinical interview. The goal is a working diagnosis specific enough to guide treatment, and a plan you actually agree with.",
      "It is not an interrogation, and there are no correct answers. Your provider is listening for patterns: when symptoms started, what makes them better or worse, what has already been tried, what your sleep and appetite and concentration look like, and how all of it is landing on your work, your relationships, and your sense of yourself.",
      "Symptoms overlap far more than most people expect. Difficulty concentrating can come from ADHD, from depression, from untreated sleep apnea, from thyroid dysfunction, or from anxiety loud enough to crowd out everything else. Getting the driver right is the whole reason a first visit is longer and more thorough than the ones that follow.",
      "You will leave with your provider's clinical impression explained in plain language, a treatment plan you helped shape, any prescriptions sent to your pharmacy, and a follow-up already on the calendar.",
    ],
  },
  {
    type: "process",
    eyebrow: "Step by step",
    heading: "How your first visit runs",
    intro:
      "Initial evaluations are scheduled for a longer block than follow-up visits so nothing has to be rushed.",
    steps: [
      {
        title: "Intake forms, completed before you log on",
        description:
          "Through the patient portal you complete a medical and psychiatric history, list current medications and supplements, note allergies, and describe what brought you in. Doing this in advance means your appointment time goes to the conversation instead of paperwork.",
        note: "Take your time and save as you go. Approximate dates are fine. Nobody expects perfect recall.",
      },
      {
        title: "Validated screening questionnaires",
        description:
          "Depending on what you describe, you may complete the PHQ-9 for depressive symptoms, the GAD-7 for anxiety, the ASRS for adult ADHD, or a Vanderbilt scale for a child or adolescent. These are standardized instruments used across psychiatry, which means your scores can be tracked meaningfully over months.",
      },
      {
        title: "Clinical interview",
        description:
          "The main part of the visit. Your provider reviews what you submitted, then asks follow-up questions about onset, course, family psychiatric history, substance use, medical conditions, sleep, and safety. Family psychiatric history matters more than people expect, because response to a given medication often runs in families.",
      },
      {
        title: "Diagnostic impression, explained",
        description:
          "Your provider tells you what they think is going on and why, including what they considered and ruled out. If the picture is not yet clear, they will say so rather than force a label. Provisional is an honest and common answer at a first visit.",
      },
      {
        title: "Treatment plan and shared decision",
        description:
          "Options are laid out with their real tradeoffs: what a medication is likely to help, how long it takes, what side effects to watch for, and what the alternatives are. You are not obligated to start medication at your first visit. Deciding to think it over is a legitimate outcome.",
      },
      {
        title: "Prescriptions, referrals, and follow-up",
        description:
          "Any prescriptions go electronically to your pharmacy. If therapy would help, you get a referral or coordination with the therapist you already see. A follow-up is scheduled before you leave, usually within two to four weeks when starting something new.",
      },
    ],
  },
  {
    type: "checklist",
    eyebrow: "Come prepared",
    heading: "What helps your provider most",
    intro:
      "None of this is required. Every item you can bring makes the hour more useful to you.",
    items: [
      {
        title: "A list of every medication and supplement you take",
        description:
          "Include doses, and include over-the-counter products and supplements. Interactions with psychiatric medications are real and are easy to design around when they are known up front.",
      },
      {
        title: "What you have tried before, and what happened",
        description:
          "Even vague memories help. A medication that caused an intolerable side effect, or one that helped before it was stopped, meaningfully changes what your provider suggests next.",
      },
      {
        title: "A rough timeline",
        description:
          "When did this start, and was there anything happening in your life around then? Symptoms that began abruptly point somewhere different from symptoms that built up over years.",
      },
      {
        title: "Any recent lab work",
        description:
          "Thyroid studies, vitamin B12, vitamin D, and a basic metabolic panel can each affect mood, energy, and concentration. If you have had them drawn recently, bring the results.",
      },
      {
        title: "Your own questions, written down",
        description:
          "It is genuinely hard to remember what you wanted to ask once the conversation gets going. A short list on your phone is enough.",
      },
      {
        title: "A private place and a working camera",
        description:
          "Visits happen by secure video. Somewhere you can speak freely, with headphones if the household is close by, makes a real difference to how open the conversation can be.",
      },
    ],
  },
  {
    type: "comparison",
    eyebrow: "Know what you are booking",
    heading: "Evaluation, follow-up visit, or therapy intake",
    intro:
      "These are three different appointments that people often use interchangeably. Booking the right one saves you a wasted visit.",
    columns: ["", "Psychiatric evaluation", "Medication follow-up", "Therapy intake"],
    rows: [
      [
        "Purpose",
        "Establish what is happening and build the initial plan",
        "Check how treatment is working and adjust it",
        "Begin talk-based treatment with a therapist",
      ],
      [
        "Typical length",
        "The longest visit in your care, scheduled accordingly",
        "Shorter and focused",
        "Set by the therapist, commonly around an hour",
      ],
      [
        "Who you see",
        "A licensed psychiatric provider",
        "The same provider who knows your history",
        "A licensed therapist, counselor, or psychologist",
      ],
      [
        "Prescribing",
        "Yes, when clinically appropriate",
        "Yes, this is the main purpose",
        "No, therapists do not prescribe",
      ],
      [
        "Book this when",
        "You are starting care or want a second opinion",
        "You are already an established patient",
        "You want skills, processing, and regular sessions",
      ],
    ],
    footnote:
      "Many people benefit from both a psychiatric provider and a therapist. The two roles complement each other rather than compete.",
  },
  {
    type: "prose",
    eyebrow: "About diagnosis",
    heading: "What a diagnosis is for, and what it is not",
    paragraphs: [
      "A psychiatric diagnosis is a clinical shorthand. It groups a pattern of symptoms so providers can draw on what is known about how that pattern usually responds to treatment. It is a tool for choosing a next step, not a verdict on your character or a permanent description of who you are.",
      "Diagnoses also change, and that is normal rather than a sign something went wrong. A first episode of depression can later look like bipolar II once a hypomanic period surfaces. Anxiety in a nine-year-old can look different at nineteen. Good psychiatric care revisits its own conclusions when new information arrives.",
      "You are entitled to ask why. If a diagnosis does not sound like your experience, say so. That disagreement is clinically useful information, not an inconvenience, and it often surfaces a detail that reshapes the plan.",
      "Your records belong to you. Notes, screening scores, and your care plan are visible in the patient portal, and you can message your provider between visits with questions that come up after you have had time to sit with what was discussed.",
    ],
  },
  {
    type: "faq",
    eyebrow: "Common questions",
    heading: "Before you book",
    items: [
      {
        question: "How long does a psychiatric evaluation take?",
        answer:
          "An initial evaluation is scheduled as a longer visit than routine follow-ups so there is room for a full history, screening review, and treatment discussion without rushing. Your confirmation will list the exact length booked for you.",
      },
      {
        question: "Will I be prescribed medication at my first appointment?",
        answer:
          "Sometimes, when the picture is clear and you want to start. Often the first visit ends with a plan and a decision to think it over. You are never obligated to accept a prescription, and choosing to wait does not affect your care.",
      },
      {
        question: "Can I get an evaluation if I already have a diagnosis?",
        answer:
          "Yes. Second opinions are a common reason people book. Bring what you have, including prior records and medication history, and your provider will assess the picture independently rather than simply carrying the previous label forward.",
      },
      {
        question: "Do I need a referral from my primary care provider?",
        answer:
          "Not to book with us. Some insurance plans require a referral for coverage, so it is worth checking your specific plan. Our team verifies benefits before your first visit and will flag it if a referral or prior authorization is needed.",
      },
      {
        question: "What if I get emotional during the appointment?",
        answer:
          "That happens often and it is completely fine. Your provider is not going to be surprised by it. Take the time you need, and say so if you want to pause or move to something else.",
      },
      {
        question: "Is a video evaluation as thorough as an in-person one?",
        answer:
          "For psychiatric assessment, the substance of the visit is history, symptom review, and clinical interview, all of which translate fully to secure video. If anything in your presentation calls for in-person medical evaluation or lab work, your provider will tell you and help arrange it locally.",
      },
      {
        question: "Who can see what I share?",
        answer:
          "Your record is protected health information. It is available to your care team and to you, and it is not shared outside that without your authorization except where law requires it, such as an imminent safety risk.",
      },
    ],
  },
];
