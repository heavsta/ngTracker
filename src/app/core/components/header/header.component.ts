import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { AuthService } from 'app/core/services/auth.service';
import { BoardService } from 'app/core/services/board.service';
import { LoadingService } from 'app/core/services/loading.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated: boolean = false;
  private userSub!: Subscription;
  login: string | undefined;

  constructor(
    private authService: AuthService,
    private boardService: BoardService,
    private router: Router,
    public translate: TranslateService,
    public loadingService: LoadingService
  ) {
    translate.addLangs(['en', 'fr', 'ru']);
    translate.setDefaultLang('en');

    const defaultLang = localStorage.getItem('lang');
    const browserLang = translate.getBrowserLang();
    translate.use(
      browserLang?.match(/en|fr|ru/) ? defaultLang || browserLang : 'en'
    );
  }

  ngOnInit(): void {
    this.userSub = this.authService.userSubject.subscribe((user) => {
      this.login = user?.login;
      this.isAuthenticated = !!user;
    });
  }

  onLogout(): void {
    this.authService.logout();
  }

  toLangName(lang: string): string {
    return {
      en: 'English',
      fr: 'Français',
      ru: 'Русский',
    }[lang] as string;
  }

  switchLang(lang: string) {
    localStorage.setItem('lang', lang);
    this.translate.use(lang);
  }

  onNewBoard(): void {
    this.router.navigate(['/dashboard']).then(() => {
      this.boardService.newBoardSubject.next(true);
    });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
}
