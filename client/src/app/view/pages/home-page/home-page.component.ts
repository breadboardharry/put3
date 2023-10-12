import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Script } from 'src/app/enums/assets/scrips';
import { EnumUserRole } from 'src/app/enums/role';
import { AssetsService } from 'src/app/services/assets-service/assets.service';

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

    public hover: EnumUserRole.MASTER | EnumUserRole.FOOL | null = null;
    public scripts = Script;
    public EnumUserRole = EnumUserRole;

    constructor(
        public assetsService: AssetsService,
        private router: Router
    ) {}

    ngOnInit(): void {}

    chooseMaster() {
        this.router.navigate(['/master']);
    }

    chooseFool() {
        this.router.navigate(['/fool']);
    }

    mouseEnter(elem: EnumUserRole.MASTER | EnumUserRole.FOOL) {
        this.hover = elem;
    }

    mouseLeave() {
        this.hover = null;
    }
}
