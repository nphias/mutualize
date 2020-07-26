
import { NgModule } from '@angular/core';
import { ContentRoutingModule } from './content-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { HomeComponent } from './home/home.component';
import {TransactionListComponent} from './home/transactionlist/transactionlist.component';
import { SignupComponent } from './signup/signup.component';
import { ProfileComponent } from "./profile/profile.component";
import { OfferComponent } from "./offer/offer.component";
import { OfferListComponent } from "./offer/offerlist/offerlist.component";
import { UserListComponent } from "./home/userlist/userlist.component";


@NgModule({
  declarations: [
    HomeComponent,
    TransactionListComponent,
    SignupComponent,
    ProfileComponent,
    OfferComponent,
    OfferListComponent,
    UserListComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    ContentRoutingModule
  ],
  providers: []
})
export class ContentModule {}
