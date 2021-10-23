import {Component, HostListener, OnInit} from '@angular/core';
import {ShowResponsiveNavigationService} from '@services/show-responsive-navigation.service';
import {Pages} from '@core/utils/pages';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss']
})
export class NavigationComponent implements OnInit {
  pages = Pages;
  @HostListener('click') onClick(){
    this.closeResponsiveNavigation();
  }

  constructor(private showResponsiveNavigationService: ShowResponsiveNavigationService) {
  }

  ngOnInit(): void {
  }

  private closeResponsiveNavigation() {
    this.showResponsiveNavigationService.setNavigationView(false);
  }
}
