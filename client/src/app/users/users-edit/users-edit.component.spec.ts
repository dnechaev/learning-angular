import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { UsersEditComponent } from './users-edit.component';
import {ActivatedRoute, Router, RouterModule} from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { UsersService } from '../users.service';
import { User } from '../../core/user.model';
import { AuthenticationService } from '../../auth/services/authentication.service';
import { LoaderIndicatorService } from '../../shared/services/loader-indicator.service';
import { SearchService } from '../../shared/services/search.service';
import { ToastService } from '../../shared/services/toast.service';

describe('UsersEditComponent', () => {
  let component: UsersEditComponent;
  let fixture: ComponentFixture<UsersEditComponent>;

  let authenticationService: AuthenticationService;
  let usersService: UsersService;
  let activatedRoute: ActivatedRoute;
  let router: Router;
  let loaderIndicatorService: LoaderIndicatorService;
  let searchService: SearchService;
  let toastService: ToastService;

  let spyUsersUpdate: jasmine.Spy;
  let spyRoute: jasmine.Spy;

  const mockUser = new User(
    1,
    'User',
    'email@test.com',
    'password',
    [
      { id: 2, name: 'MANAGER' },
      { id: 3, name: 'USER' },
    ],
    'TEST_SSID');

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        HttpClientModule,
        ReactiveFormsModule
      ],
      declarations: [ UsersEditComponent ],
      providers: [
        UsersService,
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({ user: mockUser } )
          }
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsersEditComponent);
    component = fixture.componentInstance;

    activatedRoute = fixture.debugElement.injector.get(ActivatedRoute);
    router = fixture.debugElement.injector.get(Router);
    authenticationService = fixture.debugElement.injector.get(AuthenticationService);
    usersService = fixture.debugElement.injector.get(UsersService);
    loaderIndicatorService = fixture.debugElement.injector.get(LoaderIndicatorService);
    searchService = fixture.debugElement.injector.get(SearchService);
    toastService = fixture.debugElement.injector.get(ToastService);

    spyUsersUpdate = spyOn( usersService, 'updateUser' ).and.returnValue(of(mockUser));
    spyRoute = spyOn( router, 'navigate' ).and.returnValue(new Promise((resolve) => resolve(true)));
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should user loaded', () => {
    expect(component.userLoaded).toBe(true);
  });

  it('should not submit by no valid form', () => {
    component.userForm.patchValue({name: ''});
    expect(component.userForm.valid).toBe(false);
  });

  it('should submit', () => {
    component.userForm.patchValue({
      name: 'Test User',
      email: 'test@test.com',
      password: '1234567890',
      roles: [ false, true, true ]
    });
    component.onSubmit();
    expect(spyUsersUpdate.calls.any()).toBeTruthy();
    expect(spyRoute.calls.any()).toBeTruthy();
  });

});
