import { AfterViewInit, Component, HostListener, computed, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, map, startWith, switchMap } from 'rxjs';
import { MissiondetailsComponent } from './components/missiondetails/missiondetails';
import { MissionfilterComponent } from './components/missionfilter/missionfilter';
import { MissionlistComponent } from './components/missionlist/missionlist';
import { Launch } from './models/launch.model';
import { SpacexService } from './services/spacex';

@Component({
  selector: 'app-root',
  imports: [ReactiveFormsModule, MissionfilterComponent, MissionlistComponent, MissiondetailsComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements AfterViewInit {
  private readonly formBuilder = inject(FormBuilder);

  readonly title = 'SpaceX Launch Explorer';
  readonly loading = signal(true);
  readonly error = signal<string | null>(null);
  readonly launches = signal<Launch[]>([]);
  readonly years = signal<string[]>([]);
  readonly selectedFlightNumber = signal<number | null>(null);

  readonly filterForm: FormGroup = this.formBuilder.group({
    mission: [''],
    year: ['all'],
    status: ['all']
  });

  private readonly filterValues = toSignal(
    this.filterForm.valueChanges.pipe(startWith(this.filterForm.getRawValue())),
    { initialValue: this.filterForm.getRawValue() }
  );

  readonly filteredLaunches = computed(() => {
    const filters = this.filterValues();
    const mission = String(filters.mission ?? '').toLowerCase().trim();
    const status = String(filters.status ?? 'all');

    return this.launches().filter((launch) => {
      const missionMatch = !mission || launch.mission_name.toLowerCase().includes(mission);
      const statusMatch =
        status === 'all' ||
        (status === 'success' && launch.launch_success === true) ||
        (status === 'failed' && launch.launch_success === false) ||
        (status === 'upcoming' && launch.upcoming === true);

      return missionMatch && statusMatch;
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
    this.loadAvailableYears();
    this.bindYearFilterRequests();
  }

  ngAfterViewInit(): void {
    this.updateParallaxDepth();
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.updateParallaxDepth();
  }

  private updateParallaxDepth(): void {
    const offset = window.scrollY || window.pageYOffset || 0;
    document.documentElement.style.setProperty('--space-scroll', `${offset}px`);
  }

  onMissionSelected(flightNumber: number): void {
    this.selectedFlightNumber.set(flightNumber);
  }

  closeMissionDetails(): void {
    this.selectedFlightNumber.set(null);
  }

  private bindYearFilterRequests(): void {
    this.filterForm.controls['year'].valueChanges
      .pipe(
        startWith(this.filterForm.controls['year'].value),
        map((year) => String(year ?? 'all')),
        distinctUntilChanged(),
        switchMap((year) => {
          this.loading.set(true);
          this.error.set(null);
          this.selectedFlightNumber.set(null);

          return year === 'all'
            ? this.spacexService.fetchLaunches()
            : this.spacexService.fetchLaunchesByYear(year);
        })
      )
      .subscribe({
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

  private loadAvailableYears(): void {
    this.spacexService.fetchLaunches().subscribe({
      next: (data) => {
        const uniqueYears = Array.from(new Set(data.map((launch) => launch.launch_year))).sort(
          (a, b) => Number(b) - Number(a)
        );
        this.years.set(uniqueYears);
      }
    });
  }
}
