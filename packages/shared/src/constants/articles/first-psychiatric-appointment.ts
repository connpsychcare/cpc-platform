import type { ResourceArticle } from "./types";

export const firstPsychiatricAppointment: ResourceArticle = {
  slug: "first-psychiatric-appointment",
  category: "Getting Started",
  title: "How to Get the Most From Your First Psychiatric Appointment",
  description:
    "A practical preparation guide: what to gather beforehand, how to describe symptoms so they are understood accurately, what to ask, and what to do in the weeks after.",
  readTime: "9 min read",
  reviewed: "2026-08-01",
  lead: [
    "Most people leave a first psychiatric appointment feeling they forgot half of what they meant to say. That is not a personal failing. You are being asked to summarise months or years of difficult experience to a stranger, in one sitting, while feeling exactly the way that brought you there.",
    "The visit itself is your provider's job. Getting the most out of it is something you can influence a great deal beforehand, and it does not take long. This guide is about your side of the appointment, not ours.",
  ],
  blocks: [
    {
      type: "prose",
      eyebrow: "Why preparation matters",
      heading: "Your provider can only work with what they are told",
      paragraphs: [
        "A psychiatric assessment is built almost entirely from your account. There is no scan that shows depression and no blood test that identifies ADHD. The history you give is the primary clinical data, which puts unusual weight on how accurately it comes across.",
        "This is where memory works against you. Depression makes it hard to recall periods of feeling well, so people genuinely report having always been like this when they have not. Anxiety compresses time and makes recent weeks feel like the whole picture. Under-reporting is the norm rather than the exception, particularly among people who have spent years being told they are fine.",
        "Fifteen minutes of preparation closes most of that gap. Not a document, not a presentation. A few notes on your phone that stop you leaving the important thing unsaid because it did not occur to you at the time.",
      ],
    },
    {
      type: "checklist",
      eyebrow: "Before the visit",
      heading: "Worth gathering, in rough order of usefulness",
      intro:
        "None of it is required. Each item you have makes the appointment more precise.",
      items: [
        {
          title: "Every medication and supplement, with doses",
          description:
            "Photograph the labels rather than writing them out. Include over-the-counter products and supplements, which interact more often than people expect.",
        },
        {
          title: "What you have tried before and what happened",
          description:
            "Names if you have them, approximate if not. Whether something helped, whether you stopped, and why. A medication you stopped because of a side effect tells your provider something entirely different from one you stopped because it did nothing.",
        },
        {
          title: "A rough timeline of when things changed",
          description:
            "Not dates. Something more like: fine until the year I changed jobs, worse after my father died, sharply worse in the last four months. That shape is often more diagnostic than the symptom list.",
        },
        {
          title: "Recent lab results",
          description:
            "Thyroid function, vitamin B12, vitamin D, and a basic metabolic panel all affect mood, energy, and concentration. If they have been drawn recently, bring the numbers rather than the impression.",
        },
        {
          title: "Family psychiatric history, however patchy",
          description:
            "Undiagnosed counts. A grandfather who drank heavily, an aunt who was never right after her second child, a sibling on something for anxiety. Response to particular medications runs in families, so even vague history is useful.",
        },
        {
          title: "What a normal week looks like right now",
          description:
            "Sleep and wake times, alcohol and caffeine intake, work hours, and how much of the week involves other people. Concrete detail beats a summary.",
        },
        {
          title: "Your three most important questions, written down",
          description:
            "The end of an appointment is exactly when they stop coming to mind. Written, they take ninety seconds to ask.",
        },
      ],
    },
    {
      type: "prose",
      eyebrow: "The hardest part",
      heading: "Describing symptoms in a way that lands",
      paragraphs: [
        "There is a habit almost everyone has of translating their experience into acceptable language on the way to a doctor. Not sleeping well becomes a bit tired. Not having got out of bed on Saturday or Sunday for two months becomes low energy. The translation is polite and it costs you accuracy.",
        "Specific beats general every time. I am stressed conveys almost nothing. I have woken at four every morning for six weeks, I have lost about ten pounds without trying, and I sat in the car park for twenty minutes on Tuesday because I could not make myself go in conveys a great deal, including severity.",
        "Frequency and duration matter as much as intensity. How many days out of the last fourteen. How long since it was different. Whether it is present most of the day or arrives in the evenings. These are the exact parameters that separate one diagnosis from another, and they are hard to reconstruct on the spot.",
        "Say the frightening things directly. Thoughts of not wanting to be alive, or of harming yourself, are among the most important pieces of clinical information there are, and they are the most commonly withheld. Naming them does not automatically trigger hospitalisation. It changes how urgently you are treated and what safety planning goes into the visit, both of which are in your interest.",
        "It is also fine to say you do not know. I cannot tell whether this is depression or whether I am just exhausted is a completely reasonable place to start. Sorting that out is the work of the appointment, not a prerequisite for booking it.",
      ],
    },
    {
      type: "grid",
      eyebrow: "Worth asking",
      heading: "Questions that change what you leave with",
      intro:
        "Pick the two or three that matter most to you. You are not expected to run through all of them.",
      columns: 2,
      items: [
        {
          title: "What do you think is going on, and what else did you consider?",
          description:
            "The second half is the useful half. It tells you what the alternatives were and what would change the picture, which matters if things do not improve as expected.",
        },
        {
          title: "How will we know if this is working?",
          description:
            "Ask for something concrete. Which symptoms should shift first, by when, and what score change on the questionnaire would count as real progress.",
        },
        {
          title: "What are the most likely side effects, and which ones should worry me?",
          description:
            "There is a difference between effects that settle in two weeks and effects that mean stop and call. Knowing which is which prevents both unnecessary alarm and dangerous waiting.",
        },
        {
          title: "How long before I should expect a change?",
          description:
            "Realistic timelines prevent people abandoning a medication in week two, which is exactly when side effects are at their peak and benefit has not arrived yet.",
        },
        {
          title: "What happens if this one does not work?",
          description:
            "Hearing the plan B in advance makes an unsuccessful first attempt feel like a step in a process rather than proof that nothing will help.",
        },
        {
          title: "Would therapy help alongside this, and what kind?",
          description:
            "The type matters. Cognitive behavioural therapy, trauma-focused approaches, and general supportive counselling suit different problems.",
        },
        {
          title: "What should I do if things get worse before my next appointment?",
          description:
            "Get the answer explicitly: what warrants a message, what warrants an urgent appointment, and what warrants emergency care.",
        },
        {
          title: "Can I see my notes and scores?",
          description:
            "Reading the visit summary afterwards catches the things you nodded along to at the time without fully absorbing.",
        },
      ],
    },
    {
      type: "process",
      eyebrow: "Afterwards",
      heading: "The two weeks after your appointment",
      intro:
        "What happens after the visit determines a lot more than most people realise.",
      steps: [
        {
          title: "Write down what was decided, that same day",
          description:
            "Three lines is enough: the diagnosis discussed, what you are starting, and when the follow-up is. Detail fades faster than you expect, particularly after an emotionally heavy conversation.",
        },
        {
          title: "Start the medication when you said you would",
          description:
            "A very common pattern is filling the prescription and then leaving it in the drawer for three weeks. If ambivalence is what is stopping you, that is worth a message rather than a silent delay.",
        },
        {
          title: "Keep a one-line daily note",
          description:
            "Sleep, mood out of ten, and anything notable. Thirty seconds a day. At your follow-up this is far more accurate than trying to summarise a fortnight from memory, and it makes gradual improvement visible.",
        },
        {
          title: "Report side effects early rather than enduring them",
          description:
            "Most early side effects are manageable with a timing or dose change. People who quietly stop and then say nothing until the next appointment lose a month for no reason.",
        },
        {
          title: "Keep the follow-up appointment even if nothing has changed",
          description:
            "Nothing has changed is itself the information that drives the next decision. The follow-up is not a reward for improvement.",
        },
        {
          title: "Say so if the plan does not feel right",
          description:
            "Disagreement is clinically useful. A plan you have quietly decided not to follow helps nobody, and saying so usually produces a better one.",
        },
      ],
    },
    {
      type: "callout",
      heading: "If things get worse while you are waiting for an appointment",
      body:
        "Do not wait it out. Call or text 988 to reach the Suicide and Crisis Lifeline, free and confidential, 24 hours a day. Call 911 or go to an emergency department if you are in immediate danger. Deterioration between booking and being seen is common, and it is a reason to seek help sooner rather than a reason to be embarrassed at your appointment.",
      variant: "urgent",
    },
    {
      type: "faq",
      eyebrow: "Common questions",
      heading: "Things people worry about beforehand",
      items: [
        {
          question: "What if I get emotional or cannot get the words out?",
          answer:
            "That happens in a large share of first appointments and your provider will not be surprised by it. Take the time you need. You can also write the hardest part down beforehand and hand it over, or say that there is something you are struggling to say out loud.",
        },
        {
          question: "Will I be judged for how long I waited?",
          answer:
            "No. Most people wait years, and the reasons for waiting are usually themselves symptoms: hopelessness, shame, or the belief that it is not bad enough. Nobody is keeping score.",
        },
        {
          question: "Can I bring someone with me?",
          answer:
            "Yes, and it often helps. Another person frequently remembers things you have normalised, and can hold on to what was said when you are too overwhelmed to retain it. You can also ask them to step away for part of the visit.",
        },
        {
          question: "What if I am not sure I want medication?",
          answer:
            "Say that at the start. It is a legitimate position and it shapes the whole conversation. You can have an evaluation, understand what is happening, and decide about treatment separately.",
        },
        {
          question: "Do I have to have everything ready to book?",
          answer:
            "No. Everything in this guide improves an appointment and none of it is a requirement. Turning up with nothing prepared is still far better than not turning up.",
        },
      ],
    },
  ],
};
