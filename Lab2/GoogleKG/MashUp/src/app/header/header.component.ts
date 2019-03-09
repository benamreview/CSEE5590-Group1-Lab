import { Component } from '@angular/core';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
    '.background {background: transparent; color: white; opacity:0.9; border-color:transparent}',
    'li a { color: white}',
    'ul.nav a:hover { color: #fffccc  }'
  ]
})
export class HeaderComponent {
  constructor() {}

  }
