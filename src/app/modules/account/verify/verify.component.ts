import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';

import {
  ActivatedRoute
} from '@angular/router';

import {
  Subject
} from 'rxjs';

import {
  takeUntil
} from 'rxjs/operators';

import {
  AlertService
} from '@app/ui';

import {
  SessionService,
  SessionUser
} from '@app/shared/modules/session';

import {
  AccountService
} from '../account.service';

@Component({
  selector: 'gd-verify-account',
  templateUrl: './verify.component.html',
  styleUrls: ['./verify.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VerifyAccountComponent implements OnInit, OnDestroy {
  public hasToken = false;
  public isLoading = true;
  public isVerified = false;

  private sessionUser: SessionUser;
  private ngUnsubscribe = new Subject();

  constructor(
    private accountService: AccountService,
    private alertService: AlertService,
    private changeDetector: ChangeDetectorRef,
    private route: ActivatedRoute,
    private sessionService: SessionService
  ) { }

  public ngOnInit(): void {
    this.sessionUser = this.sessionService.user;
    this.isVerified = this.sessionUser.emailAddressVerified;

    this.route.params
      .pipe(
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe((params: any) => {
        this.hasToken = (params.emailAddressVerificationToken !== undefined);
        this.changeDetector.markForCheck();

        if (!this.hasToken || this.sessionService.user.emailAddressVerified) {
          this.isLoading = false;
          this.changeDetector.markForCheck();
          return;
        }

        this.accountService
          .verifyEmailAddress(params.emailAddressVerificationToken)
          .subscribe(
            () => {
              this.isLoading = false;
              this.isVerified = true;
              this.sessionService.user.emailAddressVerified = true;
              this.changeDetector.markForCheck();
            },
            () => {
              this.isLoading = false;
              this.isVerified = false;
              this.changeDetector.markForCheck();
            }
          );
      });
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public sendVerificationEmail(): void {
    this.accountService
      .resendEmailAddressVerification(this.sessionUser.id)
      .subscribe(
        (data: any) => {
          this.sessionService.user.emailAddressVerified = true;
          this.alertService.success(data.message);
        },
        (err: any) => {
          this.alertService.error(err.error.message);
        }
      );
  }
}
