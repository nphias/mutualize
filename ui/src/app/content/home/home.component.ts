import { Component } from '@angular/core';
import { Router } from "@angular/router";
import { MyBalanceGQL } from 'src/app/graphql/queries/mybalance-gql';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  balance: Observable<number>;
  errorMessage:string

  constructor(private mybalance:MyBalanceGQL, private router: Router) { }

  ngOnInit() {
    if (!sessionStorage.getItem("userhash"))
        this.router.navigate(["signup"]);
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
