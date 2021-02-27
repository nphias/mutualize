
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import {ContentRoutingModule} from './content-routing.module'
import { LazyComponent } from './lazycontent/lazy.component';
import { MobxAngularModule } from 'mobx-angular';
import { TransactionListComponent } from './home/transactionlist/transactionlist.component';
import { HomeComponent } from './home/home.component';
import { UserListComponent } from './home/userlist/userlist.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { OfferComponent } from './offer/offer.component';
 
@NgModule({
  imports: [
    CommonModule,
    ContentRoutingModule,
    MobxAngularModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [LazyComponent,
     TransactionListComponent,
     UserListComponent,
     HomeComponent,
     OfferComponent
     ],
})
export class ContentModule {}
