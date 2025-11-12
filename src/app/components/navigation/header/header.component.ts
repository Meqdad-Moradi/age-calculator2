import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterLink } from '@angular/router';
import { SidenavService } from '../../../services/sidenav.service';
import { SwitchThemeComponent } from '../../shared/switch-theme/switch-theme.component';
import { MatMenuModule } from '@angular/material/menu';
import { PdfService } from '../../../services/pdf.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DownloadService } from '../../../services/download.service';

@Component({
  selector: 'app-header',
  imports: [
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    MatProgressSpinnerModule,
    RouterLink,
    SwitchThemeComponent,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  private readonly sideNavService = inject(SidenavService);
  private readonly pdfService = inject(PdfService);
  private readonly downloadService = inject(DownloadService);

  public title = signal<string>('Age Calculator');
  public isSideNaveOpen = true;
  public isDownloading = this.pdfService.isDownloading;

  /**
   * toggleSideNav
   */
  public toggleSideNav(): void {
    this.isSideNaveOpen = !this.isSideNaveOpen;
    this.sideNavService.isSideNavOpen.set(this.isSideNaveOpen);
  }

  /**
   * onPrint -> print page
   */
  public onPrint(): void {
    print();
  }

  /**
   * downloadPDF
   */
  public downloadPDF(): void {
    this.pdfService.generatePDF();
  }

  /**
   * downloadData
   */
  public downloadData(): void {
    this.downloadService.triggerDownloadSubject(true);
  }
}
