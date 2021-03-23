import { Component, OnInit } from "@angular/core";
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from "@angular/router";
import { Dictionary, PublicTransactorService, Transaction } from '../../../services/transactor.service'
import { TransactorStore } from "src/app/stores/transactor.store";
//import { MyTransactionsGQL,Transaction } from 'src/app/graphql/transactor/queries/mytransactions-gql';

@Component({
  selector: "app-transactionlist",
  templateUrl: "./transactionlist.component.html",
  styleUrls: ["./transactionlist.component.css"]
})
export class TransactionListComponent implements OnInit {
  transaction!: Transaction;
  transactionlist: Transaction[] = []//Observable<Transaction[]>;
  errorMessage:string = ""

  constructor( public t_store: TransactorStore, 
    private transactionService: PublicTransactorService,
    private router: Router) { //private transactions: MyTransactionsGQL
  }

  async ngOnInit() {
   try {
     await this.transactionService.getMyTransactions()
     //console.log("trnasactions",this.t_store.myTransactions)
     //this.transactionlist = this.t_store.myTransactions.map(transaction =>{return transaction.content})
      /*this.transactionlist = this.transactions.watch().valueChanges.pipe(map(result=>{
        if (result.errors){
          this.errorMessage = result.errors[0].message
          return null
        }
        if (!result.data)
          return null
        else{
          console.log(result.data.transactions)
          return result.data.transactions//.map(tx=> <Transaction>{id:tx.id,debtor:tx.debtor,creditor:tx.creditor,amount:tx.amount,timestamp:(new Date(tx.timestamp))})
        }
      }))*/
    } catch(exception){
        console.log(exception)
        this.errorMessage = "type:"+exception.data.type+" "+exception.data.data
        console.log(exception)
    }
  }

}
