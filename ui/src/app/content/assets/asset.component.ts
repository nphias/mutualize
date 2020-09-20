import { Component, OnInit, Input } from "@angular/core";
import { FormBuilder } from "@angular/forms";
import { Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { HolochainService } from 'src/app/core/holochain.service';
import { MyBalanceGQL } from 'src/app/graphql/transactor/queries/mybalance-gql';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { environment } from '@environment';


@Component({
  selector: "app-asset",
  templateUrl: "./asset.component.html",
  styleUrls: ["./asset.component.css"]
})
export class AssetComponent implements OnInit {
  balance: Observable<number>;
  errorMessage:string = ""
  breadCrumbs: string[]
  filteredCrumbs:string[]
  parent_dna_id:string
  grand_parent_dna_id:string

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private hcs: HolochainService,
    private mybalance: MyBalanceGQL
  ) { }

  postForm = this.fb.group({
    content: ["", Validators.required]
  });

  ngOnInit() {
    if (!sessionStorage.getItem("userhash"))
      this.router.navigate(["signup"]);
    this.breadCrumbs = this.hcs.breadCrumbTrail
    this.filteredCrumbs = this.hcs.breadCrumbTrail.map(crumb=>{ return crumb.split("_")[0]})
    const inst = sessionStorage.getItem("parent_dna")
    if (!this.hcs.dna_id_from_instance_hash(inst))
      console.warn("no dna found for instance:"+inst)
    else{
      this.parent_dna_id = this.hcs.dna_id_from_instance_hash(inst).split("_")[0]
      if(this.parent_dna_id != environment.TEMPLATE_DNA_ID)
        this.grand_parent_dna_id = "from:"+this.hcs.breadCrumbTrail[this.hcs.breadCrumbTrail.length-2].split("_")[0]
      //else
       // this.grand_parent_dna_id = this.parent_dna_id
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
    //this.user = new User(sessionStorage.getItem("userhash"),sessionStorage.getItem("username"))
    //this.user.avatarURL = sessionStorage.getItem("avatar")
  }

  navigateGrandParentDNA(){
    const grand_parent_dna_hash = this.hcs.instance_hash_from_dna_id(this.hcs.breadCrumbTrail[this.hcs.breadCrumbTrail.length-2])
      this.hcs.changeToRunningNetwork(grand_parent_dna_hash)
      //sessionStorage.removeItem("userhash")
      this.router.navigate(["home"]);
  }

  navigateNetwork(net:string){
    this.hcs.changeToRunningNetwork(this.hcs.instance_hash_from_dna_id(net))
    this.router.navigate(["home"]);
  }

  logout(){
    console.log("logging out")
    sessionStorage.clear()
    this.router.navigate(["signup"]);
  }
}

