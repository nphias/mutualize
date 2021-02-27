import { Component } from '@angular/core';
import { Router } from "@angular/router";
//import { MyBalanceGQL } from 'src/app/graphql/transactor/queries/mybalance-gql';
import { map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
//import { MyProfileGQL } from 'src/app/graphql/profile/queries/myprofile-gql';
import { HolochainService } from 'src/app/services/holochain.service';
import { NetworkService } from 'src/app/services/network.service';
import { ProfilesStore } from 'src/app/stores/profiles.store';
import { TransactorStore } from 'src/app/stores/transactor.store';
import { PublicTransactorService } from 'src/app/services/transactor.service';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  public balance: Observable<number> = of(0)
  public errorMessage:string = ""
  public breadCrumbs: string[] = []
  public filteredCrumbs:string[] =[]
  public parent_dna_id: string = "Mutualize"
  public description: string = "this is the default network"
  public unit_of_account: string = "love"
  //private ts = TransactorStore

  constructor(
    //mybalance:MyBalanceGQL, 
    //private me:MyProfileGQL, 
    private ps:ProfilesStore,
    private ts:TransactorStore,
    private transactorService: PublicTransactorService,
    private router: Router, 
    private hcs: HolochainService,
    private network: NetworkService) { 
    
  }

  ngOnInit() {
    //if (!sessionStorage.getItem("userhash"))
     //   this.router.navigate(["signup"]);
    //const state = this.hcs.getConnectionState()
    //if(state != "OPEN")
      //  this.errorMessage = "Holochain is "+state
    this.filteredCrumbs = this.network.breadCrumbTrail.map(crumb=>{ return crumb.split("_")[0]})
    //this.parent_dna_id = this.hcs.dna_id_from_instance_hash(sessionStorage.getItem("parent_dna")).split("_")[0]
    try{
  //    console.log("fetching profile")
//this.ps.fetchMyProfile()//.fetchMyTransactions()
      //this.me.fetch().toPromise()
  //    .then(result=>{
    //    console.log(result)
        //console.log(this.ps.myProfile)
        //if (!result.data.me.agent.username){ //session invalid, user not registered
          //this.logout() 
       // }
      //})
    }catch(exception){
      this.errorMessage = exception
    }
    /*try{
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
    }*/
  }

  logout(){
    console.log("logging out")
    //sessionStorage.clear()
    this.router.navigate(["signup"]);
  }

}
