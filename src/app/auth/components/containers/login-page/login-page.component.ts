import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import { RouterLink } from '@angular/router';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { environment } from '@env/environment';
import { emailValidator } from '@core/validators';
import { injectLoginStore, LoginStore } from '@auth/store';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    NgIf,
    RouterLink,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    TranslateModule,
  ],
  providers: [LoginStore],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginPageComponent {
  #fb = inject(FormBuilder);
  loginStore = injectLoginStore();
  loginForm: FormGroup;
  hidePassword = true;
  onboardingUrl = environment.onboardingUrl;

  constructor() {
    this.loginForm = this.#fb.group({
      email: ['', [Validators.required, emailValidator()]],
      password: ['', Validators.required],
      rememberMe: [false],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid || this.loginStore.isLoading()) {
      return;
    }

    const { email: username, password, rememberMe } = this.loginForm.value;

    this.loginStore.login({ username, password, rememberMe });
  }
}
