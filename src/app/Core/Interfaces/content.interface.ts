export interface TeamMember {
  name: string;
  role: string;
  image: string;
}

export interface HomeContent {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  heroImages: string[];
  primaryCta: string;
  secondaryCta: string;
  aboutTitle: string;
  aboutText: string;
  featuredTourIds: string[];
}

export interface AboutContent {
  title: string;
  intro: string;
  mission: string;
  vision: string;
  team: TeamMember[];
  email: string;
  phone: string;
  address: string;
  image: string;
}

export interface SiteContent {
  home: HomeContent;
  about: AboutContent;
}

export type UpdateContentDTO = Partial<SiteContent>;
