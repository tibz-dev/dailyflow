import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonItemSliding, IonItemOptions, IonItemOption, IonCheckbox, IonBadge, IonGrid, IonRow, IonCol, IonSearchbar, IonReorderGroup, IonReorder, IonButtons, IonButton, IonIcon, AlertController, ModalController, ActionSheetController, PopoverController, IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/angular/standalone';
import { TaskService, Task } from '../services/task.service';
import { EditTaskModalComponent } from '../components/edit-task-modal/edit-task-modal.component';
import { TaskOptionsPopoverComponent } from '../components/task-options-popover/task-options-popover.component';
import { Haptics, ImpactStyle } from '@capacitor/haptics';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonList, IonItem, IonLabel, IonItemSliding,
    IonItemOptions, IonItemOption, IonCheckbox, IonBadge,
    IonSearchbar, IonReorderGroup, IonReorder, IonButtons, IonButton, IonIcon,
    IonGrid,
    IonRow,
    IonCol,
    IonInfiniteScroll,
    IonInfiniteScrollContent
]
})
export class Tab1Page implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  searchTerm: string = '';
  reorderMode: boolean = false;

  constructor(
    private taskService: TaskService,
    private alertCtrl: AlertController,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private popoverCtrl: PopoverController
  ) {}

  displayedTasks: Task[] = [];
  pageSize = 5;



loadMore(event: any) {
  const currentLength = this.displayedTasks.length;
  const more = this.filteredTasks.slice(currentLength, currentLength + this.pageSize);
  this.displayedTasks = [...this.displayedTasks, ...more];
  event.target.complete();

  if (this.displayedTasks.length >= this.filteredTasks.length) {
    event.target.disabled = true;
  }
}

  async ngOnInit() {
    await this.loadTasks();
  }

  async ionViewWillEnter() {
    await this.loadTasks();
  }

  async loadTasks() {
    this.tasks = await this.taskService.getTasks();
    this.applyFilter();
  }

  // applyFilter() {
  //   const term = this.searchTerm.toLowerCase().trim();
  //   this.filteredTasks = term
  //     ? this.tasks.filter(t => t.name.toLowerCase().includes(term))
  //     : this.tasks;
  // }

  applyFilter() {
  const term = this.searchTerm.toLowerCase().trim();
  this.filteredTasks = term
    ? this.tasks.filter(t => t.name.toLowerCase().includes(term))
    : this.tasks;
  this.displayedTasks = this.filteredTasks.slice(0, this.pageSize);
  }


  onSearchChange(event: any) {
    this.searchTerm = event.detail.value;
    this.applyFilter();
  }

  toggleReorderMode() {
    this.reorderMode = !this.reorderMode;
  }

  async handleReorder(event: any) {
    this.filteredTasks = event.detail.complete(this.filteredTasks);
    this.tasks = this.filteredTasks;
    await this.taskService.reorderTasks(this.tasks);
  }

  async onToggle(id: number) {
    await Haptics.impact({ style: ImpactStyle.Light });
    await this.taskService.toggleComplete(id);
    await this.loadTasks();
  }

  async confirmDelete(id: number) {
    const alert = await this.alertCtrl.create({
      header: 'Delete Task',
      message: 'Are you sure you want to delete this task?',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Delete',
          role: 'destructive',
          handler: async () => {
            await Haptics.impact({ style: ImpactStyle.Medium });
            await this.taskService.deleteTask(id);
            await this.loadTasks();
          }
        }
      ]
    });
    await alert.present();
  }

  async openEditModal(task: Task) {
    const modal = await this.modalCtrl.create({
      component: EditTaskModalComponent,
      componentProps: { task }
    });
    await modal.present();

    const { data, role } = await modal.onWillDismiss();
    if (role === 'confirm' && data) {
      await this.taskService.updateTask(data);
      await this.loadTasks();
    }
  }

  async openTaskOptions(task: Task) {
    if (this.reorderMode) return;

    const actionSheet = await this.actionSheetCtrl.create({
      header: task.name,
      buttons: [
        { text: 'Edit', icon: 'create-outline', handler: () => this.openEditModal(task) },
        {
          text: task.completed ? 'Mark as Incomplete' : 'Mark as Complete',
          icon: 'checkmark-circle-outline',
          handler: () => this.onToggle(task.id)
        },
        { text: 'Delete', icon: 'trash-outline', role: 'destructive', handler: () => this.confirmDelete(task.id) },
        { text: 'Cancel', icon: 'close', role: 'cancel' }
      ]
    });
    await actionSheet.present();
  }

  async openHeaderMenu(ev: any) {
    const popover = await this.popoverCtrl.create({
      component: TaskOptionsPopoverComponent,
      event: ev,
      translucent: true
    });
    await popover.present();

    const { data } = await popover.onDidDismiss();

    if (data === 'sortPriority') {
      const order = { high: 0, medium: 1, low: 2 };
      this.tasks.sort((a, b) => order[a.priority] - order[b.priority]);
      await this.taskService.reorderTasks(this.tasks);
      this.applyFilter();
    } else if (data === 'clearCompleted') {
      const remaining = this.tasks.filter(t => !t.completed);
      this.tasks = remaining;
      await this.taskService.reorderTasks(remaining);
      this.applyFilter();
    }
  }

  priorityColor(priority: string): string {
    if (priority === 'high') return 'danger';
    if (priority === 'medium') return 'warning';
    return 'success';
  }
    get totalCount(): number {
    return this.tasks.length;
  }

  get activeCount(): number {
    return this.tasks.filter(t => !t.completed).length;
  }

  get doneCount(): number {
    return this.tasks.filter(t => t.completed).length;
  }
}