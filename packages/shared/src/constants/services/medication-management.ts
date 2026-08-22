import type { ContentBlock } from "../content-blocks";

export const medicationManagementBlocks: ContentBlock[] = [
  {
    type: "prose",
    eyebrow: "How decisions get made",
    heading: "Prescribing is a series of informed guesses, narrowed carefully",
    paragraphs: [
      "There is no blood test that tells a provider which antidepressant will work for you. Choosing a medication means weighing your diagnosis, your symptom pattern, your medical history, what you have already tried, what worked for blood relatives, what side effects you are least willing to tolerate, and what else you take. Then you start, and you watch closely.",
      "That means the first medication is a well-reasoned starting point rather than a final answer. A meaningful share of people need a dose change or a switch before they find the right fit. That is expected, and it is not a sign that treatment is failing or that your case is unusually difficult.",
      "What separates good medication management from a prescription is the follow-through. Structured check-ins, repeat screening scores rather than memory alone, honest conversations about side effects, and a willingness to change course rather than wait it out indefinitely.",
      "You are the one living with the result. If a medication is flattening you, blunting your sex drive, wrecking your sleep, or simply not helping, that is clinical information your provider needs. There are almost always other options.",
    ],
  },
  {
    type: "timeline",
    eyebrow: "What to expect",
    heading: "The first three months on a new medication",
    intro:
      "This arc is typical for antidepressants and anti-anxiety medications. Stimulants for ADHD work on a much faster timeline, often within days.",
    entries: [
      {
        marker: "Days 1 to 7",
        title: "Side effects usually arrive before benefits",
        description:
          "Nausea, headache, sleep changes, and some early jitteriness are common in the first week and typically settle. This stretch is where people most often stop on their own, and it is the stretch most worth riding out. Message your provider rather than quietly quitting.",
      },
      {
        marker: "Weeks 2 to 4",
        title: "First signals, often noticed by other people",
        description:
          "Early change tends to show up in sleep, appetite, and energy before mood. Others sometimes notice before you do. Your first follow-up usually lands here so the dose can be adjusted while the picture is still forming.",
      },
      {
        marker: "Weeks 4 to 8",
        title: "The real assessment window",
        description:
          "Most antidepressants need four to six weeks at an adequate dose before you can fairly judge them. Repeating your PHQ-9 or GAD-7 here gives a comparison against your baseline that is more reliable than trying to remember how bad February was.",
      },
      {
        marker: "Weeks 8 to 12",
        title: "Optimize, augment, or switch",
        description:
          "If you have partial benefit, the usual next step is a dose increase or adding a second agent. If there has been no response at an adequate dose and duration, switching is generally more sensible than waiting longer.",
      },
      {
        marker: "Beyond three months",
        title: "Maintenance and spacing out visits",
        description:
          "Once you are stable, visits typically move to every one to three months. Continuing treatment for a meaningful period after you feel well substantially lowers relapse risk, which is why providers rarely recommend stopping the moment things improve.",
      },
    ],
  },
  {
    type: "grid",
    eyebrow: "The landscape",
    heading: "Classes of psychiatric medication and what they are for",
    intro:
      "General orientation, not a recommendation. What is right for you depends on your diagnosis and history, and that is a conversation with your provider.",
    columns: 3,
    items: [
      {
        title: "SSRIs",
        description:
          "Selective serotonin reuptake inhibitors are first-line for many depressive and anxiety disorders. Generally well tolerated, non-habit-forming, and slow to act. Common tradeoffs include early nausea, sleep changes, and sexual side effects.",
      },
      {
        title: "SNRIs",
        description:
          "Serotonin and norepinephrine reuptake inhibitors work on two systems and are often used for depression with fatigue or with co-occurring chronic pain. Blood pressure is monitored on some agents in this class.",
      },
      {
        title: "Atypical antidepressants",
        description:
          "Agents that do not fit the SSRI or SNRI pattern. Some are chosen specifically to avoid sexual side effects, others because they help sleep or appetite. Useful when the first-line options were not tolerated.",
      },
      {
        title: "Mood stabilizers",
        description:
          "Used in bipolar spectrum disorders to reduce the height and depth of mood cycles. Several require periodic blood monitoring, which is a routine part of care rather than a warning sign.",
      },
      {
        title: "Atypical antipsychotics",
        description:
          "Despite the name, these are widely used at lower doses for bipolar disorder and as add-ons for depression that has not responded to an antidepressant alone. Metabolic effects are monitored with periodic labs.",
      },
      {
        title: "Stimulants",
        description:
          "First-line for ADHD, with effects usually apparent within days rather than weeks. Controlled substances, so they carry additional prescribing rules and require regular follow-up.",
      },
      {
        title: "Non-stimulant ADHD medications",
        description:
          "An option when stimulants are not tolerated, not appropriate given cardiac or substance-use history, or simply not preferred. Slower to take effect, typically over several weeks.",
      },
      {
        title: "Sleep-targeted medications",
        description:
          "Sometimes appropriate short term, though persistent insomnia usually responds better and more durably to cognitive behavioral therapy for insomnia than to long-term sedatives.",
      },
      {
        title: "Benzodiazepines",
        description:
          "Fast-acting for acute anxiety, with real dependence and tolerance risk. Where used, it is deliberately short term and alongside a longer-term plan, not as a standing solution.",
      },
    ],
  },
  {
    type: "checklist",
    eyebrow: "Ongoing monitoring",
    heading: "What your provider tracks between visits",
    items: [
      {
        title: "Repeat symptom scores",
        description:
          "The same instruments used at intake, repeated over time. Scores make partial improvement visible in a way that memory does not, especially when progress is gradual.",
      },
      {
        title: "Side effects, including the ones people avoid raising",
        description:
          "Sexual side effects, emotional blunting, and weight change are common, under-reported, and frequently fixable by changing agent or dose. They are worth naming directly.",
      },
      {
        title: "Sleep and appetite",
        description:
          "Both tend to shift before mood does, in either direction, which makes them a useful early signal of how a medication is landing.",
      },
      {
        title: "Relevant lab work",
        description:
          "Some medications call for periodic monitoring, such as thyroid and kidney function on lithium, or metabolic panels on certain antipsychotics. Your provider will tell you what applies to your regimen and how often.",
      },
      {
        title: "Interactions with anything new",
        description:
          "Tell your provider about new prescriptions, over-the-counter medications, and supplements. St. John's wort in particular interacts significantly with serotonergic medications.",
      },
      {
        title: "Alcohol and other substances",
        description:
          "Asked without judgment, because it genuinely changes how medications behave and how safe a given combination is.",
      },
      {
        title: "Safety",
        description:
          "Reviewed at every visit, in every direction. Increased agitation, new hopelessness, or thoughts of self-harm are reasons to contact your provider before your next scheduled appointment.",
      },
    ],
  },
  {
    type: "callout",
    heading: "Do not stop a psychiatric medication abruptly",
    body:
      "Stopping suddenly can cause discontinuation symptoms including dizziness, electric-shock sensations, irritability, flu-like feelings, and rebound anxiety. With mood stabilizers and antipsychotics, abrupt discontinuation also raises the risk of relapse. If you want to come off a medication, that is a completely reasonable goal. Message your provider and it can be tapered on a schedule that keeps you comfortable.",
    variant: "urgent",
  },
  {
    type: "faq",
    eyebrow: "Common questions",
    heading: "What people ask about medication",
    items: [
      {
        question: "Will I be on medication for the rest of my life?",
        answer:
          "Often no. For a single episode of depression or anxiety, treatment is commonly continued for a period after recovery and then tapered. Some conditions, including bipolar disorder, usually call for longer-term maintenance because relapse risk stays high without it. Your provider will tell you which situation applies to you and why.",
      },
      {
        question: "Will medication change my personality?",
        answer:
          "It should not. The aim is to reduce symptoms while leaving you recognisably yourself. If you feel flat, numbed, or not like you, that is a side effect worth reporting rather than a price of treatment. It usually responds to a dose change or a different agent.",
      },
      {
        question: "Can I drink alcohol on psychiatric medication?",
        answer:
          "It depends on the medication and the amount. Alcohol worsens depression and disrupts sleep on its own, and combined with sedating medications it increases impairment. Ask about your specific regimen rather than assuming, and answer honestly so the advice you get is actually useful.",
      },
      {
        question: "What if the first medication does not work?",
        answer:
          "That is a common and planned-for outcome, not a dead end. The next step is usually a dose adjustment, a switch within or across classes, or adding a second agent. Most people who continue working through options find something that helps.",
      },
      {
        question: "Can you prescribe controlled substances by telehealth?",
        answer:
          "Controlled substances, including stimulants for ADHD, are governed by federal and California rules that are stricter than for other prescriptions and have changed over recent years. Your provider will explain exactly what applies to your situation, including any requirement for an in-person evaluation.",
      },
      {
        question: "Can you take over prescribing from my current provider?",
        answer:
          "Yes. Bring your current regimen and, where possible, records from your previous prescriber. Transfers of care go most smoothly when your provider can see what has already been tried and at what doses.",
      },
      {
        question: "How do refills work between appointments?",
        answer:
          "Refills are issued in line with your follow-up schedule, so keeping appointments is what keeps prescriptions uninterrupted. Request refills through the patient portal with several days of lead time rather than on your last pill.",
      },
      {
        question: "What if I am pregnant or planning to be?",
        answer:
          "Tell your provider as early as you can. This is a genuine risk-versus-risk discussion, because untreated psychiatric illness in pregnancy carries its own significant risks. Decisions here are made together and coordinated with your obstetric provider.",
      },
    ],
  },
];
