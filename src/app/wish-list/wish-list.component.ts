import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import 'rxjs/add/operator/first';

import {
  AlertService,
  WishListService
} from '../_services';

import {
  WishList
} from '../_models';

@Component({
  selector: 'app-wish-list',
  templateUrl: './wish-list.component.html'
})
export class WishListComponent implements OnInit {
  public wishList: WishList;
  public isLoading = false;

  constructor(
    private alertService: AlertService,
    private wishListService: WishListService,
    private route: ActivatedRoute,
    private router: Router) { }

  public ngOnInit(): void {
    this.isLoading = true;
    const paramSubscription = this.route.params.subscribe((params: any) => {
      this.wishListService
        .getById(params.wishListId)
        .first()
        .finally(() => {
          this.isLoading = false;
          paramSubscription.unsubscribe();
        })
        .subscribe(
          (data: any) => {
            this.wishList = data;
          },
          (err: any) => {
            this.alertService.error(err.message);
          }
        );
    });
  }

  public deleteWishList(wishListId: string): void {
    this.isLoading = true;
    this.wishListService
      .remove(wishListId)
      .first()
      .finally(() => this.isLoading = false)
      .subscribe(
        (data: any) => {
          this.alertService.success(data.message, true);
          this.router.navigate(['/profile']);
        },
        (err: any) => {
          this.alertService.error(err.message);
        }
      );
  }
}