import type { ResourceArticle } from "./types";

export const psychiatryVsTherapy: ResourceArticle = {
  slug: "psychiatry-vs-therapy",
  category: "Mental Health Basics",
  title: "Psychiatrist, Therapist, or Both? How to Tell What You Need",
  description:
    "The two roles do different jobs and are frequently confused. A clear breakdown of who does what, which to start with, how they work together, and what the letters after a provider's name actually mean.",
  readTime: "8 min read",
  reviewed: "2026-08-01",
  lead: [
    "Do I need a psychiatrist or a therapist is one of the most common questions people arrive with, and it is usually asked with the assumption that it is a fork in the road. It is closer to a question of sequencing, because for many conditions the answer is both, in an order that depends on what is happening.",
    "The confusion is understandable. Both roles sit under the heading of mental health, both involve talking, and the titles overlap in ordinary speech in ways they do not in practice.",
  ],
  blocks: [
    {
      type: "comparison",
      eyebrow: "The core difference",
      heading: "Two roles, two different jobs",
      intro:
        "The simplest distinction: one treats the biology, the other treats the patterns. Most people benefit from attention to both.",
      columns: ["", "Psychiatric provider", "Therapist"],
      rows: [
        [
          "Trained in",
          "Medicine and psychiatric diagnosis",
          "Psychotherapy and behavioural change",
        ],
        [
          "Can prescribe",
          "Yes",
          "No",
        ],
        [
          "Main tools",
          "Diagnosis, medication, medical workup, monitoring",
          "Structured talk-based treatment and skills work",
        ],
        [
          "Visit rhythm",
          "A longer first visit, then shorter reviews every one to three months",
          "Typically weekly or fortnightly sessions of similar length",
        ],
        [
          "What improvement depends on",
          "Finding the right medication and dose",
          "Consistent attendance and work between sessions",
        ],
        [
          "Strongest for",
          "Moderate to severe depression, bipolar disorder, ADHD, psychosis, severe anxiety",
          "Anxiety, trauma, relationship difficulty, mild to moderate depression, coping and skills",
        ],
        [
          "Time to benefit",
          "Weeks, once the right agent is found",
          "Weeks for skills, months for durable change",
        ],
      ],
      footnote:
        "Neither is a lesser version of the other. They address different parts of the same problem.",
    },
    {
      type: "prose",
      eyebrow: "Titles explained",
      heading: "What the letters after a name actually mean",
      paragraphs: [
        "A psychiatrist is a medical doctor who completed medical school and then a psychiatry residency. A psychiatric mental health nurse practitioner, usually written PMHNP-BC, is an advanced practice nurse with graduate training and board certification specifically in psychiatric care. Both diagnose and both prescribe, and in California both practise within defined scopes. Which one you see depends far more on availability and fit than on any difference in the day-to-day care of common conditions.",
        "On the therapy side, the alphabet is broader. LCSW is a licensed clinical social worker. LMFT is a licensed marriage and family therapist. LPCC is a licensed professional clinical counsellor. PhD and PsyD indicate a doctoral-level psychologist, who may also carry out formal psychological testing. None of these prescribe medication in California.",
        "The letters matter less than two other things: whether the person is licensed in your state, and whether they are trained in a modality that fits your problem. A therapist with specific training in exposure work for OCD will do more for OCD than a more senior generalist. It is entirely reasonable to ask about that directly before you book.",
        "A psychologist is not a psychiatrist, despite the similarity of the words. Psychologists are doctoral-level clinicians in psychology, not physicians, and in California they do not prescribe.",
      ],
    },
    {
      type: "grid",
      eyebrow: "Where to start",
      heading: "Common situations and the usual first step",
      intro:
        "General orientation rather than advice for your specific case. Starting in the other place is rarely a wasted step, because good providers redirect.",
      items: [
        {
          title: "Low mood and stress after a specific life event",
          description:
            "Therapy is a reasonable first stop. Where distress is a proportionate response to something identifiable, talk-based work often resolves it without medication.",
        },
        {
          title: "You cannot function day to day",
          description:
            "Start with a psychiatric evaluation. When someone cannot get out of bed or leave the house, medication frequently creates the capacity to make use of therapy.",
        },
        {
          title: "Anxiety that is limiting what you do",
          description:
            "Either works, and both together works better. Cognitive behavioural therapy has strong durable evidence in anxiety; medication lowers the baseline enough to engage with it.",
        },
        {
          title: "You suspect ADHD",
          description:
            "Psychiatric evaluation, because diagnosis and medication both sit there. Coaching or therapy for structure and organisation is a valuable addition afterwards.",
        },
        {
          title: "Mood swings, or episodes of unusually high energy",
          description:
            "Psychiatric evaluation first, and promptly. Bipolar spectrum illness needs accurate diagnosis before treatment, because the wrong medication can make it worse.",
        },
        {
          title: "Trauma history with intrusive memories",
          description:
            "Both, usually in a deliberate order: psychiatric care to stabilise sleep and arousal, then trauma-focused therapy, which is the treatment that addresses the injury itself.",
        },
        {
          title: "Relationship or family difficulty",
          description:
            "Therapy, and specifically a therapist trained in couples or family work. There is no medication for a communication breakdown.",
        },
        {
          title: "Thoughts of suicide or self-harm",
          description:
            "Urgent psychiatric assessment, not a waiting list. Call or text 988 now if these thoughts are present, and seek emergency care if you are in immediate danger.",
        },
        {
          title: "Grief that is not lifting",
          description:
            "Therapy first in most cases. Grief is not an illness, though when it stays disabling long beyond what is expected, psychiatric assessment is worth adding.",
        },
      ],
    },
    {
      type: "prose",
      eyebrow: "Why both",
      heading: "The case for combined treatment",
      paragraphs: [
        "For moderate to severe depression, the research consistently finds that medication and psychotherapy together outperform either alone. The two act on different parts of the problem, and the effects compound rather than overlap.",
        "The practical logic is easier to see than the statistics. Medication can lift someone far enough to attend a session, retain what is discussed, and attempt something between appointments. Therapy supplies the skills and the changes that make relapse less likely once medication is eventually reduced. One creates capacity, the other builds durability.",
        "This is also why the combination is particularly valuable when the plan involves eventually coming off medication. Someone who has done the therapy work is in a substantially stronger position at the point of tapering than someone whose only intervention was pharmacological.",
        "Cost and time are real constraints, and doing one well is better than doing two badly. If you can only manage one, take the recommendation of whichever provider you see first about which is the higher-value starting point for your situation.",
      ],
    },
    {
      type: "checklist",
      eyebrow: "Making it work",
      heading: "Getting two providers to function as one team",
      intro:
        "Care coordinated between a prescriber and a therapist works better than two separate treatments running in parallel.",
      items: [
        {
          title: "Give consent for them to communicate",
          description:
            "A short release form is all it takes. Without it, neither can discuss your care with the other, which leaves you carrying messages between them.",
        },
        {
          title: "Tell each about the other",
          description:
            "Names, and roughly what you are working on in each. It prevents duplicated effort and contradictory advice.",
        },
        {
          title: "Bring what your therapist notices to your psychiatric visit",
          description:
            "A therapist sees you weekly and often spots medication effects, including flattening or agitation, before a monthly review would.",
        },
        {
          title: "Do not ask your therapist about medication decisions",
          description:
            "They are not the right person, and putting them there creates awkwardness. Send the question to your prescriber through the portal instead.",
        },
        {
          title: "Say if the two approaches feel contradictory",
          description:
            "Occasionally providers pull in different directions. Naming it early gets it resolved, whereas leaving it usually ends with you disengaging from one of them.",
        },
        {
          title: "Keep both while things are improving",
          description:
            "The temptation to drop one as soon as you feel better is strong and it is the most common route back to where you started.",
        },
      ],
    },
    {
      type: "faq",
      eyebrow: "Common questions",
      heading: "What people ask",
      items: [
        {
          question: "Can a psychiatric provider do therapy as well?",
          answer:
            "Some do, though most psychiatric practice is oriented around diagnosis and medication management, with therapy delivered by a therapist. Ask directly about the model if having one person do both matters to you.",
        },
        {
          question: "Is a nurse practitioner as good as a psychiatrist?",
          answer:
            "For the everyday management of common psychiatric conditions, PMHNP-BC providers are trained, board-certified, and prescribe within their licensed scope. Highly complex or treatment-resistant presentations may warrant a physician psychiatrist, and a good provider will tell you when that applies.",
        },
        {
          question: "Do I need a referral to see a psychiatric provider?",
          answer:
            "Not to book with us. Some insurance plans require one for coverage, so it is worth checking your specific plan. We verify benefits before your first visit and flag it if a referral or prior authorisation is needed.",
        },
        {
          question: "Can I see a therapist while waiting for a psychiatric appointment?",
          answer:
            "Yes, and it is often a good use of the interval. Starting therapy first means the evaluation lands on someone already engaged in treatment, which is a stronger position than arriving cold.",
        },
        {
          question: "What if I do not click with my therapist?",
          answer:
            "Change. The relationship itself is one of the better predictors of outcome in therapy, so fit is not a luxury. Trying two or three before settling is normal and not something to feel awkward about.",
        },
        {
          question: "Does insurance cover both?",
          answer:
            "California parity law requires most commercial plans to cover mental health services on the same basis as medical care, and that generally includes both. Copays, session limits, and network status differ by plan, so it is worth checking specifics before you start.",
        },
      ],
    },
  ],
};
