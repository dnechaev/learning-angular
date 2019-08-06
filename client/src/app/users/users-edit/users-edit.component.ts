import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormGroup, FormControl, Validators, FormArray, ValidatorFn } from '@angular/forms';
import { Subscription } from 'rxjs';

import { Role } from '../../shared/enums';
import { User } from '../../shared/models';
import { SearchService } from '../../shared/services/search.service';
import { ToastService } from '../../shared/services/toast.service';
import { UsersService } from '../users.service';
import { AuthenticationService } from '../../auth/services/authentication.service';
import { LoaderIndicatorService } from '../../shared/services/loader-indicator.service';
import { UsersRoutesPath } from '../users.routing';

@Component({
  selector: 'app-users-edit',
  templateUrl: './users-edit.component.html',
  styleUrls: ['./users-edit.component.scss']
})
export class UsersEditComponent implements OnInit, OnDestroy {

  constructor(
    private authenticationService: AuthenticationService,
    private usersService: UsersService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private loaderIndicatorService: LoaderIndicatorService,
    private searchService: SearchService,
    private toastService: ToastService,
  ) {}

  userId: number;
  subscriptions: Subscription[] = [];
  authorizedUser: User;
  access       = false;
  isLoading    = false;
  userLoaded   = false;

  userForm: FormGroup;
  allRoles = [
    { id: 1, name: Role.ADMIN },
    { id: 2, name: Role.MANAGER },
    { id: 3, name: Role.USER },
  ];

  private static getRoleIdsFromRoles(roles: any[]): number[] {
    return roles
      .map((v) => v ? v.id : null)
      .filter(v => v !== null);
  }

  ngOnInit() {

    // this.userId = +this.activatedRoute.snapshot.paramMap.get('id');

    this.searchService.disable();

    this.subscriptions.push(
      this.authenticationService.currentUser$.subscribe(( user: User ) => {
        this.authorizedUser = user;
        this.access = this.authenticationService.userHasRoles(this.authorizedUser, [Role.ADMIN]);
      })
    );

    this.subscriptions.push(
      this.loaderIndicatorService.subject$.subscribe(( isLoading ) => {
        this.isLoading = isLoading;
      })
    );

    this.createForm();

    // this.loadUser(this.userId);
    this.activatedRoute.data
      .subscribe((data: { user: User }) => {
        this.applyUser(data.user);
      });
  }

  ngOnDestroy() {
    this.subscriptions.map((subscription) => {
      subscription.unsubscribe();
    });
    this.subscriptions = null;
  }

  onSubmit(user: User) {
    if (!this.userLoaded) {
      return this.toastService.warning('User won\'t loaded');
    }
    user.roles = this.getSelectedRoleIds(this.userForm.value.roles);
    this.usersService.updateUser(this.userId, user).subscribe(
      (data) => {
        this.toastService.success('User updated!');
        this.router.navigate([ UsersRoutesPath.PATH_TO_LIST ]);
      },
      error => {
        console.error(error);
      });
  }

  private createForm() {

    this.userForm = new FormGroup({
      name: new FormControl(null, [Validators.required, Validators.minLength(4)]),
      email: new FormControl(null, [Validators.required, Validators.email]),
      password: new FormControl(null, this.validatorEmptyOrMin(4)),
      roles: new FormArray([], this.validatorMinSelectedCheckboxes(1))
    });

    this.allRoles.map(() => {
      (this.userForm.controls.roles as FormArray).push(new FormControl(false));
    });

  }

  private validatorMinSelectedCheckboxes(min = 1): ValidatorFn {
    return (formArray: FormArray) => {
      const totalSelected = formArray.controls
        .map(control => control.value)
        .reduce((prev, next) => next ? prev + next : prev, 0);
      return totalSelected >= min ? null : { required: true };
    };
  }

  private validatorEmptyOrMin(min = 1): ValidatorFn {
    return  (formControl: FormControl) => {
      const valueLength = formControl.value ? formControl.value.length : 0;
      return (valueLength === 0 || valueLength >= min) ? null : { required: true };
    };
  }

  private getSelectedRoleIds(roles: any[]): number[] {
    return roles
      .map((v, i) => v ? this.allRoles[i].id : null)
      .filter(v => v !== null);
  }

  private applyUser(user: User) {

    this.toastService.success('User loaded!');
    this.userId = user.id;

    const selectedRoles = UsersEditComponent.getRoleIdsFromRoles(user.roles);

    user.roles = [];
    this.allRoles.map((o) => {
      user.roles.push(selectedRoles.includes(o.id));
    });

    this.userForm.patchValue(user);
    this.userLoaded = true;

  }

}
