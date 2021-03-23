import { Component, OnInit, Input } from "@angular/core";
//import { ConnectionService } from "../../core/connection.service";
import { FormBuilder } from "@angular/forms";
import { Validators } from "@angular/forms";

//import { User } from "../../models/User";
import { Router } from "@angular/router";
import { HolochainService } from '../../services/holochain.service';
//import { MyBalanceGQL } from 'src/app/graphql/transactor/queries/mybalance-gql';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { TransactorStore } from "src/app/stores/transactor.store";
import { PublicTransactorService } from "src/app/services/transactor.service";
import { ProfilesStore } from "src/app/stores/profiles.store";


@Component({
  selector: "app-offer",
  templateUrl: "./offer.component.html",
  styleUrls: ["./offer.component.css"]
})
export class OfferComponent implements OnInit {
  balance: number = 0 //Observable<number>;
  errorMessage:string = ""
  filteredCrumbs:string[] = []

  constructor(
   // private fb: FormBuilder,
    private router: Router,
   // private hcs: HolochainService,
    public t_store: TransactorStore,
    public p_store: ProfilesStore,
    private transactionService:PublicTransactorService
    //private mybalance: MyBalanceGQL
  ) {
  }

 // postForm = this.fb.group({
  //  content: ["", Validators.required]
  //});

  ngOnInit() {
    if (!sessionStorage.getItem("userhash"))
      this.router.navigate(["signup"]);
    //if(this.hcs.getConnectionState() == 2)
      //this.errorMessage = "Holochain is disconnected"
      //this.filteredCrumbs = this.hcs.breadCrumbTrail.map(crumb=>{ return crumb.split("_")[0]})
    try{
      this.transactionService.queryMyPendingOffers()
      //this.balance = this.transactionService.getMyBalance()
      /*this.balance = this.mybalance.watch().valueChanges.pipe(map(result=>{
        if (result.errors){
          this.errorMessage = result.errors[0].message
          return null
        }
        if (!result.data)
          return null
        else
          return result.data.balance
        }))*/
    } catch(exception){
      this.errorMessage = exception
    }
    //this.user = new User(sessionStorage.getItem("userhash"),sessionStorage.getItem("username"))
    //this.user.avatarURL = sessionStorage.getItem("avatar")
  }

  logout(){
    console.log("logging out")
    sessionStorage.clear()
    this.router.navigate(["signup"]);
  }
}

