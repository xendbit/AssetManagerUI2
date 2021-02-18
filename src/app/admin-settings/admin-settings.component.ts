import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-settings',
  templateUrl: './admin-settings.component.html',
  styleUrls: ['./admin-settings.component.scss']
})
export class AdminSettingsComponent implements OnInit {

  Holidays: { name: string,  type: string }[] = [
    { "name": "New Year's Day",  type: "Oil Painting" },
    { "name": 'Good Friday',  type: "Casein Painting" },
    { "name": '	Easter Monday',  type: "Water color painting" },
    { "name": "Workers' Day",  type: "Miniature Painting" },
    { "name": 'Id el Fitr',  type: "Anamorphosis painting" },
    { "name": 'Id el Fitr holiday',  type: "Aerial Perspective" },
    { "name": 'Democracy Day',  type: "Action" },
    { "name": '	Id el Kabir',  type: "Tempera" },
    { "name": 'Id el Kabir additional holiday',  type: "Gouache painting" },
    { "name": '	Independence Day',  type: "Encuastic painting" },
    { "name": 'Id el Maulud',  type: "Collage painting" },
    { "name": '	Christmas Day',  type: "Ballpoint painting" },
    { "name": 'Boxing Day',  type: "Ink painting" }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
