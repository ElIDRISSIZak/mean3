import {Component, Input, ComponentFactoryResolver, ViewChild, OnInit} from '@angular/core';
import {Directory} from './directory';
import {Classification} from './classification';


import { Router } from '@angular/router';
import { Http, Headers, RequestOptions } from '@angular/http';

import { User } from '../model/user';

@Component({
    selector: 'tree-view',
    templateUrl: './tree-view.html',
    styleUrls  : ['tree-view.css']
})
export class TreeView implements OnInit {
    @Input() directories: Array<Directory>;
    @Input() Classification: Array<Classification>;
    showIcon = false;
    expanded = false;
    icon = null;
    result: any;
    classification: Classification[] = [];
    loading: boolean;
    position = 'right';
    ifAdmin: any;
    currentUser: User;
    constructor(private componentResolver: ComponentFactoryResolver,
                private router: Router, private _http: Http){
	this.currentUser = JSON.parse(localStorage.getItem("currentUser"));    
	if (localStorage.getItem('currentUser')) {
           this.currentUser = JSON.parse(localStorage.getItem("currentUser"));
   	   console.log(this.currentUser);
        }
	if (localStorage.getItem('ifAdmin') == "true") {
	   this.ifAdmin = true;	
   	   console.log("tes if "+localStorage.getItem('ifAdmin'));	
	}
   	   console.log(localStorage.getItem('ifAdmin'));
	/*this.getAttribut().subscribe(data => {
		this.classification = data;
  		console.log("use data here");
	});*/
    	}
    ngOnInit(){
        console.log("From tree view =>"+this.Classification);        
         this.getAttribut();
    }
    /*expand(){
        this.expanded = !this.expanded;
        this.icon = this.getIcon();
    }*/
    getIcon(cl:Classification){
        if (cl.showIcon === true) {
          if(cl.expanded){
            return '- ';
          }
          return '+ ';
        }
        return null;
    }
    toggle(cl:Classification){
        console.log("aff =>"+this.classification["0"]);
        cl.icon = '-';
        cl.expanded = !cl.expanded;
        cl.icon = this.getIcon(cl);
    }

    getData():void {
        this._http.get("/api/test")
         .subscribe(result =>
            this.result = result.json()
         );
         console.log(this.result);
         
     }
     getResult():void {
         console.log(this.Classification["Classification"]);
         this.loading = true;
         console.log(this.loading);
         
     }
     getAttribut():any {
        console.log(this.Classification["0"].Classification);
        
        this.classification = this.Classification["0"].Classification["0"].Classification;
        console.log(this.classification);
        
        // this.classification = this.Classification["Classification"].Classification;
        this.classification["0"].icon = '+';
        for( let cl of this.classification){
           cl.expanded = false;
           cl.checked = false;
           cl.showIcon = true;
           cl.icon = '+';
           for( let cl2 of cl.Classification){
               cl2.expanded = false;
               cl2.checked = false;
               cl2.showIcon = true;
               cl2.icon = '+';
               if(cl2.Classification){
                    for( let cl3 of cl2.Classification){
                   cl3.expanded = false;
                   cl3.checked = false;
                   cl3.showIcon = true;
                   cl3.icon = '+';
                   }
               }
               
           }
               
        }
	return this.classification;        
    }
	administrer(){
    		this.router.navigate(['config']);
	} 
    
}
