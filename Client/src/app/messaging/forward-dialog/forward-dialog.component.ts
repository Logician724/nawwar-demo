import { Component, OnInit } from '@angular/core';
import { Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { MessageService } from '../messaging.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../auth/auth.service';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-forward-dialog',
  templateUrl: './forward-dialog.component.html',
  styleUrls: ['./forward-dialog.component.scss']
})
export class ForwardDialogComponent implements OnInit {

  Body: String = this.data.body;
  msg: any;
  currentUser: any;
  div2: Boolean;
  div3: Boolean;
  div4: Boolean; // div for blocked user
  allisWell: Boolean = true;
  Receiver: any;
  UserList: string[] = ['_id', 'firstName', 'lastName', 'username', 'schedule', 'studyPlans',
  'email', 'address', 'phone', 'birthday', 'children', 'verified', 'isChild', 'isParent', 'blocked'];

  constructor(public dialogRef: MatDialogRef<ForwardDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private messageService: MessageService, private authService: AuthService) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit() {
    const self = this;
    const userDataColumns = ['username'];
    // getting username of logged in user
    this.authService.getUserData(userDataColumns).subscribe(function (res) {
      self.currentUser = res.data;
    });
  }

  send(): void {
    const self = this;

    if (this.Body === '') {
      this.div2 = true;
      this.div3 = false;
    } else {
       // create a message object with the info the user entered
       this.msg = {'body': this.Body, 'recipient': this.Receiver, 'sender': this.currentUser.username};

       this.authService.getAnotherUserData(this.UserList, this.Receiver.toString()).subscribe((user)  => {
        const list = user.data.blocked;
        for ( let i = 0 ; i < user.data.blocked.length ; i++) {
          if ( this.currentUser.username === list[i] ) {
            console.log('blocked is:', list[i]);
            this.div4 = true;
            this.allisWell = false;
          } // end if
        }// end for

       // make a POST request using messaging service
       if ( this.allisWell === true) {
        this.messageService.send(this.msg)
         .subscribe(function(res) {
          self.div3 = true;
          self.div2 = false;
          self.div4 = false;
         });
         }// end if
    });
   }// end method
}// end class
}
