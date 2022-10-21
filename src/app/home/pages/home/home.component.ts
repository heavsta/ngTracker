import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subscription } from 'rxjs';

import { AuthService } from 'app/core/services/auth.service';
import { User } from 'app/shared/models/user.model';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
  private userSub!: Subscription;
  isAuthenticated: boolean = false;
  users: User[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.userSub = this.authService.userSubject.subscribe((user) => {
      this.isAuthenticated = !!user;
    });
  }

  ngOnDestroy(): void {
    this.userSub.unsubscribe();
  }
}
