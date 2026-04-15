import { Component, OnInit } from '@angular/core';
import { AsyncPipe, NgStyle } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel,
  IonIcon, IonItemSliding, IonItemOptions, IonItemOption, IonFab, IonFabButton,
  IonBadge, IonText, ModalController, AlertController,
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addOutline, createOutline, trashOutline } from 'ionicons/icons';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { Category } from '../../../models/category.model';
import { CategoryService } from '../../../services/category.service';
import { TaskService } from '../../../services/task.service';
import { CategoryFormModalComponent } from '../components/category-form-modal/category-form-modal.component';

@Component({
  selector: 'app-category-list', standalone: true,
  imports: [AsyncPipe, NgStyle, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonIcon, IonItemSliding, IonItemOptions, IonItemOption, IonFab, IonFabButton, IonBadge, IonText, TranslateModule],
  templateUrl: './category-list.page.html', styleUrls: ['./category-list.page.scss'],
})
export class CategoryListPage implements OnInit {
  categories$!: Observable<Category[]>;
  constructor(private categoryService: CategoryService, private taskService: TaskService, private modalCtrl: ModalController, private alertCtrl: AlertController, private translate: TranslateService) {
    addIcons({ addOutline, createOutline, trashOutline });
  }
  async ngOnInit(): Promise<void> { await this.categoryService.loadCategories(); this.categories$ = this.categoryService.categories$; }
  getTaskCount(categoryId: string): number { return this.taskService.getTasksByCategory(categoryId).length; }

  async openAddModal(): Promise<void> {
    const modal = await this.modalCtrl.create({ component: CategoryFormModalComponent, breakpoints: [0, 0.5, 0.75], initialBreakpoint: 0.5, handleBehavior: 'cycle' });
    await modal.present();
    const { data, role } = await modal.onDidDismiss();
    if (role === 'save' && data) {
      try { await this.categoryService.addCategory(data); } catch (error) {
        const alert = await this.alertCtrl.create({ header: 'Error', message: (error as Error).message, buttons: ['OK'] }); await alert.present();
      }
    }
  }

  async openEditModal(category: Category): Promise<void> {
    const modal = await this.modalCtrl.create({ component: CategoryFormModalComponent, componentProps: { category }, breakpoints: [0, 0.5, 0.75], initialBreakpoint: 0.5, handleBehavior: 'cycle' });
    await modal.present();
    const { data, role } = await modal.onDidDismiss();
    if (role === 'save' && data) { await this.categoryService.updateCategory(category.id, data); }
  }

  async onDelete(category: Category): Promise<void> {
    const taskCount = this.getTaskCount(category.id);
    let message = this.translate.instant('categories.deleteConfirm', { name: category.name });
    if (taskCount > 0) { message += ' ' + this.translate.instant('categories.tasksWillUnlink', { count: taskCount }); }
    const alert = await this.alertCtrl.create({
      header: this.translate.instant('categories.deleteTitle'), message,
      buttons: [
        { text: this.translate.instant('modal.cancel'), role: 'cancel' },
        { text: this.translate.instant('categories.delete'), role: 'destructive', handler: async () => { await this.taskService.removeCategoryFromTasks(category.id); await this.categoryService.deleteCategory(category.id); } },
      ],
    });
    await alert.present();
  }
}
