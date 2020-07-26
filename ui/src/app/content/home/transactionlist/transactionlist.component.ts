import { Component, OnInit } from "@angular/core";
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from "@angular/router";
import { MyTransactionsGQL,Transaction } from 'src/app/graphql/queries/mytransactions-gql';

@Component({
  selector: "app-transactionlist",
  templateUrl: "./transactionlist.component.html",
  styleUrls: ["./transactionlist.component.css"]
})
export class TransactionListComponent implements OnInit {
  transaction: Transaction;
  transactionlist: Observable<Transaction[]>;
  errorMessage:string

  constructor(private transactions: MyTransactionsGQL,  private router: Router) {
  }

  ngOnInit() {
    try {
      this.transactionlist = this.transactions.watch().valueChanges.pipe(map(result=>{
        if (result.errors){
          this.errorMessage = result.errors[0].message
          return null
        }
        if (!result.data)
          return null
        else
          return result.data.transactions
      }))
    } catch(exception){
        this.errorMessage = exception
    }
  }

}
