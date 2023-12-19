import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';

import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
})
export class SearchPage implements OnInit {
    friends = [];
    currentSearchQuery: string = "";
    search: any;

  constructor(
    private apiService: ApiService,
    public modalController: ModalController
  ) { }

  ngOnInit() {
    
  }

  

}
