import {
  ChangeDetectionStrategy,
  Component,
  inject,
  model,
  OnInit,
  signal,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { PostOffice } from '../../../models/post-office.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  FormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { FormatEnumPipe } from '../../../pipes/format-enum.pipe';

@Component({
  selector: 'app-post-office-dialog',
  imports: [
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
  ],
  templateUrl: './post-office-dialog.component.html',
  styleUrl: './post-office-dialog.component.scss',
})
export class PostOfficeDialogComponent implements OnInit {
  readonly fb = inject(FormBuilder);
  readonly dialogRef = inject(MatDialogRef<PostOfficeDialogComponent>);
  readonly data = inject<PostOffice>(MAT_DIALOG_DATA);
  postOfficeForm!: FormGroup;

  ngOnInit(): void {
    this.postOfficeForm = this.fb.group({
      location: [this.data.location ?? '', Validators.required],
      zipCode: [
        this.data.zipCode ?? '',
        [Validators.required, Validators.minLength(5), Validators.maxLength(5)],
      ],
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.postOfficeForm.valid) {
      const savedPostOffice = this.postOfficeForm.value as PostOffice;
      this.dialogRef.close(savedPostOffice);
    }
  }
}
