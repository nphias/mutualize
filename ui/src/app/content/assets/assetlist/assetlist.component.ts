import { Component, OnInit } from "@angular/core";
import { Observable, Subscription } from 'rxjs';
import { Router } from "@angular/router";
import { map } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { HolochainService, CloneResult } from 'src/app/core/holochain.service'
import { CloneIn, RegisterCloneGQL } from 'src/app/graphql/clone-tracker/queries/register-clone-gql';
import { environment } from '@environment';
import { Clone,AllClonesGQL } from 'src/app/graphql/clone-tracker/queries/all-clones-gql';

interface Asset
{
  id:string
  hash:string
  name:string
  description:string
  keywords:string
  unit_of_account:string
  members:number
  is_member:boolean
} 

interface CloneProperties
{
  name:string
  description:string
  keywords:string
  unit_of_account:string
  parent_dna:string
} 

@Component({
  selector: "app-assetlist",
  templateUrl: "./assetlist.component.html",
  styleUrls: ["./assetlist.component.css"]
})
export class AssetListComponent implements OnInit {
  clonelist: Observable<Clone[]>;
  allClones: Clone[] 
  errorMessage:string
  assetForm: FormGroup
  showModal: boolean;
  newAssetForm: FormGroup;
  submitted = false;
  cloneSubscription: Subscription
  parent_instance: string = sessionStorage.getItem("parent_instance")
  parentDNA: string = sessionStorage.getItem("parent_dna")
  instanceList: string[]

  constructor(
    private add_clone: RegisterCloneGQL,
    private clones: AllClonesGQL,
    private fb: FormBuilder,
    private hcs: HolochainService,
    private router: Router
    ) { 
  }

  ngOnInit() {
    if (!sessionStorage.getItem("userhash"))
        this.router.navigate(["signup"]);
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
      this.clonelist = this.clones.watch({template_dna:this.parentDNA}).valueChanges.pipe(map(result=>{
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
    this.cloneSubscription = this.clonelist.subscribe(clones => { 
      this.allClones = clones
      this.populateForm(clones)})
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
            id: this.fb.control(clonelist[i].properties['dna_id']),
            hash: this.fb.control(clonelist[i].cloned_dna_hash),
            name: this.fb.control(clonelist[i].properties['name']),
            description: this.fb.control(clonelist[i].properties['description']),
            keywords: this.fb.control(clonelist[i].properties['keywords']),
            unit_of_account: this.fb.control(clonelist[i].properties['unit_of_account']),
            members: this.fb.control(0),
            is_member: this.fb.control(this.hcs.is_instanceMember(clonelist[i].cloned_dna_hash))
          })
        )
      //}
    }
  }


  async createAsset(){
    this.submitted = true;
    if (this.newAssetForm.invalid)
      return;
    this.showModal = false;
    const props:CloneProperties = this.newAssetForm.getRawValue()
    props["parent_dna"] = this.parentDNA
    try{
      const dna_id = props.name+"_"+Date.now()
      const result:CloneResult = await this.cloneAsset( 
        dna_id, //props.name +"_" + "123",//props.parent_dna,
        props
      );
      if (result.success){
        props['dna_id'] = dna_id
        this.formArr.clear()
        this.add_to_tracker(props,result.dna_hash)
      }
    }catch(exception){
      this.errorMessage = exception.message
    }
  }

  async cloneAsset(dna_id:string,props:CloneProperties):Promise<CloneResult>{
    return this.hcs.cloneDna( 
      dna_id, //props.name +"_" + "123",//props.parent_dna,
      props
    );
  }

  async add(asset:Asset){
    const props:CloneProperties = {
      name:asset.name,
      description:asset.description,
      keywords:asset.keywords,
      unit_of_account:asset.unit_of_account,
      parent_dna:this.parentDNA
    }
    try{
      const alreadycloned = await this.hcs.cloneExists(asset.id)
      if(!alreadycloned){
        const result:CloneResult = await this.cloneAsset(asset.id,props)
        console.log(result)
      }
      const DNA_ID = asset.id //name+"_"+"123"//this.parentDNA
      const CELL_ID = asset.hash //name+"_"+asset.id
      await this.hcs.registerNetwork(
        environment.AGENT_ID, 
        DNA_ID, 
        CELL_ID,
        (interfaces) => {return interfaces[0]}
      )
      this.formArr.clear()
      this.formArr.reset()
      this.populateForm(this.allClones)
    } catch(exception){
      console.log(exception.message)
      this.errorMessage = exception.message
    }
  }

  start(asset:Asset){
    //const dna_id = this.hcs.dna_from_instance(asset.id)
    //if(dna_id){
      this.hcs.startNetwork(asset.hash)
      this.formArr.clear()
      //sessionStorage.removeItem("userhash")
      this.router.navigate(["home"]);
    //}else
     // console.warn("warning, dna not found for intanceID:"+asset.id)
  }

  async remove(asset:Asset){}

    
  private async add_to_tracker(props:any,dna_hash:string){
      const clone:CloneIn = {
        parent_dna_hash: this.parentDNA,
        properties:JSON.stringify(props),
        cloned_dna_hash: dna_hash
      }
      try {
        const newclone = await this.add_clone.mutate(
          {clone:clone}, 
          {refetchQueries: [{
                query: this.clones.document,
                variables: {template_dna:this.parentDNA}
              }]
          }).toPromise()
      }catch(exception){
        this.errorMessage = exception
      }
    }
  
}
