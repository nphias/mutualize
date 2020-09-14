import { Component, OnInit } from "@angular/core";
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { HolochainService, cloneResult } from 'src/app/core/holochain.service'
import { CloneIn, RegisterCloneGQL } from 'src/app/graphql/clone-tracker/queries/register-clone-gql';
import { environment } from '@environment';
import { Clone,AllClonesGQL } from 'src/app/graphql/clone-tracker/queries/all-clones-gql';

interface cloneRow
{
  id:string,
  name:string,
  description:string,
  keywords:string,
  unit_of_account:string,
  members:number
} 

@Component({
  selector: "app-assetlist",
  templateUrl: "./assetlist.component.html",
  styleUrls: ["./assetlist.component.css"]
})
export class AssetListComponent implements OnInit {
  clonelist: Observable<Clone[]>;
  errorMessage:string
  assetForm: FormGroup
  showModal: boolean;
  newAssetForm: FormGroup;
  submitted = false;
  cloneSubscription: Subscription

  constructor(
    private add_clone: RegisterCloneGQL,
    private clones: AllClonesGQL, 
    private fb: FormBuilder,
    private hcs: HolochainService
    ) { 
  }

  ngOnInit() {
    this.assetForm = this.fb.group({
      Rows : this.fb.array([])
    });
    this.newAssetForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(3)]],
      keywords: ['', []],
      unit_of_account: ['', [Validators.required]]
    });
    try{
      this.clonelist = this.clones.watch({template_dna:environment.TEMPLATE_HASH}).valueChanges.pipe(map(result=>{
        if (!result.errors)
          return result.data.allClones.map(c => <Clone>{
            parent_dna_hash:c.parent_dna_hash,
            properties:JSON.parse(c.properties),
            cloned_dna_hash:c.cloned_dna_hash})
        this.errorMessage = result.errors[0].message
        return null
      }))
    }catch(exception){
      this.errorMessage = exception
    }
    this.cloneSubscription = this.clonelist.subscribe(clones => { this.populateForm(clones)})
  }

  ngOnDestroy(){
    this.cloneSubscription.unsubscribe()
  }

  get formArr() {
    return this.assetForm.get("Rows") as FormArray;
  }
  get fa() { return this.newAssetForm.controls; }

  show(){
    this.showModal = true; // Show-Hide Modal Check
    
  }
  hide(){
    this.showModal = false;
  }
  

  populateForm(clonelist: Clone[]){
    for (let i = 0; i < clonelist.length; i++ ) {
        this.formArr.push(
          this.fb.group({
            id: this.fb.control(clonelist[i].cloned_dna_hash),
            name: this.fb.control(clonelist[i].properties['name']),
            description: this.fb.control(clonelist[i].properties['description']),
            keywords: this.fb.control(clonelist[i].properties['keywords']),
            unit_of_account: this.fb.control(clonelist[i].properties['unit_of_account']),
            members: this.fb.control(0)
          })
        )
      //}
    }
  }

  async join(){}


  async createAsset(){
    this.submitted = true;
    if (this.newAssetForm.invalid)
      return;
    this.showModal = false;
    const props = this.newAssetForm.getRawValue()
    props["parent_dna"] = environment.TEMPLATE_HASH
    //const props = {name:"car_share", description:"mutual credit for car people", keywords:"car,ride",unit_of_account:"km"}
    const result:cloneResult = await this.hcs.cloneDna( 
      "interstellar_"+Date.now(),
      props
    );
    if (result.success){
      const clone:CloneIn = {
        parent_dna_hash: environment.TEMPLATE_HASH,
        properties:JSON.stringify(props),
        cloned_dna_hash: result.dna_hash
      }
      this.formArr.clear()
      try {
        const newclone = await this.add_clone.mutate(
          {clone:clone}, 
          {refetchQueries: [{
                query: this.clones.document,
                variables: {template_dna:environment.TEMPLATE_HASH}
              }]
          }).toPromise()
      }catch(exception){
        this.errorMessage = exception
      }
    }
  }
  
}
