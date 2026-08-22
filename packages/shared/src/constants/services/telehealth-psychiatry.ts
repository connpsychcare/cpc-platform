import type { ContentBlock } from "../content-blocks";

export const telehealthPsychiatryBlocks: ContentBlock[] = [
  {
    type: "prose",
    eyebrow: "Why it works",
    heading: "Psychiatry translates to video better than most specialties",
    paragraphs: [
      "A psychiatric visit is built out of history, symptom review, and conversation. There is no physical examination that a screen prevents, which is why psychiatric telehealth held up in research even before it became widespread, showing outcomes broadly comparable to in-person care across depression, anxiety, and PTSD.",
      "The bigger effect is on whether care happens at all. The most common reasons people abandon psychiatric treatment are practical: the drive, the time off work, arranging childcare, the wait for an appointment that fits. Remove those and attendance improves, and attendance is what treatment depends on.",
      "There is a clinical benefit that gets less attention too. Seeing someone in their own home, on an ordinary Tuesday, gives a provider context that a clinic room does not. The environment you live in is part of the picture.",
      "Connected Psychiatric Care operates entirely by secure video across California. There is no office to travel to and no waiting room. Your visit happens wherever you have privacy and a reliable connection.",
    ],
  },
  {
    type: "process",
    eyebrow: "How a visit works",
    heading: "From booking to prescription",
    steps: [
      {
        title: "Book online, without a phone queue",
        description:
          "Choose a provider and a time that works. Evening and early appointments are easier to find when you are not competing for one clinic's physical rooms.",
      },
      {
        title: "Complete intake and screening in the portal",
        description:
          "History, medications, and validated questionnaires are submitted before your appointment so the visit itself is spent talking rather than filling in forms.",
        note: "Insurance benefits are verified in advance, and you are told what your plan covers before your first visit.",
      },
      {
        title: "Join the secure video visit",
        description:
          "A link arrives by email and appears in your portal. You need a phone, tablet, or computer with a camera and a stable connection. No software to buy, no account to create with a third party.",
      },
      {
        title: "Meet with your provider",
        description:
          "The same clinical conversation you would have in an office: history, symptoms, screening results, diagnosis, and options, with time for your questions.",
      },
      {
        title: "Prescriptions sent electronically",
        description:
          "Any prescription is transmitted to the pharmacy you nominate, including mail-order pharmacies. Nothing to carry, nothing to lose.",
      },
      {
        title: "Stay connected between visits",
        description:
          "Message your care team through the portal, view your notes and screening scores, request refills, and book your next appointment without calling.",
      },
    ],
  },
  {
    type: "checklist",
    eyebrow: "Setting up",
    heading: "How to get a good visit out of a video call",
    intro:
      "Small things make a surprising difference to how open a conversation can be.",
    items: [
      {
        title: "Find somewhere you can speak freely",
        description:
          "A parked car, a bedroom with the door shut, or a walk in a quiet place all work. If you are censoring yourself because of who might overhear, the visit is worth less than it should be.",
      },
      {
        title: "Use headphones",
        description:
          "They keep your provider's side of the conversation private and cut background noise. The single highest-value item on this list in a shared household.",
      },
      {
        title: "Test the connection beforehand",
        description:
          "Join a few minutes early. If your internet is unreliable, being near the router or switching to cellular data usually solves it.",
      },
      {
        title: "Put light in front of you, not behind",
        description:
          "A window at your back turns you into a silhouette. Facial expression is part of a psychiatric assessment, so it is worth being visible.",
      },
      {
        title: "Have your medications within reach",
        description:
          "Actual bottles beat memory. Doses and pill strengths matter, and reading them off is faster than describing the colour.",
      },
      {
        title: "Keep your questions on a note",
        description:
          "It is easy to reach the end of a visit and remember the thing you meant to ask. A short list prevents it.",
      },
      {
        title: "Know where you are physically",
        description:
          "Your provider needs your current location for licensing and for safety planning. If you are travelling, say so at the start of the visit.",
      },
    ],
  },
  {
    type: "comparison",
    eyebrow: "An honest comparison",
    heading: "Telehealth against a traditional clinic",
    intro:
      "Video is genuinely better for some things and genuinely limited for others. Both are worth knowing before you decide.",
    columns: ["", "Secure video visits", "Traditional in-office psychiatry"],
    rows: [
      [
        "Access",
        "Anywhere in California with privacy and a connection",
        "Limited to a commutable radius around the office",
      ],
      [
        "Time cost",
        "The length of the appointment",
        "The appointment plus travel, parking, and waiting",
      ],
      [
        "Scheduling",
        "Easier to find times outside the standard working day",
        "Constrained by clinic hours and room availability",
      ],
      [
        "Continuity",
        "Attendance holds up better through weather, illness, and travel",
        "Missed appointments are more common when logistics intervene",
      ],
      [
        "Physical assessment",
        "Not possible; vitals and labs are arranged locally",
        "Available in the room",
      ],
      [
        "Acute crisis care",
        "Not appropriate; emergency services are the right route",
        "Also not an emergency service, but physically present",
      ],
      [
        "Privacy",
        "Depends on your space, and improves with headphones",
        "Controlled clinical environment",
      ],
    ],
    footnote:
      "Neither format is an emergency service. If you are in immediate danger, call 911, or call or text 988 for the Suicide and Crisis Lifeline.",
  },
  {
    type: "prose",
    eyebrow: "The limits",
    heading: "What telehealth cannot do",
    paragraphs: [
      "Telehealth is not the right setting for an acute psychiatric emergency. If you are at immediate risk of harming yourself or someone else, the right call is 911 or your nearest emergency department. Call or text 988 to reach the Suicide and Crisis Lifeline at any hour.",
      "Some medications require blood monitoring, and some presentations require a physical examination or lab work before it is safe to prescribe. When that applies, your provider will arrange it with a local lab or your primary care provider and continue managing your psychiatric care by video.",
      "Controlled substances, including stimulants used for ADHD, sit under federal and California rules that are stricter than for other prescriptions and have shifted over recent years. Your provider will explain exactly what those rules mean for your treatment rather than leaving you to guess.",
      "California licensure means care is provided to patients located in California. If you move out of state or travel for an extended period, tell your care team so continuity can be planned rather than interrupted.",
    ],
  },
  {
    type: "faq",
    eyebrow: "Common questions",
    heading: "About video visits",
    items: [
      {
        question: "Do I need to download special software?",
        answer:
          "No. The visit opens from the link in your email or portal in a standard browser on a phone, tablet, or computer. All you need is a camera, a microphone, and a stable connection.",
      },
      {
        question: "Is a video visit private?",
        answer:
          "The platform is HIPAA-secure and sessions are not recorded. The variable is your side: a room where you cannot be overheard, and headphones, do most of the work.",
      },
      {
        question: "What if my connection drops mid-visit?",
        answer:
          "It happens and it is not a problem. Rejoin using the same link. If the connection will not hold, your provider can continue by phone so the appointment is not wasted.",
      },
      {
        question: "Can I be anywhere in California?",
        answer:
          "Yes, anywhere in the state. Our providers are California-licensed, which is what determines where care can be delivered. Tell your provider if you are temporarily outside California.",
      },
      {
        question: "Do you accept insurance for telehealth visits?",
        answer:
          "Yes. California parity law requires most commercial plans to cover telehealth mental health services on the same basis as in-person care. We verify your benefits before your first visit so there are no surprises.",
      },
      {
        question: "Can adolescents be seen by video?",
        answer:
          "Yes. For younger patients a parent or guardian usually joins for part of the visit and steps away for part of it, which is straightforward to arrange over video.",
      },
      {
        question: "What if I would rather not be on camera?",
        answer:
          "Say so. Video is preferred because expression and presentation are part of an assessment, but your provider will work with you if being on camera is itself a barrier to getting care.",
      },
    ],
  },
];
