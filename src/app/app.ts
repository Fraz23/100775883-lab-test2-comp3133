import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { startWith } from 'rxjs';
import { LaunchFiltersComponent } from './components/launch-filters/launch-filters';
import { LaunchListComponent } from './components/launch-list/launch-list';
import { Launch } from './models/launch.model';
import { SpacexService } from './services/spacex';

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule, LaunchFiltersComponent, LaunchListComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private readonly formBuilder = inject(FormBuilder);

  readonly title = 'SpaceX Launch Explorer';
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly launches = signal<Launch[]>([]);

  readonly filterForm: FormGroup = this.formBuilder.group({
    mission: [''],
    year: ['all'],
    status: ['all']
  });

  private readonly filterValues = toSignal(
    this.filterForm.valueChanges.pipe(startWith(this.filterForm.getRawValue())),
    { initialValue: this.filterForm.getRawValue() }
  );

  readonly years = computed(() => {
    const unique = new Set(this.launches().map((launch) => launch.launch_year));
    return Array.from(unique).sort((a, b) => Number(b) - Number(a));
  });

  readonly filteredLaunches = computed(() => {
    const filters = this.filterValues();
    const mission = String(filters.mission ?? '').toLowerCase().trim();
    const year = String(filters.year ?? 'all');
    const status = String(filters.status ?? 'all');

    return this.launches().filter((launch) => {
      const missionMatch = !mission || launch.mission_name.toLowerCase().includes(mission);
      const yearMatch = year === 'all' || launch.launch_year === year;
      const statusMatch =
        status === 'all' ||
        (status === 'success' && launch.launch_success === true) ||
        (status === 'failed' && launch.launch_success === false) ||
        (status === 'upcoming' && launch.upcoming === true);

      return missionMatch && yearMatch && statusMatch;
    });
  });

  readonly stats = computed(() => {
    const launches = this.filteredLaunches();
    const successful = launches.filter((launch) => launch.launch_success === true).length;
    const failed = launches.filter((launch) => launch.launch_success === false).length;
    const upcoming = launches.filter((launch) => launch.upcoming).length;

    return {
      total: launches.length,
      successful,
      failed,
      upcoming
    };
  });

  constructor(
    private readonly spacexService: SpacexService
  ) {
    this.loadLaunches();
  }

  private loadLaunches(): void {
    this.loading.set(true);
    this.error.set(null);

    this.spacexService.fetchLaunches().subscribe({
      next: (data) => {
        this.launches.set(data);
        this.loading.set(false);
      },
      error: () => {
        this.error.set('Unable to fetch SpaceX launch data right now.');
        this.loading.set(false);
      }
    });
  }
}
