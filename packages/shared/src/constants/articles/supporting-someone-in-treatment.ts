import type { ResourceArticle } from "./types";

export const supportingSomeoneInTreatment: ResourceArticle = {
  slug: "supporting-someone-in-treatment",
  category: "For Families",
  title: "Supporting Someone Through Mental Health Treatment Without Losing Yourself",
  description:
    "What actually helps when a partner, child, parent, or friend is struggling, which well-meant responses backfire, how to raise the subject, and how to sustain it without burning out.",
  readTime: "10 min read",
  reviewed: "2026-08-01",
  lead: [
    "Being close to someone who is struggling is its own difficult position, and it comes with almost no guidance. You are told to be supportive without anyone specifying what that means on a Tuesday evening when they will not get out of bed and you have already asked twice.",
    "This is about the practical version: what to say, what to stop saying, how to raise the subject, and how to keep doing it over months without ending up depleted yourself.",
  ],
  blocks: [
    {
      type: "callout",
      heading: "If you are worried about their immediate safety",
      body:
        "Ask directly. Have you been thinking about hurting yourself, or about not wanting to be here. Research consistently shows that asking does not plant the idea, and that it makes disclosure more likely. If the answer is yes, do not leave them alone, remove access to means where you can, and get help: call or text 988 for the Suicide and Crisis Lifeline, or call 911 if there is immediate danger. You are not required to manage this on your own, and treating it as urgent is the right call even if you turn out to be wrong.",
      variant: "urgent",
      tone: "plain",
    },
    {
      type: "prose",
      eyebrow: "The starting point",
      heading: "You are not the treatment",
      paragraphs: [
        "The most common trap for people in your position is taking responsibility for the outcome. It comes from the right place and it does not work, because you cannot want someone's recovery into existence, and trying tends to produce two exhausted people instead of one.",
        "What you can do is real and considerable. You can make it easier to get help. You can notice changes they have normalised. You can keep the connection alive during a stretch when they are withdrawing from everyone. You can be the reason an appointment gets kept. Those are not consolation prizes, they meaningfully affect outcomes.",
        "There is a related trap worth naming: assuming that because you love them, you should know what to do. Nobody knows what to do. The people who help most are usually the ones who ask what would help and then take the answer seriously, including when the answer is nothing today.",
        "It also helps to hold the distinction between the person and the illness. Depression makes people irritable and unresponsive. Anxiety makes them cancel. Those behaviours are symptoms, and while that does not make them painless to be on the receiving end of, it does change what conclusions you draw from them.",
      ],
    },
    {
      type: "comparison",
      eyebrow: "What lands, and what does not",
      heading: "Common responses and better alternatives",
      intro:
        "Almost everything in the left column is said with genuine care. The problem is what it communicates rather than what it intends.",
      columns: ["Instead of", "Try", "Why it works better"],
      rows: [
        [
          "Have you tried going for a walk?",
          "Do you want company for a short walk later? No is fine.",
          "Turns advice into an offer, and removes the implication that they have not thought of the obvious.",
        ],
        [
          "You have so much to be grateful for.",
          "It makes sense that this is hard.",
          "Gratitude framing implies the feeling is a failure of perspective, which adds guilt to an illness.",
        ],
        [
          "Let me know if you need anything.",
          "I am bringing dinner Thursday. Tell me if that does not work.",
          "Open offers require the unwell person to initiate, which is exactly the capacity the illness has removed.",
        ],
        [
          "You seem so much better!",
          "How are you finding things at the moment?",
          "Announcing improvement can make someone feel they must now perform it, and hide any slippage.",
        ],
        [
          "I know exactly how you feel.",
          "I do not know quite what this is like for you. Tell me.",
          "Claimed equivalence closes the conversation. Curiosity keeps it open.",
        ],
        [
          "You need to snap out of it.",
          "I am not going anywhere.",
          "Willpower framing implies choice. Depression is not sustained by choosing it.",
        ],
        [
          "Why did you not call me?",
          "I noticed you have been quiet. I am checking in.",
          "The first adds guilt to withdrawal. The second does the reaching for them.",
        ],
      ],
    },
    {
      type: "process",
      eyebrow: "The hard conversation",
      heading: "Raising it with someone who has not sought help",
      steps: [
        {
          title: "Pick a moment that is not a crisis",
          description:
            "Not mid-argument, not at midnight, not immediately after something has gone wrong. Calm and unhurried, ideally side by side rather than face to face. In a car or on a walk is often easier than across a table.",
        },
        {
          title: "Lead with observation, not diagnosis",
          description:
            "You have not been sleeping and you have stopped seeing anyone lands very differently from I think you are depressed. Specific observed changes are hard to argue with and do not require them to accept a label first.",
        },
        {
          title: "Say the effect on you, briefly and without blame",
          description:
            "I have been worried. Owning it as your concern rather than their failing keeps the conversation from becoming a defence.",
        },
        {
          title: "Make the next step small and concrete",
          description:
            "Not you need therapy. Something like: would you be willing to talk to someone once, and I will help find them. One appointment with no commitment beyond it is a much smaller thing to agree to.",
        },
        {
          title: "Offer to do the logistics",
          description:
            "Finding a provider, checking insurance, and booking are genuinely hard when you are depressed. Taking that on removes the most common practical barrier.",
        },
        {
          title: "Accept a no without withdrawing",
          description:
            "If they say no, leave the door open rather than escalating. I am going to ask again in a few weeks, and it stands whenever you want it. Pressure usually produces refusal that then has to be defended.",
        },
        {
          title: "Expect to have the conversation more than once",
          description:
            "It very often takes several attempts across months. Each one lowers the barrier a little, even when it appears to change nothing at the time.",
        },
      ],
    },
    {
      type: "checklist",
      eyebrow: "Sustaining it",
      heading: "Keeping yourself intact over the long run",
      intro:
        "This is not selfishness. Depleted carers are less able to help and are themselves at higher risk of depression and anxiety.",
      items: [
        {
          title: "Have someone of your own to talk to",
          description:
            "A friend, a therapist, or a carers' group. Being the only support for someone unwell is isolating in a way people rarely anticipate, and it accumulates quietly.",
        },
        {
          title: "Keep the parts of your life that are yours",
          description:
            "Work, friendships, exercise, the things you do for their own sake. Dismantling your own life does not add anything to theirs and makes the situation harder to sustain.",
        },
        {
          title: "Set limits, and be honest about which are firm",
          description:
            "You can care deeply and still say that you cannot take calls after midnight, or that you will not have that conversation while they are drinking. Limits that are stated and held are kinder than resentment that builds silently.",
        },
        {
          title: "Do not become their only support",
          description:
            "One person cannot be partner, therapist, crisis line, and case manager. Widening the circle protects the relationship as well as you.",
        },
        {
          title: "Let progress be non-linear",
          description:
            "Recovery includes bad weeks. Treating each dip as evidence that nothing is working exhausts you and puts pressure on them to perform improvement they may not feel.",
        },
        {
          title: "Notice your own signs",
          description:
            "Sleep loss, resentment, dread, and numbness are signals worth attending to. Carers develop depression and anxiety at elevated rates, and it is entirely reasonable to seek help for yourself.",
        },
      ],
    },
    {
      type: "faq",
      eyebrow: "Common questions",
      heading: "What people ask",
      items: [
        {
          question: "Can I speak to their provider?",
          answer:
            "Not without their written authorisation, since medical information is protected. What you can always do is send information to a provider. They cannot confirm or discuss anything, but they can receive what you tell them, and that can be genuinely useful clinically.",
        },
        {
          question: "What if they refuse help and are getting worse?",
          answer:
            "Keep the relationship, keep offering, and keep the door open. If they become a danger to themselves or others, that is a different situation: call 988 for guidance, or 911 in an emergency. California has a process for emergency psychiatric evaluation when someone is at immediate risk and unable to accept help.",
        },
        {
          question: "How do I support someone without enabling avoidance?",
          answer:
            "A workable line is helping with things they genuinely cannot do right now, while not taking over things they can. Making the appointment while they are barely functioning is support. Making every phone call for someone with social anxiety indefinitely reinforces the avoidance.",
        },
        {
          question: "Should I tell other family members?",
          answer:
            "Ask them first wherever possible. Losing control over who knows is a real harm and it damages trust. The exception is genuine safety risk, where involving others is warranted even if it is unwelcome.",
        },
        {
          question: "My teenager will not talk to me. What now?",
          answer:
            "Reduce the pressure of direct conversation. Adolescents often talk more easily side by side, in a car or while doing something else, than in a designated talk. Make clear that the door is open, keep showing up, and consider whether they would speak to another adult they trust.",
        },
        {
          question: "How do I know if I am helping?",
          answer:
            "You often cannot tell in the moment, which is genuinely hard. The things that matter most, staying in contact and keeping the door open, tend to show their value in hindsight rather than at the time.",
        },
      ],
    },
  ],
};
