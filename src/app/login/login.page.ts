import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonTitle, IonContent,
  IonItem, IonLabel, IonInput, IonInputPasswordToggle,
  IonButton, IonText, IonIcon, LoadingController, ToastController
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-login',
  templateUrl: 'login.page.html',
  styleUrls: ['login.page.scss'],
  standalone: true,
  imports: [
    CommonModule, FormsModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonItem, IonLabel, IonInput, IonInputPasswordToggle,
    IonButton, IonText, IonIcon
  ]
})
export class LoginPage {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(
    private router: Router,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController
  ) {}

 async login() {
  this.errorMessage = '';

  if (!this.email || !this.password) {
    this.errorMessage = 'Please enter both email and password.';
    return;
  }

  const loading = await this.loadingCtrl.create({
    message: 'Logging in...',
    duration: 1000
  });
  await loading.present();

  setTimeout(async () => {
    await loading.dismiss();

    const toast = await this.toastCtrl.create({
      message: 'Welcome back!',
      duration: 1500,
      color: 'success'
    });
    await toast.present();

    this.router.navigate(['/tabs/tab1']);
  }, 1000);
}
}