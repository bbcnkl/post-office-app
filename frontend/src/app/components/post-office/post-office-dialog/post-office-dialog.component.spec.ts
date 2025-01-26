import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostOfficeDialogComponent } from './post-office-dialog.component';

describe('PostOfficeDialogComponent', () => {
  let component: PostOfficeDialogComponent;
  let fixture: ComponentFixture<PostOfficeDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostOfficeDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostOfficeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
