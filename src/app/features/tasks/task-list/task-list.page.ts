import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable as RxObservable } from 'rxjs';
import { AsyncPipe } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonList,
  IonFab, IonFabButton, IonIcon, IonBadge, IonButtons,
  IonRefresher, IonRefresherContent, IonText, IonSearchbar,
  IonSegment, IonSegmentButton, IonLabel,
  ModalController, AlertController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, checkmarkDoneOutline } from 'ionicons/icons';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { FeatureFlagService } from '../../../services/feature-flag.service';
import { Observable, Subscription, combineLatest, map, BehaviorSubject } from 'rxjs';
import { Task } from '../../../models/task.model';
import { Category } from '../../../models/category.model';
import { TaskService } from '../../../services/task.service';
import { CategoryService } from '../../../services/category.service';
import { SwipeHintService } from '../../../services/swipe-hint.service';
import { TaskItemComponent } from '../components/task-item/task-item.component';
import { TaskFormModalComponent } from '../components/task-form-modal/task-form-modal.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [
    AsyncPipe, IonHeader, IonToolbar, IonTitle, IonContent, IonList,
    IonFab, IonFabButton, IonIcon, IonBadge, IonButtons,
    IonRefresher, IonRefresherContent, IonText, IonSearchbar,
    IonSegment, IonSegmentButton, IonLabel,
    TranslateModule, TaskItemComponent,
  ],
  // Note: IonNote is already available via TaskItemComponent
  templateUrl: './task-list.page.html',
  styleUrls: ['./task-list.page.scss'],
})
export class TaskListPage implements OnInit, OnDestroy {
  filteredTasks$!: Observable<Task[]>;
  categories$: Observable<Category[]>;
  pendingCount = 0;
  selectedCategoryId = 'all';

  /** Feature flags reactivos */
  categoriesEnabled$: RxObservable<boolean>;
  bannerMessage$: RxObservable<string>;

  showTaskHint = false;

  private searchTerm$ = new BehaviorSubject<string>('');
  private countSub?: Subscription;

  constructor(
    private taskService: TaskService,
    private categoryService: CategoryService,
    private modalCtrl: ModalController,
    private alertCtrl: AlertController,
    private translate: TranslateService,
    private featureFlagService: FeatureFlagService,
    private swipeHintService: SwipeHintService
  ) {
    addIcons({ addOutline, checkmarkDoneOutline });
    this.categories$ = this.categoryService.categories$;
    this.categoriesEnabled$ = this.featureFlagService.categoriesEnabled$;
    this.bannerMessage$ = this.featureFlagService.bannerMessage$;
  }

  async ngOnInit(): Promise<void> {
    this.showTaskHint = await this.swipeHintService.shouldShowTaskHint();
    
    await this.taskService.loadTasks();
    await this.categoryService.loadCategories();
    this.filteredTasks$ = combineLatest([
      this.taskService.tasks$, this.searchTerm$,
    ]).pipe(
      map(([tasks, searchTerm]) => {
        let filtered = tasks;
        if (this.selectedCategoryId !== 'all') {
          filtered = filtered.filter((t) => t.categoryId === this.selectedCategoryId);
        }
        if (searchTerm.trim()) {
          const term = searchTerm.toLowerCase();
          filtered = filtered.filter((t) =>
            t.title.toLowerCase().includes(term) ||
            (t.description && t.description.toLowerCase().includes(term))
          );
        }
        return filtered;
      })
    );
    this.countSub = this.taskService.tasks$.subscribe(() => {
      this.pendingCount = this.taskService.getTaskCount().pending;
    });

    if (this.showTaskHint) {
      await this.swipeHintService.markTaskHintShown();
    }
  }

  ngOnDestroy(): void { this.countSub?.unsubscribe(); }

  onSearchChange(event: CustomEvent): void {
    this.searchTerm$.next(event.detail.value || '');
  }

  onCategoryFilter(event: CustomEvent): void {
    this.selectedCategoryId = event.detail.value || 'all';
    this.searchTerm$.next(this.searchTerm$.getValue());
  }

  async openAddTaskModal(): Promise<void> {
    const modal = await this.modalCtrl.create({
      component: TaskFormModalComponent,
      breakpoints: [0, 0.5, 0.75],
      initialBreakpoint: 0.5,
      handleBehavior: 'cycle',
    });
    await modal.present();
    const { data, role } = await modal.onDidDismiss();
    if (role === 'save' && data) {
      await this.taskService.addTask(data);
    }
  }

  async onToggleComplete(taskId: string): Promise<void> {
    await this.taskService.toggleComplete(taskId);
  }

  async onDeleteTask(taskId: string): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: this.translate.instant('tasks.deleteTitle'),
      message: this.translate.instant('tasks.deleteConfirm'),
      buttons: [
        { text: this.translate.instant('modal.cancel'), role: 'cancel' },
        { text: this.translate.instant('tasks.delete'), role: 'destructive',
          handler: () => { this.taskService.deleteTask(taskId); } },
      ],
    });
    await alert.present();
  }

  async onRefresh(event: CustomEvent): Promise<void> {
    await this.taskService.loadTasks();
    await this.categoryService.loadCategories();
    (event.target as HTMLIonRefresherElement).complete();
  }

  trackByTaskId(index: number, task: Task): string { return task.id; }
}
