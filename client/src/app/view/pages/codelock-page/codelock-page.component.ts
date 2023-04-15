import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-codelock-page',
  templateUrl: './codelock-page.component.html',
  styleUrls: ['./codelock-page.component.scss']
})
export class CodelockPageComponent implements OnInit {

  accessCode: string = 'master';
  targetRoute: string = 'home';
  cookieDuration = 2; // Hours

  constructor(private router: Router, private cookie: CookieService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      if (params['route'])
        this.targetRoute = params['route'];

      if (this.cookie.get('access'))
        this.reRoute('/' + this.targetRoute);
    });
  }

  onValidate() {
    // Set an access cookie
    let options: any = {};
    if (this.cookieDuration > 0) {
      const expirationDate = new Date();
      expirationDate.setHours(expirationDate.getHours() + this.cookieDuration);
      options.expires = expirationDate;
    }
    this.cookie.set('access', 'true', options);

    this.reRoute('/' + this.targetRoute);
  }

  reRoute(route: string) {
    this.router.navigate([route]);
  }
}
