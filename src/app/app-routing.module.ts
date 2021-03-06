import {
  NgModule
} from '@angular/core';

import {
  RouterModule,
  Routes
} from '@angular/router';

import {
  AuthGuard
} from '@app/shared/guards';

const appRoutes: Routes = [
  {
    path: '',
    loadChildren: 'app/features/home/home.module#HomeModule',
    pathMatch: 'full'
  },
  {
    path: 'account',
    loadChildren: 'app/features/account/account.module#AccountModule'
  },
  {
    path: 'support',
    loadChildren: 'app/features/support/support.module#SupportModule'
  },
  {
    path: 'users',
    loadChildren: 'app/features/users/users.module#UsersModule',
    canLoad: [AuthGuard]
  },
  {
    path: 'wish-lists',
    loadChildren: 'app/features/wish-lists/wish-lists.module#WishListsModule',
    canLoad: [AuthGuard]
  },
  {
    path: 'gifts',
    loadChildren: 'app/features/gifts/gifts.module#GiftsModule',
    canLoad: [AuthGuard]
  },
  {
    path: 'dibs',
    loadChildren: 'app/features/dibs/dibs.module#DibsModule',
    canLoad: [AuthGuard]
  },
  {
    path: '**',
    loadChildren: 'app/features/page-not-found/page-not-found.module#PageNotFoundModule'
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes)
  ],
  exports: [
    RouterModule
  ],
  providers: [
    AuthGuard
  ]
})
export class AppRoutingModule { }
