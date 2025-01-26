import { Component, inject, model, OnInit, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogModule,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { PostOffice } from '../../../models/post-office.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-post-office-delete-dialog',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogModule,
    MatDialogActions,
  ],
  templateUrl: './post-office-delete-dialog.component.html',
  styleUrl: './post-office-delete-dialog.component.scss',
})
export class PostOfficeDeleteDialogComponent {
  readonly dialogRef = inject(MatDialogRef<PostOfficeDeleteDialogComponent>);
  readonly data = inject<PostOffice>(MAT_DIALOG_DATA);

  onCancel(): void {
    this.dialogRef.close();
  }

  onConfirm(): void {
    this.dialogRef.close(this.data);
  }
}
