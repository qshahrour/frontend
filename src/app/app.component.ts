import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  users: any[] = [];
  name = '';

  API = 'http://localhost:8000/api/users';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.http.get<any[]>(this.API).subscribe(data => this.users = data);
  }

  addUser() {
    this.http.post(this.API, null, {
      params: { name: this.name }
    }).subscribe(() => {
      this.name = '';
      this.loadUsers();
    });
  }
}
