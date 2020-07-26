import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators, FormArray } from '@angular/forms';
// import { computeStyle } from '@angular/animations/browser/src/util';
import { Router } from '@angular/router';
import { SetUsernameGQL } from 'src/app/graphql/queries/set-username-gql';
import { MyProfileGQL,Agent } from 'src/app/graphql/queries/myprofile-gql'
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  agent: Agent;
  registered: Promise<boolean> = new Promise(()=>{return false});
  errorMessage: string = ""

  constructor(
    private fb: FormBuilder,
    private setUser: SetUsernameGQL,
    private myprofile:MyProfileGQL,
    private router: Router
  ) {}

  profileForm = this.fb.group({
    handle: ["", Validators.required],
    avatar: ["", Validators.required]
  });

  ngOnInit() {
    this.registered = this.isRegistered().then((result)=>{
      if(result)
      this.errorMessage = "You are registered as: "+this.agent.username
      return result
    }) as Promise<boolean>
  }

 async signUp(){
    console.log("signup called")
    const handle:string = this.profileForm.get("handle").value;
    let avatarLink = this.profileForm.get("avatar").value;
    if (handle.length == 0) {
      return;
    }
    if (avatarLink.length == 0) {
      avatarLink = "../assets/img/avatar_placeholder.jpg";
    }
    const isRegistered = await this.registered
    if (!isRegistered) {
      try{
        await this.setUser.mutate({username:handle}).toPromise()//.then(()=>{
        this.agent.username = handle
        console.log("user registered")
      }catch(error){
        this.errorMessage = error
      }
    } else if(handle != this.agent.username){
        this.errorMessage = "Incorrect Username"
        console.log("username is incorrect")
        return
    }
    sessionStorage.setItem("userhash",this.agent.id)
    sessionStorage.setItem("username",this.agent.username)
    sessionStorage.setItem("avatar",avatarLink)
    this.router.navigate(["profile"]);
  };

  private async isRegistered():Promise<boolean>{
    if(!this.agent)
    this.agent =  await this.getProfileData()
    if(this.agent)
     return this.agent.username != (null || undefined) ? true : false       
  }

  private getProfileData():Promise<Agent>{
    return this.myprofile.fetch().pipe(map(result=>{
        return <Agent>{id:result.data.me.id, username:result.data.me.agent.username}
    })).toPromise().then((result)=> { return result},
      (reason)=>{ 
          this.errorMessage = reason
          return null
    }) as Promise<Agent> | null
  }
}
