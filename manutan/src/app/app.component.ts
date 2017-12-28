import {Component , OnInit , OnDestroy} from '@angular/core';

// Import the DataService
import { DataService } from './data.service';
import { Router} from '@angular/router';
import { User } from './model/user';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
  
  // Define a users property to hold our user data
  users: Array<any>;
  currentUser: User;
  subscription: Subscription;

  // Create an instance of the DataService through dependency injection
  constructor(private _dataService: DataService, private router: Router) {
	 if( localStorage.getItem('currentUser') == null){
             this.router.navigate(['login']);
	}else{
	     this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
	    
	// subscribe to Login component 
        this.subscription = this._dataService.getUser().subscribe(currentUser => { this.currentUser = currentUser; }); 
	       
	}

  }
  logout(){
    console.log(localStorage.getItem('currentUser'));    
    localStorage.removeItem('currentUser');
    this.currentUser = null;;
    this.router.navigate(['login']);
    
  }
  ngOnDestroy() {
        // unsubscribe to ensure no memory leaks
        this.subscription.unsubscribe();
    }
}
