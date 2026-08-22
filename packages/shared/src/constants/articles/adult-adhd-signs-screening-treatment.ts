import type { ResourceArticle } from "./types";

export const adultAdhdSignsScreeningTreatment: ResourceArticle = {
  slug: "adult-adhd-signs-screening-treatment",
  category: "ADHD",
  title: "Recognising ADHD in Adulthood, and Deciding Whether to Get Assessed",
  description:
    "Why so many adults reach their thirties or forties undiagnosed, what ADHD actually looks like once compensation stops working, and how to decide whether an assessment is worth pursuing.",
  readTime: "10 min read",
  reviewed: "2026-08-01",
  lead: [
    "Adults rarely arrive suspecting ADHD because of poor concentration. They arrive because something recently stopped working. A promotion into a role with less structure. A second child. Remote work removing the office that had been holding the day together. The strategies that carried them for twenty years quietly stopped covering the gap.",
    "This piece is about recognition and the decision to seek assessment. It deliberately does not cover treatment in depth, which is a longer subject in its own right.",
  ],
  blocks: [
    {
      type: "prose",
      eyebrow: "The gap",
      heading: "Why it goes unrecognised for decades",
      paragraphs: [
        "The diagnostic picture most people carry is a boy who cannot sit still. That image comes from the presentation that gets noticed, because it disrupts a classroom. Inattentive ADHD, which is more common in girls and women, produces a child who stares out of the window and hands work in late. Nobody refers a quiet child who is not causing anyone trouble.",
        "Ability masks it further. Bright children compensate: cramming the night before, relying on last-minute pressure as the only reliable motivator, coasting on intelligence through a curriculum with a great deal of external structure. It looks like a slightly disorganised student rather than a neurological difference, and it holds up right until the structure disappears.",
        "That is why late diagnosis so often follows a specific trigger: university, a first genuinely demanding job, parenthood, a promotion into management, or losing an assistant or a partner who had been quietly running the systems. The ADHD did not begin. The scaffolding came down.",
        "There is a cost to the delay that is worth naming. Decades of underperforming relative to obvious ability tends to produce a particular kind of damage: the settled conviction that you are lazy, careless, or fundamentally unserious. A great many adults arrive at assessment carrying that as an established fact about themselves rather than as a symptom of something treatable.",
      ],
    },
    {
      type: "grid",
      eyebrow: "What it actually looks like",
      heading: "How adult ADHD presents in ordinary life",
      intro:
        "None of these is diagnostic alone. Everybody has some of them sometimes. The pattern is lifelong presence, across settings, with real cost.",
      items: [
        {
          title: "The gap between intention and starting",
          description:
            "Not difficulty with hard tasks. Difficulty beginning at all. A five-minute email sitting untouched for three weeks while objectively harder work gets finished ahead of it.",
        },
        {
          title: "Time as a foreign concept",
          description:
            "Chronic lateness despite genuine effort and real distress about it, and a poor internal sense of how long anything takes. Often described as having only two time zones: now and not now.",
        },
        {
          title: "Attention that will not be steered",
          description:
            "Six hours of complete absorption in something interesting, and an inability to hold thirty seconds on something that is not. The deficit is in directing attention, not in having it.",
        },
        {
          title: "Working memory dropping things in real time",
          description:
            "Walking into a room and losing the reason. Losing your own sentence halfway through. Reading the same paragraph three times with none of it landing.",
        },
        {
          title: "Emotions arriving at full volume",
          description:
            "Frustration, rejection sensitivity, and irritation hitting before there is any chance to moderate them. Frequently the most damaging feature in relationships and the least commonly associated with ADHD.",
        },
        {
          title: "The graveyard of abandoned systems",
          description:
            "A new app, planner, or routine that works beautifully for eleven days and then vanishes. The repetition of that cycle is itself informative.",
        },
        {
          title: "Restlessness that went internal",
          description:
            "Hyperactivity does not disappear with age, it relocates. It becomes an inability to sit through a film, talking over people, constant background agitation, or a need for stimulation that drives impulsive decisions.",
        },
        {
          title: "Interest-driven rather than importance-driven",
          description:
            "Effort follows interest, novelty, and urgency rather than importance. Which is why deadlines work and long-term consequences do not.",
        },
        {
          title: "Physical clutter that reappears",
          description:
            "Not simply untidiness. A full reset that lasts four days before the surfaces fill again, because the maintenance step is the part that does not stick.",
        },
      ],
    },
    {
      type: "comparison",
      eyebrow: "The differential",
      heading: "Other things that look exactly like this",
      intro:
        "This is the single most important reason not to self-diagnose from a video. Several conditions produce a near-identical picture and need entirely different treatment.",
      columns: ["Condition", "How it resembles ADHD", "What usually distinguishes it"],
      rows: [
        [
          "Untreated sleep apnea",
          "Poor concentration, forgetfulness, irritability, daytime fog",
          "Adult onset rather than lifelong, often with snoring, and it improves when sleep is treated",
        ],
        [
          "Depression",
          "Difficulty concentrating, poor motivation, unfinished tasks",
          "Episodic rather than lifelong, with low mood and loss of interest as the core features",
        ],
        [
          "Anxiety",
          "Distractibility, restlessness, poor sleep, difficulty finishing things",
          "Attention is captured by worry specifically, rather than being generally unsteerable",
        ],
        [
          "Trauma history",
          "Hypervigilance mistaken for distractibility, difficulty settling",
          "Symptoms trace to identifiable experiences, usually with intrusion and avoidance alongside",
        ],
        [
          "Thyroid dysfunction",
          "Fatigue, poor concentration, low mood or agitation",
          "Identified on a blood test, and it resolves once treated",
        ],
        [
          "Chronic sleep deprivation",
          "Essentially the full inattentive presentation",
          "It lifts after a period of adequate sleep, which lifelong ADHD does not",
        ],
      ],
      footnote:
        "These can also co-exist with ADHD rather than replace it, which is exactly why a structured evaluation is worth more than a checklist.",
    },
    {
      type: "checklist",
      eyebrow: "Deciding",
      heading: "Signs an assessment is likely worth your time",
      intro:
        "Assessment costs a visit. These are the indicators that it is more likely to be productive.",
      items: [
        {
          title: "It goes back as far as you can remember",
          description:
            "ADHD is developmental. Difficulties that began in your thirties point somewhere else. Old school reports are often startlingly clear once you know what to look for.",
        },
        {
          title: "It shows up everywhere, not in one setting",
          description:
            "At work and at home and in your own projects. Difficulty confined to one job usually says more about the job.",
        },
        {
          title: "It is costing you something real",
          description:
            "Missed deadlines, financial consequences, strained relationships, or capability that has never translated into results. Symptoms without impact do not meet the diagnostic threshold.",
        },
        {
          title: "You have already tried the obvious fixes",
          description:
            "Multiple productivity systems, sincere effort, and genuine motivation, and the pattern persists anyway. Repeated failure despite real effort is meaningful.",
        },
        {
          title: "Treatment for something else has not resolved it",
          description:
            "Depression or anxiety treated to a good response, with the concentration and disorganisation still fully in place, is a common route to a late ADHD diagnosis.",
        },
        {
          title: "It runs in the family",
          description:
            "ADHD is substantially heritable. A diagnosed child frequently prompts a parent to recognise themselves, and that recognition is often correct.",
        },
      ],
      footnote:
        "An assessment that concludes this is not ADHD is a useful result, not a wasted appointment. It redirects effort toward whatever is actually driving the difficulty.",
    },
    {
      type: "prose",
      eyebrow: "A word on self-diagnosis",
      heading: "Online content is a reasonable prompt and a poor conclusion",
      paragraphs: [
        "A great deal of ADHD content describes experiences that are close to universal. Losing your keys, procrastinating, getting bored in meetings. Recognition alone is not evidence, because the content is often written to maximise recognition.",
        "What separates ADHD from ordinary human inconsistency is the combination of lifelong presence, presence across settings, and genuine functional cost. Those three together are hard to establish from the inside, which is exactly what the structured elements of an evaluation are designed to test.",
        "That said, arriving at an appointment having read widely is not a problem. It usually means you can describe your own history far more precisely than someone who has never had language for it. Say where the recognition came from and what specifically resonated. Providers find that useful rather than suspect.",
        "The risk of self-diagnosis is not that you might be wrong about ADHD. It is that a treatable sleep disorder, thyroid problem, or depression goes unaddressed for another two years while you work on organisational systems that were never going to fix it.",
      ],
    },
    {
      type: "faq",
      eyebrow: "Common questions",
      heading: "Before seeking an assessment",
      items: [
        {
          question: "Is it too late to get diagnosed at forty or fifty?",
          answer:
            "No. Late diagnosis is increasingly common, and treatment works across the lifespan. Many people describe the greater benefit as the reframing itself: understanding decades of difficulty as a neurological difference rather than a character flaw.",
        },
        {
          question: "Do I need my school reports or a parent's account?",
          answer:
            "Helpful but not required. Since the diagnosis requires childhood onset, any evidence about how you were as a child adds weight. Where a parent is unavailable, your own recollection and any surviving records are used instead.",
        },
        {
          question: "Will I automatically be put on stimulants?",
          answer:
            "No. Medication is one option among several, non-stimulant medications exist, and some people choose structure, coaching, and accommodations without medication. Diagnosis and treatment are separate decisions.",
        },
        {
          question: "Could this just be anxiety?",
          answer:
            "It could, and the two also frequently co-exist. The distinguishing question is whether attention is being captured by worry specifically, or whether it is generally unsteerable regardless of mood. That is a core part of what an evaluation examines.",
        },
        {
          question: "What if I have been managing fine so far?",
          answer:
            "Then the question is what it has cost to manage. Many undiagnosed adults function well by working substantially harder than their peers for the same output. That is sustainable until it is not.",
        },
        {
          question: "Does a diagnosis go on a permanent record?",
          answer:
            "It becomes part of your medical record, which is protected health information. It is not shared with employers or anyone else without your written authorisation. Documentation for workplace or academic accommodations is provided only at your request.",
        },
      ],
    },
  ],
};
