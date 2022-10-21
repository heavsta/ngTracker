import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'environments/environment';
import { User } from 'app/shared/models/user.model';

import { UserService } from './user.service';

const expectedUrl: string = `${environment.apiUrl}/users`;

describe('UserService', () => {
  let service: UserService;
  let controller: HttpTestingController;
  let fakeUsers: User[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService],
    });
    service = TestBed.inject(UserService);
    controller = TestBed.inject(HttpTestingController);
    fakeUsers = [
      {
        id: '4cf6024c-a15c-4024-a294-93f70c350581',
        name: 'Brian',
        login: 'brian',
      },
      {
        id: 'cfb83f66-e3c4-47cd-a324-bc76d275af53',
        name: 'François',
        login: 'heavsta',
      },
      {
        id: 'af7b9a47-d9b0-48e2-b63a-c672ce181bc3',
        name: 'Liam',
        login: 'LiamC',
      },
    ];
  });

  it('#getUser(): should get only one user from API', () => {
    let user: User | undefined;
    const requestedUser: User = fakeUsers[1];
    service.getUser(requestedUser.id).subscribe((u) => (user = u));

    const request = controller.expectOne(`${expectedUrl}/${requestedUser.id}`);
    request.flush(requestedUser);
    controller.verify();

    expect(user).toEqual(requestedUser);
  });

  it('#getUsers(): should get all users from API', () => {
    let usersArr: User[] | undefined;
    service.getUsers().subscribe((users) => (usersArr = users));

    const request = controller.expectOne(expectedUrl);
    request.flush(fakeUsers);
    controller.verify();

    expect(usersArr).toEqual(fakeUsers);
  });

  it('#updateUser(): should update a user existing in the API users list', () => {
    let updatedUser: User | undefined;
    const userToModify: User = fakeUsers[1];
    const newName: string = 'François Leduc';

    service
      .updateUser(userToModify.id, {
        name: newName,
        login: userToModify.login,
        password: 'userpass@123',
      })
      .subscribe((user) => (updatedUser = user));

    const request = controller.expectOne(`${expectedUrl}/${userToModify.id}`);
    const fakeRes = { ...userToModify, name: newName };
    request.flush(fakeRes);
    controller.verify();

    expect(updatedUser).toEqual(fakeRes);
  });

  it('#deleteUser(): should remove a user existing in the API users list', () => {
    const userId: string = 'cfb83f66-e3c4-47cd-a324-bc76d275af53';
    const expectedResult: User[] = fakeUsers.filter((u) => u.id !== userId);

    service.deleteUser(userId).subscribe();

    const request = controller.expectOne(`${expectedUrl}/${userId}`);
    request.flush(null);
    controller.verify();

    expect(expectedResult.length).toBe(2);
  });
});
