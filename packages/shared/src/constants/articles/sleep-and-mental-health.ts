import type { ResourceArticle } from "./types";

export const sleepAndMentalHealth: ResourceArticle = {
  slug: "sleep-and-mental-health",
  category: "Everyday Wellbeing",
  title: "Sleep Is Not a Side Issue in Mental Health",
  description:
    "Poor sleep is treated as a symptom when it is frequently a driver. Why the relationship runs both ways, what the evidence says about treating insomnia directly, and the changes that actually work.",
  readTime: "9 min read",
  reviewed: "2026-08-01",
  lead: [
    "Sleep is usually the first thing to go and the last thing anyone treats directly. It gets recorded as a symptom of the depression or the anxiety, on the assumption that fixing the mood will fix the sleep.",
    "The evidence has moved on from that assumption. The relationship runs in both directions, and treating sleep as its own target frequently improves the psychiatric condition rather than merely reflecting it.",
  ],
  blocks: [
    {
      type: "prose",
      eyebrow: "The relationship",
      heading: "Sleep problems predict mental illness, not only follow it",
      paragraphs: [
        "For a long time insomnia was classified as secondary to psychiatric illness. Research over the past two decades has substantially revised that. Insomnia is now understood to be a risk factor for developing depression, not merely a symptom of it, and people with persistent insomnia develop depression at markedly higher rates than those without.",
        "The direction matters clinically. If poor sleep were only downstream of mood, treating mood alone would be sufficient. Because it also feeds back upward, leaving it untreated means leaving a driver in place. Residual insomnia after depression treatment is one of the better predictors of relapse.",
        "The mechanism is not mysterious. Sleep deprivation reduces activity in the prefrontal regions involved in regulating emotion while increasing reactivity in the amygdala. In plain terms, the brake weakens and the alarm gets louder. That is a recipe for the irritability, reactivity, and poor tolerance of stress that people recognise immediately after a bad night.",
        "Sleep also matters in specific conditions in specific ways. Reduced need for sleep is one of the earliest warning signs of an emerging manic or hypomanic episode in bipolar disorder, which is why sleep tracking is a core part of managing it. Nightmares are a defining feature of PTSD. Delayed sleep timing is extremely common in ADHD.",
      ],
    },
    {
      type: "grid",
      eyebrow: "Not all the same problem",
      heading: "Different sleep problems, different causes",
      intro:
        "Naming the pattern precisely matters, because the treatments diverge.",
      items: [
        {
          title: "Difficulty falling asleep",
          description:
            "Lying awake with a racing mind. Most commonly associated with anxiety, and also with delayed circadian timing in ADHD and in adolescence.",
        },
        {
          title: "Waking in the early hours",
          description:
            "Waking at three or four and unable to return to sleep. Classically associated with depression, and one of the symptoms that tends to improve early in treatment.",
        },
        {
          title: "Sleeping far too much",
          description:
            "Ten or twelve hours and still exhausted. Seen in atypical depression, in bipolar depression, and in seasonal patterns. Often mistaken for laziness by everyone including the person experiencing it.",
        },
        {
          title: "Reduced need for sleep",
          description:
            "Four hours and genuinely energised, rather than tired and wired. Distinct from insomnia and an important early warning sign in bipolar disorder.",
        },
        {
          title: "Nightmares",
          description:
            "Repetitive distressing dreams, central to PTSD and often the symptom that most disrupts recovery. Specific treatments exist and are worth asking about directly.",
        },
        {
          title: "Sleep apnea",
          description:
            "Breathing interruptions producing fragmented sleep and daytime exhaustion. Frequently misread as depression or ADHD, and it needs a sleep study rather than a psychiatric medication.",
        },
        {
          title: "Restless legs",
          description:
            "An uncomfortable urge to move the legs at night. Treatable, associated with iron deficiency in some cases, and worsened by certain antidepressants.",
        },
        {
          title: "Shift work sleep disruption",
          description:
            "Circadian misalignment from rotating or night shifts. A genuine occupational health issue with an elevated associated risk of depression, and it requires a different approach from ordinary insomnia.",
        },
      ],
    },
    {
      type: "checklist",
      eyebrow: "What actually works",
      heading: "Changes with real evidence behind them",
      intro:
        "Ordered roughly by how much difference they tend to make, rather than by how easy they are.",
      items: [
        {
          title: "A fixed wake time, every day",
          description:
            "The highest-value single change and the one people most resist. A consistent wake time anchors the circadian system. Sleeping in to compensate for a bad night feels reasonable and reliably makes the following night worse.",
        },
        {
          title: "Get out of bed when you cannot sleep",
          description:
            "Lying awake trains your brain to associate the bed with wakefulness. After roughly twenty minutes, get up, do something dull in low light, and return when sleepy. Counterintuitive, and it is a core component of the most effective insomnia treatment there is.",
        },
        {
          title: "Bright light early, dim light late",
          description:
            "Morning daylight is the strongest signal for setting the circadian clock. Ten to twenty minutes outside shortly after waking does more than most evening interventions.",
        },
        {
          title: "Stop napping to catch up",
          description:
            "Daytime naps reduce the sleep pressure that helps you fall asleep at night. If you must nap, keep it short and early rather than long and late.",
        },
        {
          title: "Move caffeine earlier than feels necessary",
          description:
            "Caffeine has a half-life of several hours, so an afternoon coffee is still meaningfully active at bedtime. Being able to fall asleep after it does not mean the sleep quality is unaffected.",
        },
        {
          title: "Reconsider alcohol as a sleep aid",
          description:
            "It shortens time to falling asleep and degrades the second half of the night, fragmenting sleep and suppressing the stages involved in emotional processing. It is one of the most common causes of three a.m. waking.",
        },
        {
          title: "Ask about CBT-I rather than a sedative",
          description:
            "Cognitive behavioural therapy for insomnia is the recommended first-line treatment for chronic insomnia in major guidelines, ahead of medication, and its benefits persist after treatment ends.",
        },
      ],
      footnote:
        "Sleep hygiene advice alone, the standard list about dark rooms and screens, has modest effects for chronic insomnia. The behavioural components above are what carry most of the benefit.",
    },
    {
      type: "callout",
      heading: "When sleep problems need medical assessment rather than advice",
      body:
        "Loud snoring with pauses in breathing, gasping awake, or severe daytime sleepiness despite adequate time in bed all warrant assessment for sleep apnea, which is common, frequently undiagnosed, and treatable. Acting out dreams physically, falling asleep suddenly during the day, or an irresistible urge to move the legs at night are also reasons to seek evaluation rather than adjust your routine. These conditions imitate psychiatric illness closely enough that treating the psychiatric picture alone will not resolve them.",
      variant: "info",
    },
    {
      type: "prose",
      eyebrow: "In treatment",
      heading: "How medication interacts with sleep",
      paragraphs: [
        "Psychiatric medications affect sleep in both directions, and the effect is often manageable through timing alone. Some antidepressants are activating and are better taken in the morning. Others are sedating and are better at night. Being told to take something in the morning is frequently a deliberate decision rather than an arbitrary instruction.",
        "Stimulants for ADHD delay sleep onset if taken too late, which is one of the most common reasons people abandon them. This is usually a timing or formulation problem rather than a reason to stop, and it is worth raising rather than solving by discontinuing.",
        "Early improvement in sleep is often the first sign an antidepressant is working, arriving before any change in mood. That can be confusing, since you are sleeping better while still feeling flat. It is a positive signal rather than a mismatch.",
        "Sedatives and sleeping medications have a narrow legitimate role. They can be appropriate short term in specific situations, and they do not address the mechanisms that maintain chronic insomnia, which is why guidelines put behavioural treatment first. If you have been on a sleeping medication long term, that is worth reviewing rather than continuing by default.",
      ],
    },
    {
      type: "faq",
      eyebrow: "Common questions",
      heading: "About sleep",
      items: [
        {
          question: "How much sleep do I actually need?",
          answer:
            "Most adults need somewhere between seven and nine hours, with genuine individual variation. The more useful measure than hours is how you function: consistent daytime alertness without relying on caffeine to stay upright suggests you are getting enough.",
        },
        {
          question: "Is it bad to look at my phone before bed?",
          answer:
            "The light effect is real but generally smaller than the content effect. Doom-scrolling and work email are activating in a way that matters more than screen brightness. A dull book on a screen is less of a problem than an alarming feed on paper.",
        },
        {
          question: "Should I take melatonin?",
          answer:
            "It is more useful for shifting sleep timing, such as in jet lag or delayed sleep phase, than as a general sedative. Doses sold over the counter are frequently far higher than what is needed. Worth discussing with your provider rather than guessing.",
        },
        {
          question: "Will treating my depression fix my sleep?",
          answer:
            "Often partly, and frequently not completely. Residual insomnia after depression has otherwise improved is common and predicts relapse, which is why treating sleep as its own target rather than waiting for it to resolve is worthwhile.",
        },
        {
          question: "Why do I wake at three every morning?",
          answer:
            "Common causes include alcohol earlier in the evening, depression, anxiety with early-hours rumination, and sleep apnea. The pattern alone does not identify which, and it is worth raising specifically rather than describing it simply as poor sleep.",
        },
        {
          question: "Is catching up at the weekend enough?",
          answer:
            "It helps with sleep debt somewhat and it costs you circadian stability. Shifting your wake time by several hours at the weekend produces a jet-lag effect that makes Monday harder. A smaller, more consistent schedule generally works better.",
        },
      ],
    },
  ],
};
