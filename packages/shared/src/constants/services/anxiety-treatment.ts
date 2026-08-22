import type { ContentBlock } from "../content-blocks";

export const anxietyTreatmentBlocks: ContentBlock[] = [
  {
    type: "prose",
    eyebrow: "The mechanism",
    heading: "Why anxiety keeps itself going",
    paragraphs: [
      "Anxiety is a threat-detection system doing its job at the wrong threshold. The physical machinery is the same one that would serve you well if something genuinely dangerous were happening: raised heart rate, shallow breathing, muscle tension, hypervigilance. The problem is not that the system is broken. It is that it is firing at things that cannot actually hurt you.",
      "What turns ordinary worry into a disorder is usually avoidance. You avoid the meeting, the drive, the phone call, the situation. The anxiety drops immediately, which teaches your nervous system that avoidance is what kept you safe. Next time the alarm is louder and the avoidance is more automatic. This loop is why anxiety tends to expand into more and more of a life rather than staying where it started.",
      "It is why the effective treatments do not aim to eliminate the feeling. They aim to break the loop, by helping you stay in a situation long enough for your nervous system to learn that nothing catastrophic happens. Medication can lower the baseline enough to make that possible. Therapy provides the structure for doing it.",
      "That also explains why the thing that feels most helpful in the moment, escaping, is usually the thing that makes the next episode worse. It is not a failure of willpower. It is a learning system doing exactly what it was designed to do with the information it is being given.",
    ],
  },
  {
    type: "grid",
    eyebrow: "What we treat",
    heading: "Anxiety does not have one shape",
    intro:
      "These share anxiety as a core feature but differ enough in presentation and treatment that identifying the right one matters.",
    items: [
      {
        title: "Generalised anxiety disorder",
        description:
          "Persistent, hard-to-control worry across many areas of life, running most days for six months or more. Usually accompanied by muscle tension, restlessness, poor concentration, and disturbed sleep.",
      },
      {
        title: "Panic disorder",
        description:
          "Sudden surges of intense fear with strong physical symptoms: racing heart, breathlessness, chest tightness, dizziness, a sense of unreality. Many people first present to an emergency department convinced they are having a cardiac event.",
      },
      {
        title: "Social anxiety disorder",
        description:
          "Intense fear of being observed, judged, or humiliated. Frequently mistaken for shyness, and frequently disabling, because it quietly shapes career choices, friendships, and whether people speak up at all.",
      },
      {
        title: "Specific phobias",
        description:
          "Marked fear of a particular object or situation, such as flying, needles, heights, or driving. Highly treatable, and needle phobia in particular is worth naming because it affects medical care.",
      },
      {
        title: "Obsessive-compulsive disorder",
        description:
          "Intrusive, unwanted thoughts paired with compulsions performed to reduce the distress they cause. Treated differently from other anxiety disorders, often with higher medication doses and a specific therapy approach.",
      },
      {
        title: "Agoraphobia",
        description:
          "Fear of situations where escape would be difficult or help unavailable, often developing after panic attacks. Can narrow a life dramatically over time as the safe zone shrinks.",
      },
      {
        title: "Illness anxiety",
        description:
          "Persistent preoccupation with having or developing a serious illness, often with repeated checking or reassurance-seeking that provides relief for hours and then restarts the cycle.",
      },
      {
        title: "Anxiety with depression",
        description:
          "The most common combination in practice. Treated together, since treating one while the other runs unchecked tends to produce partial and unstable improvement.",
      },
      {
        title: "Substance-related anxiety",
        description:
          "Caffeine, cannabis, stimulants, and alcohol withdrawal all produce or amplify anxiety. Worth identifying early, because the fix is sometimes simpler than a prescription.",
      },
    ],
  },
  {
    type: "comparison",
    eyebrow: "Treatment options",
    heading: "How the main approaches differ",
    intro:
      "These are not ranked best to worst. They do different jobs, and most effective plans use more than one.",
    columns: ["", "SSRIs and SNRIs", "Cognitive behavioural therapy", "Benzodiazepines"],
    rows: [
      [
        "How fast it works",
        "Four to six weeks for full effect",
        "Skills within weeks, durable change over months",
        "Within an hour",
      ],
      [
        "How long the benefit lasts",
        "While you continue taking it",
        "Persists after treatment ends, which is its main advantage",
        "Hours, then it wears off",
      ],
      [
        "Dependence risk",
        "None; discontinuation still needs a taper",
        "None",
        "Real, and rises with regular use",
      ],
      [
        "Main drawbacks",
        "Early nausea and jitteriness, possible sexual side effects",
        "Requires time, effort, and deliberate discomfort",
        "Sedation, tolerance, impaired learning from exposure",
      ],
      [
        "Best suited to",
        "Ongoing anxiety needing a lower baseline",
        "Almost everyone, particularly panic, social anxiety, and OCD",
        "Narrow, short-term situations only",
      ],
      [
        "Our usual approach",
        "Common first-line for moderate to severe anxiety",
        "Recommended alongside medication in nearly every plan",
        "Used sparingly, briefly, and with an exit plan agreed up front",
      ],
    ],
    footnote:
      "Beta blockers are sometimes used for performance-limited situations, where the trouble is mainly physical symptoms in a predictable setting.",
  },
  {
    type: "process",
    eyebrow: "How care runs",
    heading: "Building an anxiety treatment plan",
    steps: [
      {
        title: "Identify which anxiety disorder this is",
        description:
          "GAD-7 gives a severity baseline, and the clinical interview separates generalised worry from panic, social anxiety, OCD, and phobia. The distinction changes which medication and which therapy is likely to work.",
      },
      {
        title: "Rule out the physical contributors",
        description:
          "Thyroid dysfunction, cardiac arrhythmia, caffeine intake, stimulant use, and alcohol withdrawal can all present as anxiety. Sorting this out early prevents months spent treating the wrong thing.",
        note: "Caffeine is the one most often overlooked. It is worth counting honestly, including energy drinks and pre-workout.",
      },
      {
        title: "Choose a starting medication, if indicated",
        description:
          "SSRIs and SNRIs are usual first-line. In anxiety, the starting dose is deliberately lower than in depression and increased slowly, because a fast start often produces an initial jitteriness that leads people to stop.",
      },
      {
        title: "Pair it with therapy",
        description:
          "Cognitive behavioural therapy, and exposure work specifically, has the strongest evidence base in anxiety. We refer to a therapist or coordinate with the one you already see.",
      },
      {
        title: "Start reducing avoidance early",
        description:
          "Waiting until you feel calm to face the avoided situation means waiting indefinitely. The plan begins with the smallest version you can tolerate and builds from there.",
      },
      {
        title: "Track and adjust",
        description:
          "Repeat GAD-7 scores at follow-ups show progress that is easy to miss from the inside, particularly when improvement is gradual and you have already normalised the new baseline.",
      },
    ],
  },
  {
    type: "callout",
    heading: "Where we stand on benzodiazepines",
    body:
      "Benzodiazepines work quickly and can be appropriate in narrow, short-term circumstances. They also carry real risks: tolerance, physical dependence, withdrawal that can be medically serious, and cognitive effects that matter more with age. There is a further problem specific to anxiety, which is that by suppressing the physical response they interfere with the learning that makes exposure work. Where they are used here, it is briefly, deliberately, and alongside a longer-term plan rather than instead of one. If you are already taking one, that is not a problem to hide. Bring it up and it can be managed properly.",
    variant: "info",
  },
  {
    type: "faq",
    eyebrow: "Common questions",
    heading: "About anxiety treatment",
    items: [
      {
        question: "How do I know if my anxiety needs treatment?",
        answer:
          "The practical test is interference. If anxiety is changing what you do, where you go, what you take on, or how you sleep, it is worth an assessment. You do not need to be at the severe end to benefit from treatment.",
      },
      {
        question: "Are panic attacks dangerous?",
        answer:
          "Panic attacks are intensely unpleasant but not physically dangerous in themselves. They peak within about ten minutes and subside. That said, chest pain and breathlessness should be medically evaluated at least once so a cardiac cause is properly excluded.",
      },
      {
        question: "Will an SSRI make my anxiety worse at first?",
        answer:
          "It can, briefly. Early jitteriness or increased anxiety in the first one to two weeks is a recognised effect, which is why anxiety treatment starts at a lower dose and titrates slowly. It typically settles. Message your provider rather than stopping on your own.",
      },
      {
        question: "Can I treat anxiety without medication?",
        answer:
          "Yes. Cognitive behavioural therapy alone is effective for many people, especially in mild to moderate anxiety, and its benefits persist after treatment ends. Medication is more strongly indicated when anxiety is severe enough that engaging with therapy is itself out of reach.",
      },
      {
        question: "Is it normal to feel anxious about starting treatment?",
        answer:
          "Extremely. Anxiety about medication side effects and anxiety about being judged in a first appointment are both common presentations of the condition itself. It is worth saying out loud at the start of the visit.",
      },
      {
        question: "How long will I need to stay on medication?",
        answer:
          "Commonly at least six to twelve months after symptoms have resolved, then a supervised taper. Stopping as soon as you feel better carries a high rate of return. If you have combined it with therapy, you are usually in a stronger position when the taper comes.",
      },
      {
        question: "Does cutting caffeine actually help?",
        answer:
          "Often more than people expect, particularly for panic symptoms and sleep-onset problems. It is not a substitute for treatment, but it is a change you control and it costs nothing to test.",
      },
    ],
  },
];
