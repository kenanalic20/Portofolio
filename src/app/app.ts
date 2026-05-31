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

@Component({
  selector: 'app-root',
  templateUrl: './app.html',
  styleUrl: './app.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App {
  private readonly http = inject(HttpClient);
  private readonly cvData = signal<CvData | null>(null);
  readonly showMoreProjects = signal(false);

  readonly experiences = computed(() => this.cvData()?.experience ?? []);
  readonly projects = computed(() => this.cvData()?.projects ?? []);
  readonly extraProjects = computed(() => this.cvData()?.extraProjects ?? []);
  readonly skills = computed(() => this.cvData()?.skills ?? []);
  readonly education = computed(() => this.cvData()?.education ?? []);

  constructor() {
    this.http.get<CvData>('assets/cv.json').subscribe({
      next: (data) => this.cvData.set(data),
      error: () =>
        this.cvData.set({ experience: [], projects: [], extraProjects: [], skills: [], education: [] })
    });
  }

  downloadPdf(): void {
    window.print();
  }
}
