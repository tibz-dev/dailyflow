import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonItem, IonLabel, IonToggle, IonList,
  IonSegment, IonSegmentButton, IonButton,
  ToastController, AlertController
} from '@ionic/angular/standalone';
import { Preferences } from '@capacitor/preferences';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonItem, IonLabel, IonToggle, IonList,
    IonSegment, IonSegmentButton, IonButton
  ]
})
export class Tab3Page implements OnInit {
  darkMode: boolean = false;
  listView: string = 'all';

  constructor(
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private router: Router
  ) {}

  async ngOnInit() {
    const { value } = await Preferences.get({ key: 'dark_mode' });
    this.darkMode = value === 'true';
    this.applyTheme();
  }

  async toggleDarkMode() {
    await Preferences.set({ key: 'dark_mode', value: String(this.darkMode) });
    this.applyTheme();

    const toast = await this.toastCtrl.create({
      message: this.darkMode ? 'Dark mode on' : 'Dark mode off',
      duration: 1000
    });
    await toast.present();
  }

  applyTheme() {
    document.body.classList.toggle('ion-palette-dark', this.darkMode);
  }

  async confirmLogout() {
    const alert = await this.alertCtrl.create({
      header: 'Log Out',
      message: 'Are you sure you want to log out?',
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Log Out',
          role: 'destructive',
          handler: () => {
            this.router.navigate(['/login']);
          }
        }
      ]
    });
    await alert.present();
  }
}