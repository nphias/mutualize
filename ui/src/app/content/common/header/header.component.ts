import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
username = sessionStorage.getItem("username")
//@Input() network = "Genesis"//sessionStorage.getItem("username")
@Input() breadCrumbTrail:string[]
breadcrumbs:string

  ngOnInit(){
    if (this.breadCrumbTrail.length != 0)
      this.breadcrumbs = this.breadCrumbTrail.join("->") 
  }
}