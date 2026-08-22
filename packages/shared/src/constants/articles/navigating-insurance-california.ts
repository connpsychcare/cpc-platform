import type { ResourceArticle } from "./types";

export const navigatingInsuranceCalifornia: ResourceArticle = {
  slug: "navigating-insurance-california",
  category: "Insurance",
  title: "Paying for Psychiatric Care in California: A Plain-Language Guide",
  description:
    "Parity law, deductibles, prior authorisation, network status, and what to do if you are uninsured. What the terms mean, which questions to ask your insurer, and where costs usually surprise people.",
  readTime: "11 min read",
  reviewed: "2026-08-01",
  lead: [
    "Insurance is one of the more common reasons people delay psychiatric care, and rarely because coverage does not exist. More often it is because the system is opaque enough that finding out what you are entitled to feels like its own project.",
    "This guide covers the terms, the California-specific protections, and the specific questions that get you a useful answer from your insurer. It is general information about how coverage works, not advice about your particular plan.",
  ],
  blocks: [
    {
      type: "prose",
      eyebrow: "Your starting position",
      heading: "California parity law is stronger than most people realise",
      paragraphs: [
        "Federal parity law requires health plans that cover mental health to do so on terms no more restrictive than they apply to medical and surgical care. California went further. State law requires most commercial plans to cover the diagnosis and medically necessary treatment of mental health and substance use conditions, and to do it under the same terms as physical health care.",
        "In practical terms that means a plan cannot lawfully charge you a higher copay for a psychiatric visit than for a comparable specialist medical visit, impose visit limits it does not impose on medical care, or apply a separate and more restrictive deductible to mental health services.",
        "California also requires plans to offer timely access to care, with appointment wait-time standards that apply to non-urgent mental health appointments and follow-ups. If a plan cannot arrange care within those standards, that is a basis for a complaint rather than something you have to accept.",
        "Telehealth is covered on the same footing. California law requires plans to cover services delivered by telehealth where they would cover the same service in person, which is why remote psychiatric care is generally not a coverage obstacle.",
        "These protections apply to most commercial plans regulated in California. Some large self-funded employer plans are governed by federal rather than state law, so the state-specific provisions may not reach them. Your plan documents or your HR benefits contact can tell you which category you are in.",
      ],
    },
    {
      type: "grid",
      eyebrow: "The vocabulary",
      heading: "Terms that determine what you actually pay",
      intro:
        "Most confusion about a bill comes from three or four of these interacting. Worth reading once properly.",
      items: [
        {
          title: "Premium",
          description:
            "What you pay monthly to hold the plan, whether you use it or not. It has no bearing on what a given visit costs.",
        },
        {
          title: "Deductible",
          description:
            "What you pay yourself before the plan starts contributing. On a high-deductible plan, early-year visits may be billed at the full contracted rate, which is where most surprise bills originate.",
        },
        {
          title: "Copay",
          description:
            "A fixed amount per visit, such as thirty dollars. Usually applies once any deductible is met, though some plans apply copays to certain services from day one.",
        },
        {
          title: "Coinsurance",
          description:
            "A percentage of the cost rather than a flat fee, commonly twenty percent. Because it is proportional, the amount varies with the service.",
        },
        {
          title: "Out-of-pocket maximum",
          description:
            "The annual ceiling on your own spending for covered in-network care. Once reached, the plan covers eligible costs at one hundred percent for the rest of the plan year.",
        },
        {
          title: "In-network",
          description:
            "A provider with a contract with your plan, at negotiated rates. Your share is calculated from that contracted rate rather than the list price.",
        },
        {
          title: "Out-of-network",
          description:
            "No contract. Some plans reimburse a portion, many reimburse nothing, and out-of-network spending often does not count toward your in-network out-of-pocket maximum.",
        },
        {
          title: "Prior authorisation",
          description:
            "Advance approval from the insurer before a service or medication is covered. Common for certain medications, and the reason a pharmacy sometimes says a prescription was rejected.",
        },
        {
          title: "Explanation of benefits",
          description:
            "Not a bill. It is the insurer's summary of what was claimed, what they paid, and what remains your responsibility. Worth reading, because errors do occur and are appealable.",
        },
      ],
    },
    {
      type: "process",
      eyebrow: "Before your first visit",
      heading: "Getting a straight answer out of your insurer",
      intro:
        "Fifteen minutes on the phone before you start prevents most billing surprises. Write down the reference number and the name of whoever you speak to.",
      steps: [
        {
          title: "Find the member services number",
          description:
            "On the back of your insurance card. Some plans route behavioural health through a separate administrator with its own number, which is worth identifying up front.",
        },
        {
          title: "Ask about outpatient mental health specifically",
          description:
            "Do not ask about coverage in general. Ask about outpatient behavioural health office visits and telehealth visits with a psychiatric provider, which is the category that determines your cost.",
        },
        {
          title: "Ask whether your deductible applies",
          description:
            "The key question is whether behavioural health visits are subject to the deductible or covered at a copay from the first visit. This single answer changes your early-year cost more than anything else.",
        },
        {
          title: "Ask what remains on your deductible today",
          description:
            "Not the annual figure, the remaining balance. If you are three hundred dollars from meeting it, your first visits will look very different from the ones after.",
        },
        {
          title: "Confirm telehealth is covered identically",
          description:
            "It generally is under California law, but confirming it and recording the reference number gives you something concrete if a claim is later processed incorrectly.",
        },
        {
          title: "Ask whether a referral or prior authorisation is required",
          description:
            "Some plans, particularly HMOs, require a referral from your primary care provider before specialist care is covered. Finding out afterwards is expensive.",
          note: "Ask separately about prior authorisation for medications, since it is handled through the pharmacy benefit rather than the medical benefit.",
        },
        {
          title: "Ask what happens if a provider is out-of-network",
          description:
            "Specifically: what percentage is reimbursed, whether there is a separate out-of-network deductible, and whether that spending counts toward any out-of-pocket maximum.",
        },
      ],
    },
    {
      type: "prose",
      eyebrow: "Where costs surprise people",
      heading: "The four situations that generate unexpected bills",
      paragraphs: [
        "The first is January. Deductibles reset at the start of the plan year, so a visit that cost thirty dollars in November can cost several hundred in January. Nothing has changed about your coverage. You are simply back at the start of the deductible.",
        "The second is prior authorisation on medication. A prescription is sent, the pharmacy says the insurer has rejected it, and it reads like a denial of care. Usually it is a form the prescriber needs to submit, and it resolves within a few days. Tell your provider promptly rather than waiting, because they cannot act on a rejection they have not been told about.",
        "The third is the difference between a therapy session and a psychiatric visit. They are billed under different codes and frequently carry different copays. Assuming your therapy copay applies to a psychiatric appointment is a common and understandable error.",
        "The fourth is out-of-network reimbursement not working the way people expect. Plans reimburse against their own allowed amount rather than the amount you were charged, so a promised eighty percent can translate to substantially less than eighty percent of the actual bill. If you are planning to use out-of-network benefits, ask what the allowed amount is for the specific service code.",
      ],
    },
    {
      type: "checklist",
      eyebrow: "If you are uninsured or underinsured",
      heading: "Routes that still lead to care",
      intro:
        "Being uninsured is a real barrier and not usually an absolute one. These are worth knowing about.",
      items: [
        {
          title: "Covered California enrolment periods",
          description:
            "The state marketplace has an annual open enrolment window, and a life change such as losing job-based coverage, moving, marriage, or having a child opens a special enrolment period outside it. Subsidies are income-based and many people qualify for more than they assume.",
        },
        {
          title: "Medi-Cal eligibility",
          description:
            "California's Medicaid programme covers mental health services and has broader eligibility than many people realise, including for adults without children. It can be applied for at any time of year, not only during open enrolment.",
        },
        {
          title: "Self-pay rates",
          description:
            "Ask what the practice charges directly. Self-pay is sometimes lower than the deductible-phase cost through insurance, particularly early in the plan year on a high-deductible plan.",
        },
        {
          title: "Generic medications",
          description:
            "Most first-line psychiatric medications have generic versions costing a fraction of the branded price, and pharmacy discount programmes can reduce that further. Ask your provider to prescribe generically where clinically equivalent.",
        },
        {
          title: "County behavioural health services",
          description:
            "Every California county operates behavioural health services with sliding-scale or no-cost options, and they are the appropriate route for people who cannot access private care.",
        },
        {
          title: "The 988 line is always free",
          description:
            "Crisis support is available regardless of insurance, immigration status, or ability to pay. Call or text 988, at any hour, at no cost.",
        },
      ],
    },
    {
      type: "faq",
      eyebrow: "Common questions",
      heading: "About coverage and cost",
      items: [
        {
          question: "Does my employer find out that I used mental health benefits?",
          answer:
            "No. Your employer receives aggregate cost data, not individual medical information. Your diagnosis and the services you use are protected health information and are not disclosed to them.",
        },
        {
          question: "Will a psychiatric diagnosis affect my insurance in the future?",
          answer:
            "For health insurance, no. Federal law prohibits health plans from denying coverage or charging more on the basis of a pre-existing condition. Some other products, such as certain life or disability policies, do underwrite on health history, which is worth knowing but is a separate matter from health coverage.",
        },
        {
          question: "What if my insurance denies a claim?",
          answer:
            "Denials are appealable and a meaningful share are overturned. Start with your plan's internal appeal, and if that fails, California offers an independent medical review through the Department of Managed Health Care, which is free to the patient and binding on the plan.",
        },
        {
          question: "Can I use a health savings account or flexible spending account?",
          answer:
            "Yes. Psychiatric visits and prescription medications are generally qualifying medical expenses under both, which effectively pays for them with pre-tax income.",
        },
        {
          question: "Is telehealth billed differently from an in-person visit?",
          answer:
            "It is coded to indicate telehealth delivery, but California law requires plans to cover it on the same basis as in-person care. Your cost share should not be higher because a visit happened by video.",
        },
        {
          question: "What if my plan is not one you accept?",
          answer:
            "Contact us anyway. Depending on your plan, out-of-network benefits or self-pay may still make care workable, and our team can explain what your options would look like before you commit to anything.",
        },
        {
          question: "How do I know a bill is correct?",
          answer:
            "Compare it against the explanation of benefits from your insurer. If the two do not match, or a service you did not receive appears, contact both the practice and your plan. Billing errors are common and are usually straightforward to correct.",
        },
      ],
    },
  ],
};
