import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../../models/user';
import { RouterLink } from '@angular/router';
import { SharingDataService } from '../../services/sharingDataSer.service';

@Component({
  selector: 'app-auth',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent {

  user: User;

  constructor(
    private sharingData: SharingDataService){
    this.user = new User();
  }

  onSubmit(){
    if(!this.user.username || !this.user.password){
      console.log("eeeeerrrror");
      
    } else {
      this.sharingData.handlerLoginEventEmitter.emit(
        {username: this.user.username, password: this.user.password});
    }
  }
}
