import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';

// Import all the components for which navigation service has to be activated
import { LazyComponent } from './lazycontent/lazy.component';
import { OfferComponent } from './offer/offer.component';

const routes: Routes = [
  { path: 'lazy', component: LazyComponent },
  {
    path: 'lazy', // If no matching route found, go back to home route
    component: LazyComponent
  },
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },
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
