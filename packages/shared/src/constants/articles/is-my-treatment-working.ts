import type { ResourceArticle } from "./types";

export const isMyTreatmentWorking: ResourceArticle = {
  slug: "is-my-treatment-working",
  category: "During Treatment",
  title: "How to Tell Whether Your Treatment Is Actually Working",
  description:
    "Improvement in mental health is gradual enough to be invisible from the inside. What response and remission mean, why scores beat memory, when partial improvement is not good enough, and when to push for a change.",
  readTime: "9 min read",
  reviewed: "2026-08-01",
  lead: [
    "A strange thing happens a few months into treatment. You are sleeping, you are working, you have started answering messages again, and you still cannot say whether the treatment is working, because you cannot clearly remember how bad it was in March.",
    "Recovery from depression and anxiety is usually gradual, and gradual change is close to invisible from the inside. That is not a memory failure. It is how adaptation works, and it is exactly why measurement matters.",
  ],
  blocks: [
    {
      type: "prose",
      eyebrow: "The problem",
      heading: "You are the least reliable narrator of your own improvement",
      paragraphs: [
        "Ask someone six weeks into treatment whether they are better and you will often get a shrug. Ask them concretely how many days in the past fortnight they did not get out of bed, and compare it to what they reported at intake, and a clear answer appears.",
        "Two things drive this. The first is that we compare to yesterday rather than to a baseline, so steady incremental change registers as no change at all. The second is that depression in particular distorts recall, making it hard to access memories of feeling well, which flattens the whole timeline into always having been like this.",
        "There is a related pattern worth watching for: the goalposts move. Someone who could not leave the house in January is out most days by April, and now measures themselves against people who are thriving rather than against January. The improvement was real and it has been quietly written out of the account.",
        "This is why measurement-based care exists. Repeating the same standardised questionnaire over time turns a vague impression into a comparable number, and it consistently improves outcomes in the research, mostly because it catches non-response earlier than clinical impression alone.",
      ],
    },
    {
      type: "comparison",
      eyebrow: "The vocabulary",
      heading: "Response, remission, and recovery are not the same thing",
      intro:
        "These terms have specific meanings in psychiatry and they matter, because settling at the first one is a common route back to where you started.",
      columns: ["", "What it means", "Why it matters"],
      rows: [
        [
          "Non-response",
          "Little or no meaningful change at an adequate dose and duration",
          "The trigger to change the plan rather than wait longer. Usually assessed at four to six weeks",
        ],
        [
          "Partial response",
          "Clear improvement, with symptoms still meaningfully present",
          "A common place to stop and a poor one, since residual symptoms strongly predict relapse",
        ],
        [
          "Response",
          "Conventionally around a fifty percent reduction in symptom severity",
          "Real progress, and not the end point. Half of a severe depression is still a considerable burden",
        ],
        [
          "Remission",
          "Symptoms reduced to a minimal level, close to how you were before",
          "The actual target of treatment. Best predictor of staying well",
        ],
        [
          "Recovery",
          "Remission sustained over a longer period",
          "The point at which tapering is generally discussed",
        ],
        [
          "Relapse",
          "Symptoms returning after improvement",
          "Most common after stopping treatment early, or after settling for partial response",
        ],
      ],
      footnote:
        "If your provider says you have responded, it is entirely reasonable to ask whether you are in remission, and if not, what the next step toward it would be.",
    },
    {
      type: "checklist",
      eyebrow: "Better than a general impression",
      heading: "Concrete markers worth tracking",
      intro:
        "Specific and countable beats how am I feeling, which is nearly impossible to answer accurately month to month.",
      items: [
        {
          title: "Your questionnaire score over time",
          description:
            "PHQ-9 for depression, GAD-7 for anxiety, and equivalents for other conditions. The same instrument repeated is what makes the comparison meaningful. Ask to see your scores rather than only being told they improved.",
        },
        {
          title: "Sleep, in hours and in pattern",
          description:
            "Frequently the first thing to move, in either direction. Time to fall asleep and number of night wakings are easier to report accurately than sleep quality.",
        },
        {
          title: "Days you did the thing you avoid",
          description:
            "Left the house, went to work, answered the phone, attended the class. A count out of fourteen is far more informative than a summary.",
        },
        {
          title: "Whether anything is enjoyable again",
          description:
            "Loss of interest is a core symptom and its return is a strong signal. The question is not whether life is good, but whether anything at all has registered as enjoyable this week.",
        },
        {
          title: "How long it takes to recover from a bad day",
          description:
            "In depression a bad day can absorb a week. Recovering within a day is meaningful progress even when the bad days have not stopped.",
        },
        {
          title: "What other people are noticing",
          description:
            "Partners and close friends often register improvement earlier than you do. Their observation is data, not flattery.",
        },
        {
          title: "Side effect burden",
          description:
            "Improvement that comes at the cost of exhaustion, emotional flatness, or sexual side effects is only a partial success. That tradeoff is negotiable rather than fixed.",
        },
      ],
    },
    {
      type: "timeline",
      eyebrow: "Reasonable expectations",
      heading: "When to expect what",
      intro:
        "Timelines for antidepressants and anti-anxiety medication. Stimulants for ADHD work much faster, usually within days.",
      entries: [
        {
          marker: "Weeks 1 to 2",
          title: "Side effects, rarely benefit",
          description:
            "This is the hardest stretch and the one people most often abandon. Judging a medication here is judging it at its worst point.",
        },
        {
          marker: "Weeks 2 to 4",
          title: "Physical symptoms shift first",
          description:
            "Sleep, appetite, and energy typically move before mood. Improvement here while still feeling low is a positive signal, not a contradiction.",
        },
        {
          marker: "Weeks 4 to 6",
          title: "The first fair assessment point",
          description:
            "If there has been no movement at all at an adequate dose by now, that is the conversation to have, rather than assuming more time will help.",
        },
        {
          marker: "Weeks 6 to 8",
          title: "Response should be evident",
          description:
            "Where a medication is going to work, meaningful improvement is usually apparent by this stage. Partial response is a cue to optimise rather than to accept.",
        },
        {
          marker: "Weeks 8 to 12",
          title: "Pushing from response toward remission",
          description:
            "Dose increase, an added agent, or a switch. Residual symptoms are worth actively treating rather than tolerating, because they predict relapse.",
        },
        {
          marker: "Months 4 and beyond",
          title: "Consolidation",
          description:
            "Treatment continues past feeling well, to protect the gain. This is also when therapy work tends to produce its most durable benefit.",
        },
      ],
    },
    {
      type: "prose",
      eyebrow: "Speaking up",
      heading: "How to say it is not working without feeling difficult",
      paragraphs: [
        "A surprising number of people sit through appointments reporting improvement they do not feel, because they do not want to seem ungrateful, difficult, or like a treatment failure. It is one of the more common ways months get lost.",
        "Providers need accurate information more than they need agreement. Saying that you do not think this is working is not a complaint, it is the specific input that drives the next clinical decision. Nobody is offended by it.",
        "Concrete language helps. Rather than I still feel bad, something like: my score has only moved three points, I am still waking at four every morning, and I have not been to work in ten days. That is actionable in a way a general statement is not.",
        "It is also worth saying if the tradeoff is wrong even when symptoms have improved. I am less depressed and I feel nothing at all, or this has resolved my anxiety and eliminated my sex drive, are both legitimate reasons to change treatment. Tolerating an unacceptable side effect indefinitely is not a requirement of care.",
        "If you have raised it and nothing changed, raise it again explicitly, and ask directly what the criteria are for trying something different. A reasonable provider will give you a clear answer.",
      ],
    },
    {
      type: "faq",
      eyebrow: "Common questions",
      heading: "About progress",
      items: [
        {
          question: "How long should I give a medication before deciding?",
          answer:
            "For antidepressants, generally four to six weeks at an adequate dose. Less than that is not a fair trial, since early side effects arrive before benefit. Considerably longer without any movement is usually waiting rather than treating.",
        },
        {
          question: "Is it normal to feel worse before better?",
          answer:
            "Early side effects can make the first week or two harder, which is different from the underlying condition worsening. New agitation, increased hopelessness, or thoughts of self-harm are not part of the expected course and warrant contacting your provider promptly.",
        },
        {
          question: "What if I feel better but not fully better?",
          answer:
            "That is partial response, and it is worth pushing past rather than accepting. Residual symptoms are one of the stronger predictors of relapse. Ask specifically what the next step toward remission would be.",
        },
        {
          question: "Could the improvement just be time passing?",
          answer:
            "Sometimes, and it is a fair question. The pattern usually distinguishes it: improvement that tracks with a dose change or the expected onset window points to treatment, and a comparison against your baseline score is more reliable than either impression.",
        },
        {
          question: "How do I know when I can stop?",
          answer:
            "Generally after a sustained period in remission, and it depends heavily on your history. A first episode is treated differently from a fourth. Whenever you decide, taper with your provider rather than stopping abruptly.",
        },
        {
          question: "What if I have improved but still do not feel like myself?",
          answer:
            "Worth naming directly. Emotional blunting is a recognised effect of some medications and is frequently mistaken for a permanent state or for the illness itself. It often responds to a dose adjustment or a different agent.",
        },
      ],
    },
  ],
};
