import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';

import { LoginComponent } from './login.component';
import { AuthenticationService } from '../services/authentication.service';
import { By } from '@angular/platform-browser';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router;
  let authenticationService: AuthenticationService;
  let spy: jasmine.Spy;
  let spyRoute: jasmine.Spy;
  let mockUser;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        RouterModule.forRoot([]),
        HttpClientModule,
        ReactiveFormsModule
      ],
      declarations: [ LoginComponent ],
      providers: [ AuthenticationService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    authenticationService = fixture.debugElement.injector.get(AuthenticationService);
    router = fixture.debugElement.injector.get(Router);
    mockUser = {
      id: 10,
      name: 'User',
      ssid: 'TEST_SSID'
    };
    spy = spyOn(authenticationService, 'login').and.returnValue(of(mockUser));
    spyRoute = spyOn(router, 'navigate').and.returnValue(new Promise((resolve) => resolve(true)));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not submit by no valid form', () => {
    component.onSubmit();
    expect(component.formLogin.valid).toBe(false);
  });

  it('should submit', () => {
    component.formLogin.patchValue({
      email: 'test@test.com',
      password: '1234567890'
    });
    component.onSubmit();
    expect(spy.calls.any()).toBeTruthy();
    expect(spyRoute.calls.any()).toBeTruthy();
  });

  it('bad email',  () => {
    const inputElement = fixture.debugElement.query(By.css('#inputEmail')).nativeElement;
    inputElement.value = 'test@test.';
    inputElement.dispatchEvent(new Event('input'));
    inputElement.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    const errorElement = fixture.debugElement.query(By.css('#formGroupEmail .error-symbol'));
    expect(errorElement).toBeTruthy();
  });

  it('bad password',  () => {
    const inputElement = fixture.debugElement.query(By.css('#inputPassword')).nativeElement;
    inputElement.value = '';
    inputElement.dispatchEvent(new Event('input'));
    inputElement.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    const errorElement = fixture.debugElement.query(By.css('#formGroupPassword .error-symbol'));
    expect(errorElement).toBeTruthy();
  });

  it('should disable Submit button when form not valid', () => {
    const button = fixture.debugElement.query(By.css('button'));
    expect(button.nativeElement.disabled).toBeTruthy();
  });

  it('should enable Submit button when form is valid', () => {
    component.formLogin.patchValue({
      email: 'test@test.com',
      password: '1234567890'
    });
    fixture.detectChanges();

    const button = fixture.debugElement.query(By.css('#formGroupSubmit button'));
    expect(button.nativeElement.disabled).toBeFalsy();
  });

});
