"use client";

import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  getHeroContent,
  getAboutContent,
  getSkillsContent,
  getExperienceContent,
  type HeroContent,
  type AboutContent,
  type SkillsContent,
  type ExperienceContent,
} from "@/lib/siteContent";

/**
 * Admin panelinden site içeriğini okuma/yazma. Formlar her zaman dolu bir
 * değerle açılsın diye, doküman Firestore'da yoksa `siteContent.ts`'teki
 * statik fallback'ler kullanılır (aynı fonksiyonlar public tarafta da
 * kullanılıyor, tek kaynak).
 */

export async function getHeroForAdmin(): Promise<HeroContent> {
  return getHeroContent();
}

export async function saveHero(values: HeroContent): Promise<void> {
  await setDoc(doc(db, "siteContent", "hero"), values);
}

export async function getAboutForAdmin(): Promise<AboutContent> {
  return getAboutContent();
}

export async function saveAbout(values: AboutContent): Promise<void> {
  await setDoc(doc(db, "siteContent", "about"), values);
}

export async function getSkillsForAdmin(): Promise<SkillsContent> {
  return getSkillsContent();
}

export async function saveSkills(values: SkillsContent): Promise<void> {
  await setDoc(doc(db, "siteContent", "skills"), values);
}

export async function getExperienceForAdmin(): Promise<ExperienceContent> {
  return getExperienceContent();
}

export async function saveExperience(values: ExperienceContent): Promise<void> {
  await setDoc(doc(db, "siteContent", "experience"), values);
}

/** Bir bölümün Firestore'da hiç kaydedilmemiş (hâlâ statik varsayılanları kullanan) olup olmadığını kontrol eder. */
export async function isSectionCustomized(sectionId: string): Promise<boolean> {
  const snap = await getDoc(doc(db, "siteContent", sectionId));
  return snap.exists();
}
