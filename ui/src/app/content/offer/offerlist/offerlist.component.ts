import { Component, OnInit } from "@angular/core";
import { Observable,Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from "@angular/router";
import { MyOffersGQL,Offer } from 'src/app/graphql/transactor/queries/myoffers-gql';
import { ValidateOfferGQL } from 'src/app/graphql/transactor/queries/validate-offer-gql';
import { AcceptOfferGQL,ConsentOfferGQL,CancelOfferGQL } from 'src/app/graphql/transactor/queries/offer-mutations-gql';
import { ReceivedOffersGQL } from 'src/app/graphql/transactor/queries/offer-subscriptions-gql';
import { SubscriptionResult } from 'apollo-angular';
import { HolochainService } from 'src/app/core/holochain.service';
import { MyBalanceGQL } from 'src/app/graphql/transactor/queries/mybalance-gql';
import { MyTransactionsGQL } from 'src/app/graphql/transactor/queries/mytransactions-gql';


@Component({
  selector: "app-offerlist",
  templateUrl: "./offerlist.component.html",
  styleUrls: ["./offerlist.component.css"]
})
export class OfferListComponent {
  pendingOffers: Observable<Offer[]>;
  validOffer: Observable<Offer>;
  validOfferSubscription: Subscription
  //pendingOfferSubscription: Subscription
  newOffersSubscription: Observable<SubscriptionResult<any>>
  errorMessage:string

  constructor(
              private offers:MyOffersGQL, 
              private validate:ValidateOfferGQL, 
              private accept:AcceptOfferGQL, 
              private consent:ConsentOfferGQL, 
              private cancel_offer:CancelOfferGQL, 
              private mybalance: MyBalanceGQL,
              private transactions: MyTransactionsGQL,
              //private onNewOffer:ReceivedOffersGQL,
              private hcs: HolochainService,
              private router: Router) {
  }

  ngOnInit() {
    //this.newOffersSubscription = this.onNewOffer.subscribe()
    //this.newOffersSubscription.subscribe(result =>{
   //   console.log("offer subscription result",result)
   // })
    try {
      this.pendingOffers = this.offers.watch().valueChanges.pipe(map(result=>{ //.watch().valueChanges.
        if (!result.errors)
          return result.data.offers.map(offer => <Offer>{id:offer.id, transaction:offer.transaction, state:offer.state})
        this.errorMessage = result.errors[0].message
        return null
      }))
    } catch(exception){
        this.errorMessage = exception
    }
    this.hcs.PubSub.subscribe("offer-received",(address)=>{
      console.log("offer recieved signal with address:",address)
      this.offers.watch().refetch()
    })
    this.hcs.PubSub.subscribe("offer-cancelled",(address)=>{
      console.log("offer cancelled signal with address:",address)
      this.offers.watch().refetch()
    })
    this.hcs.PubSub.subscribe("offer-completed",(address)=>{
      console.log("offer completed signal with address:",address)
      this.offers.watch().refetch()
      this.mybalance.fetch()
      this.transactions.watch().refetch()

    })
    
  }

  ngOnDestroy(){
    if (this.validOfferSubscription)
    this.validOfferSubscription.unsubscribe()
  }

 async verifyOffer(transactID:string){
    try {
      this.consent.mutate({transactionId:transactID}).toPromise().then( async result=>{
        console.log(result)
        await new Promise((resolve) => setTimeout(() => resolve(), 300));
        try {
          this.validOffer = this.validate.watch({transactionId:transactID}).valueChanges.pipe(map(result=>{
            if (result.errors){
              this.errorMessage = result.errors[0].message
              return null
            }
            console.log(result.data.offer)
            if(!result.data.offer.counterparty.consented)
              this.errorMessage = "consent has not been given for the transaction"
            if (!result.data.offer.counterparty.snapshot.valid)
              this.errorMessage = "Error:"+result.data.offer.counterparty.snapshot.invalidReason
            return result.data.offer
          }))
        } catch(exception){
            this.errorMessage = exception
        }
        this.validOfferSubscription = this.validOffer.subscribe(async offerDetail=>{ 
          await new Promise((resolve) => setTimeout(() => resolve(), 300));
          if (offerDetail.counterparty.snapshot)
            this.markAccepted(offerDetail.id, offerDetail.counterparty.snapshot.lastHeaderId)
          else
            console.log("consent failed?")
        })
      }).catch(ex=>{this.errorMessage = ex})
    } catch(exception){
        this.errorMessage = exception
    }
  }

  async markAccepted(transactID:string, header_address:string){
    try {
      const result = await this.accept.mutate({transactionId:transactID,approvedHeaderId:header_address}
        ,{refetchQueries: [{query: this.offers.document},{query:this.transactions.document}]})
        .toPromise().catch(ex=>{console.log("in promise catch"); this.errorMessage = ex})
      console.log(result)
      this.mybalance.fetch()
    } catch(exception){
        console.log(exception)
        this.errorMessage = exception
    }
  }

  cancelOffer(transactID:string){
    console.log(transactID)
    try {
      this.cancel_offer.mutate({transactionId:transactID},{refetchQueries: [{query: this.offers.document}]})
      .toPromise().catch(ex=>{this.errorMessage = ex})
    }catch(exception){
        console.error(exception)
       // if (Object.JSON.parse(exception).includes("Timeout"))
         exception = "No reponse, the user is probably offline:"+exception
        this.errorMessage = exception
    }
  }




}
