import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'environments/environment';
import { Login } from 'app/shared/models/login.model';
import { User } from 'app/shared/models/user.model';

import { AuthService, Jwt } from './auth.service';
import { UserService } from './user.service';

const expectedUrl: string = environment.apiUrl;

describe('AuthenticationService', () => {
  let service: AuthService;
  let controller: HttpTestingController;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService, UserService],
    });
    service = TestBed.inject(AuthService);
    controller = TestBed.inject(HttpTestingController);
    userService = TestBed.inject(UserService);
    let store: { [key: string]: string } = {};
    const mockLocalStorage = {
      getItem: (key: string): string | null => {
        return key in store ? store[key] : null;
      },
      setItem: (key: string, value: string) => {
        store[key] = `${value}`;
      },
      removeItem: (key: string) => {
        delete store[key];
      },
      clear: () => {
        store = {};
      },
    };

    spyOn(localStorage, 'getItem').and.callFake(mockLocalStorage.getItem);
    spyOn(localStorage, 'setItem').and.callFake(mockLocalStorage.setItem);
    spyOn(localStorage, 'removeItem').and.callFake(mockLocalStorage.removeItem);
    spyOn(localStorage, 'clear').and.callFake(mockLocalStorage.clear);
  });

  it('#signup(): should sign the user up', () => {
    let addedUser: User | undefined;
    const userToAdd: Required<Pick<User, 'name' | 'login' | 'password'>> = {
      name: 'Vasya',
      login: 'user001',
      password: 'userpass@123',
    };

    service.signup(userToAdd).subscribe((user) => (addedUser = user));

    const request = controller.expectOne(`${expectedUrl}/signup`);
    const fakeRes = {
      id: '90ae0dd2-5f54-45d0-be2a-55d91ca6a748',
      name: 'Vasya',
      login: 'user001',
    };
    request.flush(fakeRes);
    controller.verify();

    expect(addedUser).toEqual(fakeRes);
  });

  it('#login(): should log the user in and generate an auth token', () => {
    let generatedToken: Jwt | undefined;
    const userToLog: Login = {
      login: 'user001',
      password: 'userpass@123',
    };

    service.login(userToLog).subscribe((jwt) => {
      generatedToken = jwt;
    });

    const request = controller.expectOne(`${expectedUrl}/signin`);
    const fakeRes = {
      token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0NGNmOTZkMi01OGZjLTRlMGMtOTZkOS05YWM0MjhkNGQ0OTUiLCJsb2dpbiI6InVzZXIwMDEiLCJpYXQiOjE2NTIwMDMyMTF9.EUlvrrs0Hl7wq1o-vkW5eh710CeNmhTfivk8aYkO43I',
    };
    request.flush(fakeRes);
    controller.verify();

    expect(generatedToken).toEqual(fakeRes);
  });

  it('#autologin(): should automatically set user value to userSubject$', () => {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0NGNmOTZkMi01OGZjLTRlMGMtOTZkOS05YWM0MjhkNGQ0OTUiLCJsb2dpbiI6InVzZXIwMDEiLCJpYXQiOjE2NTIwMDMyMTF9.EUlvrrs0Hl7wq1o-vkW5eh710CeNmhTfivk8aYkO43I';
    const userId = service.decodeJwt(token)!.userId;

    localStorage.setItem('token', token);
    expect(localStorage.getItem('token')).toEqual(token);

    userService.getUser(userId).subscribe((user: User) => {
      service.userSubject.next(user);
    });

    const request = controller.expectOne(`${expectedUrl}/users/${userId}`);
    const fakeRes = {
      id: '40af606c-c0bb-47d1-bc20-a2857242cde3',
      name: 'Vasya',
      login: 'user001',
    };
    request.flush(fakeRes);
    controller.verify();

    service.userSubject.subscribe((user: User | null) => {
      expect(user).toBeTruthy();
      expect(user?.id).toEqual(fakeRes.id);
      expect(user?.name).toEqual(fakeRes.name);
      expect(user?.login).toEqual(fakeRes.login);
    });
  });

  it('#logout(): should log the user out removing data from localStorage', () => {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0NGNmOTZkMi01OGZjLTRlMGMtOTZkOS05YWM0MjhkNGQ0OTUiLCJsb2dpbiI6InVzZXIwMDEiLCJpYXQiOjE2NTIwMDMyMTF9.EUlvrrs0Hl7wq1o-vkW5eh710CeNmhTfivk8aYkO43I';
    const user = {
      userId: 'cfb83f66-e3c4-47cd-a324-bc76d275af53',
      login: 'heavsta',
      iat: 1664189881,
    };

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    expect(localStorage.getItem('token')).toEqual(token);
    expect(JSON.parse(localStorage.getItem('user')!)).toEqual(user);

    service.logout();
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });

  it('#getToken(): should return token or null', () => {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0NGNmOTZkMi01OGZjLTRlMGMtOTZkOS05YWM0MjhkNGQ0OTUiLCJsb2dpbiI6InVzZXIwMDEiLCJpYXQiOjE2NTIwMDMyMTF9.EUlvrrs0Hl7wq1o-vkW5eh710CeNmhTfivk8aYkO43I';

    localStorage.setItem('token', JSON.stringify(token));
    expect(service.getToken()).toEqual(token);

    localStorage.removeItem('token');
    expect(service.getToken()).toBeNull();
  });

  it('#setToken(): should save token and user object in local storage', () => {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0NGNmOTZkMi01OGZjLTRlMGMtOTZkOS05YWM0MjhkNGQ0OTUiLCJsb2dpbiI6InVzZXIwMDEiLCJpYXQiOjE2NTIwMDMyMTF9.EUlvrrs0Hl7wq1o-vkW5eh710CeNmhTfivk8aYkO43I';

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();

    service.setToken(token);

    expect(localStorage.getItem('token')).toBeTruthy();
    expect(localStorage.getItem('user')).toBeTruthy();
  });

  it('decodeJwt(): should be able to decode a Json Web Token', () => {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0NGNmOTZkMi01OGZjLTRlMGMtOTZkOS05YWM0MjhkNGQ0OTUiLCJsb2dpbiI6InVzZXIwMDEiLCJpYXQiOjE2NTIwMDMyMTF9.EUlvrrs0Hl7wq1o-vkW5eh710CeNmhTfivk8aYkO43I';

    const decodedToken = service.decodeJwt(token);

    expect(decodedToken.userId).toEqual('44cf96d2-58fc-4e0c-96d9-9ac428d4d495');
    expect(decodedToken.login).toEqual('user001');
    expect(decodedToken.iat).toEqual(1652003211);
  });
});
