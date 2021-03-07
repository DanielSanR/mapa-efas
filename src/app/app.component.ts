import { Component } from '@angular/core';
import { Plugins } from '@capacitor/core';
const { SplashScreen } = Plugins;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'mapa-efas';

  ngAfterViewInit(): void {
    SplashScreen.hide({
      fadeOutDuration: 500
    });
  }

}
