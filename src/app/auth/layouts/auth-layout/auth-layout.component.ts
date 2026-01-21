import { ChangeDetectionStrategy, Component } from '@angular/core';
import { NgClass } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { injectBreakpointStore } from '@core/store';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [NgClass, RouterOutlet],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AuthLayoutComponent {
  breakpointStore = injectBreakpointStore();
}
