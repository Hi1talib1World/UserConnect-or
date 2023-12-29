import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-search',
  templateUrl: 'search.page.html',
  styleUrls: ['search.page.scss'],
})
export class SearchPage implements OnInit {
  friendsData: any;
  currentSearchQuery = '';
  filteredFriends = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    // Fetch JSON data from a file path
    this.http.get('../../assets/data/data.json').subscribe((data: any) => {
      this.friendsData = data;
    });
  }

  searchQueryChanged(query: string) {
    // Filter friends based on the current search query
    this.filteredFriends = this.friendsData.friends.filter(
      (friend) => friend.name.toLowerCase().includes(query.toLowerCase())
    );
  }
}
