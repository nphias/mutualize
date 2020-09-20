
import { NgModule } from '@angular/core';
import { ContentRoutingModule } from './content-routing.module';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SplitFirst } from './common/pipes/splitfirst'

import { HomeComponent } from './home/home.component';
import {TransactionListComponent} from './home/transactionlist/transactionlist.component';
import { SignupComponent } from './signup/signup.component';
import { ProfileComponent } from "./profile/profile.component";
import { OfferComponent } from "./offer/offer.component";
import { OfferListComponent } from "./offer/offerlist/offerlist.component";
import { UserListComponent } from "./home/userlist/userlist.component";
import { HeaderComponent } from "./common/header/header.component"
import { AssetComponent } from "./assets/asset.component";
import { AssetListComponent } from "./assets/assetlist/assetlist.component";


 
@NgModule({
  declarations: [
    HomeComponent,
    TransactionListComponent,
    SignupComponent,
    ProfileComponent,
    OfferComponent,
    OfferListComponent,
    UserListComponent,
    HeaderComponent,
    AssetComponent,
    AssetListComponent,
    SplitFirst
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
