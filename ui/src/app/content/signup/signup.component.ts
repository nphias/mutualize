import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
//import { SetUsernameGQL } from 'src/app/graphql/profile/queries/set-username-gql';
//import { RemoveMeGQL } from 'src/app/graphql/profile/queries/remove-me-gql';
//import { MyProfileGQL,Agent } from 'src/app/graphql/profile/queries/myprofile-gql'
import { map } from 'rxjs/operators';
import { Profile, ProfilesService } from 'src/app/services/profiles.service';
import { ProfilesStore } from 'src/app/stores/profiles.store';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html'
})
export class SignupComponent implements OnInit {
  //user: Agent;
  registered: boolean =false//Promise<boolean> = new Promise(()=>{return false});
  errorMessage?: string //= "Sign up"
  avatarLink: string = "../../assets/img/avatar_placeholder.jpg"

  constructor(
    private fb: FormBuilder,
   // private setUser: SetUsernameGQL,
    //private myprofile:MyProfileGQL,
    //private removeUser:RemoveMeGQL,
    private pstore: ProfilesStore,
    private profilesService: ProfilesService,
    private router: Router
  ) {}

  profileForm = this.fb.group({
    handle: ["", Validators.required],
    avatar: ["", Validators.required]
  });

  ngOnInit() {
    try {
      this.profilesService.getMyProfile()
    /*this.registered = this.isRegistered().then((result)=>{
      if(result)
      this.errorMessage = "You are registered as: "+this.user.username
      return result
    }) as Promise<boolean>*/
  }catch(exception){
    console.log(exception)
  }
  }


 async signUp(){
    console.log("signup called")
    const handle:string = this.profileForm.get("handle")?.value;
    this.avatarLink = this.profileForm.get("avatar")?.value;
    if (handle.length == 0) {
      return;
    }
    if (this.avatarLink.length == 0) {
      this.avatarLink = "../../assets/img/avatar_placeholder.jpg";
    }
    const profile:Profile = {nickname:handle, fields:{avatar:this.avatarLink}}
    //const isRegistered = await this.registered
    //if (!isRegistered) {
      try{
        console.log("before createprofile")
        await this.profilesService.createProfile(profile)
              // await this.setUser.mutate({username:handle}).toPromise()//.then(()=>{
        //this.user.username = handle
        console.log("user registered")
        this.setAndRoute(profile)
      }catch(error){
        this.errorMessage = error
      }
    //} 
  };

  setAndRoute(profile:Profile){
    sessionStorage.setItem("userhash",this.pstore.agentPubKey)
    sessionStorage.setItem("username",profile.nickname)
    sessionStorage.setItem("avatar",profile.fields.avatar)
    this.router.navigate(["home"]);
  }


  isRegistered(){
    const profile = this.pstore.MyProfile
    if(profile){
      this.registered = true
      this.setAndRoute(profile)
    } else {
      this.registered = false
    }
    //this.user =  await this.getProfileData()
    //if(this.user)
    // return this.user.username != (null || undefined) ? true : false       
  }

  /*private getProfileData():Promise<Agent>{
    return this.myprofile.fetch().pipe(map(result=>{
        return <Agent>{id:result.data.me.id, username:result.data.me.agent.username}
    })).toPromise().then((result)=> { return result},
      (reason)=>{ 
          this.errorMessage = reason
          return null
    }) as Promise<Agent> | null
  }*/

  /*unregister(){
    try{
      this.removeUser.mutate({name:""}).toPromise().then((result)=>{
        console.log("user unregistered:",result)
        this.registered = new Promise(()=>{return false})
        this.errorMessage = "Sign up"
      })
    }catch(error){
      this.errorMessage = error
    }
  }*/
}
