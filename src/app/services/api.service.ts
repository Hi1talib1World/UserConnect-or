import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {
  CordovaEngine,
  Database,
  DatabaseConfiguration,
  DataSource,
  IonicCBL,
  Meta,
  MutableDocument,
  Ordering,
  QueryBuilder,
  SelectResult,
  Expression
} from '@ionic-enterprise/offline-storage';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private database: Database;
  private readyPromise: Promise<void>;

  private friendsData: any; // Declare a property to hold the data

  constructor(private http: HttpClient) {
    this.readyPromise = this.initializeDatabase();
    this.friendsData = require('../../assets/data/data.json'); // Import the JSON data
  }

  private async initializeDatabase(): Promise<void> {
    return new Promise(resolve => {
      IonicCBL.onReady(async () => {
        const config = new DatabaseConfiguration();
        config.setEncryptionKey('8e31f8f6-60bd-482a-9c70-69855dd02c38');
        this.database = new Database('friends', config);
        this.database.setEngine(
          new CordovaEngine({
            allResultsChunkSize: 9999
          })
        );
        await this.database.open();

        this.seedInitialData();
        resolve();
      });
    });
  }

  private async seedInitialData() {
    let count = await this.getDatabaseCount();
    if (count === 0) {
      for (let friend of this.friendsData.friends) {
        let doc = new MutableDocument()
          .setNumber('id', friend.id)
          .setString('name', friend.name)
          .setString('location', friend.location)
          .setString('avatar', friend.avatar)
          .setBoolean('is_online', friend.is_online)
          .setString('feed_image', friend.feed_image)
          .setString('description', friend.description);

        if (friend.last_message) {
          doc.setDictionary('last_message', new MutableDocument()
            .setString('text', friend.last_message.text)
            .setString('time', friend.last_message.time)
          );
        }

        doc.setNumber('message_count', friend.message_count);

        if (friend.notification_message) {
          doc.setDictionary('notification_message', new MutableDocument()
            .setString('text', friend.notification_message.text)
            .setString('time', friend.notification_message.time)
          );
        }

        this.database.save(doc);
      }

      // You can similarly seed groups data if needed
    }
  }

  async filterFriends(location, interests) {
    await this.readyPromise;

    const query = QueryBuilder.select(SelectResult.all())
      .from(DataSource.database(this.database))
      .where(Expression.property("location").like(this.formatWildcardExpression(location))
        .and(Expression.property("interests").like(this.formatWildcardExpression(interests)))
      )
      .orderBy(Ordering.property('name').ascending());

    const results = await (await query.execute()).allResults();

    let filteredFriends = [];
    for (var key in results) {
      let singleFriend = results[key]["*"];
      filteredFriends.push(singleFriend);
    }

    return filteredFriends;
  }

  public async getAllUniqueLocations() {
    const query = QueryBuilder.selectDistinct(
      SelectResult.property('location'))
      .from(DataSource.database(this.database))
      .orderBy(Ordering.property('location').ascending());

    const results = await (await query.execute()).allResults();
    let uniqueLocations = results.map(x => x['location']);
    uniqueLocations.unshift("Any");
    return uniqueLocations;
  }

  public async getFriends() {
    await this.readyPromise;

    // Retrieve friends from the database
    const query = QueryBuilder.selectDistinct(SelectResult.all())
      .from(DataSource.database(this.database));

    const results = await (await query.execute()).allResults();

    let friends = [];
    for (var key in results) {
      let singleFriend = results[key]["*"];
      friends.push(singleFriend);
    }

    return friends;
  }

  public async getFriend(id) {
    await this.readyPromise;

    const query = QueryBuilder.select(SelectResult.all())
      .from(DataSource.database(this.database))
      .where(Expression.property("id").equalTo(Expression.number(id)));

    const result = await (await query.execute()).allResults();
    return result[0]["*"];
  }

  private async getDatabaseCount() {
    const query = QueryBuilder.select(SelectResult.all())
      .from(DataSource.database(this.database));

    const result = await query.execute();
    const count = (await result.allResults()).length;
    return count;
  }

  private formatWildcardExpression(propValue) {
    return Expression.string(`%${propValue === "Any" ? "" : propValue}%`);
  }
}
