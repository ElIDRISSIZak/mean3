import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';

// Import the Http Module and our Data Service
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { DataService } from './data.service';
import { TaskService } from './tasks/task.service';
import { TaskComponent } from './tasks/tasks.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { LoginModule } from './login/login.module';

import { MatButtonModule, MatCheckboxModule } from '@angular/material';
import { AppRoutingModule } from './app-routing.module';
import { NotFoundComponent } from './not-found/not-found.component';
import { AuthentificationComponent } from './auth/auth.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatTooltipModule} from '@angular/material/tooltip';
import {TreeView} from './test/tree-view';
import {MyDemoApp} from './test/app';

@NgModule({
  declarations: [
    AppComponent,TaskComponent,LoginComponent,NotFoundComponent,HomeComponent,AuthentificationComponent, TreeView, MyDemoApp
  ],
  imports: [
    BrowserModule,
    HttpModule,FormsModule,
    MatButtonModule,
    MatCheckboxModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MatTooltipModule                     // <-Add HttpModule
  ],
  providers: [DataService, TaskService], // <-Add DataService
  bootstrap: [AppComponent]
})
export class AppModule { }
