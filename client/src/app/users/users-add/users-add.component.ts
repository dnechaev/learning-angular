import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators, FormArray, ValidatorFn } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

import { AuthenticationService } from '../../auth/services/authentication.service';
import { LoaderIndicatorService } from '../../shared/services/loader-indicator.service';
import { SearchService } from '../../shared/services/search.service';
import { ToastService } from '../../shared/services/toast.service';
import { UsersService } from '../users.service';
import { Role } from '../../shared/enums';
import { User } from '../../shared/models';

@Component({
  selector: 'app-users-add',
  templateUrl: './users-add.component.html',
  styleUrls: ['./users-add.component.scss']
})
export class UsersAddComponent implements OnInit, OnDestroy {

  subscriptions: Subscription[] = [];
  authorizedUser: User;
  access       = false;
  isLoading    = false;

  userForm: FormGroup;
  roles = [
    { id: 1, name: Role.ADMIN },
    { id: 2, name: Role.MANAGER },
    { id: 3, name: Role.USER },
  ];

  constructor(
    private authenticationService: AuthenticationService,
    private usersService: UsersService,
    private router: Router,
    private loaderIndicatorService: LoaderIndicatorService,
    private searchService: SearchService,
    private toastService: ToastService,
  ) {}

  ngOnInit() {

    this.searchService.disable();

    this.subscriptions.push(
      this.authenticationService.currentUser$.subscribe((user: User) => {
        this.authorizedUser = user;
        this.access = this.authenticationService.userHasRoles(this.authorizedUser, [Role.ADMIN]);
      })
    );

    this.subscriptions.push(
      this.loaderIndicatorService.subject$.subscribe((isLoading) => {
        this.isLoading = isLoading;
      })
    );

    this.createForm();

  }

  ngOnDestroy() {
    this.subscriptions.map((subscription) => {
      subscription.unsubscribe();
    });
    this.subscriptions = null;
  }

  private minSelectedCheckboxes(min = 1) {
    const validator: ValidatorFn = (formArray: FormArray) => {
      const totalSelected = formArray.controls
        .map(control => control.value)
        .reduce((prev, next) => next ? prev + next : prev, 0);
      return totalSelected >= min ? null : { required: true };
    };
    return validator;
  }

  private createForm() {

    this.userForm = new FormGroup({
      name: new FormControl(null, [Validators.required, Validators.minLength(4)]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, [Validators.required, Validators.minLength(4)]),
      roles: new FormArray([], this.minSelectedCheckboxes(1))
    });

    this.roles.map((o, i) => {
      const control = new FormControl(i === 2); // if first item set to true, else false
      (this.userForm.controls.roles as FormArray).push(control);
    });

  }

  private getSelectedRoleIds() {
    const selectedRoleIds = this.userForm.value.roles
      .map((v, i) => v ? this.roles[i].id : null)
      .filter(v => v !== null);
    return selectedRoleIds;
  }

  onSubmit(user: User) {
    user.roles = this.getSelectedRoleIds();
    this.usersService.createUser(user).subscribe(
      (data) => {
        this.toastService.success('User created!');
        this.router.navigate(['/users']);
      },
      error => {
        console.error(error);
      });
  }

}

