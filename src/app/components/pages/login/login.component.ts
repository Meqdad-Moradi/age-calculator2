import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';

@Component({
  selector: 'app-login',
  imports: [MatButtonModule, MatIconModule, RouterLink],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  private readonly authService = inject(OAuthService);

  /**
   * loginWithGoogle
   */
  protected loginWithGoogle(): void {
    this.authService.initLoginFlow();
  }
}
