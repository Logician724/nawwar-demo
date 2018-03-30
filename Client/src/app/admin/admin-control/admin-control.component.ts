import { OnInit,Input, Output, ViewChild, Component} from '@angular/core';
import {ViewVerifiedContributerRequestsComponent} from '../view-verified-contributer-requests/view-verified-contributer-requests.component';
import {ViewResourcesIdeasRequestsComponent } from '../view-resources-ideas-requests/view-resources-ideas-requests.component';
import {AdminService} from '../../admin.service';

@Component({
  selector: 'app-admin-control',
  templateUrl: './admin-control.component.html',
  styleUrls: ['./admin-control.component.css']
})

export class AdminControlComponent implements OnInit {

  @ViewChild(ViewVerifiedContributerRequestsComponent) VcComponent;

  @ViewChild(ViewResourcesIdeasRequestsComponent) _ResIReq;

  hideVCRequest: any = 1;

  constructor(private _adminService: AdminService) { }

  ngOnInit() {

  }

  goToResIReq() {
    this._ResIReq.test();
    console.log(this._adminService.test());
  }

  viewVCRequests() {
    console.log('gonna hide the component');
    this.hideVCRequest = 1 - this.hideVCRequest;  // changing the visibility of the component

  }
}

