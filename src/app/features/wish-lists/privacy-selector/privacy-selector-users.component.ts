import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import {
  FormBuilder,
  FormControl,
  FormGroup
} from '@angular/forms';

import {
  ChecklistChoice,
  ModalInstance
} from '../../../modules';

import {
  Friendship,
  FriendshipService
} from '../../friendships';

import {
  User
} from '../../users';

import {
  WishListPrivacySelectorUsersContext
} from './privacy-selector-users-context';

@Component({
  selector: 'gd-privacy-selector-users',
  templateUrl: './privacy-selector-users.component.html',
  styleUrls: ['./privacy-selector-users.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WishListPrivacySelectorUsersComponent implements OnInit {
  public choices: ChecklistChoice[];
  public isReady = false;
  public usersForm: FormGroup;

  constructor(
    private changeDetector: ChangeDetectorRef,
    private context: WishListPrivacySelectorUsersContext,
    private formBuilder: FormBuilder,
    private friendshipService: FriendshipService,
    private modal: ModalInstance<any>
  ) { }

  public ngOnInit(): void {
    this.createForm();
    this.usersForm.controls.friends.reset(this.context.selected);

    this.friendshipService
      .getAllByUserId(this.context.user._id)
      .subscribe((friendships: Friendship[]) => {
        const friends: User[] = friendships.map((friendship: Friendship) => {
          if (friendship.user._id === this.context.user._id) {
            return friendship.friend;
          }

          return friendship.user;
        });

        const unique: User[] = [];
        friends.forEach(friend => {
          const found = unique.find(u => u._id === friend._id);
          if (!found) {
            unique.push(friend);
          }
        });

        this.choices = unique.map((friend) => {
          return {
            value: friend._id,
            label: `${friend.firstName} ${friend.lastName}`
          };
        });

        this.isReady = true;
        this.changeDetector.markForCheck();
      });
  }

  public save(): void {
    const value = this.usersForm.controls.friends.value;
    this.modal.close('save', { value });
  }

  public onCancelClicked(): void {
    this.modal.close('cancel');
  }

  private createForm(): void {
    this.usersForm = this.formBuilder.group({
      friends: new FormControl(null, [])
    });
  }
}