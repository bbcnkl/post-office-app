import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { MatButtonModule } from '@angular/material/button';
import { RouterTestingModule } from '@angular/router/testing'; // Import RouterTestingModule
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent, // Import the standalone component
        MatButtonModule,
        RouterTestingModule, // Provide routing-related services
        NoopAnimationsModule, // Disable animations
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have the title 'Arcadis Post Office App'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Arcadis Post Office App');
  });

  it('should render navigation links', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    // Check if Post Offices link exists
    const postOfficesLink = compiled.querySelector(
      'a[routerLink="/post-offices"]'
    );
    expect(postOfficesLink).toBeTruthy();
    expect(postOfficesLink?.textContent?.trim()).toBe('Post Offices');

    // Check if Shipments link exists
    const shipmentsLink = compiled.querySelector(
      'a[routerLink="/shipments"]'
    );
    expect(shipmentsLink).toBeTruthy();
    expect(shipmentsLink?.textContent?.trim()).toBe('Shipments');
  });

  it('should contain a <router-outlet>', () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;

    // Check if router-outlet exists
    const routerOutlet = compiled.querySelector('router-outlet');
    expect(routerOutlet).toBeTruthy();
  });
});
