import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import { AuthService } from './core/services/auth.service';

describe('AppComponent', () => {
  let fixture: ComponentFixture<AppComponent>;

  let authService: AuthService;
  let authSpy: jasmine.Spy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule, HttpClientTestingModule],
      declarations: [AppComponent],
      providers: [AuthService],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);

    authService = TestBed.inject(AuthService);
    authSpy = spyOn(authService, 'autoLogin');

    fixture.detectChanges();
  });

  it("#ngOnInit(): should call the authService's autoLogin method", () => {
    expect(authSpy).toHaveBeenCalled();
    expect(authSpy.calls.all().length).toBe(1);
  });
});
