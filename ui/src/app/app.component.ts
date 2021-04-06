import { ThrowStmt } from '@angular/compiler';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'mutualize-rsm';
  menuIsOpen = false;
  navIsOpen = false;

  constructor(
    private router: Router
  ) {}


  menutoggle(){
    (this.menuIsOpen === false) ? this.menuIsOpen = true : this.menuIsOpen = false
  }
  navtoggle(){
    (this.navIsOpen === false) ? this.navIsOpen = true : this.navIsOpen = false
  }

  logout(){
    console.log("logging out")
    sessionStorage.clear()
    this.router.navigate(["signup"]);
    return false
  }
}
