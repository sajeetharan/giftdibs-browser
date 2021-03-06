import {
  NgModule
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  GiftModule
} from '@app/shared/modules/gift';

import {
  GiftPreviewModule
} from '@app/shared/modules/gift-preview';

import {
  WaitModule
} from '@giftdibs/ux';

import {
  RepeaterModule
} from '@giftdibs/ux';

import {
  CommunityComponent
} from './community.component';

@NgModule({
  imports: [
    CommonModule,
    GiftPreviewModule,
    GiftModule,
    RepeaterModule,
    WaitModule
  ],
  declarations: [
    CommunityComponent
  ],
  exports: [
    CommunityComponent
  ]
})
export class CommunityModule {}
