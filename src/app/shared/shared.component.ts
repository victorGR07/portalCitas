import { Component , OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
declare var M: any;
import {Apollo} from 'apollo-angular';
import gql from 'graphql-tag';
 @Component({
  selector: 'app-shared',
  templateUrl: './shared.component.html',
  styleUrls: ['./shared.component.css']
})
export class SharedComponent  implements OnInit {
  myControl = new FormControl();
options: any;
marca: any;
marcasaux: any;
  protected estado: Boolean = false;
  constructor(private apollo?: Apollo) {
  }



    ngOnInit() {

    }

}
