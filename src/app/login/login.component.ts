import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnDestroy, OnInit,
} from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';
import { LoginBodyRequest } from '../shared/services';
import { AuthStore } from '../shared/store';
import { FormErrorsComponent } from '../shared/ui/form-errors';
import { TypedFormGroup } from '../shared/utils';
import {HttpClient} from "@angular/common/http";
import {NgForOf, NgIf} from "@angular/common";

@Component({
    selector: 'app-login',
  imports: [FormErrorsComponent, ReactiveFormsModule, RouterLink, NgForOf, NgIf],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export default class LoginComponent implements OnDestroy, OnInit {
  readonly #authStore = inject(AuthStore);
  readonly errorResponse = this.#authStore.selectors.errorResponse;
  readonly loginForm: TypedFormGroup<LoginBodyRequest> = new FormGroup({
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.email],
    }),
    password: new FormControl('', {
      nonNullable: true,
    }),
  });

  emailControl = new FormControl('');
  suggestions: string[] = [];

  login(): void {
    this.#authStore.login(this.loginForm);
  }

  ngOnDestroy(): void {
    this.#authStore.resetErrorResponse();
  }

  constructor(private http: HttpClient) {
  }

  ngOnInit() {
    this.emailControl.valueChanges.subscribe(val => {

      if (!val) {
        this.suggestions = [];
        return;
      }

      const url = `https://jsonplaceholder.typicode.com/todos/1?search=${val}&nocache=${Math.random()}`;
      const randomStr = (n: any) => Math.random().toString(36).substring(2, 2 + n)

      this.http.get(url).subscribe(() => {
        this.suggestions = [
          `${val}${randomStr(5)}`,
          `${val}${randomStr(5)}`,
          `${val}${randomStr(5)}`
        ];
      });
    });
  }
}
