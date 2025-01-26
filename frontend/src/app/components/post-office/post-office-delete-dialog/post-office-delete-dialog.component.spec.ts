import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostOfficeDeleteDialogComponent } from './post-office-delete-dialog.component';

describe('PostOfficeDialogComponent', () => {
  let component: PostOfficeDeleteDialogComponent;
  let fixture: ComponentFixture<PostOfficeDeleteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostOfficeDeleteDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostOfficeDeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
