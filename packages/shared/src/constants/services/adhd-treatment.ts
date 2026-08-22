import type { ContentBlock } from "../content-blocks";

export const adhdTreatmentBlocks: ContentBlock[] = [
  {
    type: "prose",
    eyebrow: "Why it gets missed",
    heading: "ADHD is not a childhood condition that people grow out of",
    paragraphs: [
      "The classic picture is a boy who cannot sit still. That picture is why a great many people reach their thirties or forties without a diagnosis. Inattentive presentations, which are more common in girls and women, produce a quiet daydreamer rather than a disruptive one, and quiet daydreamers do not get referred.",
      "Intelligence hides it too. Bright children compensate: they cram the night before, they rely on last-minute panic as a motivator, they get through school on ability. Compensation works until the structure disappears. University, a first demanding job, a promotion into management, or having a child removes the external scaffolding, and suddenly strategies that carried someone for twenty years stop working.",
      "Adult ADHD often surfaces as something else entirely. Chronic underperformance relative to obvious ability. A drawer full of started projects. Anxiety that is really the exhaustion of holding a disorganised system together by force. Depression that follows years of being told you are careless or lazy when you were trying harder than everyone around you.",
      "Hyperactivity does not vanish with age, it changes form. It becomes internal restlessness, an inability to sit through a film, talking over people, a constant need for stimulation, or impulsive decisions about money, jobs, and relationships that look inexplicable from the outside.",
    ],
  },
  {
    type: "checklist",
    eyebrow: "Recognising it",
    heading: "Signs that come up repeatedly in adult assessments",
    intro:
      "This is not a diagnostic tool and no single item means anything on its own. It is what people tend to describe once they have language for it.",
    items: [
      {
        title: "Starting is disproportionately hard",
        description:
          "Not the difficulty of the task, but the act of beginning it. A five-minute email can sit for three weeks while genuinely harder things get done instead.",
      },
      {
        title: "Time behaves strangely",
        description:
          "Chronic lateness despite genuine effort, and a poor internal sense of how long anything takes. Often described as having only two settings: now and not now.",
      },
      {
        title: "Attention is not absent, it is unregulated",
        description:
          "Hours of complete absorption in something interesting, and an inability to hold thirty seconds on something that is not. The problem is directing attention, not having it.",
      },
      {
        title: "Working memory fails in real time",
        description:
          "Walking into a room and losing the reason. Losing the thread mid-sentence. Reading a page three times without any of it landing.",
      },
      {
        title: "Emotional responses arrive fast and hard",
        description:
          "Frustration, rejection sensitivity, and irritation that hit at full intensity before there is any chance to moderate them. Frequently the most disruptive part in relationships and the least associated with ADHD.",
      },
      {
        title: "Systems keep collapsing",
        description:
          "New app, new planner, new routine. It works brilliantly for eleven days and then it is gone. The pattern of repeated short-lived systems is itself informative.",
      },
      {
        title: "It has been there the whole time",
        description:
          "ADHD is developmental, which means the signs go back to childhood even where nobody named them. Old report cards are often startlingly clear in hindsight.",
      },
    ],
    footnote:
      "Depression, anxiety, sleep disorders, and thyroid dysfunction all produce concentration problems. Distinguishing them is precisely what an evaluation is for.",
  },
  {
    type: "process",
    eyebrow: "The evaluation",
    heading: "How ADHD is properly assessed",
    intro:
      "A short questionnaire alone is not an ADHD assessment. A proper evaluation is longer because the differential genuinely matters.",
    steps: [
      {
        title: "Standardised rating scales",
        description:
          "The ASRS for adults, and Vanderbilt parent and teacher scales for children and adolescents. Teacher input matters for younger patients because ADHD must be present across settings rather than only at home.",
      },
      {
        title: "Developmental history back to childhood",
        description:
          "Symptoms have to trace to childhood for the diagnosis to hold. School reports, memories of how you were described, and a parent's account where available are all useful evidence.",
      },
      {
        title: "Functional impact across domains",
        description:
          "Diagnosis requires impairment in more than one area of life, such as work, study, relationships, or finances. Symptoms alone, without impact, are not sufficient.",
      },
      {
        title: "Differential diagnosis",
        description:
          "Untreated sleep apnea, anxiety, depression, trauma, substance use, and thyroid disease all mimic ADHD. Treating the wrong one wastes months, so this step is not skipped.",
        note: "Sleep is the most common confounder. Chronic poor sleep produces a near-perfect imitation of inattentive ADHD.",
      },
      {
        title: "Screening for what travels with it",
        description:
          "ADHD frequently co-occurs with anxiety, depression, and learning differences. Treating ADHD while ignoring co-occurring depression produces disappointing results.",
      },
      {
        title: "Cardiac and medical review before stimulants",
        description:
          "Personal and family cardiac history, blood pressure, and current medications are reviewed before any stimulant is prescribed.",
      },
    ],
  },
  {
    type: "comparison",
    eyebrow: "Medication options",
    heading: "Stimulants against non-stimulants",
    intro:
      "Both are legitimate. Which is right depends on your medical history, what else you take, your substance-use history, and your own preference.",
    columns: ["", "Stimulants", "Non-stimulants"],
    rows: [
      [
        "Time to effect",
        "Same day, and dose can be assessed within a week or two",
        "Several weeks before the full effect appears",
      ],
      [
        "Typical effect size",
        "Larger on average across the evidence",
        "Moderate, and meaningful for many people",
      ],
      [
        "Coverage",
        "Works while active, then wears off, which can mean an evening rebound",
        "Steady coverage across the whole day, including mornings and evenings",
      ],
      [
        "Common side effects",
        "Reduced appetite, sleep-onset difficulty, raised heart rate, irritability as it wears off",
        "Fatigue, nausea, and for some agents blood pressure changes",
      ],
      [
        "Controlled status",
        "Yes, with tighter prescribing rules and required follow-up",
        "No, and refills are simpler",
      ],
      [
        "Often preferred when",
        "You want a rapid, clear answer about whether medication helps",
        "There is cardiac risk, significant anxiety, a substance-use history, or a preference to avoid controlled medication",
      ],
    ],
    footnote:
      "Finding the right agent and dose commonly takes more than one attempt. That is normal titration rather than a sign the diagnosis is wrong.",
  },
  {
    type: "checklist",
    eyebrow: "Ongoing care",
    heading: "What follow-up covers",
    items: [
      {
        title: "Whether it is actually working",
        description:
          "Not simply whether you feel different, but whether the things ADHD was breaking have improved: starting tasks, finishing them, remembering commitments, staying in conversations.",
      },
      {
        title: "Blood pressure and heart rate",
        description:
          "Checked periodically on stimulant treatment. You may be asked to record readings at home between visits.",
      },
      {
        title: "Appetite, weight, and sleep",
        description:
          "Appetite suppression and delayed sleep onset are the most common reasons people stop. Both usually respond to timing or dose adjustments rather than abandoning treatment.",
      },
      {
        title: "Coverage across the whole day",
        description:
          "Medication that has worn off by the time you get home, or that has you wired at midnight, is a timing problem with a straightforward fix.",
      },
      {
        title: "How much is left over",
        description:
          "Medication improves the capacity to use a system, but it does not supply one. The highest-value work is usually pairing treatment with structure, whether through therapy, coaching, or accommodations.",
      },
      {
        title: "Refills and controlled substance rules",
        description:
          "Stimulant prescriptions cannot be refilled indefinitely without review, so appointments and prescriptions are deliberately linked. Request refills through the portal with several days of lead time.",
      },
    ],
  },
  {
    type: "callout",
    heading: "About stimulant prescribing and telehealth",
    body:
      "Stimulants are controlled substances, and the rules governing how they may be prescribed through telehealth are set federally and by California, and have changed more than once in recent years. That means we cannot promise in advance what will be possible in your specific situation. What we can promise is that your provider will tell you clearly and early what applies to you, including whether an in-person evaluation is required, so you can plan rather than discover a barrier after you have started.",
    variant: "info",
  },
  {
    type: "faq",
    eyebrow: "Common questions",
    heading: "About ADHD assessment and treatment",
    items: [
      {
        question: "Can adults really be diagnosed with ADHD for the first time?",
        answer:
          "Yes, and it is common. The requirement is that symptoms were present in childhood, not that they were noticed or diagnosed then. Many adults were simply bright enough or quiet enough that nobody looked.",
      },
      {
        question: "Is ADHD medication addictive?",
        answer:
          "Taken as prescribed for diagnosed ADHD, stimulants are not associated with the pattern seen in addiction, and treated ADHD is associated with lower rather than higher rates of substance use disorder. Misuse of stimulants without ADHD is a genuinely different situation.",
      },
      {
        question: "Will medication change who I am?",
        answer:
          "It should not. People usually describe it as the noise dropping enough to hear themselves think. Feeling flat, robotic, or not yourself is a sign the dose or the agent needs changing, not something to tolerate.",
      },
      {
        question: "Do I have to take it every day?",
        answer:
          "Not necessarily. Some people take stimulants only on working days, which is a reasonable approach discussed with your provider. Non-stimulants generally need daily dosing to maintain their effect.",
      },
      {
        question: "Can you write a letter for accommodations at work or school?",
        answer:
          "Yes. Once a diagnosis is established, your provider can supply documentation supporting workplace accommodations or school accommodations, including for university disability services.",
      },
      {
        question: "What if I have anxiety as well?",
        answer:
          "That is a very common combination and it changes sequencing. Stimulants can worsen anxiety in some people, so treatment order and agent choice are planned with both conditions in view rather than treating one and hoping.",
      },
      {
        question: "Does treatment work for children as well as adults?",
        answer:
          "Yes. For children and adolescents, treatment is combined with parent and school collaboration, and Vanderbilt scales completed by both parents and teachers form part of both diagnosis and ongoing monitoring.",
      },
      {
        question: "Is medication the only option?",
        answer:
          "No. Structure, environmental changes, coaching, and cognitive behavioural approaches adapted for ADHD all help, and some people choose them alone. Medication tends to make the rest more usable rather than replacing it.",
      },
    ],
  },
];
