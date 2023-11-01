import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { EnumFoolScript } from 'src/app/app-models/enums/scripts';
import { EnumUserRole } from 'src/app/app-models/enums/user';
import { AssetsService } from 'src/app/services/assets-service/assets.service';

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

    public hover: EnumUserRole.MASTER | EnumUserRole.FOOL | null = null;
    public EnumScript = EnumFoolScript;
    public EnumUserRole = EnumUserRole;

    constructor(
        public assetsService: AssetsService,
        private router: Router
    ) {}

    ngOnInit(): void {}

    public chooseMaster() {
        this.router.navigate(['/master']);
    }

    public chooseFool() {
        this.router.navigate(['/fool']);
    }

    public mouseEnter(elem: EnumUserRole.MASTER | EnumUserRole.FOOL) {
        this.hover = elem;
    }

    public mouseLeave() {
        this.hover = null;
    }
}
