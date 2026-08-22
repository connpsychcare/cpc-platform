import type { ResourceArticle } from "./types";

import { firstPsychiatricAppointment } from "./first-psychiatric-appointment";
import { psychiatryVsTherapy } from "./psychiatry-vs-therapy";
import { adultAdhdSignsScreeningTreatment } from "./adult-adhd-signs-screening-treatment";
import { whenWorryBecomesAnxiety } from "./when-worry-becomes-anxiety";
import { isMyTreatmentWorking } from "./is-my-treatment-working";
import { navigatingInsuranceCalifornia } from "./navigating-insurance-california";
import { supportingSomeoneInTreatment } from "./supporting-someone-in-treatment";
import { sleepAndMentalHealth } from "./sleep-and-mental-health";

export type { ResourceArticle } from "./types";

/**
 * The care library. Each article is written to stand on its own and to avoid
 * repeating a service page: where a subject has a service page, the article takes
 * the reader's angle (recognising it, deciding what to do) and the service page
 * carries the clinical detail.
 */
export const publicResourceArticles: ResourceArticle[] = [
  firstPsychiatricAppointment,
  psychiatryVsTherapy,
  whenWorryBecomesAnxiety,
  adultAdhdSignsScreeningTreatment,
  isMyTreatmentWorking,
  sleepAndMentalHealth,
  supportingSomeoneInTreatment,
  navigatingInsuranceCalifornia,
];

export const getResourceArticle = (slug: string): ResourceArticle | undefined =>
  publicResourceArticles.find((article) => article.slug === slug);
