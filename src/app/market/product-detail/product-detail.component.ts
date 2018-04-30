import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogModule, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatIconModule, MatButtonModule } from '@angular/material';
import { Product } from '../Product';
import { MarketService } from '../market.service';
import { AuthService } from '../../auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent {

  product: Product;
  toggleEditForm = false;
  updatedFields = new Set();
  x = [];
  formInput = <any>{};
  oldData = <any>{};
  newData = <any>{};
  user: any;
  constructor(private marketService: MarketService, private toasterService: ToastrService, private authService: AuthService,
    public dialogRef: MatDialogRef<ProductDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private translate: TranslateService) {
    let self = this;
    self.oldData = data.product;
    self.product = data.product;
    const userDataColumns = ['username'];
    this.authService.getUserData(userDataColumns).subscribe(function (res) {
      self.user = res.data;
    });
  }


  editPrice() {
    let self = this;
    const userDataColumns = ['username'];
    this.authService.getUserData(userDataColumns).subscribe(function (res) {
      self.user = res.data;
    });
    if (this.toggleEditForm) {
      // let newprice = this.formInput.price;
      const req = {
        _id: this.product._id,
        acquiringType: this.product.acquiringType,
        createdAt: this.product.createdAt,
        description: this.product.description,
        image: this.product.image,
        name: this.product.name,
        price: this.formInput.price,
        rentPeriod: this.product.rentPeriod,
        seller: this.product.seller
      };
      this.marketService.editPrice(req, self.user.username).subscribe(function (res) {
        self.toggleEditForm = false;
        if (res.err == null) {
        }
        self.toasterService.success('Price changed Successfully');
      });
      self.dialogRef.close();
    } else {
      self.toggleEditForm = true;
      self.formInput = self.oldData;
      self.toasterService.error('Price edit failed.');

    }
  }

  deleteProduct(): void {
    let self = this;
    const userDataColumns = ['isAdmin'];
    this.authService.getUserData(userDataColumns).subscribe(function (res) {
      self.user = res.data;
      if (self.user.isAdmin || self.user.username === self.product.seller) {
        const req = {
          product: {
            _id: self.product._id,
            acquiringType: self.product.acquiringType,
            createdAt: self.product.createdAt,
            description: self.product.description,
            image: self.product.image,
            name: self.product.name,
            price: self.formInput.price,
            rentPeriod: self.product.rentPeriod,
            seller: self.product.seller
          }
        };
        self.marketService.deleteProduct(req).subscribe(function (res1) {
          if (res1.err == null) {
            console.log(res1.err);
          }
        });
        self.dialogRef.close();
      }
    });
    // check if user is admin so he can delete any product
    // if not admin then he can only delete his own product
  }











}
