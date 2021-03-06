import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';

import {
  ActivatedRoute,
  Params,
  Router
} from '@angular/router';

import {
  Subject
} from 'rxjs';

import {
  finalize,
  mergeMap,
  takeUntil
} from 'rxjs/operators';

import {
  Gift,
  GiftService
} from '@app/shared/modules/gift';

import {
  GiftEditComponent,
  GiftEditContext
} from '@app/shared/modules/gift-edit';

import {
  SessionService
} from '@giftdibs/session';

import {
  AlertService
} from '@giftdibs/ux';

import {
  GiftMoveComponent,
  GiftMoveContext
} from '@app/shared/modules/gift-move';

import {
  ConfirmAnswer,
  ConfirmService,
  DropdownMenuItem,
  ModalClosedEventArgs,
  ModalService,
  ModalSize
} from '@giftdibs/ux';

@Component({
  selector: 'gd-gift',
  templateUrl: './gift.component.html',
  styleUrls: ['./gift.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GiftComponent implements OnInit, OnDestroy {
  public gift: Gift;
  public isLoading = true;
  public isSessionUser = false;
  public quantityRemaining: number;

  public menuItems: DropdownMenuItem[] = [
    {
      label: 'Edit',
      action: () => this.openGiftEditModal()
    },
    {
      label: 'Move',
      action: () => this.openGiftMoveModal(),
      addSeparatorAfter: true
    },
    {
      label: 'Delete',
      action: () => this.confirmDelete()
    }
  ];

  private ngUnsubscribe = new Subject();

  constructor(
    private activatedRoute: ActivatedRoute,
    private alertService: AlertService,
    private changeDetector: ChangeDetectorRef,
    private confirmService: ConfirmService,
    private giftService: GiftService,
    private modalService: ModalService,
    private router: Router,
    private sessionService: SessionService
  ) { }

  public ngOnInit(): void {
    this.activatedRoute.params
      .pipe(
        mergeMap((params: Params) => {
          this.isLoading = true;
          this.gift = undefined;
          this.isSessionUser = false;
          this.changeDetector.markForCheck();
          return this.giftService.getById(params.giftId);
        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe(
        (gift: Gift) => {
          this.gift = gift;
          this.isSessionUser = this.sessionService.isSessionUser(this.gift.user.id);
          this.checkQuantity();
          this.isLoading = false;
          this.changeDetector.markForCheck();
        },
        () => {
          this.alertService.error('Gift not found.', true);
          this.router.navigate(['/']);
        }
      );
  }

  public ngOnDestroy(): void {
    this.ngUnsubscribe.next();
    this.ngUnsubscribe.complete();
  }

  public markReceived(): void {
    this.isLoading = true;
    this.changeDetector.markForCheck();

    this.confirmService.confirm({
      message: 'Are you sure? This action cannot be undone.'
    }, (answer: ConfirmAnswer) => {
      if (answer.type === 'okay') {
        this.giftService.markAsReceived(this.gift.id)
          .pipe(
            finalize(() => {
              this.isLoading = false;
              this.changeDetector.markForCheck();
            })
          )
          .subscribe(
            (result: any) => {
              this.refreshGift();
              this.alertService.success(result.message);
            },
            (err: any) => {
              this.alertService.error(err.error.message);
            }
          );
      } else {
        this.isLoading = false;
        this.changeDetector.markForCheck();
      }
    });
  }

  public onCommentSaved(): void {
    this.refreshGift();
  }

  public onDibChange(): void {
    this.refreshGift();
  }

  public getURLName(url: string): string {
    if (!url) {
      return '';
    }

    let formatted = url;
    let fragments = formatted.split('//');

    if (fragments.length > 1) {
      formatted = fragments[1];
    }

    fragments = formatted.split('www.');
    if (fragments.length > 1) {
      formatted = fragments[1];
    }

    formatted = formatted.split('/')[0];

    return formatted.charAt(0).toUpperCase() + formatted.substr(1);
  }

  private refreshGift(): void {
    this.isLoading = true;
    this.changeDetector.markForCheck();
    this.giftService.getById(this.gift.id)
      .subscribe((gift: Gift) => {
        this.gift = gift;
        this.isLoading = false;
        this.checkQuantity();
        this.changeDetector.markForCheck();
      });
  }

  private checkQuantity(): void {
    if (this.gift.dibs && this.gift.dibs.length) {
      let numDibbed = 0;
      this.gift.dibs.forEach((dib) => {
        numDibbed += dib.quantity;
      });

      this.quantityRemaining = this.gift.quantity - numDibbed;
    }
  }

  private openGiftEditModal(): void {
    const context = new GiftEditContext(this.gift, this.gift.wishList.id);

    const modalInstance = this.modalService.open(GiftEditComponent, {
      providers: [{
        provide: GiftEditContext,
        useValue: context
      }],
      size: ModalSize.Large
    });

    modalInstance.closed.subscribe((args: ModalClosedEventArgs) => {
      if (args.reason === 'save') {
        this.refreshGift();
      }
    });
  }

  private openGiftMoveModal(): void {
    const context = new GiftMoveContext(this.gift, this.gift.wishList.id);

    const modalInstance = this.modalService.open(GiftMoveComponent, {
      providers: [{
        provide: GiftMoveContext,
        useValue: context
      }],
      size: ModalSize.Small
    });

    modalInstance.closed.subscribe((args: ModalClosedEventArgs) => {
      if (args.reason === 'save') {
        this.refreshGift();
      }
    });
  }

  private confirmDelete(): void {
    this.confirmService.confirm({
      message: 'Are you sure you wish to delete this gift?'
    }, (answer: ConfirmAnswer) => {
      if (answer.type === 'okay') {
        this.giftService.remove(this.gift.id)
          .subscribe(
            () => {
              this.alertService.success('Gift successfully deleted.', true);
              this.router.navigate(['/users', this.gift.user.id]);
            },
            (err: any) => {
              const error = err.error;
              this.alertService.error(error.message);
              this.changeDetector.markForCheck();
            }
          );
      }
    });
  }
}
