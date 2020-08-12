import { Component, OnInit, Input } from "@angular/core";
//import { ConnectionService } from "../../core/connection.service";
import { FormBuilder } from "@angular/forms";
import { Validators } from "@angular/forms";

//import { User } from "../../models/User";
import { Router } from "@angular/router";
import { HolochainService } from 'src/app/core/holochain.service';
import { MyBalanceGQL } from 'src/app/graphql/queries/mybalance-gql';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Component({
  selector: "app-offer",
  templateUrl: "./offer.component.html",
  styleUrls: ["./offer.component.css"]
})
export class OfferComponent implements OnInit {
  balance: Observable<number>;
  errorMessage:string = ""
  username: string

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private holochainservice: HolochainService,
    private mybalance: MyBalanceGQL
  ) {}

  postForm = this.fb.group({
    content: ["", Validators.required]
  });

  ngOnInit() {
    if (!sessionStorage.getItem("userhash"))
      this.router.navigate(["signup"]);
    this.username = sessionStorage.getItem("username")
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
    //this.user = new User(sessionStorage.getItem("userhash"),sessionStorage.getItem("username"))
    //this.user.avatarURL = sessionStorage.getItem("avatar")
  }

  logout(){
    console.log("logging out")
    sessionStorage.clear()
    this.router.navigate(["signup"]);
  }
}

