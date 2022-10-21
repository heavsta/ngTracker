import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { environment } from 'environments/environment';
import { File } from 'app/shared/models/file.model';

import { FileService } from './file.service';

const expectedUrl = `${environment.apiUrl}/file`;

describe('FileService', () => {
  let service: FileService;
  let controller: HttpTestingController;
  let taskId: string;
  let fakeFiles: File[];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [FileService],
    });
    service = TestBed.inject(FileService);
    controller = TestBed.inject(HttpTestingController);
    taskId = 'f88f62c1-cf76-4b99-a33d-5cb95047df82';
    fakeFiles = [
      {
        filename: 'pma.jpg',
        filesize: 90003,
      },
      {
        filename: 'axios.jpg',
        filesize: 58231,
      },
      {
        filename: 'github-logo.png',
        filesize: 32021,
      },
    ];
  });

  it('#getFile(): should get a specific file from the API files list', () => {
    let file: Blob | undefined;
    const filename: string = 'axios.jpg';
    const requestedFile: File = fakeFiles[1];
    service.getFile(taskId, filename).subscribe((f: Blob) => (file = f));

    const request = controller.expectOne(
      `${expectedUrl}/${taskId}/${filename}`
    );
    request.flush(requestedFile);
    controller.verify();

    expect(file as unknown).toEqual(requestedFile);
  });

  it('#addFile(): should add a file to the API files list', () => {
    const file: any = {
      name: 'harvard.jpg',
      lastModified: 1635960779256,
      webkitRelativePath: '',
      size: 279512,
      type: 'image/jpeg',
    };

    service.addFile(taskId, file as Blob).subscribe({
      complete: () => fakeFiles.push(file),
    });

    const request = controller.expectOne(expectedUrl);
    request.flush(null);
    controller.verify();

    expect(fakeFiles.length).toBe(4);
  });
});
