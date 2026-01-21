import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TranslateModule } from '@ngx-translate/core';
import { injectLogoutStore } from '@auth/store';

@Component({
  selector: 'app-logout-page',
  standalone: true,
  imports: [MatProgressSpinnerModule, TranslateModule],
  templateUrl: './logout-page.component.html',
  styleUrl: './logout-page.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LogoutPageComponent implements OnInit {
  logoutStore = injectLogoutStore();

  ngOnInit(): void {
    this.logoutStore.logout();
  }
}
