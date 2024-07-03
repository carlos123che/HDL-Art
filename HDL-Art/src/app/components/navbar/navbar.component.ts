import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  
  currentUrl: string = '';
  menuOpen: boolean = false;

  constructor(private router: Router ) { }

  ngOnInit(): void {
    this.currentUrl = this.router.url;
  }

  toggleMenu() {
    this.menuOpen = !this.menuOpen;
  }
    
}
