import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';

// Import all the components for which navigation service has to be activated
import { SignupComponent } from './signup/signup.component';
import { NetworksComponent } from './networks/networks.component';
import { OfferComponent } from './offer/offer.component';

const routes: Routes = [
  { path: 'projects', component: NetworksComponent },
  {
    path: '',
    redirectTo: '/signup',
    pathMatch: 'full'
  },
  { path: 'signup', component: SignupComponent },
  { path: 'home', component: HomeComponent },
  {
    path: 'offers',
    component: OfferComponent
  },

];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContentRoutingModule {}
