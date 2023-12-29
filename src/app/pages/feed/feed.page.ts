import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';


import { ApiService } from '../../services/api.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.page.html',
  styleUrls: ['./feed.page.scss'],
})
export class FeedPage implements OnInit {

  friends: any;

  constructor(
    private navCtrl: NavController,
    private apiService: ApiService,
    private router: Router
  ) { }


  ngOnInit() {
    this.loadFeed();
  }

  openInboxPage() {
    this.router.navigate(['../inbox']);
  }

  loadFeed() {
    this.apiService.getFriends().then(result => {
        // console.log('getFriends result', result);
        this.friends = result;
    }).catch(error => {
        console.log('getFriends error', error);
    });
  }

}
