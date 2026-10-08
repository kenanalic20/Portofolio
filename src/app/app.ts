import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';

type CvExperience = {
  id: string;
  role: string;
  company: string;
  year: string;
  bullets: string[];
};

type CvProject = {
  id: string;
  name: string;
  stack: string;
  bullets: string[];
};

type CvEducation = {
  id: string;
  school: string;
  degree: string;
  year: string;
};

type CvData = {
  experience: CvExperience[];
  projects: CvProject[];
  extraProjects: CvProject[];
  skills: string[];
  education: CvEducation[];
};

type Language = 'en' | 'bs';

const translations = {
  en: {
    languageName: 'English',
    softwareEngineer: 'Software Engineer',
    fullStackDeveloper: 'Full-stack developer',
    downloadPdf: 'Download PDF',
    pngHint: "For PNG, use your browser's full-page screenshot.",
    contact: 'Contact',
    address: 'Address',
    email: 'Email',
    phone: 'Phone',
    country: 'Bosnia and Herzegovina',
    skills: 'Skills',
    languages: 'Languages',
    english: 'English',
    bosnian: 'Bosnian',
    professional: 'Professional',
    native: 'Native',
    experience: 'Experience',
    education: 'Education',
    projects: 'Projects',
    showMoreProjects: 'Show more projects',
    extraProjects: 'Extra Projects'
  },
  bs: {
    languageName: 'Bosanski',
    softwareEngineer: 'Softverski inženjer',
    fullStackDeveloper: 'Full-stack programer',
    downloadPdf: 'Preuzmi PDF',
    pngHint: 'Za PNG koristite snimak cijele stranice u vašem pregledniku.',
    contact: 'Kontakt',
    address: 'Adresa',
    email: 'E-pošta',
    phone: 'Telefon',
    country: 'Bosna i Hercegovina',
    skills: 'Vještine',
    languages: 'Jezici',
    english: 'Engleski',
    bosnian: 'Bosanski',
    professional: 'Profesionalno',
    native: 'Maternji',
    experience: 'Iskustvo',
    education: 'Obrazovanje',
    projects: 'Projekti',
    showMoreProjects: 'Prikaži više projekata',
    extraProjects: 'Dodatni projekti'
  }
} as const;

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  private readonly http = inject(HttpClient);
  private readonly cvData = signal<CvData | null>(null);
  readonly language = signal<Language>('en');
  readonly showMoreProjects = signal(false);

  readonly text = computed(() => translations[this.language()]);
  readonly experiences = computed(() => this.cvData()?.experience ?? []);
  readonly projects = computed(() => this.cvData()?.projects ?? []);
  readonly extraProjects = computed(() => this.cvData()?.extraProjects ?? []);
  readonly skills = computed(() => this.cvData()?.skills ?? []);
  readonly education = computed(() => this.cvData()?.education ?? []);

  constructor() {
    this.loadCv('en');
  }

  setLanguage(language: Language): void {
    if (language === this.language()) {
      return;
    }

    this.language.set(language);
    document.documentElement.lang = language;
    this.loadCv(language);
  }

  private loadCv(language: Language): void {
    const file = language === 'bs' ? 'assets/cv-bs.json' : 'assets/cv.json';
    this.http.get<CvData>(file).subscribe({
      next: (data) => this.cvData.set(data),
      error: () =>
        this.cvData.set({ experience: [], projects: [], extraProjects: [], skills: [], education: [] })
    });
  }

  downloadPdf(): void {
    window.print();
  }
}
