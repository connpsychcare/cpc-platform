import type { ContentBlock } from "../content-blocks";

export const bipolarDisorderTreatmentBlocks: ContentBlock[] = [
  {
    type: "prose",
    eyebrow: "Why diagnosis is slow",
    heading: "Bipolar disorder is usually mistaken for depression first",
    paragraphs: [
      "People do not seek help when they feel unusually good. They seek help when they feel terrible. That single fact explains most of the delay in diagnosing bipolar disorder, which studies repeatedly find takes years from first symptoms to correct identification, with an initial diagnosis of unipolar depression along the way.",
      "Hypomania in particular is easy to miss from the inside. It does not feel like illness. It feels like finally being productive, sleeping less and not minding, being funnier and more confident, having ideas arrive faster than you can write them down. Very few people report that to a doctor as a symptom. Often a partner or a parent is the one who recognises the pattern.",
      "The distinction matters clinically, not just administratively. Antidepressants given alone to someone with bipolar disorder can destabilise mood, accelerate cycling, or precipitate a manic episode. It is the main reason every depression evaluation here includes a deliberate screen for past periods of elevated mood, reduced need for sleep, and uncharacteristic risk-taking.",
      "If you have had depression that responded strangely to antidepressants, or that lifted suspiciously fast and then crashed, that history is worth raising directly. It is a meaningful clinical signal rather than a coincidence.",
    ],
  },
  {
    type: "comparison",
    eyebrow: "The spectrum",
    heading: "Bipolar I, bipolar II, and cyclothymia",
    intro:
      "These are distinguished by the height of the elevated episodes, not by how severe the depression is. Bipolar II is not a milder illness overall.",
    columns: ["", "Bipolar I", "Bipolar II", "Cyclothymia"],
    rows: [
      [
        "Elevated episodes",
        "Mania: at least a week, or any length requiring hospitalisation",
        "Hypomania: at least four days, clearly out of character but not disabling",
        "Repeated hypomanic-range symptoms that do not meet full criteria",
      ],
      [
        "Depression",
        "Common, though not required for the diagnosis",
        "Required, and usually the reason people seek care",
        "Repeated depressive symptoms below full episode threshold",
      ],
      [
        "Loss of insight",
        "Can occur, including psychosis during mania",
        "Insight generally retained",
        "Insight retained",
      ],
      [
        "Usual level of disruption",
        "Severe; hospitalisation is sometimes required",
        "Function often preserved during hypomania, heavily impaired during depression",
        "Chronic instability rather than discrete episodes",
      ],
      [
        "Most common misdiagnosis",
        "Schizophrenia, when psychotic features are present",
        "Major depressive disorder, very frequently",
        "Personality disorder or simply being described as moody",
      ],
      [
        "Treatment emphasis",
        "Mood stabilisation and relapse prevention",
        "Stabilisation with careful management of the depressive pole",
        "Stabilisation, with attention to whether the picture is evolving",
      ],
    ],
    footnote:
      "Diagnoses within this spectrum can change over time as more of the course becomes visible. That is expected rather than a sign of error.",
  },
  {
    type: "grid",
    eyebrow: "What to watch for",
    heading: "Signs of an episode, in both directions",
    intro:
      "Recognising a shift early is the single most useful skill in managing bipolar disorder, because early intervention can shorten or prevent an episode.",
    columns: 2,
    items: [
      {
        title: "Reduced need for sleep",
        description:
          "Not insomnia, which is distressing. This is sleeping four hours and feeling genuinely rested and energised. One of the earliest and most reliable warning signs of an approaching elevated episode.",
      },
      {
        title: "Accelerated speech and thought",
        description:
          "Talking faster, jumping between topics, people struggling to interrupt. Often noticed by others well before the person notices it themselves.",
      },
      {
        title: "Expansive confidence and new plans",
        description:
          "Sudden large projects, career pivots, or certainty about ideas that do not survive review later. Buying, quitting, and starting are common and expensive markers.",
      },
      {
        title: "Impulsive risk",
        description:
          "Spending, driving, sexual risk, substance use, or confrontation that is out of character. The consequences of an episode frequently outlast the episode itself.",
      },
      {
        title: "Irritability rather than euphoria",
        description:
          "Elevated episodes are not always pleasant. Many present as agitation, short temper, and intolerance of other people, which is easily mistaken for stress.",
      },
      {
        title: "Depression arriving suddenly",
        description:
          "Bipolar depression often descends faster than unipolar depression and can include heavy sleep, heavy limbs, and appetite increase rather than the reverse.",
      },
      {
        title: "Mixed features",
        description:
          "Depressed mood with agitation and racing thoughts at the same time. Deeply uncomfortable and a higher-risk state, so it warrants prompt contact with your provider.",
      },
      {
        title: "Sensory intensity",
        description:
          "Colours brighter, sounds sharper, everything more vivid. Frequently reported early in elevation and easy to dismiss as a good day.",
      },
    ],
  },
  {
    type: "timeline",
    eyebrow: "Treatment arc",
    heading: "From first visit to stable maintenance",
    entries: [
      {
        marker: "Visit 1",
        title: "Careful diagnostic work",
        description:
          "Full history including any period of elevated mood, family history, prior medication response, substance use, and thyroid function. Where possible and with your consent, input from someone who knows you well adds a great deal.",
      },
      {
        marker: "Weeks 1 to 4",
        title: "Starting a stabilising medication",
        description:
          "A mood stabiliser or an appropriate atypical antipsychotic, introduced at a low dose and titrated. Baseline labs are ordered where the chosen agent requires them.",
      },
      {
        marker: "Weeks 4 to 12",
        title: "Reaching a therapeutic dose",
        description:
          "Dose is adjusted against response, tolerability, and where relevant blood levels. Sleep is stabilised deliberately, because irregular sleep is one of the strongest triggers for relapse.",
      },
      {
        marker: "Months 3 to 6",
        title: "Addressing the depressive pole",
        description:
          "Bipolar depression is usually the harder half to treat and is approached differently from unipolar depression, with mood stabilisation kept in place throughout rather than an antidepressant used alone.",
      },
      {
        marker: "Months 6 to 12",
        title: "Building a relapse plan",
        description:
          "Your personal early warning signs, written down, with an agreed set of actions and the people who should be told. This is often what most reduces the severity of the next episode.",
      },
      {
        marker: "Long term",
        title: "Maintenance",
        description:
          "Bipolar disorder is generally managed long term rather than cured. Visits space out once you are stable, and continuing treatment through good periods is what keeps them going.",
      },
    ],
  },
  {
    type: "checklist",
    eyebrow: "Daily management",
    heading: "What protects stability between episodes",
    items: [
      {
        title: "A regular sleep schedule",
        description:
          "The highest-value habit in bipolar disorder. Disrupted sleep is both a symptom and a trigger, and consistent sleep and wake times materially reduce relapse risk.",
      },
      {
        title: "Mood tracking",
        description:
          "A daily one-line note on mood, sleep hours, and anything notable. Patterns visible over weeks in a log are invisible in memory, and they make appointments substantially more useful.",
      },
      {
        title: "Staying on medication through the good stretches",
        description:
          "The most common cause of relapse is stopping once things feel fine. The stability is frequently the medication working rather than evidence it is no longer needed.",
      },
      {
        title: "Required lab monitoring",
        description:
          "Some agents need periodic blood work, including kidney and thyroid function on lithium, and metabolic panels on several antipsychotics. Your provider will tell you exactly what applies and how often.",
      },
      {
        title: "Caution with alcohol and stimulants",
        description:
          "Both destabilise mood and both interact with treatment. Alcohol in particular is closely linked to relapse and to poorer long-term outcomes.",
      },
      {
        title: "One person who is allowed to say something",
        description:
          "Agreed in advance, while you are well: someone permitted to tell you they are seeing early signs, and a plan for what happens when they do.",
      },
      {
        title: "Care during pregnancy planning",
        description:
          "Several medications used here need review before conception. Raise it early, because the planning is manageable when there is time and much harder when there is not.",
      },
    ],
  },
  {
    type: "callout",
    heading: "If you are in a manic or mixed episode now",
    body:
      "Acute mania is not something to manage through a routine outpatient appointment. If you or someone you care about is not sleeping, behaving in ways that are dangerous, or losing touch with reality, seek urgent help. Call 911 or go to an emergency department. Call or text 988 for the Suicide and Crisis Lifeline at any hour. Mixed states, where depression and agitation occur together, carry particular risk and should be treated as urgent rather than waited out.",
    variant: "urgent",
  },
  {
    type: "faq",
    eyebrow: "Common questions",
    heading: "About bipolar treatment",
    items: [
      {
        question: "Can bipolar disorder be cured?",
        answer:
          "It is managed rather than cured, in the same sense as many long-term medical conditions. With consistent treatment, many people have long stretches of stability and full functioning. The realistic goal is fewer episodes, milder ones, and faster recovery.",
      },
      {
        question: "Do I have to take medication forever?",
        answer:
          "For most people with bipolar I, long-term maintenance is strongly recommended, because relapse rates after stopping are high. Bipolar II and cyclothymia are more individual. This is a conversation with your provider rather than a fixed rule.",
      },
      {
        question: "Can I take an antidepressant?",
        answer:
          "Sometimes, but rarely on its own. Used without a mood stabiliser, antidepressants can trigger elevation or accelerate cycling. Where one is used, it sits alongside stabilising treatment and is monitored closely.",
      },
      {
        question: "Will medication flatten my creativity?",
        answer:
          "This is a real and common concern, and it deserves a real answer rather than reassurance. Feeling dulled is a side effect worth reporting, and it often responds to a dose or agent change. It is also worth weighing against what episodes themselves cost, which is usually more.",
      },
      {
        question: "How do I know if I have bipolar II or just mood swings?",
        answer:
          "Hypomania is a sustained change lasting at least four days, clearly different from your usual self and visible to others, not a mood shift over hours. That distinction is exactly what an evaluation is for, and it is not something to settle from an online questionnaire.",
      },
      {
        question: "Can bipolar disorder be treated by telehealth?",
        answer:
          "Stable outpatient management works well by video, including monitoring, adjustment, and relapse planning. Acute mania and psychosis require in-person emergency care, and your provider will be direct with you about where that line sits.",
      },
      {
        question: "Should my family be involved in my care?",
        answer:
          "Where you are comfortable with it, yes. Family involvement is one of the better-supported elements of long-term bipolar care, largely because other people often see early warning signs before you do.",
      },
      {
        question: "Is it hereditary?",
        answer:
          "There is a substantial genetic component, which is why family history is asked about carefully. Having a relative with bipolar disorder raises risk but does not determine anything, and it also helps predict which medications may suit you.",
      },
    ],
  },
];
