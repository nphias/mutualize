import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { MyBalanceGQL } from 'src/app/graphql/transactor/queries/mybalance-gql';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { MyProfileGQL } from 'src/app/graphql/profile/queries/myprofile-gql';
import { HolochainService } from 'src/app/core/holochain.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  balance: Observable<number>;
  errorMessage:string
  breadCrumbs: string[]

  constructor(private mybalance:MyBalanceGQL, private me:MyProfileGQL, private router: Router, private holochainservice: HolochainService) { 
    
  }

  ngOnInit() {
    if (!sessionStorage.getItem("userhash"))
        this.router.navigate(["signup"]);
    if(this.holochainservice.getConnectionState() == 2)
        this.errorMessage = "Holochain is disconnected"
    this.breadCrumbs = this.holochainservice.breadCrumbTrail
    try{
      this.me.fetch().toPromise().then(result=>{
        console.log(result)
        if (!result.data.me.agent.username){ //session invalid, user not registered
          this.logout() 
        }
      })
    }catch(exception){
      this.errorMessage = exception
    }
    try{
      this.balance = this.mybalance.watch().valueChanges.pipe(map(result=>{
        if (result.errors){
          this.errorMessage = result.errors[0].message
          return null
        }
        if (!result.data)
          return null
        else
          return result.data.balance
        }))
    } catch(exception){
      this.errorMessage = exception
    }
  }

  logout(){
    console.log("logging out")
    sessionStorage.clear()
    this.router.navigate(["signup"]);
  }

}
