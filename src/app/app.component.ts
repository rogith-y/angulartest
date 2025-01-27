import { Component, OnInit, OnChanges} from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'testapp';
  
  ngOnInit(): void {
    if(this.title==='nottestapp'){
      console.log('test')
    }
    else
    {
      console.log('not test')
    }
  }
}
