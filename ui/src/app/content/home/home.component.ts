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
  filteredCrumbs:string[]
  parent_dna_id: string

  constructor(private mybalance:MyBalanceGQL, private me:MyProfileGQL, private router: Router, private hcs: HolochainService) { 
    
  }

  ngOnInit() {
    if (!sessionStorage.getItem("userhash"))
        this.router.navigate(["signup"]);
    if(this.hcs.getConnectionState() == 2)
        this.errorMessage = "Holochain is disconnected"
    this.filteredCrumbs = this.hcs.breadCrumbTrail.map(crumb=>{ return crumb.split("_")[0]})
    this.parent_dna_id = this.hcs.dna_id_from_instance_hash(sessionStorage.getItem("parent_dna")).split("_")[0]
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
    //sessionStorage.clear()
    this.router.navigate(["signup"]);
  }

}
