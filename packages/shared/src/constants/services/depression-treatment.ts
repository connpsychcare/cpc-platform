import type { ContentBlock } from "../content-blocks";

export const depressionTreatmentBlocks: ContentBlock[] = [
  {
    type: "triage",
    eyebrow: "Start here",
    heading: "How urgent is what you are dealing with?",
    intro:
      "Depression covers a wide range of severity, and the right first move is different at each end of it.",
    options: [
      {
        situation: "You are having thoughts of suicide or self-harm",
        urgency: "Right now",
        guidance:
          "This needs a response today, not at your next available appointment. Thoughts of not wanting to be here are a symptom of an illness that responds to treatment, and they are far more common than most people realise.",
        action:
          "Call or text 988 for the Suicide and Crisis Lifeline, available 24 hours. Call 911 or go to an emergency department if you are in immediate danger.",
      },
      {
        situation: "You are struggling to function day to day",
        urgency: "Within days",
        guidance:
          "Not getting out of bed, missing work, not eating properly, or withdrawing from everyone. Depression at this level rarely lifts on its own and tends to deepen the longer it runs.",
        action:
          "Book an evaluation at the earliest appointment available and note in your intake that symptoms are severe.",
      },
      {
        situation: "It has been building quietly for a while",
        urgency: "When you are ready",
        guidance:
          "You are still functioning, but flatter, more tired, less interested, and less like yourself than you used to be. This is the most common presentation and the one people most often postpone.",
        action:
          "Book a psychiatric evaluation. Depression treated earlier generally responds faster than depression treated years in.",
      },
    ],
  },
  {
    type: "prose",
    eyebrow: "What it actually looks like",
    heading: "Depression is not always sadness",
    paragraphs: [
      "The stereotype is tears and visible despair. Plenty of depression looks nothing like that. It often shows up as numbness rather than sadness, as irritability that surprises the people around you, as exhaustion that sleep does not fix, or as an inability to make decisions about things that used to be automatic.",
      "Loss of interest is one of the most reliable signs and one of the easiest to explain away. Things you used to look forward to become things you go through. Music does less. Food matters less. People often describe it as watching their own life through glass.",
      "It shows up physically too. Persistent fatigue, disturbed sleep at either end, appetite and weight change, slowed movement or restlessness, and unexplained aches. A meaningful number of people first raise these with a primary care provider without ever mentioning mood.",
      "Depression also distorts self-assessment while it is happening. Concluding that you are lazy, weak, or fundamentally broken is itself a symptom, not an accurate observation about your character. That distortion is one of the reasons it is so hard to seek help exactly when help would matter most.",
    ],
  },
  {
    type: "grid",
    eyebrow: "Not one condition",
    heading: "Forms depression takes",
    intro:
      "These respond differently, which is why an evaluation spends time distinguishing them rather than settling for the general label.",
    items: [
      {
        title: "Major depressive disorder",
        description:
          "Episodes of persistently low mood or lost interest lasting at least two weeks, with changes in sleep, appetite, energy, concentration, and self-worth. Episodes can be single or recurrent.",
      },
      {
        title: "Persistent depressive disorder",
        description:
          "A lower-grade depression running two years or more. Because it becomes the baseline, people frequently describe it as personality rather than illness, and often do not seek treatment until a major episode lands on top of it.",
      },
      {
        title: "Bipolar depression",
        description:
          "Depressive episodes within a bipolar illness. Important to identify, because antidepressants used alone can destabilise mood here. Screening for past hypomania is a routine part of every depression evaluation for exactly this reason.",
      },
      {
        title: "Perinatal and postpartum depression",
        description:
          "Depression during pregnancy or after birth. Common, treatable, and consistently under-reported because of the expectation that new parenthood should feel good. Treatment decisions account for pregnancy and breastfeeding.",
      },
      {
        title: "Seasonal pattern",
        description:
          "Depressive episodes that recur at a particular time of year, most often in winter, often with heavier sleep and carbohydrate craving. Light therapy is sometimes added alongside standard treatment.",
      },
      {
        title: "Depression with anxiety",
        description:
          "Very frequently the two travel together. Anxious distress alongside depression tends to predict a slower response, which shapes how actively the plan is adjusted.",
      },
      {
        title: "Depression alongside a medical condition",
        description:
          "Thyroid disease, anaemia, vitamin B12 deficiency, chronic pain, and some medications can each produce or worsen depressive symptoms. Ruling these out is part of a proper workup, not an afterthought.",
      },
      {
        title: "Depression with substance use",
        description:
          "Alcohol is a depressant and worsens the illness it is often used to manage. Treating one and ignoring the other rarely holds, so both are addressed together.",
      },
      {
        title: "Grief that has not resolved",
        description:
          "Grief is not a disorder. When it stays intense and disabling far beyond what is expected, it can meet criteria for treatment. That distinction is made carefully rather than assumed.",
      },
    ],
  },
  {
    type: "timeline",
    eyebrow: "The arc of treatment",
    heading: "What recovery usually looks like",
    intro:
      "Improvement is rarely a straight line. Knowing the shape of it makes the flat stretches less alarming.",
    entries: [
      {
        marker: "Week 1",
        title: "Evaluation and a starting plan",
        description:
          "Full history, PHQ-9 baseline, screening for bipolar features and medical contributors, and a decision about medication, therapy, or both.",
      },
      {
        marker: "Weeks 2 to 4",
        title: "Physical symptoms move first",
        description:
          "Sleep and appetite usually shift before mood does. It is common to be sleeping better and eating better while still feeling flat. That is a signal treatment is doing something, not evidence it is failing.",
      },
      {
        marker: "Weeks 4 to 8",
        title: "Mood and interest begin to return",
        description:
          "Where a medication is going to work, this is generally when it becomes clear. A repeat PHQ-9 is compared against your baseline, which is more reliable than trying to recall how last month felt.",
      },
      {
        marker: "Weeks 8 to 12",
        title: "Adjust rather than settle for partial",
        description:
          "Partial improvement is a common stopping point and not a good one, because residual symptoms predict relapse. The step here is a dose increase, an added agent, or a switch.",
      },
      {
        marker: "Months 4 to 9",
        title: "Continuation to protect the gain",
        description:
          "Treatment continues after you feel well, because stopping at the point of recovery carries a high relapse rate. This phase is about consolidating rather than adding.",
      },
      {
        marker: "Beyond",
        title: "Maintenance or a planned taper",
        description:
          "After a first episode, a supervised taper is often reasonable. With recurrent episodes, longer-term maintenance meaningfully lowers the chance of the next one. This is decided together.",
      },
    ],
  },
  {
    type: "checklist",
    eyebrow: "Beyond the prescription",
    heading: "What else moves the needle",
    intro:
      "None of this replaces treatment, and being told to exercise when you cannot get out of bed is unhelpful. These matter once there is enough traction to use them.",
    items: [
      {
        title: "Action before motivation",
        description:
          "Depression removes the desire to do the things that would help. Waiting to feel like it keeps you still. Acting first, in very small units, and letting motivation follow is one of the better-supported behavioural approaches there is.",
      },
      {
        title: "Protecting sleep timing",
        description:
          "A consistent wake time does more for mood than total hours slept. Sleeping into the afternoon and lying awake at night deepens depression regardless of what is causing it.",
      },
      {
        title: "Reducing alcohol",
        description:
          "Alcohol reliably worsens depression over days, whatever it seems to do over hours. It also blunts antidepressant response and fragments sleep.",
      },
      {
        title: "Movement at whatever scale is possible",
        description:
          "Regular physical activity has a real antidepressant effect in the evidence. The useful version starts absurdly small, because a walk to the corner that you actually take beats a gym plan you do not.",
      },
      {
        title: "Keeping one reliable human contact",
        description:
          "Withdrawal is a core symptom and it feeds the illness. One person you keep answering, even minimally, matters more than a full social calendar you cannot face.",
      },
      {
        title: "Therapy alongside medication",
        description:
          "Combined treatment outperforms either alone for moderate to severe depression. Medication can create the capacity to use therapy, which is why running them together often works better than choosing between them.",
      },
    ],
    footnote:
      "If getting through the day is currently the whole task, start there. The rest can wait for later in treatment.",
  },
  {
    type: "prose",
    eyebrow: "When it is stubborn",
    heading: "If two medications have not worked",
    paragraphs: [
      "Depression that has not responded to two adequate antidepressant trials is generally described as treatment-resistant. It is common. It means the standard first steps did not fit, not that you are beyond help or that the options are exhausted.",
      "The first thing worth checking is whether those trials were genuinely adequate. A medication taken at a low dose for three weeks, or taken irregularly, has not really been tested. The review starts with dose, duration, and adherence before drawing any conclusion about response.",
      "The next step is to revisit the diagnosis. Undetected bipolar spectrum illness, untreated ADHD, an unresolved trauma history, obstructive sleep apnea, and thyroid dysfunction all produce depression that does not respond to antidepressants alone, because the antidepressant is not addressing the actual driver.",
      "From there, options include augmentation with a second agent, switching class, and referral for approaches beyond what a telehealth practice provides directly. Your provider will be straightforward about where the boundary of remote care sits and will help arrange a referral rather than leaving you to find one.",
    ],
  },
  {
    type: "faq",
    eyebrow: "Common questions",
    heading: "About depression treatment",
    items: [
      {
        question: "How do I know if this is depression or just a rough patch?",
        answer:
          "Duration and function are the practical test. Low mood for a couple of days after something difficult is ordinary. Two weeks or more of persistent low mood or lost interest, with changes in sleep, appetite, energy, or concentration, and with daily functioning affected, is worth a professional assessment.",
      },
      {
        question: "Do I have to take medication?",
        answer:
          "No. For mild to moderate depression, therapy alone is a legitimate first-line option and you can start there. Medication is more strongly indicated as severity increases. You will be given the tradeoffs, and the decision is yours.",
      },
      {
        question: "How long until I feel better?",
        answer:
          "Sleep and appetite often shift in the first two to four weeks. Mood and interest more typically improve between weeks four and eight. If nothing has moved by week six at an adequate dose, that is the point to change the plan rather than wait longer.",
      },
      {
        question: "Will I need to stay on medication forever?",
        answer:
          "Often not. After a first episode, many people continue for a period after recovery and then taper with supervision. With repeated episodes, longer maintenance substantially reduces relapse risk, and that tradeoff is discussed openly rather than assumed.",
      },
      {
        question: "Can you treat my depression if I already see a therapist?",
        answer:
          "Yes, and that combination often works well. With your consent we coordinate with your therapist so both halves of your care are pulling in the same direction.",
      },
      {
        question: "What if I have tried antidepressants before and hated them?",
        answer:
          "Tell your provider exactly which ones and what happened. A bad experience with one agent narrows the field usefully rather than closing it, because options within and outside that class differ meaningfully in side effect profile.",
      },
      {
        question: "Is depression treatable if I have a chronic medical illness?",
        answer:
          "Yes, and it is worth treating. Depression alongside chronic illness worsens outcomes in the medical condition too. Treatment is chosen with your other conditions and medications in mind.",
      },
    ],
  },
];
